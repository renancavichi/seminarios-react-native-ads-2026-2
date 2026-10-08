import { SlideWrapper, SlideTitle, FeatureCard } from '../components/shared';

export function ConclusionSlide() {
  return (
    <SlideWrapper>
      <SlideTitle
        badge="Resumo Final"
        title="Conclusão & Casos de Uso"
        subtitle="Comparativo técnico e guia prático para escolher a solução ideal de armazenamento no React Native."
      />

      {/* Casos de Uso e Pontos Positivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 space-y-4">
          <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-3">
            <span className="text-3xl">⚡</span>
            <h3 className="text-xl font-bold text-cyan-400">MMKV</h3>
          </div>
          <div>
            <p className="text-lg text-slate-300 font-medium mb-2">Casos de Uso:</p>
            <p className="text-md text-slate-400 mb-4 leading-relaxed">Cache rápido, estado da UI, preferências do usuário e dados de sessão não-críticos. Ideal como substituto do AsyncStorage.</p>
            <p className="text-lg text-slate-300 font-medium mb-2">Pontos Positivos:</p>
            <ul className="text-md text-slate-400 list-disc list-inside space-y-2">
              <li>Velocidade absurdamente alta (mmap)</li>
              <li>Acesso síncrono (sem async/await)</li>
              <li>Suporte nativo a múltiplos tipos</li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-4">
          <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-3">
            <span className="text-3xl">🛡️</span>
            <h3 className="text-xl font-bold text-emerald-400">SecureStore</h3>
          </div>
          <div>
            <p className="text-lg text-slate-300 font-medium mb-2">Casos de Uso:</p>
            <p className="text-md text-slate-400 mb-4 leading-relaxed">Tokens JWT, chaves de API, senhas, dados bancários e informações atreladas à biometria do usuário.</p>
            <p className="text-lg text-slate-300 font-medium mb-2">Pontos Positivos:</p>
            <ul className="text-md text-slate-400 list-disc list-inside space-y-2">
              <li>Criptografia baseada em Hardware (TEE)</li>
              <li>Isolamento do sistema operacional</li>
              <li>Integração direta com FaceID/TouchID</li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 space-y-4">
          <div className="flex items-center gap-3 border-b border-indigo-500/20 pb-3">
            <span className="text-3xl">🗄️</span>
            <h3 className="text-xl font-bold text-indigo-400">Expo SQLite</h3>
          </div>
          <div>
            <p className="text-lg text-slate-300 font-medium mb-2">Casos de Uso:</p>
            <p className="text-md text-slate-400 mb-4 leading-relaxed">Aplicações offline-first, catálogos extensos, históricos de chat e dados que exigem buscas complexas e paginação.</p>
            <p className="text-lg text-slate-300 font-medium mb-2">Pontos Positivos:</p>
            <ul className="text-md text-slate-400 list-disc list-inside space-y-2">
              <li>Consultas estruturadas (SQL)</li>
              <li>Garantia ACID (Transações seguras)</li>
              <li>Performance síncrona/assíncrona via JSI</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabela Comparativa */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-400" />
          Tabela Comparativa
        </h3>
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
          <table className="w-full text-left text-md text-slate-300">
            <thead className="bg-slate-800/50 text-md uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-5 font-semibold">Feature</th>
                <th className="px-6 py-5 font-semibold text-cyan-400">MMKV</th>
                <th className="px-6 py-5 font-semibold text-indigo-400">Expo SQLite</th>
                <th className="px-6 py-5 font-semibold text-emerald-400">SecureStore</th>
                <th className="px-6 py-5 font-semibold text-amber-400">AsyncStorage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-5 font-medium text-white">Velocidade</td>
                <td className="px-6 py-5">⚡ Ultra rápido</td>
                <td className="px-6 py-5">🚀 Rápido (JSI)</td>
                <td className="px-6 py-5">🐢 Lento</td>
                <td className="px-6 py-5">🐢 Lento</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-5 font-medium text-white">API</td>
                <td className="px-6 py-5">Síncrona</td>
                <td className="px-6 py-5">Síncrona / Assíncrona</td>
                <td className="px-6 py-5">Assíncrona</td>
                <td className="px-6 py-5">Assíncrona</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-5 font-medium text-white">Criptografia</td>
                <td className="px-6 py-5">Opcional</td>
                <td className="px-6 py-5">Opcional (SQLCipher)</td>
                <td className="px-6 py-5 text-emerald-400 font-medium">Sim (nativa)</td>
                <td className="px-6 py-5">Não</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-5 font-medium text-white">Tamanho máx.</td>
                <td className="px-6 py-5">Sem limite prático</td>
                <td className="px-6 py-5">Ilimitado (Disco)</td>
                <td className="px-6 py-5 text-rose-400 font-medium">~4KB (Android)</td>
                <td className="px-6 py-5">Sem limite prático</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-5 font-medium text-white">Tipos de Dados</td>
                <td className="px-6 py-5">string, bool, number e ArrayBuffers</td>
                <td className="px-6 py-5">Relacional (Tabelas)</td>
                <td className="px-6 py-5">string apenas</td>
                <td className="px-6 py-5">string apenas</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors border-b-transparent">
                <td className="px-6 py-5 font-medium text-white rounded-bl-xl">Multi-instance</td>
                <td className="px-6 py-5">Sim</td>
                <td className="px-6 py-5">Sim (Múltiplos .db)</td>
                <td className="px-6 py-5">Não</td>
                <td className="px-6 py-5 rounded-br-xl">Não</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </SlideWrapper>
  );
}