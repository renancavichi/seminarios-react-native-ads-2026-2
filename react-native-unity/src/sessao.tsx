// Estado do jogador (nickname, avatar e placares).
// Fica só na memória do app: sem servidor, de propósito, para a demo nunca depender de internet.
import React, { createContext, useContext, useState } from 'react';

import { avatares } from '@/config/avatares';

export type Resultado = { pontos: number; quando: string };

type Sessao = {
  nickname: string;
  avatarId: string;
  definirJogador: (nickname: string, avatarId: string) => void;
  ultimo: Resultado | null;
  recorde: number;
  registrarPartida: (pontos: number) => void;
};

const Ctx = createContext<Sessao | null>(null);

export function SessaoProvider({ children }: { children: React.ReactNode }) {
  const [nickname, setNickname] = useState('');
  const [avatarId, setAvatarId] = useState(avatares[0]?.id ?? '');
  const [ultimo, setUltimo] = useState<Resultado | null>(null);
  const [recorde, setRecorde] = useState(0);

  const definirJogador = (n: string, a: string) => {
    setNickname(n);
    setAvatarId(a);
  };

  const registrarPartida = (pontos: number) => {
    setUltimo({ pontos, quando: new Date().toLocaleTimeString().slice(0, 5) });
    setRecorde((r) => Math.max(r, pontos));
  };

  return (
    <Ctx.Provider value={{ nickname, avatarId, definirJogador, ultimo, recorde, registrarPartida }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSessao() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useSessao fora do SessaoProvider');
  return s;
}
