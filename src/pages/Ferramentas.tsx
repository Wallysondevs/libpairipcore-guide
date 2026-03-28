import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Ferramentas() {
  return (
    <PageContainer
      title="Ferramentas necessárias"
      subtitle="O arsenal completo para analisar e contornar a libpairipcore."
      difficulty="iniciante"
      timeToRead="8 min"
    >
      <AlertBox type="info" title="Ambiente recomendado">
        Para seguir este guia, você precisa de: um Linux (Ubuntu/Debian recomendado) ou macOS para análise estática, e um dispositivo Android com root (físico ou emulador) para análise dinâmica.
      </AlertBox>

      <h2>Ferramentas de análise estática</h2>

      <div className="space-y-4 my-6 not-prose">
        {[
          {
            name: "Ghidra",
            badge: "Gratuito",
            badgeColor: "bg-green-500/10 text-green-500",
            desc: "Disassembler e decompilador desenvolvido pela NSA. Excelente para análise de código ARM, suporte a debug remoto com GDB, e scripting em Python/Java. Melhor opção gratuita para ELF/ARM.",
            url: "https://ghidra-sre.org",
            install: "# Download em ghidra-sre.org\n# Ou via gerenciador de pacotes:\nbrew install ghidra  # macOS\n\n# Requisitos: Java 17+\njava -version"
          },
          {
            name: "jadx",
            badge: "Gratuito",
            badgeColor: "bg-green-500/10 text-green-500",
            desc: "Decompilador de DEX/APK para Java. Permite analisar o código Java/Kotlin do app que usa libpairipcore para entender como a biblioteca é chamada.",
            url: "https://github.com/skylot/jadx",
            install: "# Download no GitHub releases\n# Ou:\nbrew install jadx  # macOS\napt install jadx    # Ubuntu\n\n# Uso básico:\njadx -d output_dir MeuApp.apk"
          },
          {
            name: "IDA Pro (+ Hex-Rays)",
            badge: "Pago",
            badgeColor: "bg-purple-500/10 text-purple-500",
            desc: "O padrão da indústria para engenharia reversa. Mais poderoso que Ghidra mas caro. IDA Free existe mas com limitações. O decompilador ARM64 (Hex-Rays) é superior ao do Ghidra.",
            url: "https://hex-rays.com",
            install: "# IDA Free disponível em hex-rays.com/ida-free/\n# Suporta x86/x64 gratuitamente\n# ARM requer licença paga"
          },
          {
            name: "APKTool",
            badge: "Gratuito",
            badgeColor: "bg-green-500/10 text-green-500",
            desc: "Ferramenta para decompilação e recompilação de APKs. Essencial para extrair recursos, smali code, e reempacotar APKs modificados.",
            url: "https://apktool.org",
            install: "# Ubuntu/Debian\napt install apktool\n\n# macOS\nbrew install apktool\n\n# Uso:\napktool d MeuApp.apk         # decompila\napktool b MeuApp_dec/ -o novo.apk  # recompila"
          },
        ].map((tool) => (
          <div key={tool.name} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <h3 className="font-bold text-foreground text-base">{tool.name}</h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tool.badgeColor}`}>{tool.badge}</span>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-3">{tool.desc}</p>
              <CodeBlock language="bash" code={tool.install} />
            </div>
          </div>
        ))}
      </div>

      <h2>Ferramentas de análise dinâmica</h2>

      <div className="space-y-4 my-6 not-prose">
        {[
          {
            name: "Frida",
            badge: "Gratuito",
            badgeColor: "bg-green-500/10 text-green-500",
            desc: "Framework de hooking dinâmico. Permite injetar JavaScript em processos Android em execução. A ferramenta mais poderosa para análise dinâmica.",
            install: `# No computador (ambiente virtual Python recomendado)
pip install frida-tools

# Baixar frida-server para o dispositivo
# Versão DEVE corresponder à versão do frida no PC!
FRIDA_VERSION=$(python -c "import frida; print(frida.__version__)")
wget "https://github.com/frida/frida/releases/download/$FRIDA_VERSION/frida-server-$FRIDA_VERSION-android-arm64.xz"

# Instalar no dispositivo
xz -d frida-server-*.xz
adb push frida-server /data/local/tmp/
adb shell "chmod +x /data/local/tmp/frida-server"
adb shell "su -c '/data/local/tmp/frida-server &'"`
          },
          {
            name: "ADB (Android Debug Bridge)",
            badge: "Gratuito",
            badgeColor: "bg-green-500/10 text-green-500",
            desc: "Ferramenta oficial do Android para comunicação com dispositivos. Essencial para transferir arquivos, executar shell commands e fazer port-forwarding.",
            install: `# Ubuntu/Debian
apt install android-tools-adb

# macOS
brew install android-platform-tools

# Verificar conexão
adb devices

# Ativar modo debug USB no Android:
# Configurações > Sobre o telefone > Número de build (toque 7x)
# Configurações > Opções do desenvolvedor > Depuração USB`
          },
          {
            name: "objection",
            badge: "Gratuito",
            badgeColor: "bg-green-500/10 text-green-500",
            desc: "Framework de análise de runtime construído sobre Frida. Simplifica tarefas comuns como bypass de SSL pinning, listagem de classes, e análise de intents.",
            install: `pip install objection

# Uso básico
objection -g com.example.app explore

# Comandos úteis dentro do objection:
# android hooking list classes
# android hooking watch class com.example.SomeClass
# android sslpinning disable`
          },
        ].map((tool) => (
          <div key={tool.name} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <h3 className="font-bold text-foreground text-base">{tool.name}</h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tool.badgeColor}`}>{tool.badge}</span>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-3">{tool.desc}</p>
              <CodeBlock language="bash" code={tool.install} />
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
