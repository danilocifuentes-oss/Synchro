"use client";

import { useRouter } from "next/navigation";
import { SchreckNetLogin } from "@/components/SchreckNetLogin";
import { phaseToHref, writeAuthRole } from "@/lib/schreckNavigation";

export default function SignInPage() {
  const router = useRouter();

  const applyPlayerLogin = () => {
    // El shell principal usa esta bandera en sessionStorage para abrir HUB/Nexo.
    writeAuthRole("player");
    router.push(phaseToHref("profileHub"));
  };

  return (
    <SchreckNetLogin
      onAuthenticate={applyPlayerLogin}
      onRootAccess={applyPlayerLogin}
    />
  );
}

