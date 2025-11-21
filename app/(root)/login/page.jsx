import LoginForm from "@/components/pages/login/login-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Вход в систему EAST LINE TELEKOM",
  description: "Авторизация для менеджеров и администраторов EAST LINE TELEKOM.",
  path: "/login",
  robots: {
    index: false,
    follow: false,
  },
});

export default function LoginPage() {
  return <LoginForm />;
}
