# Maestro — testes E2E mobile em YAML

Apresentação de seminário sobre o [Maestro](https://maestro.dev/), feita para a
disciplina de Desenvolvimento Mobile do curso de Análise e Desenvolvimento de
Sistemas (IFSP).

São 20 slides interativos sobre testes end-to-end de aplicativos mobile
escritos em YAML: o problema que a ferramenta resolve, como ela funciona, o elo
com o React Native via `testID`, o catálogo de comandos e as limitações.

---

## Ver a apresentação

```bash
npm install
npm start
```

O navegador abre em `http://localhost:8731`. É preciso servir por HTTP — os
slides são carregados por `fetch`, e abrir o `index.html` direto do disco é
bloqueado pelo navegador.

Sem Node instalado, qualquer servidor estático resolve:

```bash
python -m http.server 8731 --directory apps/deck
```

### Atalhos durante a apresentação

| Tecla | Ação |
|---|---|
| `→` `Espaço` `PageDown` | Próximo slide |
| `←` `PageUp` | Slide anterior |
| `Home` / `End` | Primeiro / último slide |
| `N` | Abre o roteiro de fala |
| `O` ou `Esc` | Panorama com todos os slides |
| `F` | Tela cheia |

O endereço reflete o slide atual (`#/7`), então dá para recarregar a página sem
perder o lugar ou mandar um link que abre direto num slide específico.

---

## Desenvolvimento

```bash
npm test
```

O teste sobe um servidor próprio e controla um Chromium de verdade: abre a
apresentação, navega pelos slides, abre o panorama, clica nas
interações e falha se aparecer qualquer erro de console. É o que evita
descobrir na frente da turma que um botão parou de funcionar.

Os mesmos testes rodam a cada push, via
[GitHub Actions](.github/workflows/ci.yml), que também publica o deck no
GitHub Pages.

### Como o deck está organizado

```
apps/deck/
├── index.html              # só o esqueleto; os slides entram por fetch
├── slides/                 # um arquivo .html por slide
└── src/
    ├── main.js             # liga os módulos entre si
    ├── core/               # mecânica: navegação, carregamento, teclado
    ├── components/         # interface: moldura, panorama, interações
    ├── data/               # conteúdo sequencial (as execuções do terminal)
    └── styles/             # CSS em camadas, dos tokens aos estados
```

Para **editar um slide**, mexa só no arquivo dele em `slides/`. Para
**reordenar, adicionar ou remover**, edite a lista em
[`src/core/slide-registry.js`](apps/deck/src/core/slide-registry.js) — nenhum
outro arquivo precisa mudar.

As interações são declaradas no HTML, sem JavaScript por slide. Um grupo de
"escolha uma opção, mostra o painel" se escreve assim:

```html
<button data-group="pain" data-value="flake">Flakiness</button>
<pre data-panel="pain" data-value="flake">…</pre>
```

Os contratos completos estão em [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md).

---

## Créditos e licença

Conteúdo do seminário baseado na [documentação oficial do Maestro](https://docs.maestro.dev/).
Código sob licença [MIT](LICENSE).
