
# React Native Testing Library (RNTL)

A **React Native Testing Library (RNTL)** é uma biblioteca leve para testes de componentes em aplicações React Native, construída sobre o `react-test-renderer`. Seu foco é incentivar testes baseados no comportamento da interface do ponto de vista do usuário, evitando dependência de detalhes internos de implementação.

> *"Quanto mais os seus testes se assemelharem à forma como o seu software é utilizado, mais confiança eles podem lhe dar."* — Kent C. Dodds

---

## Pré-requisitos

- Node.js
- React Native
- Jest configurado no projeto (`jest-expo` em projetos Expo ou o preset padrão `react-native`)

---

## Instalação

Instale a biblioteca como dependência de desenvolvimento:

```bash
# npm
npm install --save-dev @testing-library/react-native

# yarn
yarn add --dev @testing-library/react-native
```

> **Nota:** A partir da versão `12.4`, os *matchers* específicos de React Native (como `toBeOnTheScreen`, `toHaveTextContent`, `toBeDisabled`, entre outros) já vêm integrados na própria biblioteca, dispensando a instalação separada do pacote `@testing-library/jest-native`.

---

## Exemplo Prático

### Componente (`LoginForm.tsx`)

```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

type Props = {
  onSubmit: (email: string) => void;
};

export function LoginForm({ onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handlePress() {
    if (!email.trim()) return;
    onSubmit(email);
    setSubmitted(true);
  }

  return (
    <View>
      <TextInput onChangeText="{setEmail}" placeholder="Digite seu e-mail" value="{email}"/>
      <Pressable accessibilityRole="button" onPress="{handlePress}">
        <Text>Entrar</Text>
      </Pressable>
      {submitted && <Text>Bem-vindo, {email}</Text>}
    </View>
  );
}
```

### Teste (`LoginForm.test.tsx`)

```tsx
import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('deve enviar o e-mail preenchido e exibir a mensagem de boas-vindas', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();

    render(<LoginForm onSubmit="{mockOnSubmit}"/>);

    const input = screen.getByPlaceholderText('Digite seu e-mail');
    const button = screen.getByRole('button', { name: 'Entrar' });

    await user.type(input, 'usuario@exemplo.com');
    await user.press(button);

    expect(mockOnSubmit).toHaveBeenCalledWith('usuario@exemplo.com');
    expect(screen.getByText('Bem-vindo, usuario@exemplo.com')).toBeOnTheScreen();
  });
});
```

---

## Principais Queries

As *queries* são usadas para localizar elementos renderizados na árvore de componentes.

| Tipo de Query | 0 correspondências | 1 correspondência | >1 correspondência | Assíncrona? |
| :--- | :--- | :--- | :--- | :--- |
| **`getBy*`** | Lança erro | Retorna elemento | Lança erro | Não |
| **`queryBy*`** | Retorna `null` | Retorna elemento | Lança erro | Não |
| **`findBy*`** | Rejeita Promise | Retorna elemento | Rejeita Promise | Sim |
| **`getAllBy*`** | Lança erro | Retorna array | Retorna array | Não |
| **`queryAllBy*`** | Retorna `[]` | Retorna array | Retorna array | Não |
| **`findAllBy*`** | Rejeita Promise | Retorna array | Retorna array | Sim |

### Ordem de prioridade recomendada

1. **`getByRole`** — Busca por papel de acessibilidade (`button`, `header`, `checkbox`, etc.).
2. **`getByLabelText`** — Busca pelo `accessibilityLabel`.
3. **`getByPlaceholderText`** — Útil para campos de texto (`TextInput`).
4. **`getByText`** — Busca pelo texto visível na tela.
5. **`getByDisplayValue`** — Busca pelo valor atual de um campo de entrada.
6. **`getByTestId`** — Último recurso, quando não há forma semântica ou visível de selecionar o elemento.

---

## Interações do Usuário

- **`userEvent` (recomendado):** Simula interações de forma mais próxima ao comportamento real do dispositivo (disparando a sequência completa de eventos, como foco, digitação e perda de foco). Todas as ações são assíncronas (`await user.press(...)`, `await user.type(...)`).
- **`fireEvent`:** Dispara eventos pontuais diretamente no elemento (`fireEvent.press(button)`, `fireEvent.changeText(input, 'texto')`). Útil para cenários simples ou eventos customizados.

---

## Matchers Integrados Úteis

- `toBeOnTheScreen()` — Verifica se o elemento está montado e presente na árvore.
- `toBeVisible()` — Verifica se o elemento está visível (não oculto por opacidade, `display: 'none'` ou modal fechado).
- `toHaveTextContent(text)` — Verifica o conteúdo textual do elemento.
- `toBeDisabled()` / `toBeEnabled()` — Verifica o estado de acessibilidade/interação.
- `toHaveStyle(style)` — Verifica estilos aplicados ao elemento.

---

## Testes Assíncronos

Para elementos que aparecem após requisições de API, temporizadores ou atualizações de estado assíncronas:

- **`findBy*`**: Combina `getBy*` com `waitFor`.
- **`waitFor`**: Executa asserções repetidamente até que passem ou atinjam o tempo limite (*timeout*).

```tsx
const message = await screen.findByText('Dados carregados');
expect(message).toBeOnTheScreen();
```

---

## Boas Práticas

- **Teste comportamento, não implementação:** Evite testar nomes de estados internos, estrutura interna de funções ou *snapshots* extensos.
- **Prefira `screen`:** Utilize os métodos a partir de `screen` (`screen.getByText`) em vez de desestruturar o retorno de `render()`.
- **Use `queryBy*` apenas para verificar ausência:** Para confirmar que um elemento não está na tela, utilize `expect(screen.queryByText('Erro')).not.toBeOnTheScreen()`.
- **Evite `testID` em excesso:** Priorize *queries* baseadas em texto e acessibilidade, o que também melhora a acessibilidade real da aplicação.

---

## Documentação Oficial

- [React Native Testing Library Docs](https://callstack.github.io/react-native-testing-library/)
