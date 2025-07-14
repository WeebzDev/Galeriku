import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
        <div className="flex justify-center flex-col items-center pt-4">
          <p>Demo</p>
          <p>Username : dropio</p>
          <p>Password : Password!123</p>
        </div>
      </div>
    </div>
  );
}
