# Arquitetura do deck

Como a apresentação está organizada e como mexer nela sem quebrar nada.

## O princípio

Um slide é um arquivo HTML. Uma interação é um atributo `data-*`. Nenhum slide
tem JavaScript próprio.

Isso vem de um problema concreto: a versão anterior era um único HTML de 1.674
linhas, com o JavaScript referenciando IDs específicos de slides (`#painFile`,
`#anaCode`). Mover um slide de lugar podia quebrar um comportamento três telas
adiante. Hoje os módulos leem atributos declarados no HTML e não sabem quais
slides existem.

## Estrutura

```
apps/deck/
├── index.html              # esqueleto: moldura, painéis, <script type="module">
├── slides/                 # 01-capa.html … 20-conclusao.html
└── src/
    ├── main.js             # carrega os slides e liga os módulos
    ├── core/
    │   ├── slide-registry.js   # a ordem da apresentação
    │   ├── slide-loader.js     # fetch + injeção no palco
    │   ├── presentation.js     # slide atual + observadores
    │   ├── stage-scaler.js     # encaixa 1280x720 em qualquer tela
    │   ├── keyboard.js         # teclas → ações
    │   └── deep-link.js        # sincroniza com o #/N da URL
    ├── components/
    │   ├── chrome.js           # marcadores, progresso, rodapé
    │   ├── overview.js         # panorama (O)
    │   ├── selectable-group.js # "escolha uma opção, mostra o painel"
    │   ├── tabs.js             # abas dentro de um slide
    │   ├── phone-demo.js       # celular interativo do slide 11
    │   ├── pipeline.js         # animação do slide 7
    │   ├── terminal.js         # execução simulada do slide 17
    │   └── jump-links.js       # botões que pulam de slide
    ├── data/
    │   └── terminal-runs.js    # as transcrições do terminal
    └── styles/                 # 01-tokens.css … 12-states.css
```

`core/` é a mecânica da apresentação; `components/` é o que aparece na tela.
A regra prática: se funcionaria igual noutro deck com outro conteúdo, é `core/`.

## Tarefas comuns

### Editar o texto de um slide

Abra o arquivo em `slides/`. Só isso.

### Reordenar, adicionar ou remover slides

Edite a lista em [`src/core/slide-registry.js`](../apps/deck/src/core/slide-registry.js).
Ela é a fonte da verdade: a ordem do array é a ordem da apresentação, e o
`title` alimenta o rodapé, os marcadores e o panorama.

Para um slide novo, crie o arquivo em `slides/` com esta forma:

```html
<section class="slide" data-title="Meu slide">
  <div class="kicker">Ato 03 · seção</div>
  <h2>Título</h2>
  <p>Conteúdo.</p>
</section>
```

Cuidado com os botões de salto do slide 2 (`data-go="2"`): o valor é o índice
0-based no registro, então reordenar slides pede conferir esses números.

### Adicionar uma interação

Os três padrões disponíveis, todos declarados no HTML:

**Escolher uma opção e trocar o painel**

```html
<button class="card pick" data-group="sel" data-value="id"
        data-label="titulo-opcional.yaml">Por ID</button>

<pre data-panel="sel" data-value="id">…</pre>
<pre data-panel="sel" data-value="texto" hidden>…</pre>

<span data-label-for="sel"></span>  <!-- recebe o data-label do escolhido -->
```

Acrescentar `class="on"` a um botão define a opção inicial; sem isso, vale o
primeiro. Para acender linhas de código junto com a escolha, marque-as com
`data-highlight="sel" data-value="id"`.

**Abas**

```html
<div class="tabs" data-tabs="inst">
  <button class="tab on" data-tab="mac">macOS</button>
  <button class="tab" data-tab="win">Windows</button>
</div>

<div class="pane on" data-tabs="inst" data-tab="mac">…</div>
<div class="pane" data-tabs="inst" data-tab="win">…</div>
```

**Pular para outro slide**

```html
<button class="card pick jump" data-go="7">Ir ao ato 03</button>
```

### Mudar as cores ou as fontes

Tudo está em [`src/styles/01-tokens.css`](../apps/deck/src/styles/01-tokens.css).
As folhas são numeradas porque a ordem é a cascata: tokens primeiro, estados
por último.

## Decisões e seus porquês

**Por que sem build.** A apresentação precisa abrir daqui a dois anos, num
computador qualquer, sem `npm install` e sem uma versão de Node específica. Um
bundler resolveria problemas que este projeto não tem, ao custo de uma
dependência que envelhece.

**Por que fetch e não um HTML só.** Um arquivo por slide é o que permite editar
um slide sem rolar por 1.600 linhas, e é o que faz o `git diff` de uma mudança
mostrar só o slide alterado. O custo é precisar de um servidor HTTP local, que
o `npm start` resolve.

**Por que o registro separado dos arquivos.** A ordem da apresentação é uma
decisão de conteúdo e merece um lugar só dela. Sem o registro, a ordem viria do
nome dos arquivos, e reordenar significaria renomear tudo.

**Por que testes numa apresentação.** Porque a alternativa é descobrir que um
botão parou de funcionar na frente de uma turma. O `npm test` abre a
apresentação num navegador de verdade e clica nas coisas; seria incoerente
defender testes E2E por vinte slides e não testar o próprio deck.
