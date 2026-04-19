import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticleNetwork() {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-500 dark:opacity-100 opacity-40">
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0 pointer-events-none"
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: false } }
          },
          particles: {
            color: { value: "#E63946" },
            links: { color: "#990000", distance: 150, enable: true, opacity: 0.15, width: 1 },
            move: { enable: true, speed: 0.5, direction: "none", random: true, straight: false, outModes: "out" },
            number: { density: { enable: true, area: 800 }, value: 30 },
            opacity: { value: 0.15 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 2 } },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}
