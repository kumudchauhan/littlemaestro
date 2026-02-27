import { useCallback, useState } from "react";
import { ensureAudioStarted, playXylophone } from "../audio/engine";

const BARS = [
  { note: "C5", color: "#FF0000", width: 100 },
  { note: "D5", color: "#FF7700", width: 93 },
  { note: "E5", color: "#FFDD00", width: 86 },
  { note: "F5", color: "#00CC00", width: 79 },
  { note: "G5", color: "#0088FF", width: 72 },
  { note: "A5", color: "#5500FF", width: 65 },
  { note: "B5", color: "#AA00FF", width: 58 },
  { note: "C6", color: "#FF00AA", width: 51 },
];

export default function Xylophone() {
  const [activeBar, setActiveBar] = useState<string | null>(null);

  const handlePlay = useCallback(async (note: string) => {
    await ensureAudioStarted();
    playXylophone(note);
    setActiveBar(note);
    setTimeout(() => setActiveBar(null), 200);
  }, []);

  return (
    <div className="instrument-container">
      <div className="instrument-title">🎵 Xylophone</div>
      <div className="xylo-fullscreen">
        {BARS.map(({ note, color, width }) => (
          <button
            key={note}
            className={`xylo-full-bar ${activeBar === note ? "xylo-hit" : ""}`}
            style={{ backgroundColor: color, width: `${width}%`, alignSelf: "center" }}
            onPointerDown={() => handlePlay(note)}
          >
            <div className="xylo-bar-shine" />
            <div className="xylo-bar-screw left" />
            <div className="xylo-bar-screw right" />
          </button>
        ))}
      </div>
    </div>
  );
}
