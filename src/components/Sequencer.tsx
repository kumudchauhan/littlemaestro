import { useState, useCallback, useRef, useEffect } from "react";
import {
  ensureAudioStarted,
  playDrum,
  startSequencer,
  stopSequencer,
} from "../audio/engine";

const STEPS = 8;
const ROWS = [
  { type: "kick" as const, emoji: "🥁", color: "#FF6B6B" },
  { type: "snare" as const, emoji: "💥", color: "#FECA57" },
  { type: "hihat" as const, emoji: "🔔", color: "#48DBFB" },
  { type: "tom" as const, emoji: "🪘", color: "#FF9F43" },
];

export default function Sequencer() {
  const [grid, setGrid] = useState<boolean[][]>(
    ROWS.map(() => Array(STEPS).fill(false))
  );
  const [playing, setPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const gridRef = useRef(grid);
  const playingRef = useRef(playing);
  gridRef.current = grid;
  playingRef.current = playing;

  useEffect(() => {
    return () => {
      stopSequencer();
    };
  }, []);

  const toggleCell = useCallback((row: number, col: number) => {
    setGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = !next[row][col];
      return next;
    });
  }, []);

  const handlePlayStop = useCallback(async () => {
    await ensureAudioStarted();
    if (playingRef.current) {
      stopSequencer();
      setPlaying(false);
      setActiveStep(-1);
    } else {
      setPlaying(true);
      startSequencer(120, STEPS, (step) => {
        setActiveStep(step);
        const currentGrid = gridRef.current;
        ROWS.forEach((row, rowIdx) => {
          if (currentGrid[rowIdx][step]) {
            playDrum(row.type);
          }
        });
      });
    }
  }, []);

  return (
    <div className="instrument-container">
      <div className="instrument-title">🎶 Beat Maker</div>
      <div className="sequencer">
        {ROWS.map((row, rowIdx) => (
          <div key={row.type} className="seq-row">
            <span className="seq-label">{row.emoji}</span>
            {Array.from({ length: STEPS }).map((_, colIdx) => (
              <button
                key={colIdx}
                className={`seq-cell ${grid[rowIdx][colIdx] ? "seq-active" : ""} ${activeStep === colIdx ? "seq-current" : ""}`}
                style={{
                  backgroundColor: grid[rowIdx][colIdx] ? row.color : "#2d2d3d",
                  borderColor: activeStep === colIdx ? "#fff" : "transparent",
                }}
                onPointerDown={() => toggleCell(rowIdx, colIdx)}
              />
            ))}
          </div>
        ))}
      </div>
      <button
        className="play-btn"
        style={{ backgroundColor: playing ? "#FF6B6B" : "#1DD1A1" }}
        onPointerDown={handlePlayStop}
      >
        {playing ? "⏹ Stop" : "▶ Play"}
      </button>
    </div>
  );
}
