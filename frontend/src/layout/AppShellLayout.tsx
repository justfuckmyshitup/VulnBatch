import { useState, type PropsWithChildren } from 'react';
import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Divider,
  Group,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconAdjustments,
  IconAlertTriangle,
  IconBuildingWarehouse,
  IconClipboardList,
  IconFileAnalytics,
  IconFileExport,
  IconHistory,
  IconLayoutDashboard,
  IconLogout,
  IconReportSearch,
  IconServer,
  IconShieldCheck,
  IconUpload,
  IconUsers,
} from '@tabler/icons-react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const navigation = [
  { label: 'Dashboard', to: '/', icon: IconLayoutDashboard },
  { label: 'Hosts', to: '/hosts', icon: IconServer },
  { label: 'Findings', to: '/findings', icon: IconAlertTriangle },
  { label: 'Imports', to: '/imports', icon: IconUpload },
  { label: 'Identity review', to: '/identity-review', icon: IconShieldCheck },
  { label: 'Saved views', to: '/saved-views', icon: IconBuildingWarehouse },
  { label: 'Report builder', to: '/reports', icon: IconReportSearch },
  { label: 'Export history', to: '/exports', icon: IconFileExport },
  { label: 'Audit history', to: '/audit', icon: IconHistory },
  { label: 'Settings', to: '/settings', icon: IconAdjustments },
  { label: 'Users', to: '/users', icon: IconUsers, adminOnly: true },
];

export function AppShellLayout({ children }: PropsWithChildren) {
  const [opened, setOpened] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <AppShell
      className="vb-shell"
      header={{ height: 64 }}
      navbar={{ width: 248, breakpoint: 'md', collapsed: { mobile: !opened } }}
      padding={0}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={() => setOpened((value) => !value)}
              hiddenFrom="md"
              size="sm"
              aria-label="Toggle navigation"
            />
            <Group gap="sm">
              <IconClipboardList color="#4f46e5" />
              <Title order={2} size="h4">
                VulnBatch
              </Title>
            </Group>
          </Group>
          <Group gap="sm">
            <Avatar size="sm" color="indigo">
              {user?.display_name?.slice(0, 1).toUpperCase()}
            </Avatar>
            <Stack gap={0} visibleFrom="sm">
              <Text size="sm" fw={600}>
                {user?.display_name}
              </Text>
              <Text size="xs" c="dimmed">
                {user?.role.replaceAll('_', ' ')}
              </Text>
            </Stack>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className="vb-navbar" p="md">
        <Group mb="lg" gap="sm">
          <IconFileAnalytics color="#a5b4fc" />
          <Text className="vb-brand" fw={700}>
            Operations
          </Text>
        </Group>
        <AppShell.Section grow component={ScrollArea}>
          {navigation.filter((item) => !item.adminOnly || user?.role === 'administrator').map((item) => (
            <NavLink
              className="vb-nav-link"
              component={RouterNavLink}
              to={item.to}
              key={item.to}
              label={item.label}
              leftSection={<item.icon size={18} />}
              active={item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)}
              onClick={() => setOpened(false)}
            />
          ))}
        </AppShell.Section>
        <Divider color="rgba(255,255,255,.12)" my="md" />
        <Button
          color="gray"
          variant="subtle"
          fullWidth
          leftSection={<IconLogout size={18} />}
          onClick={() => void logout()}
          styles={{ root: { color: '#cbd5e1' } }}
        >
          Sign out
        </Button>
      </AppShell.Navbar>
      <AppShell.Main className="vb-main">
        <main className="vb-page">{children}</main>
      </AppShell.Main>
    </AppShell>
  );
}
