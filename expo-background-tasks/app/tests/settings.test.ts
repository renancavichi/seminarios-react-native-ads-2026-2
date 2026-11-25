import { test } from 'node:test';
import { deepStrictEqual, throws } from 'node:assert/strict';
import { DEFAULT_SETTINGS, normalizeSettings } from '../src/background/settings-validation.ts';

test('usa mensagem padrão e remove espaços da mensagem', () => {
  deepStrictEqual(normalizeSettings({ message: '  ', minimumInterval: 15 }), {
    ...DEFAULT_SETTINGS, minimumInterval: 15,
  });
  deepStrictEqual(normalizeSettings({ message: ' Olá ', minimumInterval: 30 }), {
    message: 'Olá', minimumInterval: 30,
  });
});

test('rejeita intervalo menor que 15, fracionário ou inválido', () => {
  for (const minimumInterval of [0, 14, 15.5, NaN, Infinity]) {
    throws(() => normalizeSettings({ message: '', minimumInterval }));
  }
});
