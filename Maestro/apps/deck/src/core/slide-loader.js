/**
 * Carrega os arquivos de slide e injeta no palco.
 *
 * Cada slide vive em seu próprio arquivo .html contendo um único <section
 * class="slide">. O carregamento é feito via fetch em paralelo, preservando a
 * ordem declarada no registro.
 *
 * Por usar fetch, a apresentação precisa ser servida por HTTP — abrir o
 * index.html direto do disco (file://) é bloqueado pela política de origem do
 * navegador. O README documenta o `npm start` / `python -m http.server`.
 */

/** Falha de carregamento com contexto suficiente para o diagnóstico na tela. */
export class SlideLoadError extends Error {
  constructor(file, cause) {
    super(`Não foi possível carregar o slide "${file}": ${cause}`);
    this.name = 'SlideLoadError';
    this.file = file;
  }
}

/**
 * Busca um slide e devolve o elemento <section> já pronto para inserção.
 * @param {string} baseUrl diretório dos slides, com barra final
 * @param {{file: string, title: string}} entry
 * @returns {Promise<HTMLElement>}
 */
async function fetchSlide(baseUrl, entry) {
  let response;
  try {
    response = await fetch(baseUrl + entry.file);
  } catch (cause) {
    throw new SlideLoadError(entry.file, cause.message);
  }
  if (!response.ok) {
    throw new SlideLoadError(entry.file, `HTTP ${response.status}`);
  }

  const markup = await response.text();
  const section = new DOMParser()
    .parseFromString(markup, 'text/html')
    .querySelector('section.slide');

  if (!section) {
    throw new SlideLoadError(entry.file, 'nenhum <section class="slide"> encontrado');
  }

  // O registro é a fonte da verdade do título; o atributo no arquivo é apenas
  // documentação para quem abre o slide isolado.
  section.dataset.title = entry.title;
  return section;
}

/**
 * Carrega todos os slides do registro e os anexa ao palco, na ordem.
 * @param {HTMLElement} stage
 * @param {ReadonlyArray<{file: string, title: string}>} registry
 * @param {string} baseUrl
 * @returns {Promise<HTMLElement[]>} as seções inseridas, em ordem
 */
export async function loadSlides(stage, registry, baseUrl) {
  const sections = await Promise.all(
    registry.map((entry) => fetchSlide(baseUrl, entry)),
  );

  // Um fragmento evita 20 reflows durante a inserção.
  const fragment = document.createDocumentFragment();
  sections.forEach((section) => fragment.appendChild(section));
  stage.appendChild(fragment);

  return sections;
}
