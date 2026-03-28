import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function ComoFunciona() {
  return (
    <PageContainer
      title="Como funciona"
      subtitle="O fluxo completo de verificação de integridade — do app até os servidores do Google."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <h2>Visão geral do fluxo</h2>
      <p>
        O processo de verificação de integridade feito pelo <code>libpairipcore</code> ocorre em múltiplas etapas. O objetivo final é produzir um <strong>token de integridade assinado</strong> que o servidor do app pode verificar junto ao Google.
      </p>

      <div className="grid grid-cols-1 gap-3 my-8 not-prose">
        {[
          { n: "1", t: "App solicita verificação", d: "O app chama a Play Integrity API passando um nonce (número aleatório único para evitar replay attacks)." },
          { n: "2", t: "Coleta de dados do dispositivo", d: "libpairipcore coleta informações: fingerprint do dispositivo, estado do bootloader, presença de root, assinatura do APK, versão do Android, etc." },
          { n: "3", t: "Atestação via Google Play Services", d: "Os dados são enviados (cifrados) ao Google Play Services, que por sua vez comunica com os servidores do Google Cloud." },
          { n: "4", t: "Geração do token JWT", d: "O Google gera um JSON Web Token (JWT) assinado com chaves RSA, contendo os veredictos de integridade." },
          { n: "5", t: "Retorno ao app", d: "O token JWT é retornado ao app. O app envia ao seu servidor backend." },
          { n: "6", t: "Verificação server-side", d: "O backend do app valida o JWT junto à API do Google, obtendo os veredictos definitivos." },
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

      <h2>Os veredictos de integridade</h2>
      <p>O token gerado contém três categorias de veredicto:</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 not-prose">
        {[
          { name: "DEVICE_INTEGRITY", desc: "Verifica se o dispositivo é genuíno, não está com bootloader desbloqueado e passou nos testes de hardware.", levels: ["MEETS_DEVICE_INTEGRITY", "MEETS_STRONG_INTEGRITY", "MEETS_BASIC_INTEGRITY"] },
          { name: "APP_INTEGRITY", desc: "Verifica se o APK é original (assinatura corresponde à Play Store) e não foi modificado.", levels: ["PLAY_RECOGNIZED", "UNRECOGNIZED_VERSION", "UNEVALUATED"] },
          { name: "ACCOUNT_DETAILS", desc: "Verifica se o usuário tem uma conta Google licenciada para o app.", levels: ["LICENSED", "UNLICENSED", "UNEVALUATED"] },
        ].map((v) => (
          <div key={v.name} className="bg-card border border-border rounded-xl p-4">
            <h4 className="font-mono text-primary text-xs font-bold mb-2">{v.name}</h4>
            <p className="text-xs text-muted-foreground mb-3">{v.desc}</p>
            <div className="space-y-1">
              {v.levels.map(l => (
                <span key={l} className="block text-xs font-mono bg-muted/50 px-2 py-0.5 rounded text-muted-foreground">{l}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2>Estrutura do token JWT</h2>
      <CodeBlock
        language="json"
        title="Exemplo de payload do token Play Integrity"
        code={`{
  "requestDetails": {
    "requestPackageName": "com.example.meuapp",
    "timestampMillis": "1710000000000",
    "nonce": "dW5pcXVlX25vbmNlX3ZhbHVl"
  },
  "appIntegrity": {
    "appRecognitionVerdict": "PLAY_RECOGNIZED",
    "packageName": "com.example.meuapp",
    "certificateSha256Digest": ["abc123..."],
    "versionCode": "42"
  },
  "deviceIntegrity": {
    "deviceRecognitionVerdict": ["MEETS_DEVICE_INTEGRITY"]
  },
  "accountDetails": {
    "appLicensingVerdict": "LICENSED"
  }
}`}
      />

      <h2>Checagens locais vs. checagens server-side</h2>
      <p>
        Uma distinção crucial: nem toda verificação passa pelo servidor. O <code>libpairipcore</code> executa algumas checagens <strong>localmente</strong> no dispositivo (mais rápidas, mas contornáveis) e outras dependem da resposta do servidor do Google (mais robustas):
      </p>
      <div className="not-prose overflow-x-auto my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="bg-muted text-foreground font-semibold px-4 py-2 text-left border border-border">Checagem</th>
              <th className="bg-muted text-foreground font-semibold px-4 py-2 text-left border border-border">Onde ocorre</th>
              <th className="bg-muted text-foreground font-semibold px-4 py-2 text-left border border-border">Contornável localmente?</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Detecção de root via /su", "Local", "✅ Sim (Magisk Hide)"],
              ["Verificação de bootloader", "Servidor Google", "⚠️ Difícil"],
              ["Assinatura do APK", "Servidor Google", "❌ Não (sem modificar servidor)"],
              ["Detecção de Frida/debugger", "Local", "✅ Sim (scripts Frida)"],
              ["Verificação de emulador", "Local + Servidor", "⚠️ Parcialmente"],
              ["Licença do usuário", "Servidor Google", "❌ Não diretamente"],
            ].map(([check, onde, bypass], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : ""}>
                <td className="px-4 py-2 border border-border text-foreground text-sm">{check}</td>
                <td className="px-4 py-2 border border-border text-muted-foreground text-sm">{onde}</td>
                <td className="px-4 py-2 border border-border text-sm">{bypass}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertBox type="info" title="Foco deste guia">
        Nosso foco são as checagens locais — aquelas que o <code>libpairipcore</code> executa no dispositivo antes de contactar o servidor. Estas são as que podem ser analisadas e contornadas com Frida e Magisk.
      </AlertBox>
    </PageContainer>
  );
}
