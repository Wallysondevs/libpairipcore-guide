import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Ghidra() {
  return (
    <PageContainer
      title="Análise com Ghidra"
      subtitle="Passo a passo completo para analisar a libpairipcore com o Ghidra — do import à identificação de funções críticas."
      difficulty="avancado"
      timeToRead="20 min"
    >
      <AlertBox type="info" title="Pré-requisito">
        Este tutorial assume que você já extraiu a <code>libpairipcore.so</code> do APK. Se não fez isso ainda, veja a seção "Estrutura da biblioteca".
      </AlertBox>

      <h2>Importando a biblioteca no Ghidra</h2>
      <div className="space-y-3 my-6 not-prose">
        {[
          "Abra o Ghidra e crie um novo projeto (File > New Project > Non-Shared Project)",
          "Importe o arquivo: File > Import File > selecione libpairipcore.so",
          "Na janela de import, o Ghidra detectará automaticamente: Format: ELF, Language: AARCH64:LE:64:v8A (para arm64-v8a)",
          "Clique em OK e depois em 'Yes' para analisar o binário",
          "Na janela de análise, mantenha as opções padrão e clique em 'Analyze'",
          "Aguarde — a análise pode levar 2-10 minutos dependendo do hardware",
        ].map((step, i) => (
          <div key={i} className="flex gap-4 bg-card border border-border rounded-xl p-4">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
            <p className="text-sm text-foreground/80 m-0">{step}</p>
          </div>
        ))}
      </div>

      <h2>Encontrando funções exportadas</h2>
      <CodeBlock
        language="bash"
        title="Navegando no Symbol Tree do Ghidra"
        code={`# No painel esquerdo do Ghidra:
# 1. Abra "Symbol Tree" (Window > Symbol Tree)
# 2. Expanda "Functions" > "Exports"
# 3. Você verá as funções exportadas:
#    - JNI_OnLoad
#    - Java_com_google_android_play_core_integrity_*
#    - Funções internas com nomes ofuscados como "a", "b", "aa", etc.

# Também útil: Symbol References
# Window > Symbol References
# Permite ver onde uma função é chamada`}
      />

      <h2>Analisando a JNI_OnLoad</h2>
      <p>
        Clique duplo em <code>JNI_OnLoad</code> na Symbol Tree. Esta função é o ponto de entrada quando a biblioteca é carregada. No decompilador (Window {'>'} Decompile), você verá algo como:
      </p>
      <CodeBlock
        language="c"
        title="Exemplo de JNI_OnLoad decompilado (simplificado)"
        code={`jint JNI_OnLoad(JavaVM *vm, void *reserved) {
    JNIEnv *env;
    
    // Obtém o JNIEnv
    if ((*vm)->GetEnv(vm, (void**)&env, JNI_VERSION_1_6) != JNI_OK) {
        return JNI_ERR;
    }
    
    // Registra métodos nativos
    // (Em código ofuscado, isto aparece como chamadas obscuras)
    jclass clazz = (*env)->FindClass(env, "com/google/android/play/core/integrity/IntegrityManager");
    
    JNINativeMethod methods[] = {
        {"nativeInit", "()V", (void*)native_init},
        {"nativeCheck", "(Ljava/lang/String;)I", (void*)native_check},
    };
    
    (*env)->RegisterNatives(env, clazz, methods, 2);
    
    // Executa checagens iniciais de ambiente
    if (detect_analysis_environment()) {
        // Anti-debug: se detectar Frida/debugger, pode retornar erro
        // ou entrar em loop infinito, ou dar crash propositalmente
        return JNI_ERR;
    }
    
    return JNI_VERSION_1_6;
}`}
      />

      <h2>Identificando funções de verificação</h2>
      <p>
        As funções de verificação são geralmente encontradas indiretamente. Use estas estratégias:
      </p>
      <h3>Busca por strings</h3>
      <CodeBlock
        language="bash"
        title="Buscando strings no Ghidra"
        code={`# Menu: Search > For Strings
# Ou atalho: Ctrl+F no Listing

# Strings que identificam funções de detecção de root:
# "/system/bin/su" -> verá referências em funções de detecção
# "/proc/self/maps" -> mapeamento de memória
# "ro.debuggable"  -> props do sistema

# Para cada string encontrada:
# 1. Clique na string
# 2. Clique direito > References > Show References to Address
# 3. Isso mostra quais funções usam essa string`}
      />

      <h3>Script Ghidra para busca automatizada</h3>
      <CodeBlock
        language="java"
        title="Script Ghidra (Java) para listar funções suspeitas"
        code={`// Script para Ghidra: Window > Script Manager > New Script
// Salve como FindSuspiciousFunctions.java

import ghidra.app.script.GhidraScript;
import ghidra.program.model.symbol.*;
import ghidra.program.model.listing.*;
import ghidra.program.model.address.*;

public class FindSuspiciousFunctions extends GhidraScript {
    
    String[] suspiciousStrings = {
        "su", "magisk", "frida", "/proc/maps",
        "ro.debuggable", "debuggerd", "jdwp"
    };
    
    @Override
    public void run() throws Exception {
        println("=== Buscando funções suspeitas ===");
        
        for (String target : suspiciousStrings) {
            // Busca nos dados da memória
            AddressSetView set = currentProgram.getMemory();
            byte[] pattern = target.getBytes();
            
            Address found = find(null, pattern);
            while (found != null) {
                println("String '" + target + "' em: " + found);
                // Mostrar funções que referenciam este endereço
                found = findAfter(found, pattern);
            }
        }
    }
}`}
      />

      <AlertBox type="warning" title="Ofuscação — o maior obstáculo">
        Versões recentes do libpairipcore usam Control Flow Flattening, que transforma funções em grandes switch statements com centenas de casos, tornando a análise manual extremamente tediosa. Plugins como OLLVM-Deobfuscator para Ghidra podem ajudar parcialmente.
      </AlertBox>
    </PageContainer>
  );
}
