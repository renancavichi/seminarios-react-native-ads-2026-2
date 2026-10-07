import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SlideLayout } from "../components/SlideLayout";
import { DiagramaFluxo } from "../components/DiagramaFluxo";
import { NumberControl } from "../components/Controls";
import { Nota } from "../components/Nota";
import { colors, space, type } from "../theme/tokens";

const CAMINHO_ANTIGO = [
  { rotulo: "Dados", nota: "thread JS" },
  { rotulo: "Cálculo", nota: "thread JS" },
  { rotulo: "Ponte", nota: "serialização", alerta: true },
  { rotulo: "~400 views SVG", nota: "thread nativa", alerta: true },
  { rotulo: "Tela" },
];

const CAMINHO_NOVO = [
  { rotulo: "Dados" },
  { rotulo: "Escalas" },
  { rotulo: "?" },
  { rotulo: "?" },
  { rotulo: "Tela" },
];

const CAUSAS = [
  {
    titulo: "Uma view por elemento",
    texto:
      "Cada ponto, cada segmento de linha e cada rótulo é uma view nativa. Um gráfico de 200 pontos com eixos passa fácil de 400 nós.",
  },
  {
    titulo: "A ponte no meio do caminho",
    texto:
      "Toda atualização precisa ser serializada, atravessar a ponte e ser aplicada do outro lado.",
  },
  {
    titulo: "Re-render a cada quadro",
    texto:
      "Animação e gesto passam pelo estado do React. Sessenta quadros por segundo significam sessenta ciclos de reconciliação.",
  },
];

export function S04PorQueDificil() {
  const [nos, setNos] = useState(200);

  return (
    <SlideLayout
      title="Por que é difícil em React Native"
      lead="O problema nunca foi falta de biblioteca. É o caminho que os dados percorrem até chegar na tela."
      controls={
        <>
          <NumberControl
            label="pontos no gráfico"
            value={nos}
            onChange={setNos}
            min={50}
            max={2000}
            step={150}
          />
          <View style={styles.contaBox}>
            <Text style={styles.contaLabel}>views nativas estimadas</Text>
            <Text style={styles.contaValor}>{(nos * 2 + 40).toLocaleString("pt-BR")}</Text>
          </View>
        </>
      }
      visual={
        <View style={styles.diagramas}>
          <DiagramaFluxo
            titulo="O caminho tradicional · SVG"
            etapas={CAMINHO_ANTIGO}
            legenda="Gestos e animação atravessam a ponte a cada quadro."
          />

          <View style={styles.divisor} />

          <DiagramaFluxo
            titulo="O caminho que veremos a seguir"
            etapas={CAMINHO_NOVO}
            legenda="Duas etapas mudam. E isso muda tudo."
            apagado
          />
        </View>
      }
    >
      {CAUSAS.map((c) => (
        <Nota key={c.titulo} titulo={c.titulo}>
          {c.texto}
        </Nota>
      ))}
    </SlideLayout>
  );
}

const styles = StyleSheet.create({
  diagramas: { flex: 1, padding: space.lg, justifyContent: "center", gap: space.lg },
  divisor: { height: 1, backgroundColor: colors.border },

  contaBox: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: space.md,
    gap: space.xs,
  },
  contaLabel: { ...type.label, fontSize: 12, color: colors.textFaint },
  contaValor: { fontFamily: "JetBrainsMono-Regular", fontSize: 30, color: colors.accent },
});
