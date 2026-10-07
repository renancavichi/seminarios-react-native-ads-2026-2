import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { colors, radius, space, type } from "../theme/tokens";

/**
 * Controles usados nos slides para alterar props do gráfico ao vivo.
 *
 * Decisão deliberada: passo discreto com botões, não slider de arrastar.
 * A apresentação é feita com mouse num telão projetado — acertar o punho
 * de um slider é frágil, e o valor precisa ficar legível para a plateia.
 */

export function NumberControl({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <View style={styles.block}>
      <View style={styles.head}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value}
          {suffix}
        </Text>
      </View>
      <View style={styles.stepRow}>
        <Stepper glyph="−" onPress={() => onChange(clamp(value - step))} disabled={value <= min} />
        <View style={styles.track}>
          <View style={[styles.trackFill, { width: `${pct}%` }]} />
        </View>
        <Stepper glyph="+" onPress={() => onChange(clamp(value + step))} disabled={value >= max} />
      </View>
    </View>
  );
}

function Stepper({
  glyph,
  onPress,
  disabled,
}: {
  glyph: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.stepper,
        disabled && styles.stepperOff,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.stepperGlyph}>{glyph}</Text>
    </Pressable>
  );
}

export function ToggleControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={[styles.block, styles.toggleRow]}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.accentLine }}
        thumbColor={value ? colors.accent : colors.textFaint}
      />
    </View>
  );
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.segments}>
        {options.map((opt) => {
          const active = opt === value;
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              style={({ pressed }) => [
                styles.segment,
                active && styles.segmentActive,
                pressed && !active && styles.pressed,
              ]}
            >
              <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function ActionButton({
  label,
  onPress,
  tone = "neutral",
}: {
  label: string;
  onPress: () => void;
  tone?: "neutral" | "accent";
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        tone === "accent" && styles.actionAccent,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.actionText, tone === "accent" && styles.actionTextAccent]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: space.md, gap: space.sm },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  label: { ...type.label, color: colors.textMuted },
  value: { ...type.code, color: colors.accent },

  stepRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
  stepper: {
    width: 34,
    height: 30,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperOff: { opacity: 0.3 },
  pressed: { backgroundColor: colors.surfaceRaised },
  stepperGlyph: { ...type.label, color: colors.text, fontSize: 18 },
  track: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.border, overflow: "hidden" },
  trackFill: { height: 3, backgroundColor: colors.accent },

  toggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  segments: { flexDirection: "row", gap: space.xs },
  segment: {
    flex: 1,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  segmentActive: { backgroundColor: colors.accentSoft, borderColor: colors.accentLine },
  segmentText: { ...type.code, fontSize: 13, color: colors.textMuted },
  segmentTextActive: { color: colors.accent },

  action: {
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    marginBottom: space.sm,
  },
  actionAccent: { backgroundColor: colors.accentSoft, borderColor: colors.accentLine },
  actionText: { ...type.label, color: colors.textMuted },
  actionTextAccent: { color: colors.accent },
});
