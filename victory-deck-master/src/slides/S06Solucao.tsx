import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SlideLayout } from "../components/SlideLayout";
import { DiagramaFluxo } from "../components/DiagramaFluxo";
import { Destaque, Nota } from "../components/Nota";
import { colors, space } from "../theme/tokens";

const CAMINHO_ANTIGO = [
  { rotulo: "Dados" },
  { rotulo: "Cálculo" },
  { rotulo: "Ponte", alerta: true },
  { rotulo: "Views SVG", alerta: true },
  { rotulo: "Tela" },
];

const CAMINHO_NOVO = [
  { rotulo: "Dados", nota: "thread JS" },
  { rotulo: "Escalas", nota: "D3" },
  { rotulo: "Skia", nota: "um canvas" },
  { rotulo: "GPU", nota: "desenho direto" },
  { rotulo: "Tela" },
];

export function S06Solucao() {
  return (
    <SlideLayout
      title="Victory Native"
      lead="Biblioteca de visualização de dados para React Native, mantida pela Nearform. A resposta não foi otimizar o caminho antigo — foi trocar o alvo de renderização."
      visual={
        <View style={styles.diagramas}>
          <DiagramaFluxo titulo="Antes · SVG na CPU" etapas={CAMINHO_ANTIGO} apagado />

          <View style={styles.divisor} />

          <DiagramaFluxo
            titulo="Victory Native · Skia na GPU"
            etapas={CAMINHO_NOVO}
            legenda="Gestos e animação rodam na thread de UI, sem passar pelo JavaScript."
            destaque
          />
        </View>
      }
    >
      <Destaque>
        Não é o mesmo gráfico mais rápido. É outro caminho até a tela.
      </Destaque>

      <Nota titulo="Um canvas, não 400 views">
        O gráfico inteiro é desenhado num único elemento nativo. Não existe uma
        view por ponto, então não existe ponte a cada atualização.
      </Nota>

      <Nota titulo="Reescrita, não atualização">
        A versão anterior era o Victory da web adaptado ao mobile via
        react-native-svg. A biblioteca atual foi reconstruída do zero para React
        Native.
      </Nota>

      <Nota titulo="Ativa">
        Versão 42, com releases frequentes e suporte acompanhando as versões
        recentes do React Native.
      </Nota>
    </SlideLayout>
  );
}

const styles = StyleSheet.create({
  diagramas: { flex: 1, padding: space.lg, justifyContent: "center", gap: space.lg },
  divisor: { height: 1, backgroundColor: colors.border },
});
