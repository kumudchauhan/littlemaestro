import { useCallback, useState } from "react";
import { ensureAudioStarted, playDrum } from "../audio/engine";

const PADS = [
  { type: "hihat" as const, label: "Hi-Hat", color: "#C9A84C" },
  { type: "tom" as const, label: "Tom", color: "#4A90D9" },
  { type: "snare" as const, label: "Snare", color: "#E8E8E8" },
  { type: "kick" as const, label: "Kick", color: "#555555" },
];

export default function Drums() {
  const [hits, setHits] = useState<Record<string, number>>({});

  const handlePlay = useCallback(async (type: "kick" | "snare" | "hihat" | "tom") => {
    await ensureAudioStarted();
    playDrum(type);
    const id = Date.now();
    setHits((prev) => ({ ...prev, [type]: id }));
    setTimeout(() => {
      setHits((prev) => (prev[type] === id ? { ...prev, [type]: 0 } : prev));
    }, 300);
  }, []);

  return (
    <div className="instrument-container">
      <div className="instrument-title">🥁 Drums</div>
      <div className="drum-grid">
        {PADS.map(({ type, label, color }) => (
          <button
            key={type}
            className={`drum-grid-pad ${hits[type] ? "drum-flash" : ""}`}
            style={{
              background: `radial-gradient(circle at 40% 35%, ${color}, ${color}cc, ${color}88)`,
            }}
            onPointerDown={() => handlePlay(type)}
          >
            {hits[type] ? (
              <>
                <div className="drum-ripple" />
                <div className="drum-ripple delay" />
              </>
            ) : null}
            <div className="drum-rim" />
            <span className="drum-grid-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
