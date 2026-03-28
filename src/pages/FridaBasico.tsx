import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function FridaBasico() {
  return (
    <PageContainer
      title="Hooking com Frida"
      subtitle="Aprenda a interceptar chamadas da libpairipcore em tempo de execução usando o Frida."
      difficulty="avancado"
      timeToRead="15 min"
    >
      <h2>Configuração inicial</h2>
      <CodeBlock
        language="bash"
        title="Conectando Frida ao dispositivo"
        code={`# 1. Inicie o frida-server no dispositivo (com root)
adb shell "su -c 'killall frida-server 2>/dev/null; /data/local/tmp/frida-server &'"

# 2. Configure port forwarding
adb forward tcp:27042 tcp:27042

# 3. Verifique a conexão
frida-ps -U  # Lista processos via USB

# 4. Listar apps instalados
frida-ps -Ua  # -a = apenas apps, -U = USB`}
      />

      <h2>Primeiro script — listando módulos carregados</h2>
      <CodeBlock
        language="javascript"
        title="script_listar_modulos.js"
        code={`// Listar todas as bibliotecas .so carregadas pelo app
Process.enumerateModules().forEach(function(module) {
    console.log('[+] Módulo: ' + module.name + 
                ' @ ' + module.base + 
                ' (tamanho: ' + module.size + ')');
});

// Filtrar especificamente pelo libpairipcore
var pairip = Process.findModuleByName("libpairipcore.so");
if (pairip) {
    console.log('[!] libpairipcore encontrada!');
    console.log('    Base: ' + pairip.base);
    console.log('    Size: ' + pairip.size);
    console.log('    Path: ' + pairip.path);
} else {
    console.log('[-] libpairipcore NÃO encontrada no processo');
}`}
      />

      <CodeBlock
        language="bash"
        title="Executando o script"
        code={`# Substituir com.exemplo.app pelo package name real
frida -U -f com.exemplo.app -l script_listar_modulos.js --no-pause`}
      />

      <h2>Hookando funções exportadas</h2>
      <CodeBlock
        language="javascript"
        title="script_hook_exports.js — Hookando funções exportadas"
        code={`// Aguardar carregamento do módulo
var pairipModule = null;

// Esperar pelo módulo (pode ser carregado depois do início)
Module.ensureInitialized("libpairipcore.so");

pairipModule = Process.findModuleByName("libpairipcore.so");
if (!pairipModule) {
    console.log("[-] Módulo não encontrado! Aguardando carregamento...");
}

// Hook em JNI_OnLoad — primeiro ponto de entrada
var jniOnLoad = pairipModule.findExportByName("JNI_OnLoad");
if (jniOnLoad) {
    Interceptor.attach(jniOnLoad, {
        onEnter: function(args) {
            console.log("[*] JNI_OnLoad chamado!");
            console.log("    JavaVM: " + args[0]);
        },
        onLeave: function(retval) {
            console.log("[*] JNI_OnLoad retornou: " + retval);
            // Se retornou -1 (JNI_ERR), indica detecção de Frida
            if (retval.toInt32() < 0) {
                console.log("[!] JNI_OnLoad retornou erro — possível anti-Frida!");
                retval.replace(0x10006); // Forçar retorno de JNI_VERSION_1_6
            }
        }
    });
} else {
    console.log("[-] JNI_OnLoad não encontrada nos exports");
}`}
      />

      <h2>Hookando funções não exportadas (por endereço)</h2>
      <p>
        Funções internas não são exportadas. Para hookear, precisamos do endereço base + offset encontrado via Ghidra:
      </p>
      <CodeBlock
        language="javascript"
        title="script_hook_interno.js — Hooking por offset"
        code={`// Após identificar o offset de uma função no Ghidra:
// Exemplo: função de detecção de root em offset 0x1A2B0

var pairipBase = Module.getBaseAddress("libpairipcore.so");
console.log("[*] Base address: " + pairipBase);

// Calcular endereço absoluto
var funcOffset = 0x1A2B0;  // <- Substitua com o offset real do Ghidra
var funcAddr = pairipBase.add(funcOffset);

console.log("[*] Hookando função em: " + funcAddr);

Interceptor.attach(funcAddr, {
    onEnter: function(args) {
        console.log("[>] Função de detecção de root chamada!");
        console.log("    arg0: " + args[0]);
    },
    onLeave: function(retval) {
        var original = retval.toInt32();
        console.log("[<] Resultado original: " + original);
        
        // Se a função retorna 1 (root detectado), forçar 0
        if (original !== 0) {
            console.log("[!] Root detectado! Alterando retorno para 0...");
            retval.replace(0);
        }
    }
});`}
      />

      <h2>Hookando chamadas de sistema (syscalls)</h2>
      <CodeBlock
        language="javascript"
        title="script_hook_syscalls.js — Interceptando leitura de /proc"
        code={`// Interceptar abertura de arquivos suspeitos
var openPtr = Module.getExportByName(null, "open");

Interceptor.attach(openPtr, {
    onEnter: function(args) {
        var path = args[0].readCString();
        
        if (path && (path.includes("/proc/self/maps") || 
                     path.includes("/proc/self/status") ||
                     path.includes("/system/bin/su"))) {
            console.log("[*] Abrindo arquivo suspeito: " + path);
            this.isSuspicious = true;
            this.suspiciousPath = path;
        }
    },
    onLeave: function(retval) {
        if (this.isSuspicious) {
            console.log("[*] fd retornado para " + this.suspiciousPath + ": " + retval);
        }
    }
});`}
      />

      <AlertBox type="warning" title="Anti-Frida na libpairipcore">
        Versões recentes incluem detecção de Frida! A biblioteca verifica por threads do Frida em <code>/proc/self/maps</code> e analisa padrões de memória. Os scripts na próxima seção (Bypass com Frida) abordam como contornar essas defesas.
      </AlertBox>
    </PageContainer>
  );
}
