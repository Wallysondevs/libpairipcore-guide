import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Troubleshooting() {
  return (
    <PageContainer
      title="Troubleshooting"
      subtitle="Soluções para os problemas mais comuns ao trabalhar com libpairipcore e Play Integrity."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <h2>Problemas com Frida</h2>

      <div className="space-y-4 my-6 not-prose">
        {[
          {
            problema: "Failed to attach: unable to find process with name",
            causa: "O app não está em execução ou o nome do processo está errado",
            solucao: `# Listar processos em execução:
frida-ps -U

# Usar package name explícito em vez do nome:
frida -U -f com.exemplo.app -l script.js --no-pause

# Para apps já em execução:
frida -U -p $(adb shell pidof com.exemplo.app) -l script.js`,
          },
          {
            problema: "frida-server: command not found / Permission denied",
            causa: "frida-server não iniciado ou sem permissão de execução",
            solucao: `# Verificar se o frida-server está no dispositivo:
adb shell "ls -la /data/local/tmp/frida-server"

# Dar permissão de execução:
adb shell "chmod 755 /data/local/tmp/frida-server"

# Iniciar com root:
adb shell "su -c '/data/local/tmp/frida-server -D &'"

# Verificar se está rodando:
adb shell "ps -A | grep frida"`,
          },
          {
            problema: "Process crashed / app fecha na inicialização",
            causa: "Detecção de Frida pelo app antes do script ser carregado",
            solucao: `# Use --no-pause com -f para spawn e injetar antes do main:
frida -U -f com.exemplo.app -l anti_detection.js --no-pause

# Se ainda crashar, tente spawn com delay:
frida -U -f com.exemplo.app --pause
# (Em outro terminal conecte e carregue o script)
frida -U -n com.exemplo.app -l script.js`,
          },
          {
            problema: "Versão do frida-server incompatível",
            causa: "Versão do frida no PC diferente do frida-server no dispositivo",
            solucao: `# Verificar versão no PC:
python -c "import frida; print(frida.__version__)"

# A versão do frida-server DEVE ser idêntica
# Baixar versão correta:
FRIDA_VER=$(python -c "import frida; print(frida.__version__)")
wget "https://github.com/frida/frida/releases/download/$FRIDA_VER/frida-server-$FRIDA_VER-android-arm64.xz"`,
          },
        ].map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-destructive/20 bg-destructive/5">
              <h3 className="font-mono text-sm text-destructive font-semibold">{item.problema}</h3>
              <p className="text-xs text-muted-foreground mt-1">Causa: {item.causa}</p>
            </div>
            <div className="p-4">
              <CodeBlock language="bash" code={item.solucao} />
            </div>
          </div>
        ))}
      </div>

      <h2>Problemas com Play Integrity</h2>

      <div className="space-y-4 my-6 not-prose">
        {[
          {
            problema: "Obtendo apenas MEETS_BASIC_INTEGRITY mas preciso de DEVICE_INTEGRITY",
            causa: "O dispositivo não passa nas verificações de hardware (bootloader desbloqueado, sem atestação de hardware)",
            solucao: `# Instalar PlayIntegrityFix (PIF):
# 1. Baixar de github.com/chiteroman/PlayIntegrityFix
# 2. Instalar via Magisk
# 3. Configurar /data/adb/pif.json com fingerprint de dispositivo certificado

# Verificar quais módulos estão ativos:
adb shell "su -c 'magisk --list-modules'"

# Limpar cache do Google Play Services:
# Configurações > Apps > Google Play Services > Limpar cache`,
          },
          {
            problema: "Error code -8 / INTEGRITY_TOKEN_PROVIDER_INVALID",
            causa: "Google Play Services corrompido ou desatualizado",
            solucao: `# Atualizar o Google Play Services:
# Play Store > Meu perfil > Gerenciar apps > Google Play Services

# Forçar sincronização:
adb shell "su -c 'am force-stop com.google.android.gms'"

# Se em emulador: verifique se tem Google Play Services
# AVD sem Play (AOSP) não suporta Play Integrity API`,
          },
        ].map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-yellow-500/20 bg-yellow-500/5">
              <h3 className="font-mono text-sm text-yellow-500 font-semibold">{item.problema}</h3>
              <p className="text-xs text-muted-foreground mt-1">Causa: {item.causa}</p>
            </div>
            <div className="p-4">
              <CodeBlock language="bash" code={item.solucao} />
            </div>
          </div>
        ))}
      </div>

      <AlertBox type="success" title="Recursos de ajuda da comunidade">
        Para problemas não cobertos aqui, a comunidade XDA Developers tem threads específicas sobre Play Integrity e bypass de root detection. Busque pelos módulos mencionados neste guia.
      </AlertBox>
    </PageContainer>
  );
}
