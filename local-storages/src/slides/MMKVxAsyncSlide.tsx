import { SlideWrapper, SlideTitle, CodeBlock, FeatureCard } from '../components/shared';

export function MMKVxAsyncSlide() {
  return (
    <SlideWrapper>
      <SlideTitle
        badge="Storage de Alta Performance"
        title="MMKV x AsyncStorage"
        subtitle="Diferença das bibliotecas"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Características Principais
          </h3>
          <div className="space-y-3">
            <FeatureCard
              icon={<span className="text-xl">⚡</span>}
              title="30x mais rápido que AsyncStorage"
              description="Usa mmap para acesso direto à memória, sem serialização assíncrona"
              color="cyan"
            />
            <FeatureCard
              icon={<span className="text-xl">🔄</span>}
              title="Síncrono por padrão"
              description="API síncrona que simplifica o código e elimina race conditions"
              color="indigo"
            />
            <FeatureCard
              icon={<span className="text-xl">📐</span>}
              title="Tipos nativos"
              description="Suporta string, number, boolean, Buffer e objetos diretamente"
              color="emerald"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Como funciona
          </h3>
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">1</div>
              <p className="text-sm text-slate-300">Mapeia arquivo em memória com <code className="text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded">mmap</code></p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">2</div>
              <p className="text-sm text-slate-300">Acesso direto ao buffer sem parsing</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">3</div>
              <p className="text-sm text-slate-300">Escrita atômica com <code className="text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded">msync</code></p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">4</div>
              <p className="text-sm text-slate-300">Persistência garantida no disco</p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-start gap-2">
              <span className="text-amber-400">⚠️</span>
              <div>
                <p className="text-sm font-medium text-amber-300">Limitação</p>
                <p className="text-xs text-slate-400 mt-1">Não é criptografado por padrão. Para dados sensíveis, use o modo de criptografia ou combine com SecureStore.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        Exemplo de Uso
      </h3>
      <CodeBlock
        title="mmkv-storage.ts"
        code={`import { MMKV } from 'react-native-mmkv';

// Criar instância (pode ter múltiplas)
export const storage = new MMKV({
  id: 'app-storage',
  path: \`\${MMKV.defaultStoragePath}/app\`,
  encryptionKey: 'my-secret-key', // opcional
});

// Uso síncrono - sem await!
storage.set('user.name', 'João Silva');
storage.set('user.age', 28);
storage.set('user.premium', true);

const name = storage.getString('user.name'); // "João Silva"
const age = storage.getNumber('user.age');   // 28
const isPremium = storage.getBoolean('user.premium'); // true

// Listener para mudanças
storage.addOnValueChangedListener((key) => {
  console.log(\`Key "\${key}" mudou!\`);
});

// Limpar tudo
storage.clearAll();`}
      />
    </SlideWrapper>
  );
}
