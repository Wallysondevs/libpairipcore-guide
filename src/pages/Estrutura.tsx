import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Estrutura() {
  return (
    <PageContainer
      title="Estrutura da biblioteca"
      subtitle="Análise interna da libpairipcore.so — seções, símbolos exportados e organização do código."
      difficulty="avancado"
      timeToRead="15 min"
    >
      <h2>Formato ELF</h2>
      <p>
        Como toda biblioteca nativa Android, a <code>libpairipcore.so</code> é um arquivo no formato <strong>ELF (Executable and Linkable Format)</strong>. Este formato organiza o código em seções com propósitos específicos.
      </p>

      <CodeBlock
        language="bash"
        title="Inspecionando o header ELF"
        code={`# Instale as ferramentas em Linux/Mac
apt install binutils  # ou brew install binutils

# Ver informações do header ELF
readelf -h libpairipcore.so

# Saída típica:
# ELF Header:
#   Class:    ELF64
#   Data:     2's complement, little endian
#   Machine:  AArch64
#   Type:     DYN (Shared object file)

# Listar seções da biblioteca
readelf -S libpairipcore.so | head -40`}
      />

      <h2>Seções principais</h2>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="bg-muted text-foreground font-semibold px-4 py-2 text-left border border-border">Seção</th>
              <th className="bg-muted text-foreground font-semibold px-4 py-2 text-left border border-border">Propósito</th>
              <th className="bg-muted text-foreground font-semibold px-4 py-2 text-left border border-border">Relevância</th>
            </tr>
          </thead>
          <tbody>
            {[
              [".text", "Código executável", "Alta — onde estão as funções de verificação"],
              [".rodata", "Dados somente leitura (strings, constantes)", "Alta — strings ofuscadas, URLs do Google"],
              [".data", "Dados globais inicializados", "Média — variáveis de estado"],
              [".bss", "Dados globais não inicializados", "Baixa"],
              [".dynsym", "Tabela de símbolos dinâmicos (exportados)", "Alta — funções visíveis externamente"],
              [".dynstr", "Strings dos nomes de símbolos", "Alta — nomes das funções exportadas"],
              [".plt / .got", "Tabelas de linkagem dinâmica", "Média — chamadas a outras bibliotecas"],
              [".note.android.ident", "Metadados Android (versão NDK, etc.)", "Baixa"],
            ].map(([sec, prop, rel], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : ""}>
                <td className="px-4 py-2 border border-border font-mono text-primary text-xs">{sec}</td>
                <td className="px-4 py-2 border border-border text-muted-foreground text-sm">{prop}</td>
                <td className="px-4 py-2 border border-border text-muted-foreground text-sm">{rel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Símbolos exportados</h2>
      <p>
        A biblioteca exporta um conjunto limitado de funções — estrategicamente — para dificultar o hooking. Você pode listá-las com:
      </p>
      <CodeBlock
        language="bash"
        title="Listando símbolos exportados"
        code={`# Com readelf
readelf -sW libpairipcore.so | grep FUNC | grep GLOBAL

# Com nm
nm -D libpairipcore.so | grep " T "

# Com objdump
objdump -T libpairipcore.so

# Funções tipicamente encontradas:
# Java_com_google_android_play_core_integrity_*
# pairip_check_integrity
# pairip_get_token
# pairip_init
# JNI_OnLoad`}
      />

      <h2>A função JNI_OnLoad</h2>
      <p>
        Toda biblioteca nativa Android que interage com o Java/Kotlin precisa da função <code>JNI_OnLoad</code>. Esta é chamada automaticamente quando a biblioteca é carregada via <code>System.loadLibrary()</code>. No <code>libpairipcore</code>, esta função:
      </p>
      <ul>
        <li>Registra métodos nativos que serão chamáveis do lado Java</li>
        <li>Inicializa estruturas internas</li>
        <li>Executa checagens de ambiente já na inicialização</li>
        <li>Pode detectar tentativas de análise (Frida ativo, debugger conectado) e abortar</li>
      </ul>

      <AlertBox type="warning" title="Ofuscação agressiva">
        As versões mais recentes do libpairipcore usam técnicas avançadas de ofuscação de código aplicadas pelo LLVM durante a compilação: Control Flow Flattening (CFF), Bogus Control Flow (BCF), e string encryption. Isso torna a análise estática muito mais difícil.
      </AlertBox>

      <h2>Strings internas</h2>
      <CodeBlock
        language="bash"
        title="Extraindo strings da biblioteca"
        code={`# Extrair todas as strings legíveis
strings libpairipcore.so | sort -u

# Filtrar URLs do Google
strings libpairipcore.so | grep "google"

# Filtrar possíveis paths de detecção
strings libpairipcore.so | grep -E "(/proc|/sys|su|magisk|frida)"

# Strings comuns encontradas:
# /proc/self/maps
# /proc/self/status
# /data/local/tmp/frida
# ro.debuggable
# ro.secure
# android.hardware.security.keymint`}
      />
    </PageContainer>
  );
}
