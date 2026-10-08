import { SlideWrapper, SlideTitle, CodeBlock, FeatureCard } from '../components/shared';

export function StoragesAndZustandSlide() {
  return (
    <SlideWrapper>
      <SlideTitle
        badge="State Management + Persistência"
        title="Storages & Zustand"
        subtitle="Como combinar soluções de storage com Zustand para gerenciamento de estado persistente de forma elegante e performática."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Por que Zustand?
          </h3>
          <div className="space-y-3">
            <FeatureCard
              icon={<span className="text-xl">🪶</span>}
              title="Leve (~1KB)"
              description="Muito menor que Redux, sem boilerplate. API simples e direta."
              color="amber"
            />
            <FeatureCard
              icon={<span className="text-xl">🔌</span>}
              title="Middleware de Persistência"
              description="Plugin oficial createJSONStorage para integrar com qualquer storage"
              color="indigo"
            />
            <FeatureCard
              icon={<span className="text-xl">🎯</span>}
              title="Seletivo"
              description="Re-renderiza apenas componentes que usam a parte específica do state"
              color="cyan"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Arquitetura
          </h3>
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <span className="text-sm text-indigo-300 font-medium">Zustand Store</span>
                <span className="text-xs text-slate-400">State + Actions</span>
              </div>
              <div className="flex justify-center">
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-sm text-cyan-300 font-medium">persist middleware</span>
                <span className="text-xs text-slate-400">Serialização</span>
              </div>
              <div className="flex justify-center">
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-xs text-emerald-300">MMKV</span>
                </div>
                <div className="text-center p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <span className="text-xs text-rose-300">SecureStore</span>
                </div>
                <div className="text-center p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <span className="text-xs text-amber-300">AsyncStorage</span>
                </div>
                <div className="text-center p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <span className="text-xs text-amber-300">SQLite</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        Exemplo com MMKV
      </h3>
      <CodeBlock
        title="useStore.ts"
        code={`import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';


type CartItem = {
    name: string;
    price: number;
    quantity: number;
};

interface CartState {
    items: Record<string, CartItem>;
    addItem: (item: CartItem) => void;
    updateItemQuantity: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
}

const id = 'use-cart-storage';

const storage = createMMKV({ id });

const zustandStorage: StateStorage = {
    setItem: (name, value) => {
        return storage.set(name, value)
    },
    getItem: (name) => {
        const value = storage.getString(name)
        return value ?? null
    },
    removeItem: (name) => {
        return storage.remove(name)
    },
}

export const useCart = create<CartState>()
    (
        persist(
            (set) => ({
                items: {},
                addItem: (item) => {
                    set((state) => ({
                        items: {
                            ...state.items,
                            [item.name]: item,
                        },
                    }));
                }
                ,
                updateItemQuantity: (id, quantity) => {
                    set((state) => ({
                        items: {
                            ...state.items,
                            [id]: {
                                ...state.items[id],
                                quantity,
                            },
                        },
                    }));
                },
                removeItem: (id) => {
                    set((state) => {
                        const newItems = { ...state.items };
                        delete newItems[id];
                        return { items: newItems };
                    }
                    );
                },
                clearCart: () => {
                    set({ items: {} });
                },
            }),
            {
                name: id,
                storage: createJSONStorage(() => zustandStorage),
            }
        )
    );
`}
      />

      <h3 className="text-lg font-semibold text-white mb-4 mt-8 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Exemplo com AsyncStorage (Assíncrono)
      </h3>
      <CodeBlock
        title="useAsyncStore.ts"
        code={`import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

// AsyncStorage já possui a assinatura exata do StateStorage nativamente.
// Não é necessário criar um adapter customizado!
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
      // Passa a referência do AsyncStorage diretamente
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);`}
      />
      <h3 className="text-lg font-semibold text-white mb-4 mt-8 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-rose-400" />
        Exemplo com Expo SecureStore (Assíncrono Seguro)
      </h3>
      <CodeBlock
        title="useSecureAuth.ts"
        code={`import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

// Criando o Adapter para mapear os métodos do SecureStore
const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: 'auth-vault', // Nome da chave no SecureStore
      storage: createJSONStorage(() => secureStorage),
    }
  )
);`}
      />

      <h3 className="text-lg font-semibold text-white mb-4 mt-8 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400" />
        Exemplo com Expo SQLite (Síncrono JSI / Relacional)
      </h3>
      <CodeBlock
        title="useSqliteStore.ts"
        code={`import { openDatabaseSync } from 'expo-sqlite';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

// 1. Abre o banco usando a nova API Síncrona (JSI)
const db = openDatabaseSync('zustand_cache.db');

// 2. Garante que a tabela de chave-valor existe
db.execSync(\`
  CREATE TABLE IF NOT EXISTS store (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
\`);

// 3. Adapter executando as queries SQL
const sqliteStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const result = db.getFirstSync<{value: string}>(
      'SELECT value FROM store WHERE key = ?',
      [name]
    );
    return result ? result.value : null;
  },
  setItem: (name: string, value: string): void => {
    // INSERT OR REPLACE garante o update se a chave já existir
    db.runSync('INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)', [name, value]);
  },
  removeItem: (name: string): void => {
    db.runSync('DELETE FROM store WHERE key = ?', [name]);
  },
};

interface SettingsState {
  notifications: boolean;
  toggleNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: true,
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => sqliteStorage),
    }
  )
);`}
      />

      <div className="space-y-4 my-8">
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5 space-y-4">
          <p className="text-xl text-slate-300">
            Uma dúvida comum arquitetural: se o <code className="text-emerald-300 bg-emerald-500/10 px-1 py-0.5 rounded">AsyncStorage</code> ou <code className="text-rose-300 bg-rose-500/10 px-1 py-0.5 rounded">SecureStore</code> gravam no disco de forma assíncrona, por que as funções do Zustand (como <code className="text-cyan-300 bg-cyan-500/10 px-1 py-0.5 rounded">setTheme</code>) não retornam uma <code className="text-slate-400">Promise</code>?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-cyan-500/20 bg-cyan-500/5 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚡</span>
                <p className="font-semibold text-cyan-300 text-md">1. Estado em RAM (Síncrono)</p>
              </div>
              <p className="text-md text-slate-400 leading-relaxed">
                O Zustand opera primariamente na memória RAM. Quando você chama uma action, a alteração de estado na memória e a re-renderização da UI ocorrem instantaneamente.
              </p>
            </div>

            <div className="border border-indigo-500/20 bg-indigo-500/5 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">👻</span>
                <p className="font-semibold text-indigo-300 text-md">2. Gravação Background (Assíncrona)</p>
              </div>
              <p className="text-md text-slate-400 leading-relaxed">
                O middleware <code className="text-indigo-200">persist</code> "escuta" a mudança na RAM e dispara a gravação no disco em background, lidando com o I/O silenciosamente sem bloquear o usuário.
              </p>
            </div>
          </div>

          <div className="mt-2 border-l-4 border-amber-500/50 bg-amber-500/10 p-3 rounded-r-lg">
            <p className="text-md text-amber-200">
              <span className="font-bold">Atenção à Hidratação:</span> O único momento de bloqueio lógico é ao abrir o app. O Zustand inicia com o valor default da memória, busca no disco, e então re-hidrata o estado, podendo causar um <em>flicker</em> visual na tela se não houver um loading inicial.
            </p>
          </div>
        </div>
      </div>

    </SlideWrapper>
  );
}
