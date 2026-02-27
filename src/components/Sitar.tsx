import { useCallback, useState, useRef } from "react";
import { ensureAudioStarted, playSitar } from "../audio/engine";

const STRINGS = [
  { note: "B4", label: "Ni" },
  { note: "A4", label: "Dha" },
  { note: "G4", label: "Pa" },
  { note: "F4", label: "Ma" },
  { note: "E4", label: "Ga" },
  { note: "D4", label: "Re" },
  { note: "C4", label: "Sa" },
];

export default function Sitar() {
  const [plucked, setPlucked] = useState<Set<string>>(new Set());
  const strummingRef = useRef(false);
  const playedRef = useRef<Set<string>>(new Set());

  const triggerNote = useCallback(async (note: string) => {
    if (playedRef.current.has(note)) return;
    playedRef.current.add(note);
    await ensureAudioStarted();
    playSitar(note);
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
      <div className="instrument-title">🪕 Sitar</div>
      <div className="sitar-realistic">
        <div className="sitar-wood-body">
          <div className="sitar-neck-wood">
            <div className="sitar-neck-edge left" />
            <div className="sitar-neck-edge right" />
            <div className="sitar-neck-inlay" />
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((f) => (
              <div
                key={f}
                className="sitar-curved-fret"
                style={{ top: `${5 + f * 6.5}%` }}
              />
            ))}
          </div>
          <div className="sitar-tumba-gourd">
            <div className="sitar-tumba-shine" />
            <div className="sitar-tumba-pattern" />
          </div>
          <div className="sitar-jawari" />
          <div className="sitar-touch-lanes">
            {STRINGS.map(({ note, label }, i) => (
              <div
                key={note}
                className={`sitar-touch-lane ${plucked.has(note) ? "sitar-lane-plucked" : ""}`}
                onPointerDown={() => handlePointerDown(note)}
                onPointerEnter={() => handlePointerEnter(note)}
                style={{ touchAction: "none" }}
              >
                <div
                  className={`sitar-string-wire ${plucked.has(note) ? "sitar-string-vibrate" : ""}`}
                  style={{ width: `${3 - i * 0.2}px` }}
                />
                <span className="sitar-note-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
