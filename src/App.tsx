import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import Home from "@/pages/Home";
import OQueE from "@/pages/OQueE";
import ComoFunciona from "@/pages/ComoFunciona";
import Estrutura from "@/pages/Estrutura";
import PlayIntegrity from "@/pages/PlayIntegrity";
import DeteccaoRoot from "@/pages/DeteccaoRoot";
import DeteccaoEmulador from "@/pages/DeteccaoEmulador";
import Ferramentas from "@/pages/Ferramentas";
import Ghidra from "@/pages/Ghidra";
import FridaBasico from "@/pages/FridaBasico";
import BypassFrida from "@/pages/BypassFrida";
import BypassMagisk from "@/pages/BypassMagisk";
import CasosPraticos from "@/pages/CasosPraticos";
import Troubleshooting from "@/pages/Troubleshooting";
import Etica from "@/pages/Etica";
import Referencias from "@/pages/Referencias";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location] = useHashLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/o-que-e" component={OQueE} />
        <Route path="/como-funciona" component={ComoFunciona} />
        <Route path="/estrutura" component={Estrutura} />
        <Route path="/play-integrity" component={PlayIntegrity} />
        <Route path="/deteccao-root" component={DeteccaoRoot} />
        <Route path="/deteccao-emulador" component={DeteccaoEmulador} />
        <Route path="/ferramentas" component={Ferramentas} />
        <Route path="/ghidra" component={Ghidra} />
        <Route path="/frida-basico" component={FridaBasico} />
        <Route path="/bypass-frida" component={BypassFrida} />
        <Route path="/bypass-magisk" component={BypassMagisk} />
        <Route path="/casos-praticos" component={CasosPraticos} />
        <Route path="/troubleshooting" component={Troubleshooting} />
        <Route path="/etica" component={Etica} />
        <Route path="/referencias" component={Referencias} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter hook={useHashLocation}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
