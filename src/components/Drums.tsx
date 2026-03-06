import { useCallback, useState } from "react";
import { ensureAudioStarted, playDrum } from "../audio/engine";

const PADS = [
  { type: "hihat" as const, icon: "🥊", label: "Hi-Hat", color: "#F5D033", hitColor: "#FFE566" },
  { type: "snare" as const, icon: "🪘", label: "Snare", color: "#E0E0E0", hitColor: "#FFFFFF" },
  { type: "tom" as const, icon: "🥁", label: "Tom", color: "#4A90D9", hitColor: "#6BB0F0" },
  { type: "kick" as const, icon: "💥", label: "Kick", color: "#C0392B", hitColor: "#E74C3C" },
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
      <div className="drum-grid">
        {PADS.map((pad) => (
          <button
            key={pad.type}
            className={`drum-pad ${hits[pad.type] ? "drum-hit" : ""}`}
            style={{
              background: hits[pad.type]
                ? `radial-gradient(circle, ${pad.hitColor}, ${pad.color})`
                : `radial-gradient(circle at 35% 35%, ${pad.color}, ${pad.color}dd)`,
              boxShadow: hits[pad.type]
                ? `0 0 20px ${pad.color}88, inset 0 2px 4px rgba(255,255,255,0.3)`
                : `0 4px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2)`,
            }}
            onPointerDown={() => handlePlay(pad.type)}
          >
            <span className="drum-pad-icon">{pad.icon}</span>
            <span className="drum-pad-label">{pad.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
