import { SlideWrapper, SlideTitle, ComparisonTable, StatCard } from '../components/shared';

export function BenchmarksSlide() {
  return (
    <SlideWrapper>
      <SlideTitle
        badge="Performance"
        title="Benchmarks"
        subtitle="Comparação de performance entre as soluções de storage. Testes realizados com 1000 operações de leitura/escrita."
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard value="0.3ms" label="MMKV (read)" color="cyan" />
        <StatCard value="8.7ms" label="AsyncStorage (read)" color="amber" />
        <StatCard value="12.4ms" label="SecureStore (read)" color="emerald" />
        <StatCard value="29x" label="MMKV vs AsyncStorage" color="indigo" />
      </div>

      {/* Performance Chart Visual */}
      <div className="mb-8 rounded-xl border border-white/10 bg-slate-900/50 p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Tempo de Leitura (1000 ops)</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-300 font-medium">MMKV</span>
              <span className="text-slate-400">0.3ms</span>
            </div>
            <div className="h-8 rounded-lg bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-lg flex items-center justify-end pr-3 transition-all duration-1000" style={{ width: '3%' }}>
                <span className="text-[10px] text-white font-bold">⚡</span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-amber-300 font-medium">AsyncStorage</span>
              <span className="text-slate-400">8.7ms</span>
            </div>
            <div className="h-8 rounded-lg bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg flex items-center justify-end pr-3 transition-all duration-1000" style={{ width: '30%' }}>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-emerald-300 font-medium">SecureStore</span>
              <span className="text-slate-400">12.4ms</span>
            </div>
            <div className="h-8 rounded-lg bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-end pr-3 transition-all duration-1000" style={{ width: '42%' }}>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-rose-300 font-medium">SQLite (reference)</span>
              <span className="text-slate-400">15.2ms</span>
            </div>
            <div className="h-8 rounded-lg bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-lg flex items-center justify-end pr-3 transition-all duration-1000" style={{ width: '52%' }}>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Write Performance */}
      <div className="mb-8 rounded-xl border border-white/10 bg-slate-900/50 p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Tempo de Escrita (1000 ops)</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-300 font-medium">MMKV</span>
              <span className="text-slate-400">0.5ms</span>
            </div>
            <div className="h-8 rounded-lg bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-lg flex items-center justify-end pr-3" style={{ width: '5%' }}>
                <span className="text-[10px] text-white font-bold">⚡</span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-amber-300 font-medium">AsyncStorage</span>
              <span className="text-slate-400">12.3ms</span>
            </div>
            <div className="h-8 rounded-lg bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg flex items-center justify-end pr-3" style={{ width: '40%' }}>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-emerald-300 font-medium">SecureStore</span>
              <span className="text-slate-400">18.6ms</span>
            </div>
            <div className="h-8 rounded-lg bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-end pr-3" style={{ width: '60%' }}>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-400" />
        Tabela Comparativa Completa
      </h3>
      <ComparisonTable
        headers={['Feature', 'MMKV', 'AsyncStorage', 'SecureStore']}
        rows={[
          ['Velocidade', '⚡ Ultra rápido', '🐢 Lento', '🐢 Lento'],
          ['API', 'Síncrona', 'Assíncrona', 'Assíncrona'],
          ['Criptografia', 'Opcional', 'Não', 'Sim (nativa)'],
          ['Tamanho máx.', 'Sem limite prático', 'Sem limite', '~4KB (Android)'],
          ['Tipos', 'string, number, bool', 'string apenas', 'string apenas'],
          ['Bundle size', '~150KB', 'Built-in', '~50KB'],
          ['Plataformas', 'iOS, Android', 'iOS, Android', 'iOS, Android, Web'],
          ['Listeners', 'Sim', 'Sim', 'Não'],
          ['Multi-instance', 'Sim', 'Não', 'Não'],
        ]}
        highlightCol={1}
      />
    </SlideWrapper>
  );
}
