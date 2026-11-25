import { test } from 'node:test';
import { deepStrictEqual, rejects } from 'node:assert/strict';
import { executeTask } from '../src/background/task-execution.ts';

test('envia a mensagem salva sem consultar a rede', async () => {
  const sent: string[] = [];
  const savedSettings = { message: 'Olá', minimumInterval: 15, requireInternet: true };
  await executeTask(savedSettings, {
    notify: async (message) => { sent.push(message); },
  });
  deepStrictEqual(sent, ['Olá']);
});

test('propaga erros da notificação', async () => {
  await rejects(executeTask({ message: 'Olá', minimumInterval: 15 }, {
    notify: async () => { throw new Error('permissão negada'); },
  }), /permissão negada/);
});
