export const slides = [
  {
    title: "Login Social",
    section: "Introdução",
    time: 45,
    notes: [
      "Abra com uma pergunta: quem já usou o botão “Entrar com Google” hoje? O botão parece simples, mas envolve navegador, backend e provedor. O objetivo é entender o que acontece entre o clique e o dashboard.",
      "Apresente-se: Hyan Ferreira, Programação para Dispositivos Móveis. Vamos usar uma aplicação web para enxergar o fluxo; os conceitos também aparecem em aplicativos móveis. O exemplo prático será Laravel Socialite, com um frontend React.",
    ],
    question: "O Google fica sabendo a senha da nossa aplicação?",
    answer:
      "Não há senha local compartilhada. A pessoa se autentica no provedor; a aplicação recebe uma identidade por um fluxo controlado.",
  },
  {
    title: "O caminho até o login",
    section: "Roteiro",
    time: 45,
    notes: [
      "Situe o público: começamos pela experiência do usuário, construímos os conceitos, seguimos as setas e só então abrimos o código. Não é preciso conhecer Laravel para acompanhar.",
      "Os seis blocos somam 25 minutos. Dê mais tempo ao fluxo e ao callback; são as partes em que as fronteiras de confiança ficam claras. As perguntas podem ser guardadas para o fim.",
    ],
    question: "É necessário um backend?",
    answer:
      "Este exemplo usa um backend confidencial. Clientes públicos, como apps móveis, também usam Authorization Code com PKCE, sem embutir um segredo no app.",
  },
  {
    title: "Menos atrito. A mesma responsabilidade.",
    section: "O problema",
    time: 75,
    notes: [
      "Compare as duas experiências sem prometer que login social é sempre melhor. No cadastro tradicional, a aplicação administra a senha. No social, delega a autenticação externa a uma conta que a pessoa já tem.",
      "O consentimento depende dos scopes, do provedor e de autorizações anteriores; não surge obrigatoriamente a cada login. Há dependência do provedor, privacidade e recuperação de conta para considerar. A aplicação ainda precisa proteger sua sessão e aplicar permissões.",
    ],
    question: "Login social elimina ataques?",
    answer:
      "Não. Reduz a necessidade de gerenciar certas senhas, mas um callback mal validado ou uma vinculação insegura ainda permite invasões.",
  },
  {
    title: "Quem é você? O que pode fazer?",
    section: "Fundamentos",
    time: 75,
    notes: [
      "Use a analogia da portaria: o documento identifica a pessoa; a autorização define quais salas ela pode acessar. Reconhecer alguém não dá acesso a toda a faculdade.",
      "No Laravel, auth()->check() consulta se há usuário autenticado no guard atual. can() verifica uma habilidade definida por Gate ou Policy. O exemplo pressupõe essa habilidade configurada. O bloqueio real deve ocorrer no backend, mesmo que o frontend esconda botões.",
    ],
    question: "Estar logado permite entrar em /admin?",
    answer:
      "Não. A rota precisa verificar uma permissão ou papel além da autenticação.",
  },
  {
    title: "Do acesso à identidade",
    section: "Fundamentos",
    time: 105,
    notes: [
      "OAuth 2.0 é um framework de autorização delegada: um aplicativo pode acessar uma agenda sem receber a senha do dono. Um access token representa esse acesso, limitado por escopo e tempo.",
      "OIDC adiciona uma forma padronizada de comunicar a autenticação usando um ID Token e claims. O scope openid seleciona OIDC. Não diga que todo OAuth é um protocolo de login: GitHub OAuth Apps, por exemplo, recupera o perfil pela API do provedor.",
      "Autenticar uma conta não comprova identidade civil. No OIDC, a identidade é descrita pelo par emissor e subject, não por um endereço de e-mail.",
    ],
    question: "Todo access token é um JWT?",
    answer:
      "Não. O formato depende do provedor. ID Token OIDC é um JWT; access tokens podem ser opacos.",
  },
  {
    title: "Quatro participantes. Papéis distintos.",
    section: "Arquitetura",
    time: 60,
    notes: [
      "A pessoa interage com o navegador. O navegador segue redirecionamentos HTTP e mostra interfaces do app e do provedor. O frontend pode iniciar a navegação, mas não deve guardar credenciais confidenciais.",
      "O backend faz a troca do código e cria a sessão local. O provedor autentica a conta externa e emite os artefatos do seu protocolo. Nosso diagrama agrupa autorização e APIs do provedor para fins didáticos; em OAuth, authorization server e resource server são papéis diferentes.",
    ],
    question: "Um redirecionamento é uma chamada do servidor ao Google?",
    answer:
      "Não. A resposta de redirect manda o navegador navegar. A troca do código, mais adiante, é servidor-servidor.",
  },
  {
    title: "Por trás de um único clique",
    section: "O fluxo",
    time: 180,
    notes: [
      "Use → ou Espaço para revelar uma etapa. As dez etapas pertencem ao mesmo slide. Setas ciano representam o caminho do navegador; violeta representa trabalho do backend e chamadas protegidas. Voltar também recua etapas.",
      "1–4: o botão abre uma rota local, que constrói a autorização. O provedor autentica e pede consentimento se necessário. Pode reutilizar uma sessão prévia. 5–7: o navegador volta ao callback com code e state; o backend verifica erros e a correlação, e troca o código de uso único no token endpoint. PKCE vincula a troca ao início do fluxo.",
      "8–10: a identidade deve ser validada segundo a integração. OIDC exige validação de assinatura, emissor, audiência, expiração e nonce quando usado. Na integração Socialite mostrada, o adaptador consulta o endpoint autenticado de perfil do Google. Não estamos implementando manualmente um validador OIDC. O backend busca provider + provider_user_id e cria sua própria sessão.",
    ],
    question: "O código na URL já é a sessão do usuário?",
    answer:
      "Não. É um artefato temporário que o backend troca. A sessão local só nasce depois da validação e associação.",
  },
  {
    title: "As quatro peças da configuração",
    section: "O fluxo",
    time: 90,
    notes: [
      "Client ID é público: identifica qual aplicativo pede acesso. Client Secret é uma credencial do cliente confidencial, protegida no backend; não é a senha do usuário. Clientes públicos não conseguem protegê-lo.",
      "A Redirect URI precisa corresponder ao cadastro. Scope limita as informações ou permissões pedidas. A URL é didática: quebras de linha facilitam a leitura e os valores reais precisam de URL encoding. State e code_challenge foram omitidos desse recorte e aparecem no próximo slide. Nunca coloque o client secret na URL.",
    ],
    question: "Posso usar qualquer URL no redirect_uri?",
    answer:
      "Não. Use destinos cadastrados e comparação estrita, com exceções específicas previstas para clientes nativos.",
  },
  {
    title: "Código, tokens e sessão não são a mesma coisa.",
    section: "O fluxo",
    time: 120,
    notes: [
      "Um parâmetro email=alguem e autenticado=true pode ser fabricado. O authorization code é curto e de uso único: o servidor o troca usando as credenciais e proteções do fluxo. Não basta receber um ID Token: é preciso validá-lo.",
      "Access token: acesso a APIs. ID Token: autenticação do usuário para este cliente OIDC. Refresh token: renovação, apenas se emitido e autorizado. Não assuma que todo provedor sempre retorna os três. Sessão local: estado que a nossa aplicação emite e controla, geralmente por cookie.",
      "State correlaciona pedido e retorno e ajuda a evitar CSRF. PKCE usa um verifier secreto por tentativa e seu challenge S256, dificultando uso de um código interceptado. Clientes públicos devem usar PKCE; é recomendado também para confidenciais. Nonce, quando enviado em OIDC, deve ser conferido no ID Token.",
    ],
    question: "Posso enviar um ID Token como access token para uma API?",
    answer:
      "Não. Cada token tem público e finalidade específicos. Um ID Token não concede acesso genérico a APIs.",
  },
  {
    title: "Antes do código, registre a aplicação.",
    section: "Na prática",
    time: 60,
    notes: [
      "Isto é uma representação conceitual, não uma captura do Google Cloud. A organização e os nomes do console podem mudar. Crie um projeto, configure branding, público e acesso a dados, e registre um cliente Web.",
      "Cadastre exatamente http://localhost:8000/auth/google/callback para o exemplo local. Use HTTPS em produção. Dependendo do público e dos scopes, há usuários de teste e verificação da aplicação. Guarde as credenciais em um gestor de segredos ou variáveis protegidas, nunca no repositório.",
    ],
    question: "Posso reutilizar o cliente Web dentro do app mobile?",
    answer:
      "Use o tipo de cliente e as URIs adequadas à plataforma. Em apps nativos, siga as orientações oficiais, navegador do sistema e PKCE; não embarque um segredo.",
  },
  {
    title: "Pouca configuração. No lugar certo.",
    section: "Laravel Socialite",
    time: 90,
    notes: [
      "Socialite integra provedores OAuth no Laravel. O comando instala o pacote; .env contém exemplos fictícios. config/services.php mapeia essas variáveis para o driver google.",
      "O exemplo usa um Laravel com sessão web. O frontend e o backend estão sob a mesma origem para simplificar cookies e redirecionamentos. Em desenvolvimento separado, o link deve apontar para a origem do backend. A apresentação em si não executa PHP e funciona sem nenhuma credencial.",
      "Apple requer adaptador externo ao núcleo do Socialite. O comportamento de PKCE e OIDC depende do driver e versão: o recorte mínimo mostrado não os ativa automaticamente. A referência completa habilita PKCE com enablePKCE() nas duas rotas. Consulte a referência para os limites do exemplo.",
    ],
    question: "É seguro usar VITE_GOOGLE_CLIENT_SECRET?",
    answer:
      "Não. Variáveis VITE_ são incorporadas ao JavaScript do navegador. O segredo deve permanecer no servidor.",
  },
  {
    title: "Um botão. Uma rota. Um redirecionamento.",
    section: "Laravel Socialite",
    time: 75,
    notes: [
      "O link HTML funciona no React sem fetch: é uma navegação completa até o backend. O driver lê config/services.php, prepara a autorização e devolve um redirect HTTP para o provedor.",
      "As rotas ficam em routes/web.php para participar da sessão. O Socialite usa state por padrão nesse fluxo. Não use stateless() para apenas esconder um erro de estado: isso retiraria uma proteção sem resolver cookies, domínio ou sessão. A declaração de Route usa a facade disponível no Laravel; a referência completa inclui os imports.",
    ],
    question: "Preciso mandar o Client Secret no botão?",
    answer:
      "Não. O botão aponta para uma rota pública da nossa aplicação; o segredo só é utilizado pelo backend.",
  },
  {
    title: "Identidade externa → conta local → sessão.",
    section: "Laravel Socialite",
    time: 150,
    notes: [
      "user() recebe o retorno, verifica state no fluxo com sessão, troca o código e consulta o perfil autenticado do Google. Ele pode lançar exceção se a pessoa negar acesso ou se houver estado inválido. A referência completa trata esses casos.",
      "O trecho de login mostra apenas uma identidade já vinculada. firstOrFail() interrompe o fluxo se não houver associação; ele não cria um usuário de maneira implícita. O arquivo completo cria uma conta nova separada em transação, com e-mail local nulo, sem unir contas existentes.",
      "O par provider e provider_user_id tem restrição única. Para vincular uma identidade a uma conta já existente, exija sessão e reautenticação recente da conta local, consentimento explícito, e impeça reassociação de uma identidade que pertence a outra pessoa. Auth::login() autentica localmente; regenerate() troca o identificador da sessão para reduzir fixação de sessão.",
    ],
    question:
      "Mesmo e-mail no Google e no sistema é prova suficiente para unir as contas?",
    answer:
      "Não. A política de vinculação deve exigir prova da conta local. Endereços mudam e as garantias de verificação variam.",
  },
  {
    title: "Vamos acompanhar uma entrada.",
    section: "Demonstração",
    time: 105,
    notes: [
      "Avise antes de clicar: esta é uma simulação didática inteiramente local. Não abre o Google, não envia e-mail, não cria cookie de autenticação e não usa credenciais. A pessoa fictícia se chama Ana.",
      "Avance pelo botão ou teclado: início, redirecionamento, seleção da conta, callback, identificação, sessão local e dashboard. A trilha lateral explica quem está agindo em cada momento. No fim, use Recomeçar para repetir. Um login real exige a implementação e validações do servidor.",
    ],
    question: "Se eu desativar a internet, continua funcionando?",
    answer:
      "Sim. Todos os recursos da apresentação são locais. No build de produção, o service worker também permite recarregar offline depois da primeira carga e do cache concluído.",
  },
  {
    title: "O botão se parece. A integração muda.",
    section: "Provedores",
    time: 75,
    notes: [
      "Google suporta OIDC. GitHub OAuth Apps usa OAuth 2.0 e APIs de perfil: não confundir com o OIDC do GitHub Actions para workloads. E-mail privado pode exigir user:email e uma consulta adicional.",
      "Apple usa código e ID Token, com Services ID na web e client secret assinado como JWT. Nome é enviado na primeira autorização, e-mail pode usar relay privado; não prometa avatar. LinkedIn tem produto específico de Sign In com OIDC; profile e email dependem das permissões provisionadas e o e-mail pode faltar.",
      "Facebook Login clássico usa OAuth e Graph API; dados dependem das permissões, consentimento e modalidade. Limited Login no iOS usa OIDC e um token de autenticação: não o trate como token Graph. Os detalhes foram conferidos na documentação oficial, inclusive Limited Login e permissões da Meta; veja SOURCES.md.",
      "Os adaptadores não são intercambiáveis. Socialite inclui Google, GitHub, Facebook e LinkedIn; Apple depende de provedor comunitário. Não inferir permissões somente pelo nome do botão.",
    ],
    question: "Posso usar e-mail como identificador universal?",
    answer:
      "Não. Use o identificador estável no contexto do provedor; em OIDC, emissor + sub. Trate e-mail como atributo opcional e mutável.",
  },
  {
    title: "A confiança precisa de limites.",
    section: "Segurança",
    time: 105,
    notes: [
      "Priorize três falhas: segredo no bundle, retorno sem validação e associação por e-mail. Elas ultrapassam fronteiras que deveriam ficar protegidas. A biblioteca ajuda, mas não define sua política de contas.",
      "Use allowlist de Redirect URIs, state e PKCE conforme o fluxo. Em OIDC, validar assinatura com chaves confiáveis, algoritmos permitidos, iss, aud, exp e nonce quando usado; decodificar JWT não é validar. Solicite apenas scopes necessários.",
      "Mantenha tokens fora de URLs, logs e armazenamento inseguro. Se precisar persistir tokens, criptografe no servidor e defina expiração, rotação e revogação. Para este login, o exemplo não persiste tokens do provedor. Proteja a sessão com HTTPS, cookies HttpOnly/Secure/SameSite adequados, CSRF nas ações e regeneração no login. Sair localmente não encerra automaticamente a sessão Google.",
    ],
    question: "Uma biblioteca garante toda a segurança?",
    answer:
      "Não. É preciso configurar corretamente o fluxo, cuidar da sessão, validar o modelo de identidade e definir uma política segura de vinculação.",
  },
  {
    title: "Uma identidade externa. Uma sessão sua.",
    section: "Conclusão",
    time: 45,
    notes: [
      "Recapitule apontando três caixas: o provedor autentica a conta externa, o backend verifica e associa, a nossa aplicação cria a própria sessão. Essa é a ideia que o público deve levar.",
      "Encerre com Obrigado! Dúvidas? As fontes oficiais e a referência Laravel podem ser abertas pelos links deste slide. Se houver tempo, retome a diferença entre estar logado e estar autorizado.",
    ],
    question: "Qual é a frase central da apresentação?",
    answer:
      "O provedor autentica a identidade externa. Minha aplicação associa essa identidade a uma conta local e cria sua própria sessão.",
  },
];
export const totalSeconds = slides.reduce((sum, s) => sum + s.time, 0);
export const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
