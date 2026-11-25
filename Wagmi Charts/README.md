# 📊 Um gráfico conta uma história — React Native Wagmi Charts

> Material complementar da aula ministrada por **Vitor de Oliveira**. Este documento reúne, em formato de texto completo e estruturado, todo o conteúdo conceitual, técnico e comparativo apresentado nos slides sobre visualização de dados e o uso da biblioteca **React Native Wagmi Charts**.

---

## 1. Por que gráficos existem?

Nós já lemos gráficos todos os dias, muitas vezes sem perceber — seja ao checar a bateria do celular, a previsão do tempo, o extrato no aplicativo do banco, a contagem de passos no relógio, a cotação do dólar ou o tempo de tela da semana. Por isso, ninguém começa a aprender sobre visualização de dados do zero.

### Números brutos vs. Visualização
Imagine analisar uma tabela com o preço mensal de um cafezinho ao longo de um ano (de R$ 4,50 em janeiro até R$ 6,30 em dezembro):
* **Lendo apenas os números:** É preciso fazer esforço mental para descobrir se o café ficou mais caro e em qual mês subiu mais rápido.
* **Olhando o gráfico:** Os números são exatamente os mesmos, mas a informação visual revela instantaneamente a tendência de alta (+40% no ano) e os momentos exatos de aceleração.

**Conclusão:** O objetivo de um gráfico não é enfeitar a tela, mas permitir que a pessoa entenda a história por trás dos números com rapidez.

---

## 2. Como escolher o gráfico certo

Escolher o gráfico adequado significa, antes de tudo, identificar **qual é a dúvida de quem vai olhar para a tela**. Cada formato responde a uma pergunta específica:

| Tipo de Gráfico | Pergunta que responde | Exemplos de uso |
| :--- | :--- | :--- |
| **Linha** | *Como mudou com o tempo?* | O preço do café ao longo do ano, a evolução do peso na balança. |
| **Barras** | *Quem é maior?* | Comparar em qual loja houve mais vendas. |
| **Pizza** | *Quanto cada parte representa do todo?* | Entender para onde foi dividido o salário do mês. |
| **Velas (Candlestick)** | *Como foi cada período, por dentro?* | Visualizar onde o preço (ou valor) começou, terminou, o ponto mais alto e o mais baixo de um dia. |

### Como ler um gráfico de velas (Candlestick)
Uma única vela resume um dia inteiro de variações em **quatro números fundamentais** (usando a temperatura de um dia como exemplo):
1. **Abertura (Começou):** Às 6h fazia **18°**.
2. **Mínima (Mais baixo):** Às 9h choveu e caiu para **15°** *(formando o pavio inferior)*.
3. **Máxima (Mais alto):** Às 14h chegou a **27°** *(formando o pavio superior)*.
4. **Fechamento (Terminou):** Às 22h estava **24°**.

A diferença entre a abertura (18°) e o fechamento (24°) forma o **corpo** da vela:
* **Vela Verde:** Quando terminou **mais alto** do que começou.
* **Vela Vermelha:** Quando terminou **mais baixo** do que começou.

---

## 3. O desafio dos gráficos no celular

Em aplicativos mobile, gráficos não são imagens estáticas: o usuário espera **encostar o dedo e arrastar** sobre a linha para ver o preço e o horário exatos de cada ponto, sem precisar adivinhar valores.

Construir esse comportamento do zero dá muito trabalho porque exige resolver quatro problemas técnicos simultaneamente:
1. **Desenhar a linha:** Converter uma lista de números em coordenadas proporcionais para qualquer tamanho de tela.
2. **Seguir o dedo sem travar:** Telas atualizam cerca de 60 vezes por segundo; qualquer cálculo lento faz o gráfico engasgar.
3. **Mostrar o valor exato:** Identificar qual ponto da série está sob o dedo do usuário e atualizar o texto de preço e horário em tempo real.
4. **Mudar sem piscar:** Garantir transições suaves quando o usuário alterna filtros de período (ex: de *"Hoje"* para *"Último mês"*).

---

## 4. A Ferramenta: React Native Wagmi Charts

O **React Native Wagmi Charts** é uma biblioteca de código aberto que entrega gráficos de **linha** e de **velas** prontos para interação por toque em aplicativos React Native.

* **Origem do nome:** *WAGMI* é a sigla para *"We're All Gonna Make It"* ("todos nós vamos conseguir"), uma gíria otimista popular na internet.
* **Quem criou:** Foi desenvolvida pela **CoinJar**, uma empresa australiana de criptomoedas, originalmente para seu próprio aplicativo e depois disponibilizada gratuitamente para a comunidade.
* **Como funciona por dentro:** Ela orquestra três bibliotecas consolidadas do ecossistema React Native:
  * `react-native-svg` para desenhar os elementos gráficos na tela;
  * `react-native-gesture-handler` para capturar o toque e o movimento do dedo;
  * `react-native-reanimated` para executar as animações com fluidez nativa.

### Arquitetura em "Peças de Montar" (Composição)
A biblioteca utiliza uma abordagem declarativa e modular (semelhante a blocos de montar), onde cada componente tem uma responsabilidade clara e pode ser adicionado ou removido conforme a necessidade:

```tsx
<LineChart.Provider data="{precos}">
  <LineChart>
    <LineChart.Path/>
    <LineChart.CursorCrosshair>
      <LineChart.Tooltip/>
    </LineChart.CursorCrosshair>
  </LineChart>
  <LineChart.PriceText/>
  <LineChart.DatetimeText/>
</LineChart.Provider>
```

* **`LineChart.Provider`:** Guarda a lista de dados e distribui as informações de estado e posição para os componentes filhos.
* **`LineChart`:** A moldura principal que delimita o espaço ocupado pelo gráfico na tela.
* **`LineChart.Path`:** O desenho da linha propriamente dita.
* **`LineChart.CursorCrosshair` e `LineChart.Tooltip`:** A linha guia que acompanha o dedo do usuário e a etiqueta flutuante com o valor.
* **`LineChart.PriceText` e `LineChart.DatetimeText`:** Os textos dinâmicos que atualizam o preço e a data/hora conforme o usuário arrasta o dedo.

*(O mesmo padrão de composição se aplica para gráficos de velas utilizando `CandlestickChart`)*.

### Principais Recursos
* **Gráficos de linha e velas:** Os dois formatos mais utilizados para acompanhamento de preços e ativos.
* **Cursor interativo:** Linha que segue o dedo e pode permanecer fixa ao soltar a tela.
* **Leitura dinâmica:** Exibição automática do preço e horário exatos do ponto selecionado, além de tooltip próximo ao dedo.
* **Feedback háptico (Vibração):** O aparelho emite um leve toque tátil quando o usuário interage com o gráfico.
* **Acabamento visual:** Suporte a preenchimento gradiente abaixo da linha, marcadores de pontos e linhas de referência.
* **Transições suaves:** Interpolação animada ao trocar conjuntos de dados (ex: filtros de período).
* **Multiplataforma e gratuito:** Funciona em iOS, Android e Web com o mesmo código, sob licença aberta.

### Limitações e Pontos de Atenção
* **Apenas dois tipos de gráfico:** Faz somente linha e velas; para gráficos de pizza ou barras, é necessário usar outra ferramenta.
* **Dependências nativas:** Exige a instalação e compatibilidade das três bibliotecas base (`svg`, `gesture-handler` e `reanimated`), o que pode gerar conflitos em atualizações de versão.
* **Foco em séries financeiras:** Projetada especificamente para preços, cotações e moedas, sendo menos flexível para outros domínios.
* **Volume de dados:** Com milhares de pontos atualizando em tempo real, o desempenho pode cair em aparelhos mais simples.
* **Comunidade menor:** Possui uma base de usuários menor em comparação a bibliotecas mais generalistas, resultando em menos exemplos prontos na internet.

---

## 5. Comparativo entre Bibliotecas React Native

Não existe uma biblioteca "melhor" em todos os cenários, mas sim a mais adequada para o problema que o aplicativo precisa resolver:

| Critério | Wagmi Charts | Victory Native | Gifted Charts | Chart Kit |
| :--- | :--- | :--- | :--- | :--- |
| **Tipos de gráfico** | Linha e velas | Linha, barra, área, pizza | Barra, linha, área, pizza, rosca | Linha, barra, pizza |
| **Interação ao toque** | Já vem pronta | Possível, mas exige montagem manual | Simples | Quase inexistente |
| **Melhor cenário** | Mostrar evolução de preços com toque | Grande volume de dados e visual sob medida | Apps que precisam de vários tipos de gráfico | Gráficos simples e estáticos |
| **Ponto de atenção** | Restrito a linha e velas | Curva de aprendizado maior | Menos especializada em finanças/preços | Poucas atualizações recentes |

### Exemplos Práticos de Escolha
1. **Rendimento anual de um investimento com inspeção diária ao toque:** → **Wagmi Charts** (oferece linha interativa com preço e data prontos).
2. **Divisão de gastos mensais (mercado, transporte, lazer):** → **Gifted Charts** (exige gráfico de pizza/proporção, que o Wagmi não possui).
3. **Variação hora a hora (abertura, fechamento, máxima e mínima) de uma criptomoeda:** → **Wagmi Charts** (cenário clássico de gráfico de velas).
4. **Painel complexo com milhares de dados em tempo real e design totalmente customizado:** → **Victory Native** (alta capacidade de processamento e personalização visual).

---

## 6. Resumo Final

1. **Gráficos existem para acelerar o entendimento** dos números.
2. **Primeiro define-se a pergunta** do usuário; só depois escolhe-se o desenho.
3. **O Wagmi Charts é ideal para mostrar como um preço mudou** ao longo do tempo com interação fluida; para gráficos de pizza, barras ou dashboards genéricos, opte por outras bibliotecas.

---

### Referência Oficial
* Repositório original: [github.com/coinjar/react-native-wagmi-charts](https://github.com/coinjar/react-native-wagmi-charts)
