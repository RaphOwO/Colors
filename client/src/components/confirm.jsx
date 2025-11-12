import React, { useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { X, Check, CircleAlert, TriangleAlert } from "lucide-react";

export function ConfirmBar({
  id,
  iconType = "warning",        
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  iconBgClass = "",
  iconColor = "#000",
  snackScale = 1.2,
  allowEsc = true,
  allowBackdropClick = false,  
  onResolve,                  
}) {
    
  const navColor =
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--nav-color")
          .trim()
          .toLowerCase() || "white"
      : "white";

  const textColor = navColor === "black" ? "white" : "black";

  const icons = useMemo(
    () => ({
      close: <X size={16 * snackScale} />,
      success: <Check size={16 * snackScale} />,
      error: <CircleAlert size={16 * snackScale} />,
      warning: <TriangleAlert size={16 * snackScale} />,
    }),
    [snackScale]
  );

  // keyboard shortcuts
  useEffect(() => {
    if (!allowEsc) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onResolve?.(false);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        onResolve?.(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [allowEsc, onResolve]);

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        display: "flex",
        alignItems: "center",
        gap: `${8 * snackScale}px`,
        padding: `${8 * snackScale}px ${10 * snackScale}px`,
        width: `${440 * snackScale}px`,
        borderRadius: `${8 * snackScale}px`,
        backgroundColor: "var(--nav-color)",
        color: textColor,
        transform: `scale(${snackScale})`,
        transformOrigin: "top center",
        margin: "0 auto",
        zIndex: 100,
        fontSize: `${1 * snackScale}rem`,
        transition: "background-color 0.4s ease",
      }}
    >
      {/* Icon bubble */}
      <div
        className={iconBgClass}
        style={{
          color: iconColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: `${8 * snackScale}px`,
          width: `${28 * snackScale}px`,
          height: `${28 * snackScale}px`,
          flexShrink: 0,
        }}
      >
        {icons[iconType]}
      </div>

      {/* Text */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        <strong style={{ lineHeight: 1.1, userSelect: "none" }}>{title}</strong>
        {message ? (
          <span style={{ opacity: 0.9, userSelect: "none", whiteSpace: "nowrap" }}>
            {message}
          </span>
        ) : null}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: `${8 * snackScale}px` }}>
        <button
          onClick={() => onResolve?.(false)}
          style={{
            background: "transparent",
            color: textColor,
            border: `1px solid ${textColor}33`,
            padding: `${6 * snackScale}px ${10 * snackScale}px`,
            borderRadius: `${6 * snackScale}px`,
            cursor: "pointer",
          }}
        >
          {cancelText}
        </button>
        <button
          autoFocus
          onClick={() => onResolve?.(true)}
          style={{
            background: textColor,
            color: navColor === "black" ? "black" : "white",
            border: "none",
            padding: `${6 * snackScale}px ${10 * snackScale}px`,
            borderRadius: `${6 * snackScale}px`,
            cursor: "pointer",
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}

export function confirmAlert({
  iconType = "warning",
  title = "Are you sure?",
  message = "",
  iconBg = "#FEF08A",      
  iconBgClass = "",
  iconColor = "#92400E",
  snackScale = 1.2,
  allowEsc = true,
  allowBackdropClick = false,
  mountOffsetPx = 40,
} = {}) {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    let appliedClass = iconBgClass;
    let styleEl;
    if (!appliedClass) {
      appliedClass = `confirm-bg-${Math.random().toString(36).slice(2, 8)}`;
      styleEl = document.createElement("style");
      styleEl.textContent = `.${appliedClass}{ background-color:${iconBg}; transition: background-color .4s ease; }`;
      document.head.appendChild(styleEl);
    }

    Object.assign(container.style, {
      position: "fixed",
      top: "-120px",
      left: "50%",
      transform: "translateX(-50%)",
      transition: "top 0.5s ease, opacity 0.5s ease",
      opacity: "0",
      zIndex: 9999,
      pointerEvents: "none",
    });

    const root = createRoot(container);

    const cleanup = () => {
      setTimeout(() => {
        root.unmount();
        container.remove();
        if (styleEl) styleEl.remove();
      }, 500);
    };

    const onResolve = (ok) => {
      container.style.top = "-120px";
      container.style.opacity = "0";
      resolve(ok);
      cleanup();
    };

    root.render(
      <div style={{ pointerEvents: "auto" }}>
        <ConfirmBar
          iconType={iconType}
          title={title}
          message={message}
          iconBgClass={appliedClass}
          iconColor={iconColor}
          snackScale={snackScale}
          allowEsc={allowEsc}
          allowBackdropClick={allowBackdropClick}
          onResolve={onResolve}
        />
      </div>
    );

    // slide down
    requestAnimationFrame(() => {
      container.style.top = `${mountOffsetPx}px`;
      container.style.opacity = "1";
    });
  });
}