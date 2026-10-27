import { useState, useEffect } from 'react';
import { 
   Monitor, Scaling, Maximize, AlertTriangle, 
  Code, ShieldCheck, CheckCircle2, Eye, Layers, 
  Settings, Quote, Zap, RotateCcw, Layout, Ruler 
} from 'lucide-react';

export const slides = [

  {
    title: "O Caos das Telas no React Native",
    content: "O React Native usa 'pixels independentes de densidade' (dp). Mas 300dp em um iPhone SE ocupa a tela toda, enquanto 300dp em um iPad ou Monitor (Web) parece um botão minúsculo. Como escalar a interface de forma inteligente sem enlouquecer com media queries?",
    icon: <AlertTriangle className="text-amber-500 mb-6" size={48} />,
    playground: () => {
      const [width, setWidth] = useState(350);
      return (
        <div className="flex flex-col items-center justify-center h-full w-full space-y-8">
          <div className="w-full max-w-md space-y-4">
            <label className="text-sm text-slate-400 font-mono">Simulador de Largura da Tela: {width}px</label>
            <input type="range" min="320" max="1024" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
          <div className="relative border-4 border-slate-700 rounded-3xl overflow-hidden bg-slate-800 transition-all duration-300 flex items-center justify-center shadow-2xl" style={{ width: `${width}px`, height: '400px' }}>
            <div className="w-[300px] bg-red-500/20 border border-red-500 p-4 rounded-xl text-center">
              <span className="text-red-400 font-mono text-sm">Componente com width: 300 fixo</span>
            </div>
          </div>
        </div>
      );
    }
  },
    {
    title: "A Base: O que é 'dp'?",
    content: "No React Native, os tamanhos (como width: 300) não usam pixels físicos tradicionais, mas sim 'dp' (Density-independent Pixels).\n\nO 'dp' garante que um elemento de 50dp tenha exatamente o mesmo tamanho físico (em polegadas/cm) num iPhone 7 ou num Galaxy Tab 8 (Tablet com tela de alta densidade).\n\nO Problema: Embora o tamanho físico seja o mesmo, a área total disponível muda de acordo com o tamanho da tela. Um iPhone 7 tem 375dp de largura, enquanto um Tablet tem 768dp. Um botão de tamanho fixo ocupará proporções drasticamente diferentes.",
    icon: <Ruler className="text-indigo-400 mb-6" size={48} />,
    playground: () => {
      const [device, setDevice] = useState<'iphone' | 'tablet'>('iphone');
      const isIphone = device === 'iphone';
      const containerWidth = isIphone ? 375 : 768;
      
      return (
        <div className="flex flex-col items-center justify-center h-full w-full space-y-8 p-8">
          <div className="flex space-x-4 mb-4">
            <button onClick={() => setDevice('iphone')} className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${isIphone ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>iPhone 7 (375dp)</button>
            <button onClick={() => setDevice('tablet')} className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${!isIphone ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>Tablet (768dp)</button>
          </div>
          
          <div className="relative border-4 border-slate-700 bg-slate-900 transition-all duration-500 flex flex-col p-4 rounded-xl shadow-2xl" style={{ width: isIphone ? '375px' : '100%', maxWidth: '768px', height: '240px' }}>
            <div className="text-xs text-slate-500 font-mono mb-4">Largura Total da Tela: {containerWidth}dp</div>
            
            <div className="bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center rounded-lg h-24 whitespace-nowrap transition-all duration-500 shadow-inner" style={{ width: '300px' }}>
              <span className="text-indigo-300 font-mono font-bold text-sm">width: 300 (Fixo)</span>
            </div>
            
            <div className="mt-auto text-center border-t border-slate-800 pt-4">
               <span className="text-slate-300 text-sm font-medium">
                 {isIphone ? "Ocupa 80% da tela (300 / 375)" : "Ocupa menos da metade (300 / 768)"}
               </span>
            </div>
          </div>
        </div>
      );
    }
  },
  {
    title: "A Solução: react-native-size-matters",
    content: "Uma biblioteca leve que usa uma matemática simples. Ela assume que o seu design foi criado para um celular padrão (ex: 350x680). Ela compara a tela atual do usuário com essa tela padrão e calcula a proporção exata para crescer ou encolher os elementos dinamicamente.",
    icon: <Scaling className="text-blue-500 mb-6" size={48} />,
    playground: () => (
      <div className="h-full flex flex-col justify-center space-y-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
          <div className="flex items-center space-x-3 text-slate-300">
            <Code size={20} className="text-emerald-400"/>
            <span className="font-mono text-sm">npm install react-native-size-matters</span>
          </div>
          <p className="text-sm text-slate-400 mt-4">Nenhuma configuração nativa necessária. Funciona perfeitamente com Expo e React Native CLI.</p>
        </div>
      </div>
    )
  },
  {
    title: "Os 3 Pilares",
    content: "A biblioteca fornece 3 funções essenciais para lidar com qualquer cenário de layout.\n\n1. scale(): Para larguras e margens horizontais.\n2. verticalScale(): Para alturas e margens verticais.\n3. moderateScale(): O segredo para fontes perfeitas.",
    icon: <Layers className="text-emerald-500 mb-6" size={48} />,
    playground: () => {
      const [screen, setScreen] = useState(350);
      const ratio = screen / 350;
      
      return (
        <div className="space-y-8 flex flex-col justify-center h-full w-full max-w-lg mx-auto">
          <input type="range" min="300" max="800" value={screen} onChange={(e) => setScreen(Number(e.target.value))} className="w-full accent-emerald-500" />
          
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-400 mb-2 font-mono">1. scale(100) - Cresce linearmente</p>
              <div className="h-10 bg-blue-500 rounded flex items-center px-4 text-xs font-bold transition-all" style={{ width: `${100 * ratio}px` }}>{Math.round(100 * ratio)}px</div>
            </div>
            
            <div>
              <p className="text-sm text-slate-400 mb-2 font-mono">2. moderateScale(100) - Cresce com limite</p>
              <div className="h-10 bg-emerald-500 rounded flex items-center px-4 text-xs font-bold transition-all" style={{ width: `${100 + (100 * ratio - 100) * 0.5}px` }}>{Math.round(100 + (100 * ratio - 100) * 0.5)}px</div>
            </div>
          </div>
        </div>
      );
    }
  },
  {
    title: "O Fator de Moderação",
    content: "Por que moderateScale é tão importante? Se você aplicar um scale simples em uma fonte tamanho 16 num iPad, ela pode virar tamanho 35, quebrando o layout. O moderateScale aplica apenas uma fração desse crescimento (fator padrão 0.5), mantendo a harmonia.",
    icon: <ShieldCheck className="text-purple-500 mb-6" size={48} />,
    playground: () => {
      const [factor, setFactor] = useState(0.5);
      return (
        <div className="h-full flex flex-col justify-center space-y-8 p-8 bg-slate-800/50 rounded-2xl border border-slate-700">
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-slate-400 font-mono">
              <span>Fator de Moderação: {factor}</span>
              <span>moderateScale(16, {factor})</span>
            </div>
            <input type="range" min="0" max="1" step="0.1" value={factor} onChange={(e) => setFactor(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-center">
              <p className="text-xs text-slate-500 mb-4">iPhone SE (Tela Base)</p>
              <p className="font-bold text-white" style={{ fontSize: '16px' }}>Texto Título</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-center">
              <p className="text-xs text-slate-500 mb-4">iPad (Tela Grande)</p>
              <p className="font-bold text-blue-400 transition-all" style={{ fontSize: `${16 + (35 - 16) * factor}px` }}>Texto Título</p>
            </div>
          </div>
        </div>
      );
    }
  },
  {
    title: "Identificando a Plataforma (Platform)",
    content: "Antes de redimensionar, precisamos saber ONDE estamos rodando. A API nativa `Platform.OS` diz exatamente se o app está num iPhone, Android, Web ou macOS. Isso é crucial porque um Web Desktop exige regras diferentes de um tablet Android.",
    icon: <Settings className="text-sky-500 mb-6" size={48} />,
    playground: () => {
      const [os, setOs] = useState('ios');
      return (
        <div className="h-full flex flex-col justify-center space-y-8 p-8">
          <div className="flex space-x-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
            {['ios', 'android', 'web', 'macos'].map(p => (
              <button key={p} onClick={() => setOs(p)} className={`flex-1 py-2 rounded-lg text-sm font-bold uppercase transition-all ${os === p ? 'bg-sky-500 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>
                {p}
              </button>
            ))}
          </div>
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 font-mono text-sm text-slate-300">
            <span className="text-purple-400">import</span> {'{ Platform }'} <span className="text-purple-400">from</span> <span className="text-green-400">'react-native'</span>;
            <br/><br/>
            <span className="text-blue-400">const</span> isDesktop = Platform.OS === <span className="text-green-400">'web'</span> || Platform.OS === <span className="text-green-400">'macos'</span>;
            <br/><br/>
            <span className="text-slate-500">// Valor simulado agora:</span>
            <br/>
            Platform.OS = <span className="text-amber-400">'{os}'</span>;
          </div>
        </div>
      );
    }
  },
  {
    title: "Lendo a Tela (useWindowDimensions)",
    content: "Para interfaces realmente híbridas, saber o OS não basta. Na Web, o usuário pode redimensionar a janela a qualquer momento. O hook `useWindowDimensions` lê a largura e altura em tempo real, permitindo criar breakpoints (ex: mudar o layout se largura > 768).",
    icon: <Maximize className="text-indigo-500 mb-6" size={48} />,
    playground: () => {
      const [width, setWidth] = useState(1024);
      const isMobile = width < 768;
      
      return (
        <div className="h-full flex flex-col justify-center space-y-6">
          <input type="range" min="320" max="1200" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full accent-indigo-500" />
          
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center space-y-4">
            <div className="font-mono text-xl text-white">Width: <span className="text-indigo-400">{width}px</span></div>
            <div className={`p-4 rounded-lg font-bold ${isMobile ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              Breakpoint Atual: {isMobile ? 'MOBILE (Coluna)' : 'DESKTOP (Linha)'}
            </div>
            
            <div className={`flex gap-4 transition-all duration-500 ${isMobile ? 'flex-col' : 'flex-row'}`}>
              <div className="flex-1 bg-slate-700 h-20 rounded-lg flex items-center justify-center">A</div>
              <div className="flex-1 bg-slate-700 h-20 rounded-lg flex items-center justify-center">B</div>
            </div>
          </div>
        </div>
      );
    }
  },
  {
    title: "A Integração com Desktop",
    content: "O react-native-size-matters não foi desenhado para web desktop horizontais. Se a tela tiver 1920px, ele multiplicará tudo por 5x. A solução para apps universais é combinar a biblioteca com hooks nativos, aplicando 'max-width' para travar o crescimento no PC.",
    icon: <Monitor className="text-sky-500 mb-6" size={48} />,
    playground: () => {
      const [isDesktop, setIsDesktop] = useState(true);
      return (
        <div className="h-full flex flex-col items-center justify-center space-y-6">
          <div className="flex space-x-4 mb-4">
            <button onClick={() => setIsDesktop(false)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${!isDesktop ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Mobile</button>
            <button onClick={() => setIsDesktop(true)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDesktop ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Desktop Web</button>
          </div>
          
          <div className={`relative border-4 border-slate-700 bg-slate-900 transition-all duration-500 flex items-center justify-center p-8 ${isDesktop ? 'w-full h-[400px] rounded-xl' : 'w-[320px] h-[568px] rounded-[3rem]'}`}>
            <div className={`bg-slate-800 border border-slate-600 rounded-xl p-6 transition-all duration-500 ${isDesktop ? 'w-[400px]' : 'w-full'}`}>
              <h3 className="text-lg font-bold text-white mb-2">Card Híbrido</h3>
              <p className="text-sm text-slate-400">
                {isDesktop ? "No Desktop, limitamos com max-width: 400." : "No Mobile, usamos width: scale(300)."}
              </p>
            </div>
          </div>
        </div>
      );
    }
  },
  {
    title: "Escalonamento vs Porcentagem",
    content: "Muitos usam 'width: 100%' para adaptar telas. O problema é que porcentagens ignoram o Aspect Ratio (proporção). Um card de 80% no celular é elegante. Um card de 80% num tablet fica esticado e distorcido. O scale() preserva a beleza do design original.",
    icon: <Layout className="text-rose-500 mb-6" size={48} />,
    playground: () => {
      const [view, setView] = useState('mobile');
      return (
        <div className="h-full flex flex-col space-y-6">
          <div className="flex space-x-2">
            <button onClick={()=>setView('mobile')} className={`px-4 py-2 rounded ${view==='mobile' ? 'bg-rose-500' : 'bg-slate-700'}`}>Mobile</button>
            <button onClick={()=>setView('tablet')} className={`px-4 py-2 rounded ${view==='tablet' ? 'bg-rose-500' : 'bg-slate-700'}`}>Tablet</button>
          </div>
          <div className={`border-4 border-slate-700 mx-auto transition-all duration-500 relative flex flex-col p-4 space-y-4 ${view==='mobile' ? 'w-[300px] h-[500px]' : 'w-[600px] h-[500px]'}`}>
             <div className="w-[80%] h-24 bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400 text-sm">width: 80% (Distorce)</div>
             <div className="h-24 bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 text-sm transition-all" style={{width: view==='mobile' ? '240px' : '411px'}}>width: scale(240) (Mantém proporção)</div>
          </div>
        </div>
      )
    }
  },
  {
    title: "O Problema da Rotação",
    content: "Quando um celular deita (Landscape), a largura vira altura e vice-versa. Se seus estilos forem estáticos fora do componente, eles não vão atualizar. O size-matters lida bem com isso, desde que você reconstrua os estilos ou use hooks para forçar o re-render.",
    icon: <RotateCcw className="text-amber-400 mb-6" size={48} />,
    playground: () => {
      const [isLandscape, setIsLandscape] = useState(false);
      return (
        <div className="h-full flex flex-col items-center justify-center space-y-8">
           <button onClick={()=>setIsLandscape(!isLandscape)} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 rounded-full text-slate-900 font-bold flex items-center gap-2">
             <RotateCcw size={20}/> Girar Dispositivo
           </button>
           <div className={`border-4 border-slate-600 bg-slate-800 transition-all duration-500 flex items-center justify-center ${isLandscape ? 'w-[600px] h-[300px] rounded-3xl' : 'w-[300px] h-[600px] rounded-[3rem]'}`}>
              <div className="text-center space-y-2">
                <div className="text-amber-400 font-mono text-xl">{isLandscape ? 'Largura: 896px' : 'Largura: 414px'}</div>
                <div className="text-slate-400 text-sm">O StyleSheet precisa ser recalculado!</div>
              </div>
           </div>
        </div>
      )
    }
  },
  {
    title: "ScaledSheet na Prática",
    content: "Para evitar escrever `scale(100)` dezenas de vezes, a biblioteca oferece o ScaledSheet. Ele é um substituto idêntico ao StyleSheet do React Native, mas permite adicionar sufixos mágicos aos números: `@s` (scale), `@vs` (verticalScale) e `@ms` (moderateScale).",
    icon: <Code className="text-emerald-400 mb-6" size={48} />,
    playground: () => (
      <div className="h-full flex flex-col justify-center space-y-4">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 font-mono text-sm text-slate-300">
          <span className="text-blue-400">const</span> styles = ScaledSheet.create({'{'}
          <div className="ml-4">
            container: {'{'}
            <div className="ml-4">
              width: <span className="text-amber-300">'300@s'</span>, <span className="text-slate-500">// scale</span><br/>
              height: <span className="text-amber-300">'200@vs'</span>, <span className="text-slate-500">// verticalScale</span><br/>
              padding: <span className="text-amber-300">'16@ms'</span>, <span className="text-slate-500">// moderateScale</span><br/>
              borderWidth: <span className="text-orange-400">1</span> <span className="text-slate-500">// Fixo!</span>
            </div>
            {'}'},<br/>
            title: {'{'}
            <div className="ml-4">
              fontSize: <span className="text-amber-300">'24@ms0.3'</span> <span className="text-slate-500">// fator de 0.3</span>
            </div>
            {'}'}
          </div>
          {'}'});
        </div>
      </div>
    )
  },
  {
    title: "Performance de Renderização",
    content: "Fazer cálculos matemáticos na Thread de UI durante o render (ex: dentro da tag `<View width={scale(100)} />`) causa quedas de FPS em animações e listas longas. O ScaledSheet processa os cálculos uma única vez na criação, salvando a CPU do celular.",
    icon: <Zap className="text-yellow-400 mb-6" size={48} />,
    playground: () => (
      <div className="h-full flex flex-col justify-center space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 p-4 border border-red-500/50 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-500 text-xs px-2 py-1 rounded-bl">Ruim</div>
            <h4 className="text-white mb-4">No JSX</h4>
            <div className="flex gap-1 flex-wrap">
              {[...Array(40)].map((_, i) => <div key={i} className="w-2 h-2 bg-red-500/50 rounded animate-pulse" style={{animationDelay: `${i*0.05}s`}}/>)}
            </div>
            <p className="text-xs text-slate-400 mt-4">Recalcula a cada render</p>
          </div>
          <div className="bg-slate-800 p-4 border border-emerald-500/50 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-xs px-2 py-1 rounded-bl">Bom</div>
            <h4 className="text-white mb-4">ScaledSheet</h4>
            <div className="flex gap-1 flex-wrap">
              {[...Array(40)].map((_, i) => <div key={i} className="w-2 h-2 bg-emerald-500/50 rounded"/>)}
            </div>
            <p className="text-xs text-slate-400 mt-4">Calculado uma vez</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Acessibilidade (Font Scaling)",
    content: "Celulares permitem que usuários com visão reduzida aumentem a fonte do sistema. Se usar pixels fixos, o app quebra. O size-matters escala fontes de forma segura, mas evite usar scale() em botões pequenos, ou o texto grande vazará para fora da caixa.",
    icon: <Eye className="text-cyan-400 mb-6" size={48} />,
    playground: () => {
      const [sysFont, setSysFont] = useState(1);
      return (
        <div className="h-full flex flex-col justify-center space-y-8">
           <div className="space-y-4">
            <label className="text-sm text-slate-400 font-mono">Tamanho da Fonte do Sistema: {sysFont}x</label>
            <input type="range" min="1" max="2" step="0.1" value={sysFont} onChange={(e) => setSysFont(Number(e.target.value))} className="w-full accent-cyan-400" />
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col space-y-6">
             <div className="w-48 h-12 bg-blue-600 rounded flex items-center justify-center overflow-hidden">
                <span className="text-white font-bold whitespace-nowrap" style={{fontSize: `${16 * sysFont}px`}}>Botão com Texto</span>
             </div>
             <p className="text-xs text-slate-400">Aumente a fonte e veja que botões com altura fixa quebram a acessibilidade. Use padding em vez de height fixa!</p>
          </div>
        </div>
      )
    }
  },
  {
    title: "Comparativo de Ferramentas",
    content: "Existem várias formas de criar layouts no React Native. Enquanto bibliotecas UI trazem componentes prontos, o size-matters brilha quando você precisa construir designs super customizados sem perder a precisão do Figma.",
    icon: <Layers className="text-purple-400 mb-6" size={48} />,
    playground: () => (
      <div className="h-full flex flex-col justify-center">
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 text-sm">
          <div className="grid grid-cols-3 bg-slate-900 p-4 font-bold text-slate-300">
            <div>Recurso</div>
            <div className="text-center text-blue-400">Size Matters</div>
            <div className="text-center text-emerald-400">Tailwind (Web)</div>
          </div>
          <div className="grid grid-cols-3 p-4 border-b border-slate-700 text-slate-400">
            <div>Curva de Aprendizado</div>
            <div className="text-center text-white">Baixa</div>
            <div className="text-center">Média</div>
          </div>
          <div className="grid grid-cols-3 p-4 border-b border-slate-700 text-slate-400">
            <div>App Mobile Nativo</div>
            <div className="text-center text-emerald-400">Excelente</div>
            <div className="text-center text-amber-400">Requer Libs</div>
          </div>
          <div className="grid grid-cols-3 p-4 text-slate-400">
            <div>Desktop Web</div>
            <div className="text-center text-amber-400">Exige max-width</div>
            <div className="text-center text-emerald-400">Nativo</div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Desafio Híbrido: Refatoração",
    content: "Sua missão: Transformar um layout quebrado num iPad num design perfeito universal. Marque as boas práticas abaixo para ver o código do componente ser refatorado ao vivo.",
    icon: <ShieldCheck className="text-emerald-500 mb-6" size={48} />,
    playground: () => {
      const [rules, setRules] = useState([false, false, false]);
      const isFixed = rules.every(r => r);
      return (
        <div className="h-full flex flex-col justify-center space-y-6">
           <div className="space-y-3">
             <label className="flex items-center space-x-3 text-sm text-slate-300 cursor-pointer">
               <input type="checkbox" checked={rules[0]} onChange={(e)=>setRules([e.target.checked, rules[1], rules[2]])} className="w-5 h-5 accent-emerald-500 rounded"/>
               <span>1. Trocar height fixa por padding (verticalScale)</span>
             </label>
             <label className="flex items-center space-x-3 text-sm text-slate-300 cursor-pointer">
               <input type="checkbox" checked={rules[1]} onChange={(e)=>setRules([rules[0], e.target.checked, rules[2]])} className="w-5 h-5 accent-emerald-500 rounded"/>
               <span>2. Aplicar moderateScale na fonte</span>
             </label>
             <label className="flex items-center space-x-3 text-sm text-slate-300 cursor-pointer">
               <input type="checkbox" checked={rules[2]} onChange={(e)=>setRules([rules[0], rules[1], e.target.checked])} className="w-5 h-5 accent-emerald-500 rounded"/>
               <span>3. Limitar max-width no Desktop</span>
             </label>
           </div>
           
           <div className={`p-8 border-2 rounded-xl transition-all duration-500 flex justify-center ${isFixed ? 'border-emerald-500 bg-emerald-500/10' : 'border-red-500 bg-red-500/10'}`}>
              <div className="bg-blue-600 rounded-xl text-center text-white font-bold transition-all duration-500"
                   style={{
                     width: rules[2] ? '300px' : '100%',
                     padding: rules[0] ? '16px' : '0',
                     height: rules[0] ? 'auto' : '120px',
                     lineHeight: rules[0] ? 'normal' : '120px',
                     fontSize: rules[1] ? '20px' : '40px'
                   }}>
                 Entrar no App
              </div>
           </div>
        </div>
      )
    }
  },
  {
    title: "Conclusão e Boas Práticas",
    content: "A responsividade em React Native exige intencionalidade.\n\n• Use ScaledSheet para performance.\n• Limite o crescimento com moderateScale.\n• Adicione max-width para telas Web/Desktop.\n• Não engesse a altura de textos se quiser preservar a acessibilidade.",
    icon: <CheckCircle2 className="text-emerald-500 mb-6" size={48} />,
    playground: () => (
      <div className="h-full flex flex-col items-center justify-center space-y-6">
         <div className="w-32 h-32 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-500/20">
           <CheckCircle2 size={64} className="text-emerald-400" />
         </div>
         <h3 className="text-2xl font-bold text-white">Você está pronto!</h3>
         <p className="text-slate-400 text-center max-w-sm">Agora você domina a matemática do layout em aplicações híbridas modernas.</p>
      </div>
    )
  },
  {
    title: "Obrigado!",
    content: "Chegamos ao fim desta jornada técnica sobre redimensionamento de interfaces em React Native. Espero que você tenha aprendido boas práticas e técnicas para criar layouts responsivos e acessíveis.",
    icon: <Quote className="text-blue-500 mb-6" size={48} />,
    playground: () => (
      <div className="h-full flex flex-col justify-center space-y-8">
        <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700 shadow-2xl relative">
          <Quote size={80} className="absolute -top-4 -left-4 text-slate-700/50 rotate-180" />
          <p className="text-2xl font-medium text-white italic leading-relaxed relative z-10">
            "O design não é apenas o que parece e o que se sente. Design é como funciona."
          </p>
          <div className="mt-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="font-bold text-xl text-slate-400">SJ</span>
            </div>
            <div>
              <p className="font-bold text-white">Steve Jobs</p>
              <p className="text-sm text-slate-400">Apple Inc.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
];
