import { useState, useRef, useCallback } from "react";
import { ensureAudioStarted, startRecording, stopRecording } from "../audio/engine";

export default function Recorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleToggle = useCallback(async () => {
    await ensureAudioStarted();
    if (recording) {
      const blob = await stopRecording();
      setRecording(false);
      if (blob) {
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      }
    } else {
      setAudioUrl(null);
      await startRecording();
      setRecording(true);
    }
  }, [recording]);

  const handlePlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  return (
    <div className="recorder-bar">
      <button
        className="record-btn"
        style={{ backgroundColor: recording ? "#FF6B6B" : "#1DD1A1" }}
        onPointerDown={handleToggle}
      >
        {recording ? "⏹ Stop Recording" : "⏺ Record"}
      </button>
      {audioUrl && (
        <>
          <button className="playback-btn" onPointerDown={handlePlayback}>
            ▶ Play Recording
          </button>
          <audio ref={audioRef} src={audioUrl} />
        </>
      )}
    </div>
  );
}
