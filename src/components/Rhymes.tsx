import { useState, useCallback } from "react";
import {
  ensureAudioStarted,
  playPiano,
  playXylophone,
  playHarmonica,
  playGuitar,
  playSitar,
  playViolin,
  RHYMES,
  playRhyme,
  stopRhyme,
  setRhymeInstrument,
} from "../audio/engine";

const INSTRUMENTS = [
  { id: "piano", label: "🎹", playFn: playPiano },
  { id: "guitar", label: "🎸", playFn: playGuitar },
  { id: "sitar", label: "🪕", playFn: playSitar },
  { id: "violin", label: "🎻", playFn: playViolin },
  { id: "xylo", label: "🌈", playFn: playXylophone },
  { id: "harmonica", label: "🎙️", playFn: playHarmonica },
];

const RHYME_LIST = Object.entries(RHYMES).map(([id, { name }]) => ({ id, name }));

export default function Rhymes() {
  const [selectedInstrument, setSelectedInstrument] = useState("piano");
  const [playing, setPlaying] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState(-1);

  const handlePlay = useCallback(
    async (rhymeId: string) => {
      await ensureAudioStarted();
      if (playing) {
        stopRhyme();
        setPlaying(null);
        setActiveNote(-1);
        return;
      }
      const inst = INSTRUMENTS.find((i) => i.id === selectedInstrument);
      if (!inst) return;
      setPlaying(rhymeId);
      playRhyme(
        rhymeId,
        inst.playFn,
        (step) => setActiveNote(step),
        () => {
          setPlaying(null);
          setActiveNote(-1);
        }
      );
    },
    [playing, selectedInstrument]
  );

  return (
    <div className="instrument-container">
      <div className="instrument-title">🎼 Rhymes</div>

      <div className="rhyme-instrument-picker">
        {INSTRUMENTS.map(({ id, label }) => (
          <button
            key={id}
            className={`rhyme-inst-btn ${selectedInstrument === id ? "rhyme-inst-active" : ""}`}
            onPointerDown={() => {
              setSelectedInstrument(id);
              const inst = INSTRUMENTS.find((item) => item.id === id);
              if (inst) setRhymeInstrument(inst.playFn);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rhyme-list">
        {RHYME_LIST.map(({ id, name }) => (
          <button
            key={id}
            className={`rhyme-btn ${playing === id ? "rhyme-playing" : ""}`}
            onPointerDown={() => handlePlay(id)}
          >
            <span className="rhyme-name">{name}</span>
            {playing === id && (
              <span className="rhyme-note-indicator">
                {activeNote >= 0 ? `♪ ${RHYMES[id].notes[activeNote]?.note || ""}` : ""}
              </span>
            )}
            <span className="rhyme-action">
              {playing === id ? "⏹" : "▶"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
