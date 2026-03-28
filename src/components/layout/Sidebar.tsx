import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BookOpen, Shield, Code, Cpu, X, Download, Settings,
  AlertTriangle, FileText, Zap, Bug, Lock, HelpCircle,
  Home, Layers, Search, Terminal, FlaskConical
} from "lucide-react";

const NAVIGATION = [
  {
    title: "Introdução",
    items: [
      { path: "/", label: "Início", icon: Home },
      { path: "/o-que-e", label: "O que é libpairipcore?", icon: BookOpen },
      { path: "/como-funciona", label: "Como funciona", icon: Cpu },
      { path: "/estrutura", label: "Estrutura da biblioteca", icon: Layers },
    ]
  },
  {
    title: "Integração com Google",
    items: [
      { path: "/play-integrity", label: "Play Integrity API", icon: Shield },
      { path: "/deteccao-root", label: "Detecção de Root", icon: Bug },
      { path: "/deteccao-emulador", label: "Detecção de Emulador", icon: Settings },
    ]
  },
  {
    title: "Análise & Engenharia Reversa",
    items: [
      { path: "/ferramentas", label: "Ferramentas necessárias", icon: Download },
      { path: "/ghidra", label: "Análise com Ghidra", icon: Search },
      { path: "/frida-basico", label: "Hooking com Frida", icon: Code },
    ]
  },
  {
    title: "Bypass & Técnicas",
    items: [
      { path: "/bypass-frida", label: "Bypass com Frida", icon: Zap },
      { path: "/bypass-magisk", label: "Bypass com Magisk", icon: Lock },
      { path: "/casos-praticos", label: "Casos Práticos", icon: FlaskConical },
    ]
  },
  {
    title: "Extras",
    items: [
      { path: "/troubleshooting", label: "Troubleshooting", icon: HelpCircle },
      { path: "/etica", label: "Ética e aspectos legais", icon: AlertTriangle },
      { path: "/referencias", label: "Referências", icon: FileText },
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between lg:justify-center mb-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold mt-0 mb-0 pb-0 border-0 leading-tight font-mono">libpairipcore</h2>
                <p className="text-xs text-muted-foreground">Guia Completo PT-BR</p>
              </div>
            </Link>
            <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-8">
            {NAVIGATION.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3 mt-0 border-0 pb-0">
                  {section.title}
                </h4>
                <ul className="space-y-1">
                  {section.items.map((item, i) => {
                    const isActive = location === item.path;
                    const Icon = item.icon;
                    return (
                      <li key={i}>
                        <Link
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "opacity-70")} />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
