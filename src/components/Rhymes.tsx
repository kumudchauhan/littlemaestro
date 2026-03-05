import { useState, useCallback } from "react";
import {
  ensureAudioStarted,
  playPiano,
  RHYMES,
  playRhyme,
  stopRhyme,
} from "../audio/engine";

const RHYME_LIST = Object.entries(RHYMES).map(([id, { name }]) => ({ id, name }));

export default function Rhymes() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState(-1);

  const handleStop = useCallback(() => {
    stopRhyme();
    setPlaying(null);
    setActiveNote(-1);
  }, []);

  const handlePlay = useCallback(
    async (rhymeId: string) => {
      await ensureAudioStarted();
      if (playing === rhymeId) {
        handleStop();
        return;
      }
      if (playing) {
        stopRhyme();
      }
      setPlaying(rhymeId);
      playRhyme(
        rhymeId,
        playPiano,
        (step) => setActiveNote(step),
        () => {
          setPlaying(null);
          setActiveNote(-1);
        }
      );
    },
    [playing, handleStop]
  );

  return (
    <div className="instrument-container">
      <div className="instrument-title">🎼 Rhymes</div>

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
