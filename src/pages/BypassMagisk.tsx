import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function BypassMagisk() {
  return (
    <PageContainer
      title="Bypass com Magisk"
      subtitle="Usando o Magisk e seus módulos para passar nas verificações de integridade sem usar Frida."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <h2>Como o Magisk oculta o root</h2>
      <p>
        O Magisk implementa root <strong>"systemless"</strong> — ao invés de modificar a partição <code>/system</code>, ele usa um overlay no ramdisk. Isso permite ocultar o root de apps específicos usando o mecanismo chamado <strong>MagiskHide</strong> (versões antigas) ou <strong>DenyList</strong> (Magisk 24+).
      </p>

      <AlertBox type="info" title="MagiskHide vs. DenyList">
        O MagiskHide foi descontinuado no Magisk 24. O DenyList é o substituto — funciona de forma similar mas com algumas diferenças importantes de comportamento.
      </AlertBox>

      <h2>Configuração do DenyList</h2>
      <div className="space-y-3 my-6 not-prose">
        {[
          { step: "1", t: "Ativar o DenyList", d: "No app Magisk: Configurações (engrenagem) > Ativar DenyList" },
          { step: "2", t: "Configurar apps", d: "Magisk > Configurações > Configurar DenyList > Encontre o app alvo e marque-o" },
          { step: "3", t: "Reiniciar", d: "Reinicie o dispositivo para garantir que as mudanças sejam aplicadas corretamente" },
          { step: "4", t: "Testar", d: "Abra o app alvo — o Magisk agora oculta o root deste processo específico" },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 bg-card border border-border rounded-xl p-4">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">{item.step}</span>
            <div>
              <h4 className="font-bold text-foreground mb-1">{item.t}</h4>
              <p className="text-sm text-muted-foreground">{item.d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Módulos Magisk para bypass</h2>
      <div className="space-y-4 my-6 not-prose">
        {[
          {
            name: "Shamiko",
            desc: "Módulo que complementa o DenyList, ocultando processos do Zygisk e módulos Magisk adicionais de apps com DenyList ativo. Essencial para bypass moderno.",
            install: "# 1. Baixe o .zip do GitHub: github.com/LSPosed/LSPosed/releases\n# 2. No Magisk: Módulos > Instalar do storage\n# 3. Selecione Shamiko.zip\n# 4. Reinicie",
            badge: "Recomendado",
            badgeColor: "bg-green-500/10 text-green-500",
          },
          {
            name: "MagiskHide Props Config",
            desc: "Permite alterar as propriedades do sistema (ro.build.*, ro.product.*) para imitar um dispositivo certificado. Essencial para passar no MEETS_DEVICE_INTEGRITY.",
            install: `# Instale o módulo via Magisk
# Depois, use o terminal:
adb shell

# Executar o script de configuração:
props

# Siga o menu interativo para:
# 1. Selecionar "Change/Update Fingerprint"
# 2. Escolher um dispositivo certificado
# 3. Aplicar e reiniciar`,
            badge: "Para device integrity",
            badgeColor: "bg-purple-500/10 text-purple-500",
          },
          {
            name: "PlayIntegrityFix (PIF)",
            desc: "Módulo específico para passar na Play Integrity API. Injeta um fingerprint válido de dispositivo certificado para obter MEETS_DEVICE_INTEGRITY ou MEETS_STRONG_INTEGRITY.",
            install: `# GitHub: github.com/chiteroman/PlayIntegrityFix
# Instale via Magisk

# Opcionalmente, configure o fingerprint custom:
# /data/adb/pif.json

# Exemplo de pif.json customizado:
cat /data/adb/pif.json`,
            badge: "Para play integrity",
            badgeColor: "bg-blue-500/10 text-blue-400",
          },
        ].map((mod) => (
          <div key={mod.name} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <h3 className="font-bold text-foreground">{mod.name}</h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mod.badgeColor}`}>{mod.badge}</span>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-3">{mod.desc}</p>
              <CodeBlock language="bash" code={mod.install} />
            </div>
          </div>
        ))}
      </div>

      <h2>Arquivo pif.json para PlayIntegrityFix</h2>
      <CodeBlock
        language="json"
        title="/data/adb/pif.json — exemplo de configuração"
        code={`{
  "MANUFACTURER": "Google",
  "MODEL": "Pixel 7 Pro",
  "FINGERPRINT": "google/cheetah/cheetah:14/AP1A.240405.002.B1/11480754:user/release-keys",
  "BRAND": "google",
  "PRODUCT": "cheetah",
  "DEVICE": "cheetah",
  "RELEASE": "14",
  "ID": "AP1A.240405.002.B1",
  "INCREMENTAL": "11480754",
  "TYPE": "user",
  "TAGS": "release-keys",
  "SECURITY_PATCH": "2024-04-05",
  "DEVICE_INITIAL_SDK_INT": "31"
}`}
      />

      <h2>Testando o nível de integridade</h2>
      <CodeBlock
        language="bash"
        title="App de teste de Play Integrity"
        code={`# Use o app "YASNAC" ou "Play Integrity API Checker"
# Disponível na Play Store

# Ou use o script Python da API do Google:
# (Requer configuração de service account no Google Cloud)

# Verificação rápida via adb — instale o apk de teste:
adb install yasnac.apk

# Resultados esperados após configuração correta:
# ✅ MEETS_DEVICE_INTEGRITY
# ✅ APP_INTEGRITY: PLAY_RECOGNIZED (se app original)
# ✅ ACCOUNT_DETAILS: LICENSED`}
      />
    </PageContainer>
  );
}
