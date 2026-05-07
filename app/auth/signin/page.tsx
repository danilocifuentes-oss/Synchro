"use client";

import { useRouter } from "next/navigation";
import { SchreckNetLogin } from "@/components/SchreckNetLogin";

export default function SignInPage() {
  const router = useRouter();
  return (
    <SchreckNetLogin
      onAuthenticate={() => router.push("/")}
      onRootAccess={() => router.push("/")}
    />
  );
}

