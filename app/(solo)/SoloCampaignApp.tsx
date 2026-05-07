"use client";
import React, { useState } from "react";
import { NexoWrapper } from "@/components/NexoWrapper";
import SoloCampaignHeader from "@/components/SoloCampaignHeader";
import CharacterStatusPanel from "@/components/CharacterStatusPanel";
import ActionRevealButton from "@/components/ActionRevealButton";
import DiceRollerD10 from "@/components/DiceRollerD10";
import { useCharacter } from "@/context/CharacterContext";
import { IconSkullAnimated } from "@/components/icons/animated";

type ActionItem = {
  id: number;
  label: string;
  consequenceText: string;
  consequence?: Partial<{
    ansia: number;
    voluntad: number;
    daño: number;
    px: number;
  }>;
};

export default function SoloCampaignApp() {
  const { character, applyDelta, replaceStatus } = useCharacter();

  const [sceneIndex, setSceneIndex] = useState(0);
  const scenes = [
    {
      title: "Capítulo I — Noche de los Susurros",
      content:
        "Te despiertas en un apartamento frío. La ciudad respira a través de las rendijas del concreto. Una llamada anónima te convoca al Nexo.",
      echoes: ["Ecos: un mensaje sin remitente", "Ambiente: lluvia ácida"],
    },
    {
      title: "Capítulo II — La Marca",
      content:
        "En el pasillo, una figura encapuchada deja una marca roja en la puerta. Sientes algo latir bajo la piel.",
      echoes: ["Ecos: olor a ozono", "Ambiente: sirenas lejanas"],
    },
  ];

  const [revealedConsequence, setRevealedConsequence] = useState<string | null>(null);
  const [showDeath, setShowDeath] = useState(false);

  const actions: ActionItem[] = [
    {
      id: 1,
      label: "Investigar la marca",
      consequenceText: "Encuentras un sigilo oculto. +1 PX",
      consequence: { px: 1 },
    },
    {
      id: 2,
      label: "Ignorar y seguir",
      consequenceText: "Pierdes pista crucial. -1 PX, +1 Ansia",
      consequence: { px: -1, ansia: 1 },
    },
    {
      id: 3,
      label: "Contactar al Nexo",
      consequenceText: "Recibes una clave parcial. -1 Voluntad",
      consequence: { voluntad: -1 },
    },
  ];

  const handleHoldReveal = (id: number) => {
    const a = actions.find((x) => x.id === id);
    if (!a) return;
    setRevealedConsequence(a.consequenceText);
    applyDelta(a.consequence ?? {}, `Acción ${a.label}`);
  };

  const handlePressSelect = (_id: number) => {
    setRevealedConsequence(null);
  };

  const handleRollResult = (val: number) => {
    const success = val >= 7;
    if (success) {
      applyDelta({ px: 1, ansia: -1 }, `Despertar éxito d10=${val}`);
      setRevealedConsequence(`Éxito en el despertar (d10=${val}). Disciplina despertada. +1 PX, -1 Ansia`);
    } else {
      applyDelta({ ansia: 1 }, `Despertar fallo d10=${val}`);
      setRevealedConsequence(`Fallo en el despertar (d10=${val}). +1 Ansia`);
    }
  };

  const spendVoluntadForAwaken = () => {
    if (character.status.voluntad.current <= 0) {
      setRevealedConsequence("No tienes voluntad suficiente.");
      return;
    }
    applyDelta({ voluntad: -1, px: 1 }, "Gastar 1 voluntad para despertar");
    setRevealedConsequence("Gastaste 1 voluntad: disciplina despertada. +1 PX");
  };

  const handleSceneNext = () => {
    if (sceneIndex < scenes.length - 1) setSceneIndex((i) => i + 1);
    else {
      setRevealedConsequence("Has llegado al final de la campaña.");
    }
  };
  const handleScenePrev = () => {
    if (sceneIndex > 0) setSceneIndex((i) => i - 1);
  };

  if (character.status.daño.current >= character.status.daño.max || showDeath) {
    return (
      <NexoWrapper>
        <div className="flex min-h-screen items-center justify-center">
          <div className="sharp-border-inner rounded-md bg-[var(--panel)] p-8 text-center">
            <h2 className="mb-4 font-grotesk text-2xl text-[var(--crimson)]">Muerte definitiva</h2>
            <p className="mb-6">La noche reclama lo que es suyo. Tu crónica ha terminado.</p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => (window.location.href = "/profileHub")}
                className="rounded bg-[var(--terminal)] px-4 py-2 text-black"
              >
                Volver al Hub
              </button>
              <button
                type="button"
                onClick={() => {
                  replaceStatus({
                    ansia: 0,
                    voluntad: { current: 3, max: 5 },
                    daño: { current: 0, max: 5 },
                    px: character.status.px ?? 0,
                  });
                  setShowDeath(false);
                  setSceneIndex(0);
                  setRevealedConsequence(null);
                }}
                className="rounded border border-[rgba(255,255,255,0.04)] px-4 py-2"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </NexoWrapper>
    );
  }

  const scene = scenes[sceneIndex];

  return (
    <NexoWrapper>
      <div className="mx-auto max-w-5xl">
        <SoloCampaignHeader
          identity={{ nombre: character.identity.nombre, clan: character.identity.clan }}
          status={{ ansia: character.status.ansia, voluntad: character.status.voluntad, daño: character.status.daño }}
          onRoll={handleRollResult}
          onPrev={handleScenePrev}
          onNext={handleSceneNext}
        />

        <main className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="sharp-border-inner rounded-md bg-[var(--panel)] p-6 lg:col-span-2">
            <h3 className="mb-3 font-grotesk text-xl">{scene.title}</h3>
            <article className="prose prose-invert mb-6 text-[16px] leading-relaxed">
              <p>{scene.content}</p>
            </article>

            <div className="mb-4">
              <h4 className="mb-2 text-sm text-[var(--accent-muted)]">Ecos recientes</h4>
              <ul className="list-disc pl-5 text-sm text-[var(--terminal)]">
                {scene.echoes.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-2 text-sm text-[var(--accent-muted)]">Acciones</h4>
              <div className="flex flex-col gap-3">
                {actions.map((a) => (
                  <ActionRevealButton
                    key={a.id}
                    holdMs={900}
                    onPress={() => handlePressSelect(a.id)}
                    onHold={() => handleHoldReveal(a.id)}
                    className="bg-[var(--neon)] text-black"
                    ariaLabel={`Acción ${a.label}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <IconSkullAnimated className="icon icon--neon" />
                      <span>{a.label}</span>
                    </span>
                  </ActionRevealButton>
                ))}

                {revealedConsequence && (
                  <div className="mt-3 rounded bg-[rgba(255,255,255,0.01)] p-3 font-mono text-sm text-[var(--terminal)]">
                    {revealedConsequence}
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-4 lg:col-span-1">
            <CharacterStatusPanel
              compact={false}
              integridad={{ current: character.status.daño.current, max: character.status.daño.max }}
              voluntad={{ current: character.status.voluntad.current, max: character.status.voluntad.max }}
              ansia={character.status.ansia}
            />

            <div className="sharp-border-inner rounded-md bg-[var(--panel)] p-4">
              <h4 className="mb-2 text-sm text-[var(--accent-muted)]">Disciplina — Despertar</h4>
              <p className="mb-3 text-xs text-[var(--accent-muted)]">Elige: tira d10 (&gt;=7 éxito) o gasta 1 voluntad.</p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("inline-roller");
                    if (el) el.style.display = "block";
                  }}
                  className="rounded bg-[var(--neon)] px-3 py-2 text-black"
                >
                  Tirar d10
                </button>

                <button
                  type="button"
                  onClick={spendVoluntadForAwaken}
                  className="rounded border border-[var(--terminal)] px-3 py-2 text-[var(--terminal)]"
                >
                  Gastar 1 voluntad
                </button>
              </div>

              <div id="inline-roller" className="mt-3" style={{ display: "block" }}>
                <DiceRollerD10 onResult={handleRollResult} label="Tirar d10 (Despertar)" />
              </div>

              <div className="mt-3 text-xs text-[var(--accent-muted)]">
                PX: <span className="font-mono text-[var(--terminal)]">{character.status.px ?? 0}</span>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </NexoWrapper>
  );
}

