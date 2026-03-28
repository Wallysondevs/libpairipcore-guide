import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function PlayIntegrity() {
  return (
    <PageContainer
      title="Play Integrity API"
      subtitle="Como a biblioteca se integra com o sistema de atestação de integridade do Google."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <h2>Histórico: SafetyNet → Play Integrity</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 not-prose">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-bold text-muted-foreground text-sm mb-3 line-through">SafetyNet Attestation (descontinuada)</h3>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>✅ Primeira geração de atestação Android</li>
            <li>✅ Amplamente usada de 2015 a 2023</li>
            <li>⚠️ Mais fácil de bypassar (MagiskHide funcionava bem)</li>
            <li>❌ Descontinuada em 2024</li>
          </ul>
        </div>
        <div className="bg-card border border-primary/30 rounded-xl p-5">
          <h3 className="font-bold text-primary text-sm mb-3">Play Integrity API (atual)</h3>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>✅ Substituta completa do SafetyNet</li>
            <li>✅ Veredictos mais granulares</li>
            <li>✅ Harder to bypass — usa hardware attestation</li>
            <li>✅ Integrado com o libpairipcore</li>
          </ul>
        </div>
      </div>

      <h2>Níveis de integridade do dispositivo</h2>
      <p>A Play Integrity API retorna diferentes níveis de confiança para o dispositivo:</p>
      <div className="space-y-3 my-6 not-prose">
        {[
          {
            level: "MEETS_STRONG_INTEGRITY",
            color: "border-green-500/30 bg-green-500/5",
            badge: "bg-green-500/10 text-green-500",
            desc: "Nível mais alto. O dispositivo passou em todas as verificações de hardware (TEE/StrongBox), tem bootloader bloqueado e não apresenta sinais de comprometimento. Apps bancários e de segurança exigem isso.",
          },
          {
            level: "MEETS_DEVICE_INTEGRITY",
            color: "border-yellow-500/30 bg-yellow-500/5",
            badge: "bg-yellow-500/10 text-yellow-500",
            desc: "Nível intermediário. O dispositivo passou nas verificações principais mas pode não ter atestação de hardware forte. Bootloader pode estar desbloqueado mas o sistema parece íntegro.",
          },
          {
            level: "MEETS_BASIC_INTEGRITY",
            color: "border-orange-500/30 bg-orange-500/5",
            badge: "bg-orange-500/10 text-orange-500",
            desc: "Nível básico. O dispositivo passou nas verificações básicas de software mas falhou em verificações de hardware. Root com Magisk em modo 'pass basic' chega aqui.",
          },
          {
            level: "(sem veredicto)",
            color: "border-red-500/30 bg-red-500/5",
            badge: "bg-red-500/10 text-red-500",
            desc: "O dispositivo falhou em todas as verificações. Root detectado sem ocultação, emulador detectado, ou dispositivo com problemas graves de segurança.",
          },
        ].map((item) => (
          <div key={item.level} className={`border rounded-xl p-4 ${item.color}`}>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${item.badge}`}>{item.level}</span>
            <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2>Usando a Play Integrity API no seu app (para desenvolvedores)</h2>
      <CodeBlock
        language="kotlin"
        title="Exemplo de integração Play Integrity em Kotlin"
        code={`// build.gradle.kts
dependencies {
    implementation("com.google.android.play:integrity:1.3.0")
}

// Em seu Activity/Fragment
class MainActivity : AppCompatActivity() {

    private fun verificarIntegridade() {
        val integrityManager = IntegrityManagerFactory.create(applicationContext)

        // Gerar nonce único (obrigatório para segurança)
        val nonce = Base64.encodeToString(
            Random.nextBytes(24),
            Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP
        )

        val request = IntegrityTokenRequest.newBuilder()
            .setNonce(nonce)
            .build()

        integrityManager.requestIntegrityToken(request)
            .addOnSuccessListener { response ->
                val token = response.token()
                // Enviar token ao seu servidor para validação
                enviarParaServidor(token)
            }
            .addOnFailureListener { exception ->
                // Tratar erro (dispositivo sem Google Play Services, etc.)
                Log.e("Integrity", "Erro: \${exception.message}")
            }
    }
}`}
      />

      <AlertBox type="info" title="Validação obrigatória no servidor">
        O token retornado pela API DEVE ser validado no seu servidor backend usando a Google Play Integrity API. Validar apenas no cliente é inseguro — um atacante pode simplesmente retornar um token falso.
      </AlertBox>

      <h2>libpairipcore no contexto da API</h2>
      <p>
        Quando seu app chama <code>requestIntegrityToken()</code>, o Google Play Services carrega internamente o <code>libpairipcore.so</code> para:
      </p>
      <ol>
        <li>Coletar dados locais do dispositivo (hardware, software, configurações)</li>
        <li>Executar as verificações de integridade locais</li>
        <li>Cifrar os dados coletados</li>
        <li>Incluí-los no payload que será assinado pelo Google</li>
      </ol>
    </PageContainer>
  );
}
