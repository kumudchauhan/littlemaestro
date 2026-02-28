import { useCallback, useState, useRef } from "react";
import { ensureAudioStarted, playViolin } from "../audio/engine";

const STRINGS = [
  { note: "G3", label: "G", thickness: 4, color: "#C4922A" },
  { note: "D4", label: "D", thickness: 3.2, color: "#C4922A" },
  { note: "A4", label: "A", thickness: 2.4, color: "#D4D4D4" },
  { note: "E5", label: "E", thickness: 1.8, color: "#D4D4D4" },
];

export default function Violin() {
  const [plucked, setPlucked] = useState<Set<string>>(new Set());
  const strummingRef = useRef(false);
  const playedRef = useRef<Set<string>>(new Set());

  const triggerNote = useCallback(async (note: string) => {
    if (playedRef.current.has(note)) return;
    playedRef.current.add(note);
    await ensureAudioStarted();
    playViolin(note);
    setPlucked((prev) => new Set(prev).add(note));
    setTimeout(() => {
      setPlucked((prev) => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
    }, 800);
  }, []);

  const handlePointerDown = useCallback(
    (note: string) => {
      strummingRef.current = true;
      playedRef.current = new Set();
      triggerNote(note);
    },
    [triggerNote]
  );

  const handlePointerEnter = useCallback(
    (note: string) => {
      if (strummingRef.current) {
        triggerNote(note);
      }
    },
    [triggerNote]
  );

  const handlePointerUp = useCallback(() => {
    strummingRef.current = false;
    playedRef.current = new Set();
  }, []);

  return (
    <div className="instrument-container" onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      <div className="instrument-title">🎻 Violin</div>
      <div className="violin-realistic">
        <div className="violin-body">
          <div className="violin-bout-upper" />
          <div className="violin-waist" />
          <div className="violin-bout-lower" />
          <div className="violin-f-hole left">𝑓</div>
          <div className="violin-f-hole right">𝑓</div>
          <div className="violin-tailpiece" />
          <div className="violin-chinrest" />
          <div className="violin-neck">
            <div className="violin-fingerboard" />
            {[1, 2, 3, 4, 5].map((f) => (
              <div key={f} className="violin-position-dot" style={{ top: `${15 + f * 14}%` }} />
            ))}
          </div>
          <div className="violin-scroll" />
          <div className="violin-bridge" />
          <div className="violin-touch-lanes">
            {STRINGS.map(({ note, label, thickness, color }) => (
              <div
                key={note}
                className={`violin-touch-lane ${plucked.has(note) ? "violin-lane-plucked" : ""}`}
                onPointerDown={() => handlePointerDown(note)}
                onPointerEnter={() => handlePointerEnter(note)}
                style={{ touchAction: "none" }}
              >
                <div
                  className={`violin-string ${plucked.has(note) ? "violin-string-vibrate" : ""}`}
                  style={{ width: `${thickness}px`, background: color }}
                />
                <span className="violin-note-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
