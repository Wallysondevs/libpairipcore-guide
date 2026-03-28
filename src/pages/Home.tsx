import { Link } from "wouter";
import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal, Shield, Search, Code, Zap, Lock } from "lucide-react";

export default function Home() {
  const topics = [
    { icon: Terminal, title: "O que é libpairipcore?", desc: "Entenda o papel desta biblioteca nativa nas defesas de apps Android.", href: "/o-que-e" },
    { icon: Shield, title: "Play Integrity API", desc: "Como a biblioteca se integra com o sistema de atestação do Google.", href: "/play-integrity" },
    { icon: Search, title: "Análise com Ghidra", desc: "Engenharia reversa da .so para entender suas funções internas.", href: "/ghidra" },
    { icon: Code, title: "Hooking com Frida", desc: "Intercepte chamadas da biblioteca em tempo de execução.", href: "/frida-basico" },
    { icon: Zap, title: "Bypass com Frida", desc: "Scripts completos para contornar as verificações da biblioteca.", href: "/bypass-frida" },
    { icon: Lock, title: "Bypass com Magisk", desc: "Módulos e técnicas para passar nas verificações de integridade.", href: "/bypass-magisk" },
  ];

  return (
    <PageContainer
      title="libpairipcore"
      subtitle="Guia completo de análise, engenharia reversa e bypass da biblioteca de proteção anti-pirataria do Android — em Português Brasileiro."
    >
      <AlertBox type="warning" title="Uso educacional">
        Este guia é destinado a pesquisadores de segurança, desenvolvedores Android e entusiastas de engenharia reversa. Use o conhecimento aqui de forma ética e responsável.
      </AlertBox>

      <h2>O que você vai aprender</h2>
      <p>
        A <code>libpairipcore.so</code> é uma biblioteca nativa Android utilizada pelo Google Play para verificar a integridade e autenticidade dos aplicativos. Ela está presente em milhares de apps e jogos da Play Store e é um dos principais obstáculos para:
      </p>
      <ul>
        <li>Pesquisadores de segurança que analisam apps</li>
        <li>Desenvolvedores que testam em dispositivos com root</li>
        <li>Usuários de Virtual Space e emuladores</li>
        <li>Quem usa ferramentas como Game Guardian em jogos protegidos</li>
      </ul>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 not-prose">
        {topics.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link key={i} href={item.href}>
              <div className="group bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer h-full">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <h2>Estrutura do guia</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 not-prose">
        {[
          { n: "1", label: "Entender", desc: "O que é, como funciona e como se integra ao ecossistema Android" },
          { n: "2", label: "Analisar", desc: "Ferramentas para engenharia reversa: Ghidra, jadx, Frida, APKTool" },
          { n: "3", label: "Contornar", desc: "Técnicas de bypass usando Frida scripts e módulos Magisk" },
        ].map((item) => (
          <div key={item.n} className="bg-muted/50 border border-border rounded-xl p-4 text-center">
            <span className="text-2xl font-bold text-primary block mb-1">{item.n}</span>
            <span className="font-semibold text-foreground text-sm block mb-1">{item.label}</span>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2>Pré-requisitos recomendados</h2>
      <ul>
        <li>Conhecimentos básicos de Android e desenvolvimento de apps</li>
        <li>Familiaridade com Java/Kotlin ou C/C++ nativo</li>
        <li>Noções de arquitetura ARM (assembly ARM é útil mas não obrigatório)</li>
        <li>Dispositivo Android com root ou emulador configurado</li>
      </ul>
    </PageContainer>
  );
}
