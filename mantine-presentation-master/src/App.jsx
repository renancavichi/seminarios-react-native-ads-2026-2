import { Routes, Route, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import {
  AppShell,
  Group,
  Title,
  Text,
  Burger,
  ScrollArea,
  NavLink,
  ActionIcon,
  Badge,
  useMantineColorScheme,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSun, IconMoon, IconBrandReact } from '@tabler/icons-react';

import { groupedNav } from './data/navigation';

import Home from './pages/Home';
import WhyUseLibrary from './pages/WhyUseLibrary';
import ProblemsSolved from './pages/ProblemsSolved';
import Installation from './pages/Installation';
import MantineCore from './pages/MantineCore';
import LayoutSection from './pages/LayoutSection';
import InputsSection from './pages/InputsSection';
import ButtonsSection from './pages/ButtonsSection';
import NavigationSection from './pages/NavigationSection';
import FeedbackSection from './pages/FeedbackSection';
import OverlaysSection from './pages/OverlaysSection';
import DataDisplaySection from './pages/DataDisplaySection';
import TypographySection from './pages/TypographySection';
import HooksSection from './pages/HooksSection';
import Playground from './pages/Playground';
import Conclusion from './pages/Conclusion';

export default function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
            <Group gap={8}>
              <IconBrandReact size={26} color="var(--mantine-color-indigo-6)" />
              <Title order={4}>Mantine UI</Title>
              <Badge variant="light" color="indigo" size="sm">
                apresentação
              </Badge>
            </Group>
          </Group>

          <Group gap={6}>
            <Text size="sm" c="dimmed" visibleFrom="sm">
              Dev Web III
            </Text>
            <ActionIcon
              variant="default"
              size="lg"
              radius="md"
              onClick={() => toggleColorScheme()}
              aria-label="Alternar tema"
            >
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <ScrollArea>
          {Object.entries(groupedNav).map(([group, items]) => (
            <Box key={group} mb="md">
              <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={6} px={4}>
                {group}
              </Text>
              {items.map((item) => (
                <NavLink
                  key={item.path}
                  component={RouterNavLink}
                  to={item.path}
                  label={item.label}
                  active={location.pathname === item.path}
                  variant="light"
                  mb={2}
                  style={{ borderRadius: 8 }}
                />
              ))}
            </Box>
          ))}
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box maw={920} mx="auto" className="section-fade" key={location.pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/por-que-usar" element={<WhyUseLibrary />} />
            <Route path="/problemas" element={<ProblemsSolved />} />
            <Route path="/instalacao" element={<Installation />} />
            <Route path="/mantine-core" element={<MantineCore />} />
            <Route path="/layout" element={<LayoutSection />} />
            <Route path="/inputs" element={<InputsSection />} />
            <Route path="/buttons" element={<ButtonsSection />} />
            <Route path="/navigation" element={<NavigationSection />} />
            <Route path="/feedback" element={<FeedbackSection />} />
            <Route path="/overlays" element={<OverlaysSection />} />
            <Route path="/data-display" element={<DataDisplaySection />} />
            <Route path="/typography" element={<TypographySection />} />
            <Route path="/hooks" element={<HooksSection />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/conclusao" element={<Conclusion />} />
          </Routes>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
