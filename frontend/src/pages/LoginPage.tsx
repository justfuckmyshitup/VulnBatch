import { Alert, Button, Paper, PasswordInput, Stack, Text, TextInput, ThemeIcon, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock } from '@tabler/icons-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const form = useForm({ initialValues: { username: '', password: '' } });

  return (
    <div className="vb-auth">
      <Paper className="vb-card vb-auth-card" p="xl" radius="lg">
        <Stack>
          <ThemeIcon size={52} radius="md" color="indigo">
            <IconLock size={27} />
          </ThemeIcon>
          <Title order={1} size="h2">
            Sign in to VulnBatch
          </Title>
          <Text c="dimmed">Access the persistent host inventory and maintenance-window reports.</Text>
          {error ? <Alert color="red">{error}</Alert> : null}
          <form
            onSubmit={form.onSubmit(async (values) => {
              setError('');
              try {
                await login(values.username, values.password);
                const destination =
                  (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';
                navigate(destination, { replace: true });
              } catch (caught) {
                setError(caught instanceof Error ? caught.message.replace(/^\d+:\s*/, '') : 'Sign-in failed.');
              }
            })}
          >
            <Stack>
              <TextInput
                label="Username"
                autoFocus
                autoComplete="username"
                required
                {...form.getInputProps('username')}
              />
              <PasswordInput
                label="Password"
                autoComplete="current-password"
                required
                {...form.getInputProps('password')}
              />
              <Button type="submit" loading={form.submitting}>
                Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </div>
  );
}
