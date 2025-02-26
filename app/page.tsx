import AuthRedirectComponent from "@/components/common/AuthRedirectComponent";
import GoogleLoginButton from "@/components/common/GoogleLoginButton";

/// ホームページ
export default function HomePage() {
  return (
    <div>
      <AuthRedirectComponent />
      <h1>Welcome to the App</h1>
      <GoogleLoginButton />
    </div>
  );
}
