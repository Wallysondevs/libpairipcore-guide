import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function DeteccaoRoot() {
  return (
    <PageContainer
      title="Detecção de Root"
      subtitle="Como a libpairipcore identifica dispositivos com root e quais métodos ela usa."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <h2>Por que detectar root?</h2>
      <p>
        Dispositivos com root representam uma ameaça para apps protegidos porque permitem:
      </p>
      <ul>
        <li>Leitura e modificação da memória de processos</li>
        <li>Instalação de módulos Xposed/LSPosed que alteram o comportamento do app</li>
        <li>Uso de ferramentas como Frida para hooking</li>
        <li>Desvio das verificações de licença</li>
        <li>Acesso a arquivos e dados protegidos</li>
      </ul>

      <h2>Técnicas de detecção usadas</h2>

      <h3>1. Verificação de arquivos de binários su</h3>
      <CodeBlock
        language="cpp"
        title="Verificação típica de binários su (pseudocódigo do que acontece internamente)"
        code={`// Caminhos onde o libpairipcore verifica binários su
const char* su_paths[] = {
    "/system/bin/su",
    "/system/xbin/su",
    "/sbin/su",
    "/data/local/su",
    "/data/local/bin/su",
    "/data/local/xbin/su",
    "/system/sd/xbin/su",
    "/system/bin/failsafe/su",
    "/dev/com.koushikdutta.superuser.daemon/",
    "/system/app/Superuser.apk",
    NULL
};

bool checkSuBinaries() {
    for (int i = 0; su_paths[i] != NULL; i++) {
        if (access(su_paths[i], F_OK) == 0) {
            return true; // Root detectado!
        }
    }
    return false;
}`}
      />

      <h3>2. Leitura de /proc/self/maps</h3>
      <p>
        O arquivo <code>/proc/self/maps</code> lista todas as regiões de memória mapeadas pelo processo atual. A biblioteca analisa este arquivo em busca de bibliotecas suspeitas carregadas (Frida, módulos Magisk, etc.).
      </p>
      <CodeBlock
        language="bash"
        title="Exemplo de /proc/self/maps com Frida injetado"
        code={`# O que /proc/self/maps mostra quando Frida está ativo:
7f1a000000-7f1a100000 r-xp 00000000 fd:01 12345  /data/local/tmp/frida-agent.so
7f1b000000-7f1b200000 r-xp 00000000 fd:01 12346  /data/local/tmp/re.frida.server

# Strings que libpairipcore procura em /proc/maps:
# "frida"
# "gum-js-loop"
# "linjector"
# "jvmti"
# "xposed"`}
      />

      <h3>3. Propriedades do sistema (ro.* props)</h3>
      <CodeBlock
        language="cpp"
        title="Propriedades do sistema verificadas"
        code={`// Propriedades que indicam modificação do sistema
const char* dangerous_props[] = {
    "ro.debuggable",      // 1 em builds de debug/root
    "ro.secure",          // 0 se sistema inseguro
    "ro.build.tags",      // "test-keys" indica build não oficial
    "ro.build.type",      // "eng" ou "userdebug" indica build de dev
    "ro.build.selinux",   // SELinux desabilitado
    NULL
};

// Valores suspeitos:
// ro.debuggable = 1
// ro.secure = 0
// ro.build.tags = test-keys`}
      />

      <h3>4. Verificação de apps de root instalados</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 not-prose">
        {[
          "com.noshufou.android.su",
          "com.noshufou.android.su.elite",
          "eu.chainfire.supersu",
          "com.koushikdutta.superuser",
          "com.thirdparty.superuser",
          "com.topjohnwu.magisk",
          "io.github.lsposed.manager",
          "com.android.vending.billing.InAppBillingService.COIN",
        ].map((pkg) => (
          <span key={pkg} className="font-mono text-xs bg-muted/50 px-3 py-1.5 rounded-lg text-muted-foreground border border-border block">{pkg}</span>
        ))}
      </div>

      <h3>5. Teste de escrita em /system</h3>
      <CodeBlock
        language="cpp"
        title="Tentativa de escrita em /system para detectar root"
        code={`bool canWriteToSystem() {
    // Em dispositivos sem root, /system é somente leitura
    // Em dispositivos com root remontado como RW, isso funcionaria
    int fd = open("/system/.root_test_file", O_CREAT | O_WRONLY, 0644);
    if (fd >= 0) {
        close(fd);
        unlink("/system/.root_test_file");
        return true; // Root com /system montado como RW!
    }
    return false;
}`}
      />

      <AlertBox type="success" title="Como o Magisk contorna estas detecções">
        O Magisk usa "systemless root" — não modifica a partição /system. Em vez disso, usa um ramdisk separado. Com o MagiskHide/DenyList ativado para o app, o Magisk oculta os binários su e as propriedades do sistema do processo do app, fazendo parecer que o dispositivo não tem root.
      </AlertBox>
    </PageContainer>
  );
}
