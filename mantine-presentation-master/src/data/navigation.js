export const navItems = [
  { path: '/', label: 'Início', group: 'Apresentação' },
  { path: '/por-que-usar', label: 'Por que usar uma UI lib', group: 'Apresentação' },
  { path: '/problemas', label: 'Problemas que resolve', group: 'Apresentação' },
  { path: '/instalacao', label: 'Instalação', group: 'Apresentação' },
  { path: '/mantine-core', label: 'Mantine Core', group: 'Apresentação' },

  { path: '/layout', label: 'Layout', group: 'Componentes' },
  { path: '/inputs', label: 'Inputs', group: 'Componentes' },
  { path: '/buttons', label: 'Buttons', group: 'Componentes' },
  { path: '/navigation', label: 'Navigation', group: 'Componentes' },
  { path: '/feedback', label: 'Feedback', group: 'Componentes' },
  { path: '/overlays', label: 'Overlays', group: 'Componentes' },
  { path: '/data-display', label: 'Data Display', group: 'Componentes' },
  { path: '/typography', label: 'Typography', group: 'Componentes' },

  { path: '/hooks', label: 'Hooks', group: 'Avançado' },
  { path: '/playground', label: 'Playground', group: 'Avançado' },
  { path: '/conclusao', label: 'Conclusão', group: 'Avançado' },
];

export const groupedNav = navItems.reduce((acc, item) => {
  acc[item.group] = acc[item.group] || [];
  acc[item.group].push(item);
  return acc;
}, {});

export function getSurroundingPages(currentPath) {
  const index = navItems.findIndex((item) => item.path === currentPath);
  return {
    prev: index > 0 ? navItems[index - 1] : null,
    next: index >= 0 && index < navItems.length - 1 ? navItems[index + 1] : null,
    index,
    total: navItems.length,
  };
}
