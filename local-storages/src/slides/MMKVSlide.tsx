import { SlideWrapper, SlideTitle, CodeBlock, FeatureCard } from '../components/shared';

export function MMKVSlide() {
  return (
    <SlideWrapper>
      <SlideTitle
        badge="Storage de Alta Performance"
        title="MMKV"
        subtitle="Framework C++ desenvolvido pelo WeChat (Tencent). Escrita atômica (mmap/msync) com suporte a criptografia e React Hooks."
      />

      {/* Grid de Especificações Técnicas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Especificações e Alvos Nativo
          </h3>
          <div className="space-y-3">
            <FeatureCard
              icon={<span className="text-xl">📱</span>}
              title="Suporte Multiplataforma (Min Targets)"
              description="iOS 13.0+ | Android 5 (API 21) (no MMKV v2) e Android API 24 (a partir da versão mais recente v3+). A v4+ requere React Native 0.76 ou superior."
              color="cyan"
            />
            <FeatureCard
              icon={<span className="text-xl">🔒</span>}
              title="Criptografia Integrada"
              description="Suporta encriptação AES CFB-128 de forma transparente, isolando as instâncias."
              color="indigo"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Operações e Memória
          </h3>
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">T</div>
              <p className="text-md text-slate-300"><strong>Tipagem Forte:</strong> Sets se adaptam automaticamente, e Gets possuem métodos estritos (String, Number, Boolean, Buffer).</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">M</div>
              <p className="text-md text-slate-300"><strong>Gerenciamento (Trim):</strong> <code className="text-emerald-300 bg-emerald-500/10 px-1 py-0.5 rounded">clearMemoryCache()</code> faz o trim limpando os dados mapeados na RAM sem afetar o disco.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">H</div>
              <p className="text-md text-slate-300"><strong>Hooks:</strong> Uso de <code className="text-emerald-300 bg-emerald-500/10 px-1 py-0.5 rounded">useMMKV...</code> para amarrar o storage diretamente à UI.</p>
            </div>

          </div>
        </div>
      </div>





      {/* Grid de Código Técnico Duplo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Core API (Instâncias e Métodos)
          </h3>
          <CodeBlock
            title="mmkv-setup.ts"
            code={`import { createMMKV } from 'react-native-mmkv'

// 1. Instância Básica
export const storage = createMMKV()

// 2. Instância Customizada (Isolada e Segura)
export const storage = createMMKV({
  id: \`user-\${userId}-storage\`,
  path: \`\${USER_DIRECTORY}/storage\`,
  encryptionKey: \`\${ENCRYPTION_KEY}\`,
  encryptionType: 'AES-256',
  mode: 'multi-process',
  readOnly: false,
  compareBeforeSet: false,
});

// 3. Tipagem estrita de Sets e Gets
storage.set('user.name', 'Túlio');
storage.set('user.age', 25);
storage.set('user.logged', true);

const name = storage.getString('user.name');
const age = storage.getNumber('user.age');
const size = storage.getAllKeys().length;

// 4. Utilitários e Limpeza
storage.delete('user.age');
storage.clearAll(); // Apaga tudo
storage.clearMemoryCache(); // "Trim" da RAM`}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            React Hooks (UI Reativa)
          </h3>
          <CodeBlock
            title="ProfileScreen.tsx"
            code={`import { 
  useMMKVString, 
  useMMKVObject 
} from 'react-native-mmkv';
import { storage } from './mmkv-setup';

type UserData = { id: string; role: string };

export function ProfileScreen() {
  // Hook escuta mudanças e re-renderiza a tela
  const [theme, setTheme] = useMMKVString('theme', storage);
  
  // Suporte a Objetos complexos com tipagem
  const [user, setUser] = useMMKVObject<UserData>(
    'user.data', 
    storage
  );

  return (
    <Button 
      title={\`Tema: \${theme}\`}
      onPress={() => setTheme('dark')} 
    />
  );
}`}
          />
        </div>
      </div>

      {/* Benchmark centralizado e menor para dar espaço aos códigos */}
      <div className='flex justify-center items-center my-6 overflow-hidden rounded-xl bg-white/5'>
        <img
          src="https://raw.githubusercontent.com/margelo/react-native-mmkv/main/docs/img/benchmark_1000_get.png"
          className="object-cover h-full object-center opacity-90 hover:opacity-100 transition-opacity mix-blend-screen"
        />
      </div>

      <div className='flex justify-center items-center my-6 overflow-hidden rounded-xl bg-white/5'>
        <img
          src="https://reactnative.dev/assets/images/0.76-bridge-diagram-4e31abb22d5626336e548fa646c8cfc4.png"
          className="object-cover h-full object-center opacity-90 hover:opacity-100 transition-opacity mix-blend-screen"
        />
      </div>

      <div className='flex items-start justify-between space-y-4 gap-6'>
        <div>
          <h4 className="text-xl text-center font-semibold text-red-400 mb-3">Old Architecture: A "Async Bridge" (Ex: AsyncStorage)</h4>
          <p className="text-lg text-slate-300 leading-relaxed">
            Na arquitetura antiga (à esquerda), as threads de JavaScript e do dispositivo Nativo (Java, Kotlin, Swift, Obj-C, etc.) são completamente isoladas. Para se comunicarem, os dados precisam ser convertidos em texto (serializados em JSON), enviados por um túnel assíncrono chamado **Bridge** e decodificados no outro lado. Isso cria um grande gargalo, forçando o uso de <code className="text-red-300 bg-red-500/10 px-1 py-0.5 rounded">await</code> e atrasando a renderização de dados rápidos.
          </p>
        </div>

        <div>
          <h4 className="text-xl text-center font-semibold text-emerald-400 mb-3">New Architecture: JSI e NitroModules (O MMKV)</h4>
          <p className="text-lg text-slate-300 leading-relaxed">
            A arquitetura nova (à direita) elimina a Bridge. Usando o JSI (JavaScript Interface), o motor JS consegue enxergar e invocar funções em C++ de forma **direta e síncrona**, compartilhando a mesma memória. Recentemente, o MMKV evoluiu de JSI puro para **NitroModules**, uma estrutura moderna que cria "bindings" (ligações nativas) ultrarrápidas entre C++ e o código da plataforma (Swift/Kotlin), com conversão de tipos em tempo de compilação.
          </p>
          <p className="text-lg font-semibold text-cyan-300 mt-2">
            Resultado: Sem serialização, sem bridge, e retorno imediato sem usar "await". Isso justifica o desempenho 30x superior no gráfico inicial.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 space-y-4 mt-6">
        {/* mmap */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
            RAM
          </div>
          <div>
            <p className="text-lg text-white font-medium mb-1">Memory-Mapped Files (mmap)</p>
            <p className="text-lg text-slate-300 leading-relaxed">
              O MMKV não usa chamadas de I/O tradicionais. Ele utiliza a syscall <code className="text-emerald-300 bg-emerald-500/10 px-1 py-0.5 rounded">mmap()</code> do SO (Linux/Darwin) para criar um espelho direto de um arquivo físico no espaço de memória virtual (RAM) do app. Ler um valor é tão rápido quanto ler uma variável em memória.
            </p>
          </div>
        </div>

        {/* Sincronização */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
            SYNC
          </div>
          <div>
            <p className="text-lg text-white font-medium mb-1">Sincronização Kernel-Disco</p>
            <p className="text-lg text-slate-300 leading-relaxed">
              As operações de SET ocorrem instantaneamente de forma síncrona na RAM, sem travar a thread do JS. O kernel do sistema operacional assume a responsabilidade de fazer o "flush" (descarregar) dessas páginas de memória sujas para o disco físico em background de forma assíncrona.
            </p>
          </div>
        </div>

        {/* Integridade (msync/protobuf) */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
            I/O
          </div>
          <div>
            <p className="text-lg text-white font-medium mb-1">Integridade e Atomicidade (msync)</p>
            <p className="text-lg text-slate-300 leading-relaxed">
              Os dados são serializados compactados em formato <span className="font-semibold text-slate-200">Protobuf</span>. Para prevenir corrupção em crashes, o MMKV garante escritas atômicas utilizando <code className="text-emerald-300 bg-emerald-500/10 px-1 py-0.5 rounded">msync()</code> e valida a integridade do arquivo através de checagem de tamanho cíclica (CRC32).
            </p>
          </div>
        </div>
      </div>
    </SlideWrapper >
  );
}