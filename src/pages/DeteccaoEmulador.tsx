import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function DeteccaoEmulador() {
  return (
    <PageContainer
      title="Detecção de Emulador"
      subtitle="Como a biblioteca identifica ambientes virtualizados e emuladores Android."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <h2>Por que emuladores são detectados?</h2>
      <p>
        Emuladores facilitam a análise de apps por pesquisadores de segurança: são fáceis de snapshottear, reiniciar e modificar. A <code>libpairipcore</code> usa diversas técnicas para identificar se está rodando em um ambiente virtual.
      </p>

      <h2>Técnicas de detecção de emulador</h2>

      <h3>1. Propriedades de hardware suspeitas</h3>
      <CodeBlock
        language="cpp"
        title="Propriedades que identificam emuladores"
        code={`// Valores comuns em emuladores Android (AVD, Genymotion, etc.)
// ro.hardware
"goldfish"    // Android Emulator (QEMU)
"ranchu"      // Android Emulator moderno
"vbox86"      // VirtualBox (Genymotion)

// ro.product.model
"Android SDK built for x86"
"AOSP on IA Emulator"

// ro.product.manufacturer
"unknown"
"Google"      // (em emuladores AVD)
"Genymotion"

// ro.product.brand
"generic"
"Android"

// ro.kernel.qemu
"1"  // Confirma QEMU/AVD`}
      />

      <h3>2. Verificação de arquivos de emulador</h3>
      <CodeBlock
        language="bash"
        title="Arquivos que existem apenas em emuladores"
        code={`# Arquivos do QEMU/AVD
/dev/socket/qemud
/dev/qemu_pipe
/dev/goldfish_pipe
/dev/goldfish_sync
/system/lib/libc_malloc_debug_qemu.so

# Drivers de gráficos virtuais
/system/lib/egl/libGLES_android.so  # Mesa (emulador software render)

# Verificação via ls:
ls -la /dev/ | grep -E "(qemu|goldfish|vbox)"`}
      />

      <h3>3. Análise de CPU features</h3>
      <CodeBlock
        language="bash"
        title="CPU features ausentes em emuladores"
        code={`# /proc/cpuinfo revela diferenças entre hardware real e virtual
cat /proc/cpuinfo

# Dispositivo real (ex: Snapdragon):
# Hardware: Qualcomm Technologies, Inc SM8550
# Features: fp asimd evtstrm aes pmull sha1 sha2 crc32 atomics ...

# Emulador AVD (x86_64 com tradução ARM):
# Hardware: ranchu
# model name: Intel Core i7 ...  <- Processador do host!

# Diferença chave: emuladores de x86 traduzindo ARM
# não têm features como "asimd", "neon", "vfpv4" etc.`}
      />

      <h3>4. Timing attacks (análise de tempo)</h3>
      <p>
        Emuladores são significativamente mais lentos que hardware real para certas operações. A biblioteca pode medir o tempo de operações específicas para detectar virtualização:
      </p>
      <CodeBlock
        language="cpp"
        title="Exemplo de timing attack para detectar emulação"
        code={`#include <time.h>

bool isEmulatorByTiming() {
    struct timespec start, end;
    
    // Operação que é muito mais lenta em emuladores
    clock_gettime(CLOCK_MONOTONIC, &start);
    
    // Executa 1000 operações de ponto flutuante
    volatile double result = 1.0;
    for (int i = 0; i < 1000000; i++) {
        result *= 1.000001;
    }
    
    clock_gettime(CLOCK_MONOTONIC, &end);
    
    long elapsed_ns = (end.tv_sec - start.tv_sec) * 1000000000L
                    + (end.tv_nsec - start.tv_nsec);
    
    // Em hardware real: < 5ms
    // Em emulador sem aceleração: > 50ms
    return elapsed_ns > 50000000L;  // 50ms threshold
}`}
      />

      <h3>5. Verificação de sensores de hardware</h3>
      <p>
        Dispositivos físicos têm sensores reais — acelerômetro, giroscópio, sensor de proximidade. A maioria dos emuladores ou não tem esses sensores ou os simula de forma detectável.
      </p>

      <AlertBox type="info" title="Virtual Space e emuladores dentro de emuladores">
        Apps de Virtual Space (VMOS, VirtualXposed) também são detectados por estas técnicas, pois tecnicamente são ambientes Android virtualizados. Alguns Virtual Spaces como o VMOS Pro incluem propriedades de sistema que imitam um dispositivo real para contornar isso.
      </AlertBox>

      <h2>Emuladores com melhor furtividade</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 not-prose">
        {[
          { name: "LDPlayer 9", rating: "⭐⭐⭐⭐", desc: "Boa emulação de hardware, suporte a root, difícil de detectar" },
          { name: "BlueStacks 5", rating: "⭐⭐⭐", desc: "Popular, detecção moderada. Root requer trabalho extra." },
          { name: "MuMu Player Pro", rating: "⭐⭐⭐⭐", desc: "Boa performance e opções de camuflagem de hardware" },
          { name: "Android Studio AVD", rating: "⭐⭐", desc: "Fácil de detectar — propriedades de hardware genéricas" },
        ].map((em) => (
          <div key={em.name} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-foreground">{em.name}</h3>
              <span>{em.rating}</span>
            </div>
            <p className="text-sm text-muted-foreground">{em.desc}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
