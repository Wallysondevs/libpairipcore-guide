import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function BypassFrida() {
  return (
    <PageContainer
      title="Bypass com Frida"
      subtitle="Scripts completos para contornar as verificações de integridade da libpairipcore usando Frida."
      difficulty="avancado"
      timeToRead="20 min"
    >
      <AlertBox type="danger" title="Anti-Frida primeiro">
        A libpairipcore detecta o Frida ativo. Você precisa usar técnicas de evasão do Frida antes de tentar hookear funções de integridade. Veja os scripts abaixo na ordem apresentada.
      </AlertBox>

      <h2>Passo 1 — Esconder o Frida da biblioteca</h2>
      <CodeBlock
        language="javascript"
        title="anti_detection_frida.js"
        code={`// Script para ocultar a presença do Frida
// Execute SEMPRE antes de outros scripts

(function() {
    'use strict';

    // 1. Ocultar o frida-server de /proc/net/tcp
    var libc = Process.getModuleByName("libc.so");
    
    // 2. Hook na leitura de /proc/self/maps para filtrar entradas do Frida
    var openPtr = libc.getExportByName("open");
    var readPtr = libc.getExportByName("read");
    var fgetsPtr = libc.getExportByName("fgets");
    
    var fdsToFilter = new Map();
    
    Interceptor.attach(openPtr, {
        onEnter: function(args) {
            var path = args[0].readCString();
            if (path === "/proc/self/maps" || 
                path === "/proc/self/status" ||
                path === "/proc/net/tcp") {
                this.filterThis = true;
                this.path = path;
            }
        },
        onLeave: function(retval) {
            if (this.filterThis) {
                fdsToFilter.set(retval.toInt32(), this.path);
            }
        }
    });
    
    Interceptor.attach(fgetsPtr, {
        onEnter: function(args) {
            this.buf = args[0];
            this.fd = args[2] ? Memory.readS32(args[2]) : -1;
        },
        onLeave: function(retval) {
            if (retval.isNull()) return;
            if (!fdsToFilter.has(this.fd)) return;
            
            var line = this.buf.readCString();
            if (line && (
                line.includes("frida") ||
                line.includes("gum-js-loop") ||
                line.includes("gmain") ||
                line.includes("linjector")
            )) {
                // Substituir linha por espaços
                Memory.writeByteArray(this.buf, Array(line.length).fill(0x20));
                Memory.writeU8(this.buf, 0x0A); // newline
            }
        }
    });

    // 3. Corrigir o nome do thread do Frida
    var pthreadPtr = Module.getExportByName("libc.so", "pthread_create");
    Interceptor.attach(pthreadPtr, {
        onLeave: function() {
            // Renomear threads do Frida para nomes menos suspeitos
            var threads = Process.enumerateThreads();
            threads.forEach(function(t) {
                if (t.name && t.name.includes("gum-js")) {
                    // Não há API direta para renomear, mas o hook já filtra
                }
            });
        }
    });

    console.log("[+] Anti-detecção Frida ativo!");
})();`}
      />

      <h2>Passo 2 — Bypass da verificação de root</h2>
      <CodeBlock
        language="javascript"
        title="bypass_root_detection.js"
        code={`// Bypass de todas as técnicas comuns de detecção de root
(function() {
    'use strict';
    
    var libc = Process.getModuleByName("libc.so");
    
    // 1. Hook em access() — torna arquivos su "inexistentes"
    var accessPtr = libc.getExportByName("access");
    Interceptor.attach(accessPtr, {
        onEnter: function(args) {
            this.path = args[0].readCString();
        },
        onLeave: function(retval) {
            var suPaths = [
                "/system/bin/su",
                "/system/xbin/su",
                "/sbin/su",
                "/data/local/su",
                "/data/local/bin/su",
                "/system/app/Superuser.apk",
                "/system/app/SuperSU.apk",
            ];
            
            if (suPaths.some(p => this.path === p)) {
                console.log("[*] Bloqueando access() para: " + this.path);
                retval.replace(-1); // ENOENT — arquivo não existe
            }
        }
    });
    
    // 2. Hook em stat() e stat64()
    var statPtr = libc.getExportByName("stat");
    Interceptor.attach(statPtr, {
        onEnter: function(args) {
            this.path = args[0].readCString();
        },
        onLeave: function(retval) {
            if (this.path && this.path.includes("/su")) {
                console.log("[*] Bloqueando stat() para: " + this.path);
                retval.replace(-1);
            }
        }
    });
    
    // 3. Hook em __system_property_get — falsificar props do sistema
    var propGet = Module.getExportByName("libc.so", "__system_property_get");
    // No Android novo: usar libdl
    if (!propGet) {
        propGet = Module.getExportByName(null, "__system_property_get");
    }
    
    if (propGet) {
        Interceptor.attach(propGet, {
            onEnter: function(args) {
                this.propName = args[0].readCString();
                this.valueBuf = args[1];
            },
            onLeave: function(retval) {
                var fakeable = {
                    "ro.debuggable": "0",
                    "ro.secure": "1",
                    "ro.build.tags": "release-keys",
                    "ro.build.type": "user",
                };
                
                if (this.propName in fakeable) {
                    var fakeValue = fakeable[this.propName];
                    console.log("[*] Falsificando prop " + this.propName + " -> " + fakeValue);
                    this.valueBuf.writeUtf8String(fakeValue);
                    retval.replace(fakeValue.length);
                }
            }
        });
    }
    
    console.log("[+] Bypass de detecção de root ativo!");
})();`}
      />

      <h2>Passo 3 — Forçar retorno positivo nas verificações</h2>
      <CodeBlock
        language="javascript"
        title="bypass_integrity_result.js"
        code={`// Após análise no Ghidra — força retorno positivo nas funções de verificação
// ATENÇÃO: Os offsets abaixo são EXEMPLOS — você precisa encontrar os reais!

(function() {
    'use strict';
    
    var pairip = Process.findModuleByName("libpairipcore.so");
    if (!pairip) {
        console.log("[-] libpairipcore não carregada ainda, aguardando...");
        return;
    }
    
    var base = pairip.base;
    console.log("[*] libpairipcore base: " + base);
    
    // ====== Adapte os offsets abaixo com os do seu Ghidra ======
    
    // Exemplo: função que verifica root (offset encontrado via Ghidra)
    var checkRootOffset = 0x1A2B0;  // <- Substitua!
    var checkRootAddr = base.add(checkRootOffset);
    
    Interceptor.attach(checkRootAddr, {
        onLeave: function(retval) {
            console.log("[*] checkRoot() retornou: " + retval.toInt32());
            retval.replace(0); // 0 = sem root
        }
    });
    
    // Exemplo: função que verifica emulador
    var checkEmulatorOffset = 0x2C4A8;  // <- Substitua!
    var checkEmulatorAddr = base.add(checkEmulatorOffset);
    
    Interceptor.attach(checkEmulatorAddr, {
        onLeave: function(retval) {
            console.log("[*] checkEmulator() retornou: " + retval.toInt32());
            retval.replace(0);
        }
    });
    
    console.log("[+] Bypass de resultado ativo!");
})();`}
      />

      <h2>Script consolidado — tudo junto</h2>
      <CodeBlock
        language="bash"
        title="Executando todos os scripts juntos"
        code={`# Combinar todos os scripts num único arquivo:
cat anti_detection_frida.js bypass_root_detection.js bypass_integrity_result.js > bypass_all.js

# Executar com o app alvo:
frida -U -f com.exemplo.app \\
    -l bypass_all.js \\
    --no-pause

# Para apps que carregam libpairipcore depois:
frida -U -n com.exemplo.app \\
    -l bypass_all.js`}
      />

      <AlertBox type="success" title="Dica: usar o Objection">
        O Objection já inclui bypass de SSL pinning e algumas checagens básicas de root. Use como ponto de partida: <code>objection -g com.exemplo.app explore</code>, depois <code>android root disable</code> no shell do objection.
      </AlertBox>
    </PageContainer>
  );
}
