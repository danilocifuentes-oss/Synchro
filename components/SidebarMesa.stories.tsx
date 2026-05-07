import React, { useEffect } from "react";
import { SidebarMesa } from "@/components/SidebarMesa";
import { sampleDisciplines } from "@/components/mockData";
import { useCharacter } from "@/context/CharacterContext";

export default {
  title: "Cronista/SidebarMesa",
  component: SidebarMesa,
};

export const Default = () => {
  const { setIdentity, replaceStatus } = useCharacter();

  useEffect(() => {
    setIdentity({ nombre: "Ariadne", clan: "Toreador", generacion: "9ª" });
    replaceStatus({
      ansia: 2,
      voluntad: { current: 3, max: 5 },
      daño: { current: 1, max: 5 },
      px: 7,
    });
  }, [replaceStatus, setIdentity]);

  return (
    <div style={{ background: "#050505", padding: 20, minHeight: 500 }}>
      <SidebarMesa
        disciplines={sampleDisciplines}
        onEnterNexo={() => console.log("Entrar Nexo")}
        onOpenCodex={() => console.log("Codex V")}
        onLogout={() => console.log("Logout")}
      />
    </div>
  );
};

