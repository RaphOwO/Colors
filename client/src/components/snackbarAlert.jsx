import React from "react";
import { createRoot } from "react-dom/client";
import { Snackbar } from "./snackbar.jsx";

export function snackbarAlert({
    iconType = "success",
    message = "Action completed successfully!",
    iconBg = "#f0f0f0",
    iconBgClass = "",
    iconColor = "#000",
    duration = 3000,
    snackScale = 1.2,
}) {
    const container = document.createElement("div");
    document.body.appendChild(container);

    let appliedClass = iconBgClass;

    if (!appliedClass) {
        appliedClass = `snack-bg-${Math.random().toString(36).substr(2, 8)}`;
        const style = document.createElement("style");
        style.textContent = `
            .${appliedClass} {
                background-color: ${iconBg};
                transition: background-color 0.4s ease;
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => style.remove(), duration + 500);
    }

    Object.assign(container.style, {
        position: "fixed",
        top: "-100px",
        left: "50%",
        transform: "translateX(-50%)",
        transition: "top 0.5s ease, opacity 0.5s ease",
        opacity: "0",
        zIndex: 9999,
    });

    const root = createRoot(container);

    root.render(
        <Snackbar
            iconType={iconType}
            message={message}
            iconBgClass={appliedClass}
            iconColor={iconColor}
            canClose={true}
            snackScale={snackScale}
        />
    );

    requestAnimationFrame(() => {
        container.style.top = "40px";
        container.style.opacity = "1";
    });

    setTimeout(() => {
        container.style.top = "-100px";
        container.style.opacity = "0";

        setTimeout(() => {
            root.unmount();
            container.remove();
        }, 500);
    }, duration);
}
