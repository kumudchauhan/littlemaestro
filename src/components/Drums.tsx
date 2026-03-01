import { useCallback, useState } from "react";
import { ensureAudioStarted, playDrum } from "../audio/engine";

const PADS = [
  { type: "hihat" as const, label: "Hi-Hat", size: "small", kind: "cymbal" },
  { type: "snare" as const, label: "Snare", size: "medium", kind: "drum", shellColor: "#E0E0E0", shellDark: "#B0B0B0" },
  { type: "tom" as const, label: "Tom", size: "medium", kind: "drum", shellColor: "#4A90D9", shellDark: "#2A60A0" },
  { type: "kick" as const, label: "Kick", size: "large", kind: "drum", shellColor: "#C0392B", shellDark: "#8B1A1A" },
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
      <div className="drum-row">
        {PADS.map((pad) => (
          <button
            key={pad.type}
            className={`drum-piece drum-${pad.size} ${hits[pad.type] ? "drum-hit" : ""}`}
            onPointerDown={() => handlePlay(pad.type)}
          >
            {pad.kind === "cymbal" ? (
              <div className="cymbal">
                <div className="cymbal-disc" />
                <div className="cymbal-bell" />
                <div className="cymbal-stand" />
              </div>
            ) : (
              <div className="real-drum">
                <div className="drum-skin">
                  <div className="drum-skin-ring" />
                </div>
                <div
                  className="drum-shell"
                  style={{
                    background: `linear-gradient(180deg, ${pad.shellColor}, ${pad.shellDark})`,
                  }}
                >
                  <div className="drum-lug" style={{ left: "15%" }} />
                  <div className="drum-lug" style={{ left: "45%" }} />
                  <div className="drum-lug" style={{ left: "75%" }} />
                </div>
              </div>
            )}
            <span className="drum-label">{pad.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
