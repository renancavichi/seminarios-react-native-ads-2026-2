import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, space, type } from "../theme/tokens";

export type Etapa = { rotulo: string; nota?: string; alerta?: boolean };

/**
 * Diagrama de fluxo usado nos slides 4 e 6.
 *
 * O par é o eixo da narrativa: o mesmo desenho aparece primeiro com o
 * caminho antigo em destaque e o novo apagado, depois invertido. Nada de
 * react-native-svg aqui — caixas e setas em View resolvem e não somam
 * dependência.
 */
export function DiagramaFluxo({
  titulo,
  etapas,
  legenda,
  apagado = false,
  destaque = false,
}: {
  titulo: string;
  etapas: Etapa[];
  legenda?: string;
  apagado?: boolean;
  destaque?: boolean;
}) {
  return (
    <View style={[styles.wrap, apagado && styles.wrapApagado]}>
      <Text style={[styles.titulo, destaque && styles.tituloDestaque]}>{titulo}</Text>

      <View style={styles.fluxo}>
        {etapas.map((e, i) => (
          <React.Fragment key={e.rotulo}>
            <View
              style={[
                styles.caixa,
                destaque && styles.caixaDestaque,
                e.alerta && styles.caixaAlerta,
              ]}
            >
              <Text
                style={[
                  styles.caixaTexto,
                  destaque && styles.caixaTextoDestaque,
                  e.alerta && styles.caixaTextoAlerta,
                ]}
              >
                {e.rotulo}
              </Text>
              {e.nota ? <Text style={styles.caixaNota}>{e.nota}</Text> : null}
            </View>

            {i < etapas.length - 1 && (
              <Text style={[styles.seta, destaque && styles.setaDestaque]}>→</Text>
            )}
          </React.Fragment>
        ))}
      </View>

      {legenda ? (
        <Text style={[styles.legenda, destaque && styles.legendaDestaque]}>{legenda}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.md },
  wrapApagado: { opacity: 0.28 },

  titulo: { ...type.label, color: colors.textFaint, letterSpacing: 0.6 },
  tituloDestaque: { color: colors.accent },

  fluxo: { flexDirection: "row", alignItems: "center", gap: space.sm, flexWrap: "wrap" },

  caixa: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    minWidth: 118,
  },
  caixaDestaque: { borderColor: colors.accentLine, backgroundColor: colors.accentSoft },
  caixaAlerta: { borderColor: colors.borderStrong, backgroundColor: colors.surfaceRaised },

  caixaTexto: { ...type.label, fontSize: 15, color: colors.text },
  caixaTextoDestaque: { color: colors.text },
  caixaTextoAlerta: { color: colors.text },
  caixaNota: { ...type.code, fontSize: 12, color: colors.textFaint, marginTop: space.xs },

  seta: { ...type.title, fontSize: 22, color: colors.textFaint },
  setaDestaque: { color: colors.accent },

  legenda: { ...type.body, fontSize: 14, color: colors.textFaint },
  legendaDestaque: { color: colors.textMuted },
});
