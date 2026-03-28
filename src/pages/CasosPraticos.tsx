import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function CasosPraticos() {
  return (
    <PageContainer
      title="Casos Práticos"
      subtitle="Cenários reais onde o bypass de libpairipcore é necessário e como abordar cada um."
      difficulty="avancado"
      timeToRead="18 min"
    >
      <h2>Caso 1 — Game Guardian em jogo com proteção</h2>
      <p>
        Um dos cenários mais comuns: usar o Game Guardian para modificar valores de memória em um jogo que usa <code>libpairipcore</code> para detectar root/cheating tools.
      </p>

      <CodeBlock
        language="bash"
        title="Configuração do ambiente"
        code={`# Pré-requisitos:
# - Dispositivo com Magisk
# - Módulo Shamiko instalado
# - DenyList ativado para o jogo
# - Game Guardian instalado

# Verificar que o DenyList está ativo para o jogo:
# Magisk > DenyList > [nome do jogo] ✅

# O Game Guardian deve ser instalado como app normal (sem DenyList)
# Ele injeta no processo do jogo via Virtual Space ou direto com root`}
      />

      <AlertBox type="warning" title="Virtual Space — alternativa ao root">
        Se o jogo detecta o Magisk mesmo com Shamiko, tente usar o Game Guardian via Virtual Space (opção dentro do próprio GG). Isso cria um ambiente Android virtual onde o jogo roda sem saber do root.
      </AlertBox>

      <CodeBlock
        language="javascript"
        title="Script Frida para jogos com libpairipcore (se o GG não funcionar direto)"
        code={`// Arquivo: game_bypass.js
// Uso: frida -U -f com.exemplo.jogo -l game_bypass.js --no-pause

(function() {
    // 1. Ocultar Frida (sempre primeiro)
    var openat = Module.getExportByName("libc.so", "openat");
    Interceptor.attach(openat, {
        onEnter: function(args) {
            var path = args[1].readCString();
            if (path && path.includes("frida")) {
                args[1].writeUtf8String("/dev/null");
            }
        }
    });
    
    // 2. Bypass de root detection
    Interceptor.attach(Module.getExportByName("libc.so", "access"), {
        onLeave: function(retval) {
            // Forçar "não encontrado" para qualquer verificação de arquivo
            // (Cuidado: muito agressivo, pode causar outros problemas)
        }
    });
    
    // 3. Hook específico na verificação do jogo
    // Varia por jogo — precisa de análise com Ghidra
    
    console.log("[+] Game bypass ativo!");
})();`}
      />

      <h2>Caso 2 — App bancário em dispositivo com root</h2>
      <p>
        Muitos desenvolvedores Android têm dispositivos rooteados e precisam testar apps bancários. O processo:
      </p>
      <div className="space-y-3 my-6 not-prose">
        {[
          { n: "1", t: "Configurar Magisk DenyList", d: "Adicionar o app bancário ao DenyList. Isso isola o root do processo do app." },
          { n: "2", t: "Instalar Shamiko", d: "Garante que módulos Magisk também fiquem ocultos do processo do app." },
          { n: "3", t: "Instalar PlayIntegrityFix", d: "Para apps que verificam MEETS_DEVICE_INTEGRITY via Play Integrity API." },
          { n: "4", t: "Configurar fingerprint válido", d: "Use MagiskHide Props Config para imitar um Pixel ou Galaxy certificado." },
          { n: "5", t: "Testar com YASNAC primeiro", d: "Antes de abrir o app bancário, confirme que o Play Integrity retorna veredicto positivo." },
        ].map((item) => (
          <div key={item.n} className="flex gap-4 bg-card border border-border rounded-xl p-4">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">{item.n}</span>
            <div>
              <h4 className="font-bold text-foreground mb-1">{item.t}</h4>
              <p className="text-sm text-muted-foreground">{item.d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Caso 3 — Pesquisa de segurança em app próprio</h2>
      <p>
        Se você é o desenvolvedor do app e quer testar como a integração se comporta em dispositivos com root (para fins de QA):
      </p>
      <CodeBlock
        language="kotlin"
        title="Detecção de ambiente de desenvolvimento no app"
        code={`// No seu app, você pode implementar uma whitelist para builds de debug
class IntegrityChecker {
    
    fun shouldBypassIntegrityCheck(): Boolean {
        // Em builds de debug, pular a verificação
        if (BuildConfig.DEBUG) return true
        
        // Em ambiente de teste (CI), pular verificação
        if (isRunningInTestEnvironment()) return true
        
        return false
    }
    
    private fun isRunningInTestEnvironment(): Boolean {
        return try {
            Class.forName("androidx.test.espresso.Espresso")
            true
        } catch (e: ClassNotFoundException) {
            false
        }
    }
    
    fun checkIntegrity(context: Context, onResult: (Boolean) -> Unit) {
        if (shouldBypassIntegrityCheck()) {
            onResult(true) // Sempre aprovado em debug
            return
        }
        
        // Verificação real de produção
        val integrityManager = IntegrityManagerFactory.create(context)
        // ... resto da implementação
    }
}`}
      />

      <h2>Caso 4 — Análise de app de terceiro (research)</h2>
      <AlertBox type="danger" title="Aspectos legais">
        Analisar apps de terceiros pode violar os Termos de Serviço dos apps e, em alguns casos, leis de propriedade intelectual. Sempre consulte um advogado especializado antes de realizar análises para fins que não sejam pesquisa pessoal educacional. Veja a seção "Ética e aspectos legais" para mais detalhes.
      </AlertBox>
      <CodeBlock
        language="bash"
        title="Configuração para análise de app de terceiro"
        code={`# 1. Extrair o APK do dispositivo (app já instalado)
adb shell pm list packages | grep "com.exemplo"  # Encontrar package name
adb shell pm path com.exemplo.app  # Encontrar path do APK

# Saída: package:/data/app/~~XXX/com.exemplo.app-YYY/base.apk
adb pull /data/app/~~XXX/com.exemplo.app-YYY/base.apk ./app.apk

# 2. Extrair a libpairipcore
unzip app.apk lib/arm64-v8a/libpairipcore.so -d extracted/

# 3. Carregar no Ghidra para análise estática
# (Veja a seção de análise com Ghidra)

# 4. Executar com Frida para análise dinâmica
frida -U -f com.exemplo.app -l bypass_all.js --no-pause`}
      />
    </PageContainer>
  );
}
