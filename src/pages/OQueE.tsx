import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function OQueE() {
  return (
    <PageContainer
      title="O que é libpairipcore?"
      subtitle="Uma análise completa da origem, propósito e escopo desta biblioteca de proteção nativa Android."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <h2>Definição</h2>
      <p>
        <code>libpairipcore.so</code> é uma biblioteca nativa Android (compilada para ARM/ARM64) desenvolvida pelo Google como parte do sistema de proteção anti-pirataria e verificação de integridade de aplicativos distribuídos pela Google Play Store.
      </p>
      <p>
        O nome é um acrônimo de <strong>Play App Integrity Runtime IP Core</strong> — ou seja, é o núcleo de processamento de integridade em tempo de execução para aplicativos da Play Store.
      </p>

      <AlertBox type="info" title="Por que 'IP Core'?">
        O termo "IP Core" (Intellectual Property Core) é comum em engenharia de hardware — denota um bloco de circuito reutilizável. Aqui, o Google usa a terminologia para indicar que este é o núcleo central da proteção de propriedade intelectual dos apps.
      </AlertBox>

      <h2>Onde a biblioteca aparece</h2>
      <p>A <code>libpairipcore.so</code> é embutida automaticamente em apps que usam:</p>
      <ul>
        <li>A <strong>Play Integrity API</strong> (substituta da SafetyNet)</li>
        <li>O <strong>Google Play Protect</strong></li>
        <li>A antiga <strong>License Verification Library (LVL)</strong></li>
        <li>Qualquer SDK do Google que use o sistema de atestação de integridade</li>
      </ul>

      <h2>Como identificar a biblioteca num APK</h2>
      <CodeBlock
        language="bash"
        title="Verificando se um APK contém libpairipcore"
        code={`# Descompacte o APK (é um ZIP)
unzip -l MeuApp.apk | grep pairip

# Saída esperada:
# lib/arm64-v8a/libpairipcore.so
# lib/armeabi-v7a/libpairipcore.so

# Usando apktool para descompilar completo
apktool d MeuApp.apk -o MeuApp_dec

# Verificar arquivos .so presentes
find MeuApp_dec/lib -name "*.so" | sort`}
      />

      <h2>Arquiteturas suportadas</h2>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="bg-muted text-foreground font-semibold px-4 py-2 text-left border border-border">Arquitetura</th>
              <th className="bg-muted text-foreground font-semibold px-4 py-2 text-left border border-border">Pasta no APK</th>
              <th className="bg-muted text-foreground font-semibold px-4 py-2 text-left border border-border">Dispositivos</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ARM64 (AArch64)", "lib/arm64-v8a/", "Todos os Android modernos (2015+)"],
              ["ARMv7", "lib/armeabi-v7a/", "Dispositivos legados 32-bit"],
              ["x86_64", "lib/x86_64/", "Emuladores e alguns Chromebooks"],
              ["x86", "lib/x86/", "Emuladores legados"],
            ].map(([arq, pasta, dev], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : ""}>
                <td className="px-4 py-2 border border-border font-mono text-primary text-sm">{arq}</td>
                <td className="px-4 py-2 border border-border text-muted-foreground text-sm">{pasta}</td>
                <td className="px-4 py-2 border border-border text-muted-foreground text-sm">{dev}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Tamanho e composição</h2>
      <p>
        A biblioteca tem tipicamente entre <strong>500KB e 2MB</strong> dependendo da versão e arquitetura. Ela é compilada com ofuscação agressiva e, em versões mais recentes, usa técnicas de anti-debug e anti-tampering para dificultar a análise.
      </p>
      <p>
        Internamente, a biblioteca combina:
      </p>
      <ul>
        <li>Código C/C++ nativo compilado para ARM</li>
        <li>Código obfuscado com LLVM IR transformations</li>
        <li>Verificações de hardware através de chamadas ao kernel</li>
        <li>Comunicação cifrada com os servidores do Google</li>
      </ul>

      <AlertBox type="success" title="Por que é importante entender esta biblioteca?">
        Compreender o libpairipcore é fundamental para: testar apps em ambientes de desenvolvimento com root, pesquisa de segurança em apps Android, bypass para uso com Game Guardian em jogos protegidos, e para desenvolvedores que precisam integrar a Play Integrity API corretamente.
      </AlertBox>
    </PageContainer>
  );
}
