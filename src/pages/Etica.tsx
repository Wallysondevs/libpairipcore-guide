import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Etica() {
  return (
    <PageContainer
      title="Ética e aspectos legais"
      subtitle="O que você pode e não pode fazer com o conhecimento deste guia — uma análise responsável."
      difficulty="iniciante"
      timeToRead="8 min"
    >
      <AlertBox type="danger" title="Leia antes de continuar">
        Este guia é para fins educacionais e de pesquisa de segurança. O uso indevido do conhecimento aqui pode violar leis de propriedade intelectual, termos de serviço de apps/jogos, e em casos graves, leis penais de vários países.
      </AlertBox>

      <h2>O que é permitido</h2>
      <div className="space-y-3 my-6 not-prose">
        {[
          { ok: true, t: "Pesquisa de segurança pessoal", d: "Analisar apps em dispositivos próprios para aprender sobre segurança Android e técnicas de proteção." },
          { ok: true, t: "Testar seus próprios apps", d: "Se você é desenvolvedor, analisar e contornar proteções dos seus próprios apps para melhorar sua implementação." },
          { ok: true, t: "Uso educacional documentado", d: "Usar o conhecimento para criar conteúdo educativo sobre segurança Android, desde que não distribua ferramentas de bypass para apps específicos." },
          { ok: true, t: "Bug bounty e responsible disclosure", d: "Encontrar vulnerabilidades em implementações de Play Integrity e reportá-las responsavelmente ao Google ou ao desenvolvedor." },
          { ok: true, t: "Rodar apps próprios em dispositivo rooteado", d: "Usar seu dispositivo pessoal rooteado para rodar apps que você legitimamente possui/licenciou." },
        ].map((item, i) => (
          <div key={i} className="flex gap-4 bg-card border border-green-500/20 rounded-xl p-4">
            <span className="w-7 h-7 rounded-full bg-green-500/10 text-green-500 text-sm font-bold flex items-center justify-center shrink-0">✓</span>
            <div>
              <h4 className="font-bold text-foreground mb-1">{item.t}</h4>
              <p className="text-sm text-muted-foreground">{item.d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>O que NÃO é permitido</h2>
      <div className="space-y-3 my-6 not-prose">
        {[
          { t: "Pirataria de jogos/apps pagos", d: "Usar bypass de verificação de licença para usar apps sem pagar é pirataria, ilegal na maioria dos países e viola os termos de serviço." },
          { t: "Trapaça em jogos competitivos online", d: "Usar Game Guardian ou scripts Frida para ganhar vantagem em jogos com outros jogadores causa dano real a outras pessoas e pode resultar em banimento permanente e ação legal." },
          { t: "Distribuição de ferramentas de bypass específicas", d: "Criar e distribuir scripts ou módulos específicos para bypassar proteções de apps comerciais é ilegal em muitos países." },
          { t: "Análise de apps sem autorização para fins comerciais", d: "Fazer engenharia reversa de apps de terceiros para criar produtos concorrentes ou extrair dados proprietários é ilegal." },
          { t: "Acesso não autorizado a sistemas", d: "Usar conhecimento de bypass para acessar recursos de apps/serviços que você não tem permissão é crime em praticamente todos os países." },
        ].map((item, i) => (
          <div key={i} className="flex gap-4 bg-card border border-red-500/20 rounded-xl p-4">
            <span className="w-7 h-7 rounded-full bg-red-500/10 text-red-500 text-sm font-bold flex items-center justify-center shrink-0">✗</span>
            <div>
              <h4 className="font-bold text-foreground mb-1">{item.t}</h4>
              <p className="text-sm text-muted-foreground">{item.d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Aspectos legais por região</h2>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="bg-muted text-foreground font-semibold px-4 py-2 text-left border border-border">País/Região</th>
              <th className="bg-muted text-foreground font-semibold px-4 py-2 text-left border border-border">Lei relevante</th>
              <th className="bg-muted text-foreground font-semibold px-4 py-2 text-left border border-border">Proteção de pesquisa</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Brasil", "Lei 12.965/2014 (Marco Civil) + Lei 9.609/1998 (Software)", "Pesquisa de segurança tem alguma proteção, mas não é explícita como nos EUA"],
              ["EUA", "DMCA (Digital Millennium Copyright Act)", "Exceção de segurança da informação existe mas é limitada"],
              ["União Europeia", "Diretiva sobre proteção jurídica de programas de computador", "Permite engenharia reversa para interoperabilidade"],
              ["Internacional", "Varia significativamente por país", "Sempre consulte um advogado local"],
            ].map(([pais, lei, prot], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-muted/20" : ""}>
                <td className="px-4 py-2 border border-border font-semibold text-foreground text-sm">{pais}</td>
                <td className="px-4 py-2 border border-border text-muted-foreground text-sm">{lei}</td>
                <td className="px-4 py-2 border border-border text-muted-foreground text-sm">{prot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertBox type="info" title="Nossa posição">
        Este guia existe para promover o conhecimento sobre segurança Android. Acreditamos que a comunidade de segurança precisa entender como as proteções funcionam para poder melhorá-las. Use com responsabilidade.
      </AlertBox>
    </PageContainer>
  );
}
