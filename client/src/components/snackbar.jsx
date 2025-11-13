import { useState, useEffect } from "react";
import { X, Check, CircleAlert, TriangleAlert, AlignJustify } from "lucide-react";

export function Snackbar({
  iconType = "X",
  message,
  id,
  className = "",
  iconBgClass = "",
  iconColor = "#000",
  canClose = true,
  snackScale = 1,
}) {
  const [visible, setVisible] = useState(true);
  const [adjustedScale, setAdjustedScale] = useState(snackScale);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 450) {
        setAdjustedScale(1);
      } else {
        setAdjustedScale(snackScale);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [snackScale]);

  if (!visible) return null;

  const navColor =
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--nav-color")
          .trim()
          .toLowerCase() || "white"
      : "white";

  const textColor = navColor === "black" ? "white" : "black";
  
  const icons = {
    close: <X size={16 * adjustedScale} />,
    success: <Check size={16 * adjustedScale} />,
    error: <CircleAlert size={16 * adjustedScale} />,
    warning: <TriangleAlert size={16 * adjustedScale} />
  };

  return (
    <div
      id={id}
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.5% 0.5%",
        textAlign: "center",
        width: `${300 * adjustedScale}px`,
        borderRadius: `${0.5 * adjustedScale}rem`,
        backgroundColor: "var(--nav-color)",
        color: textColor,
        transform: `scale(${adjustedScale})`,
        transformOrigin: "bottom center",
        margin: "0 auto",
        overflow: "hidden",
        zIndex: 100,
        fontSize: `${1 * adjustedScale}rem`,
        transition: "background-color 0.4s ease",
      }}
    >
      <div
        style={{
          color: iconColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: `${0.5 * adjustedScale}rem`,
          width: `${28 * adjustedScale}px`,
          height: `${28 * adjustedScale}px`,
          flexShrink: 0,
        }}
        className={iconBgClass}
      >
        {icons[iconType]}
      </div>

      <span
        style={{
          color: textColor,
          userSelect: "none",
          flex: 1,
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        {message}
      </span>

      <button
        onClick={() => canClose && setVisible(false)}
        disabled={!canClose}
        style={{
          color: canClose ? "#555" : "#ccc",
          cursor: canClose ? "pointer" : "not-allowed",
          background: "none",
          border: "none",
          width: `${28 * adjustedScale}px`,
          height: `${28 * adjustedScale}px`,
        }}
      >
        <X size={16 * adjustedScale} />
      </button>
    </div>
  );
}

