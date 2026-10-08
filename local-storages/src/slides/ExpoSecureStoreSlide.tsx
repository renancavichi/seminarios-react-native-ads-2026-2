import { SlideWrapper, SlideTitle, CodeBlock, FeatureCard } from '../components/shared';

export function ExpoSecureStoreSlide() {
  return (
    <SlideWrapper>
      <SlideTitle
        badge="Q"
        title="Expo SecureStore"
        subtitle="Armazenamento assíncrono fortemente criptografado (TEE). Utiliza Keystore (Android) e Keychain (iOS) para isolamento em nível de hardware."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Especificações de Hardware e Nuvem
          </h3>
          <div className="space-y-3">
            <FeatureCard
              icon={<span className="text-xl">📱</span>}
              title="Suporte Multiplataforma (Min Targets)"
              description="Exige Android API 23+ (para uso do hardware Keystore). Em versões recentes do Expo, acompanha as métricas do React Native 0.76+ (API 24+ / iOS 13+)."
              color="emerald"
            />
            <FeatureCard
              icon={<span className="text-xl">☁️</span>}
              title="Isolamento de Backup (Auto Backup)"
              description="Android: A chave morre ao desinstalar o app. Não entra no backup da conta Google por segurança. iOS: A chave sobrevive à desinstalação se o Bundle ID se mantiver o mesmo (persistência da Keychain)."
              color="indigo"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Limites e Comportamento Nativo
          </h3>
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg shrink-0">L</div>
              <div>
                <p className="text-md text-white font-medium mb-1">Limites Físicos (Payload)</p>
                <p className="text-md text-slate-300">O SecureStore não é um banco de dados. Historicamente, o iOS rejeita payloads maiores que ~2048 bytes. O Android tolera por volta de 4KB. Exceder isso gerará erros nativos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg shrink-0">B</div>
              <div>
                <p className="text-md text-white font-medium mb-1">Invalidação Biométrica</p>
                <p className="text-md text-slate-300">Se você usar <code className="text-indigo-300 bg-indigo-500/10 px-1 py-0.5 rounded">requireAuthentication</code> e o usuário registrar um novo dedo ou rosto no sistema do celular, a chave é permanentemente invalidada pelo OS por segurança.</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Síncrono vs Assíncrono */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Abordagem Assíncrona (Recomendada)
          </h3>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
            <p className="text-lg text-slate-300">
              Métodos baseados em <code className="text-emerald-300 bg-emerald-500/10 px-1 py-0.5 rounded">Promise</code>. A thread do JavaScript fica livre para processar animações e UI enquanto aguarda a resposta do módulo nativo (Bridge/JSI).
            </p>
            <ul className="list-disc list-inside text-lg text-slate-300 space-y-2">
              <li><strong><code className="text-white">setItemAsync(key, value, options)</code>:</strong> Salva o par chave-valor. Rejeita se o hardware falhar ao gravar.</li>
              <li><strong><code className="text-white">getItemAsync(key, options)</code>:</strong> Resolve a string ou retorna <code className="text-white">null</code> se não existir. <span className="text-rose-400 font-semibold">Atenção:</span> Se a biometria do sistema mudar (usuário adicionar novo dedo/rosto), a chave criptográfica é invalidada pelo OS e não pode mais ser lida.</li>
              <li><strong><code className="text-white">deleteItemAsync(key, options)</code>:</strong> Exclui a entrada de forma segura.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Abordagem Síncrona (Risco de Bloqueio)
          </h3>
          <div className="rounded-xl border border-rose-500/20 bg-rose-900/5 p-4 space-y-3">
            <p className="text-lg text-slate-300">
              Executam a leitura/escrita de forma imperativa: <strong><code className="text-rose-300 bg-rose-500/10 px-1 py-0.5 rounded">getItem()</code></strong> e <strong><code className="text-rose-300 bg-rose-500/10 px-1 py-0.5 rounded">setItem()</code></strong>.
            </p>
            <p className="text-lg text-slate-300">
              <strong>Impacto Arquitetural:</strong> Estas funções <span className="font-bold text-rose-400">bloqueiam a thread principal do JavaScript</span>. Se você utilizar a opção <code className="text-white">requireAuthentication: true</code> usando um método síncrono, seu aplicativo inteiro ficará congelado e não interativo até que o usuário posicione o rosto ou o dedo e o sistema operacional retorne a resposta.
            </p>
          </div>
        </div>
      </div>

      {/* Utilities e Options */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          Métodos de Validação de Ambiente
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <p className="text-lg font-bold text-indigo-400 mb-1">isAvailableAsync()</p>
            <p className="text-md text-slate-400">Retorna <code className="text-slate-300">Promise&lt;boolean&gt;</code> indicando se a API do SecureStore é suportada pelo hardware atual (sempre true em Android/iOS modernos, útil para ignorar fallback em web).</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <p className="text-lg font-bold text-indigo-400 mb-1">canUseBiometricAuthentication()</p>
            <p className="text-md text-slate-400">Retorna <code className="text-slate-300">boolean</code> checando se o aparelho suporta biometria E se o usuário tem um método forte cadastrado antes de você tentar salvar dados exigindo FaceID.</p>
          </div>
        </div>
      </div>

      {/* Seção de Arquitetura Profunda */}
      <div className="space-y-4 mb-8 mt-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          Arquitetura de Hardware e Comunicação (Por que é mais lento?)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Camada JS & Bridge */}
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌉</span>
              <h4 className="font-bold text-rose-300">1. JS Thread & Bridge</h4>
            </div>
            <p className="text-md text-slate-300">
              Mesmo usando o JSI e expo-native-modules, o SecureStore depende de chamadas <strong>assíncronas</strong>.
            </p>
            <p className="text-md text-slate-300">
              Isso ocorre porque a criptografia de hardware requer chamadas de I/O do sistema operacional e, frequentemente, interação com a UI (como o prompt do FaceID),.
            </p>
          </div>

          {/* Camada Nativa OS */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚙️</span>
              <h4 className="font-bold text-indigo-300">2. Native OS (Keystore/Keychain)</h4>
            </div>
            <p className="text-md text-slate-300">
              O código Java/Kotlin ou Swift recebe a string via expo-native-modules e aciona as APIs de segurança do SO.
            </p>
            <p className="text-md text-slate-300">
              Nesta etapa, o dado em texto plano entra na API, mas a <strong>chave de criptografia</strong> real NUNCA fica acessível na memória RAM (Heap) do aplicativo. O SO delega o trabalho pesado para o hardware.
            </p>
          </div>

          {/* Camada de Hardware (TEE) */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🛡️</span>
              <h4 className="font-bold text-emerald-300">3. Hardware (TEE / Enclave)</h4>
            </div>
            <p className="text-md text-slate-300">
              A criptografia acontece no <strong>TEE (Trusted Execution Environment)</strong> no Android, ou no <strong>Secure Enclave</strong> no iOS.
            </p>
            <p className="text-md text-slate-300">
              É um co-processador físico isolado do processador principal. Se o seu app ou o OS for hackeado, o invasor só verá dados embaralhados, pois a chave mestra está fisicamente "trancada" dentro deste chip de segurança.
            </p>
          </div>
        </div>

        {/* Representação Arquitetural em CodeBlock */}
        <div className="mt-4">
          <CodeBlock
            title="Fluxo-Arquitetural.txt"
            code={`// O que acontece quando você chama setItemAsync('senha', '123')?

[JS Thread] 
  1. JS aciona setItemAsync("senha", "123")
  2. Retorna uma Promise e suspende a execução (não bloqueia a UI).

  ⏬ (Dados serializados passam pelo Expo Modules / Bridge) ⏬

[Native Thread (Java/Swift)]
  3. Recebe a chave "senha" e o valor "123".
  4. Solicita ao OS: "Por favor, encripte '123' usando minha chave do app".

  ⏬ (Comunicação IPC com o Kernel / Hardware) ⏬

[Hardware TEE / Secure Enclave]
  5. O chip isolado pega o valor "123".
  6. Usa a chave privada RSA/AES gravada fisicamente nele.
  7. Devolve o ciphertext: "0x8F9B2...".

[Disco / File System]
  8. O Android/iOS salva "0x8F9B2..." no disco (SharedPreferences/Keychain).
  9. Retorna o sucesso de volta pelo Bridge até o JS resolver a Promise.`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Configuração Estrita (app.json)
          </h3>
          <CodeBlock
            title="app.json (Config Plugin)"
            code={`{
  "expo": {
    "plugins": [
      [
        "expo-secure-store",
        {
          // Impede o Android de fazer backup das chaves na nuvem
          "configureAndroidBackup": true,
          // Obrigatório no iOS se for usar biometria
          "faceIDPermission": "Permita o Face ID para acessar seu token."
        }
      ]
    ],
    "ios": {
      "config": {
        // Evita travar seu app na App Store por Compliance de Criptografia
        "usesNonExemptEncryption": false
      }
    }
  }
}`}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Operações Seguras (Async)
          </h3>
          <CodeBlock
            title="auth.ts"
            code={`import * as SecureStore from 'expo-secure-store';

// Set: Bloqueia acesso da UI até validar biometria
await SecureStore.setItemAsync('api_key', token, {
  requireAuthentication: true,
  keychainAccessible: SecureStore.WHEN_UNLOCKED
});

// Get: Abre prompt nativo do sistema operacional
// Obs: Não funciona no Expo Go com biometria ativa
const token = await SecureStore.getItemAsync('api_key', {
  authenticationPrompt: 'Confirme sua identidade'
});

// Delete: Remove a chave definitivamente
await SecureStore.deleteItemAsync('api_key');`}
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Configuração Avançada (SecureStoreOptions)
          </h3>
          <CodeBlock
            title="secure-options.ts"
            code={`import * as SecureStore from 'expo-secure-store';

// As chaves só suportam caracteres alfanuméricos, '.', '-', e '_'
await SecureStore.setItemAsync('token_bancario', 'xyz.123', {
  // 1. Obriga autenticação via FaceID/TouchID (Requer API 23+ Android)
  requireAuthentication: true,
  
  // 2. Mensagem exibida no prompt nativo
  authenticationPrompt: 'Confirme para salvar o token',
  
  // 3. (iOS) Define quando o dado pode ser lido
  keychainAccessible: SecureStore.WHEN_UNLOCKED,
  
  // 4. Criação de Alias / Escopo de grupo
  keychainService: 'meu_servico_secreto'
});`}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Diferença de Plataforma: Biometria
          </h3>
          <CodeBlock
            title="biometria-comportamento.txt"
            code={`// ATENÇÃO NA IMPLEMENTAÇÃO CROSS-PLATFORM:
// A opção "requireAuthentication: true" age diferente:

// 👉 ANDROID:
// A autenticação do usuário é EXIGIDA PARA TODAS AS OPERAÇÕES.
// Seja setItem, getItem ou deleteItem, o prompt nativo
// será chamado pelo Keystore para validar a ação.

// 👉 iOS:
// A autenticação é exigida APENAS para LER (getItem) ou 
// ATUALIZAR um valor existente. O iOS NÃO solicita 
// FaceID/TouchID no momento inicial de criar/salvar a chave.

// 👉 AMBIENTE DE TESTE:
// Emuladores iOS não exigem biometria nativa. Teste num 
// iPhone físico para validar o fluxo real. Não suportado 
// no app Expo Go devido à falta do NSFaceIDUsageDescription.`}
          />
        </div>
      </div>
    </SlideWrapper>
  );
}