import { useCallback } from "react";
import { ensureAudioStarted, playPiano } from "../audio/engine";

const WHITE_KEYS = [
  { note: "C4", label: "C" },
  { note: "D4", label: "D" },
  { note: "E4", label: "E" },
  { note: "F4", label: "F" },
  { note: "G4", label: "G" },
  { note: "A4", label: "A" },
  { note: "B4", label: "B" },
  { note: "C5", label: "C" },
];

const BLACK_KEYS = [
  { note: "C#4", left: "calc(12.5% * 1 - 3.5%)" },
  { note: "D#4", left: "calc(12.5% * 2 - 3.5%)" },
  null,
  { note: "F#4", left: "calc(12.5% * 4 - 3.5%)" },
  { note: "G#4", left: "calc(12.5% * 5 - 3.5%)" },
  { note: "A#4", left: "calc(12.5% * 6 - 3.5%)" },
  null,
];

export default function Piano() {
  const handlePlay = useCallback(async (note: string) => {
    await ensureAudioStarted();
    playPiano(note);
  }, []);

  return (
    <div className="instrument-container">
      <div className="instrument-title">🎹 Piano</div>
      <div className="piano-realistic">
        <div className="piano-body">
          <div className="piano-keys-container">
            {WHITE_KEYS.map(({ note }) => (
              <button
                key={note}
                className="white-key"
                onPointerDown={() => handlePlay(note)}
              />
            ))}
            {BLACK_KEYS.map((key, i) =>
              key ? (
                <button
                  key={key.note}
                  className="black-key"
                  style={{ left: key.left }}
                  onPointerDown={() => handlePlay(key.note)}
                />
              ) : (
                <span key={`gap-${i}`} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
