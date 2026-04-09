import { useState, useCallback, useEffect } from "react";
import {
  ensureAudioStarted,
  playPiano,
  RHYMES,
  playRhyme,
  stopRhyme,
  setRhymeInstrument,
} from "../audio/engine";

const RHYME_LIST = Object.entries(RHYMES).map(([id, { name }]) => ({ id, name }));

interface RhymesProps {
  playFn?: (note: string) => void;
  instrumentEmoji?: string;
}

export default function Rhymes({ playFn = playPiano, instrumentEmoji = "🎹" }: RhymesProps) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState(-1);

  // Update the engine's play function when instrument changes (even mid-playback)
  useEffect(() => {
    setRhymeInstrument(playFn);
  }, [playFn]);

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
        playFn,
        (step) => setActiveNote(step),
        () => {
          setPlaying(null);
          setActiveNote(-1);
        }
      );
    },
    [playing, handleStop, playFn]
  );

  return (
    <div className="instrument-container">
      <div className="instrument-title">{instrumentEmoji} Rhymes</div>

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
