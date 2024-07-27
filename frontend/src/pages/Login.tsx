import LoginForm from '@/components/Form.tsx';

function Login() {
  return (
    <>
      <h1>Login</h1>
      <LoginForm route={'/token/'} />;
    </>
  );
}

export default Login;
