import { SignIn } from "@clerk/remix";

export default function SignInPage() {
  return (
    <div className="container">
      <SignIn />
    </div>
  );
}
