import type { Metadata } from 'next';
import LoginForm from '@/components/shell/login-form';
import './login.css';

export const metadata: Metadata = {
  title: 'Sign In · Load Desk',
  description: 'Sign in to your Load Desk workspace.',
};

export default function Login() {
  return <LoginForm />;
}
