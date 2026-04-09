import { useCallback, useState } from "react";
import { ensureAudioStarted, playTabla } from "../audio/engine";

type Bol = "na" | "tin" | "tun" | "ge" | "dha" | "ti";

export default function Tabla() {
  const [hits, setHits] = useState<Record<string, number>>({});

  const handlePlay = useCallback(async (type: Bol, e?: React.PointerEvent) => {
    e?.stopPropagation();
    await ensureAudioStarted();
    playTabla(type);
    const id = Date.now();
    setHits((prev) => ({ ...prev, [type]: id }));
    setTimeout(() => {
      setHits((prev) => (prev[type] === id ? { ...prev, [type]: 0 } : prev));
    }, 300);
  }, []);

  return (
    <div className="instrument-container">
      <div className="instrument-title">🪘 Tabla</div>
      <div className="tabla-layout">
        <div className="tabla-drums-row">
          {/* Bayan (left, larger bass drum) */}
          <div
            className={`tabla-drum tabla-bayan ${hits["dha"] ? "tabla-drum-flash" : ""}`}
            onPointerDown={(e) => handlePlay("dha", e)}
          >
            <div className="tabla-drum-rim" />
            <div className="tabla-skin-texture" />
            <span className="tabla-skin-label">Dha</span>
            <div
              className={`tabla-syahi tabla-bayan-syahi ${hits["ge"] ? "tabla-syahi-flash" : ""}`}
              onPointerDown={(e) => handlePlay("ge", e)}
            >
              {hits["ge"] ? <div className="tabla-hit-ring" /> : null}
              <span className="tabla-syahi-label">Ge</span>
            </div>
            {hits["dha"] ? <div className="tabla-hit-ring tabla-hit-ring-outer" /> : null}
          </div>

          {/* Dayan (right, smaller treble drum) */}
          <div
            className={`tabla-drum tabla-dayan ${hits["tin"] ? "tabla-drum-flash" : ""}`}
            onPointerDown={(e) => handlePlay("tin", e)}
          >
            <div className="tabla-drum-rim" />
            <div className="tabla-skin-texture" />
            <span className="tabla-skin-label">Tin</span>
            <div
              className={`tabla-syahi tabla-dayan-syahi ${hits["na"] ? "tabla-syahi-flash" : ""}`}
              onPointerDown={(e) => handlePlay("na", e)}
            >
              {hits["na"] ? <div className="tabla-hit-ring" /> : null}
              <span className="tabla-syahi-label">Na</span>
            </div>
            {hits["tin"] ? <div className="tabla-hit-ring tabla-hit-ring-outer" /> : null}
          </div>
        </div>

        {/* Extra bol pads */}
        <div className="tabla-extra-row">
          <button
            className={`tabla-extra-pad ${hits["tun"] ? "tabla-extra-flash" : ""}`}
            onPointerDown={() => handlePlay("tun")}
          >
            Tun
          </button>
          <button
            className={`tabla-extra-pad ${hits["ti"] ? "tabla-extra-flash" : ""}`}
            onPointerDown={() => handlePlay("ti")}
          >
            Ti
          </button>
        </div>
      </div>
    </div>
  );
}
