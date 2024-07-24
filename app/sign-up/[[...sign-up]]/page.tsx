import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <SignUp forceRedirectUrl={"/new-user"} />
    </div>
  );
}
