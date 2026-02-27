import { useCallback, useState } from "react";
import { ensureAudioStarted, playGuitar } from "../audio/engine";

const STRINGS = [
  { note: "E3", label: "E", thickness: 5, color: "#C4922A" },
  { note: "A3", label: "A", thickness: 4.5, color: "#C4922A" },
  { note: "D4", label: "D", thickness: 4, color: "#C4922A" },
  { note: "G4", label: "G", thickness: 3, color: "#D4D4D4" },
  { note: "B4", label: "B", thickness: 2.5, color: "#D4D4D4" },
  { note: "E5", label: "e", thickness: 2, color: "#D4D4D4" },
];

export default function Guitar() {
  const [plucked, setPlucked] = useState<string | null>(null);

  const handlePlay = useCallback(async (note: string) => {
    await ensureAudioStarted();
    playGuitar(note);
    setPlucked(note);
    setTimeout(() => setPlucked(null), 600);
  }, []);

  return (
    <div className="instrument-container">
      <div className="instrument-title">🎸 Guitar</div>
      <div className="guitar-realistic">
        <div className="guitar-wood-body">
          <div className="guitar-wood-grain" />
          <div className="guitar-wood-grain g2" />
          <div className="guitar-wood-grain g3" />
          <div className="guitar-neck-piece">
            <div className="guitar-nut" />
            {[1, 2, 3, 4, 5, 6, 7].map((f) => (
              <div key={f} className="guitar-fret" />
            ))}
            <div className="guitar-fret-dot dot3" />
            <div className="guitar-fret-dot dot5" />
            <div className="guitar-fret-dot dot7" />
          </div>
          <div className="guitar-soundhole-area">
            <div className="guitar-rosette">
              <div className="guitar-rosette-inner" />
              <div className="guitar-hole" />
            </div>
          </div>
          <div className="guitar-bridge" />
          <div className="guitar-bridge-saddle" />
          <div className="guitar-pickguard" />
          <div className="guitar-touch-lanes">
            {STRINGS.map(({ note, label, thickness, color }) => (
              <button
                key={note}
                className={`guitar-touch-lane ${plucked === note ? "guitar-lane-plucked" : ""}`}
                onPointerDown={() => handlePlay(note)}
              >
                <div
                  className={`guitar-string ${plucked === note ? "guitar-string-vibrate" : ""}`}
                  style={{ width: `${thickness}px`, background: color }}
                />
                <span className="guitar-note-label">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
