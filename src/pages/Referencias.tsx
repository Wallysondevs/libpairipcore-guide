import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { ExternalLink } from "lucide-react";

export default function Referencias() {
  const refs = [
    {
      category: "Documentação Oficial Google",
      items: [
        { title: "Play Integrity API — Documentação oficial", url: "https://developer.android.com/google/play/integrity", desc: "Documentação completa da API de integridade, incluindo guias de implementação e referência de API." },
        { title: "Android NDK — JNI Tips", url: "https://developer.android.com/training/articles/perf-jni", desc: "Guia oficial sobre como usar a JNI corretamente em apps Android nativos." },
        { title: "Android Security Bulletins", url: "https://source.android.com/docs/security/bulletin", desc: "Boletins de segurança mensais do Android com informações sobre vulnerabilidades corrigidas." },
      ]
    },
    {
      category: "Ferramentas",
      items: [
        { title: "Ghidra — NSA Research Directorate", url: "https://ghidra-sre.org", desc: "Download e documentação do Ghidra, o disassembler/decompilador gratuito da NSA." },
        { title: "Frida — Dynamic instrumentation toolkit", url: "https://frida.re", desc: "Site oficial do Frida com documentação completa da API JavaScript." },
        { title: "Magisk — GitHub Repository", url: "https://github.com/topjohnwu/Magisk", desc: "Repositório oficial do Magisk com releases, documentação e instruções de instalação." },
        { title: "jadx — Dex to Java decompiler", url: "https://github.com/skylot/jadx", desc: "Repositório do jadx com releases e documentação." },
        { title: "PlayIntegrityFix (PIF)", url: "https://github.com/chiteroman/PlayIntegrityFix", desc: "Módulo Magisk para bypass da Play Integrity API." },
      ]
    },
    {
      category: "Artigos e Pesquisa",
      items: [
        { title: "Analysis of Google's Play Integrity API — POC2023", url: "https://conference.hitb.org/hitbsecconf2023ams/", desc: "Apresentação de pesquisa sobre a Play Integrity API e suas implementações." },
        { title: "Reverse Engineering Android Native Libraries", url: "https://www.ragingrock.com/AndroidAppRE/", desc: "Guia abrangente sobre engenharia reversa de bibliotecas nativas Android." },
        { title: "Android Root Detection Bypass Techniques", url: "https://owasp.org/www-project-mobile-app-security/", desc: "OWASP Mobile Security Project com técnicas de bypass e melhores práticas." },
      ]
    },
    {
      category: "Comunidade",
      items: [
        { title: "XDA Developers — Android Development", url: "https://xdaforums.com", desc: "A maior comunidade de desenvolvimento Android, com threads sobre Magisk, Frida e bypass." },
        { title: "r/androidroot — Reddit", url: "https://reddit.com/r/androidroot", desc: "Comunidade Reddit sobre root Android com dicas e soluções de problemas." },
        { title: "GitHub — Magisk-Modules-Repo", url: "https://github.com/Magisk-Modules-Repo", desc: "Repositório oficial de módulos Magisk verificados pela comunidade." },
      ]
    }
  ];

  return (
    <PageContainer
      title="Referências"
      subtitle="Documentação, ferramentas e recursos da comunidade usados neste guia."
      difficulty="iniciante"
      timeToRead="5 min"
    >
      <AlertBox type="info" title="Links externos">
        Todos os links abrem em nova aba. Links para GitHub e documentações oficiais estão corretos no momento da publicação deste guia — verifique as datas de atualização de cada recurso.
      </AlertBox>

      <div className="space-y-10 my-8">
        {refs.map((section) => (
          <div key={section.category}>
            <h2>{section.category}</h2>
            <div className="space-y-3 not-prose">
              {section.items.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 bg-card border border-border hover:border-primary/50 hover:bg-primary/5 rounded-xl p-4 transition-all duration-200 group no-underline block"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                    <ExternalLink className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    <span className="text-xs text-primary/60 font-mono mt-1 block truncate">{item.url}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2>Citação deste guia</h2>
      <div className="bg-muted/50 border border-border rounded-xl p-4 font-mono text-xs text-muted-foreground">
        Wallysondevs. (2025). <em>Guia Completo libpairipcore — Análise e Bypass da Biblioteca de Proteção Android</em>. Disponível em: https://wallysondevs.github.io/libpairipcore-guide/
      </div>
    </PageContainer>
  );
}
