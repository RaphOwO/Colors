import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Ellipse,
  Text,
  Line,
  Transformer,
} from "react-konva";
import "../styles/Canvas.css";

function useContainerSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setSize({ width: cr.width, height: cr.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

const deepClone = (x) => JSON.parse(JSON.stringify(x));
const HISTORY_LIMIT = 100;

/* ---------- Shape ---------- */
const Shape = ({
  shape,
  isSelected,
  isEditingText,
  onSelect,
  onChange,
  onRightClick,
  onStartTextEdit,
}) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && !shape.locked && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, shape.locked]);

  const handleRightClick = (e) => {
    e.evt.preventDefault();
    e.cancelBubble = true;
    onRightClick(shape, e);
  };

  const handlePointerDown = (e) => {
    if (e.evt.button === 0) onSelect();
  };

  const commonProps = {
    id: shape.id,
    draggable: !shape.locked,
    listening: true,
    onMouseDown: handlePointerDown,
    onTap: onSelect,
    onContextMenu: handleRightClick,
    onDragEnd: (e) => {
      onChange({ ...shape, x: e.target.x(), y: e.target.y() });
    },
    onTransformEnd: () => {
      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);
      onChange({
        ...shape,
        x: node.x(),
        y: node.y(),
        width: Math.max(5, shape.width * scaleX),
        height: Math.max(5, shape.height * scaleY),
      });
    },
    opacity: shape.opacity ?? 1,
  };

  return (
    <>
      {shape.type === "rect" && (
        <Rect ref={shapeRef} {...shape} {...commonProps} width={shape.width} height={shape.height} />
      )}

      {shape.type === "circle" && (
        <Ellipse
          ref={shapeRef}
          {...shape}
          {...commonProps}
          radiusX={shape.width / 2}
          radiusY={shape.height / 2}
        />
      )}

      {shape.type === "triangle" && (
        <Line
          ref={shapeRef}
          x={shape.x}
          y={shape.y}
          points={[shape.width / 2, 0, 0, shape.height, shape.width, shape.height]}
          closed
          fill={shape.fill}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
          {...commonProps}
        />
      )}

      {shape.type === "text" && (
        <Text
          ref={shapeRef}
          {...shape}
          {...commonProps}
          text={shape.text}
          fontSize={shape.fontSize}
          fill={shape.fill}
          letterSpacing={shape.letterSpacing ?? 0}
          lineHeight={shape.lineHeight ?? 1}
          align={shape.align ?? "left"}
          padding={shape.padding ?? 0}
          fontFamily={shape.fontFamily ?? 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif'}
          fontStyle={shape.fontStyle ?? "normal"}
          draggable={!shape.locked && !isEditingText}
          listening={!isEditingText}
          opacity={isEditingText ? 0.2 : (shape.opacity ?? 1)}
          onDblClick={(e) => onStartTextEdit(shape, e.target)}
          onDblTap={(e) => onStartTextEdit(shape, e.target)}
        />
      )}

      {isSelected && !shape.locked && !isEditingText && (
        <Transformer ref={trRef} rotateEnabled={true} />
      )}
    </>
  );
};

/* ---------- Main Canvas ---------- */
export default function Canvas() {
  const [shapes, _setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Inline text editor state
  // id, x, y, width, height, rotation, padding, lineHeight, letterSpacing, value, fontSize, color, align, fontFamily, fontWeight, fontStyle, offsetX, offsetY
  const [editor, setEditor] = useState(null);

  const surfaceRef = useRef(null);
  const stageRef = useRef(null);
  const { width: surfaceW, height: surfaceH } = useContainerSize(surfaceRef);

  /* ---- HISTORY: undo/redo stacks ---- */
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const isApplyingHistory = useRef(false);

  const pushUndo = (prevShapes) => {
    if (isApplyingHistory.current) return;
    const snap = deepClone(prevShapes);
    const stack = undoStackRef.current;
    if (stack.length) {
      const last = JSON.stringify(stack[stack.length - 1]);
      const curr = JSON.stringify(snap);
      if (last === curr) return;
    }
    stack.push(snap);
    if (stack.length > HISTORY_LIMIT) stack.shift();
    redoStackRef.current = [];
  };

  const performSetShapes = (producer) => {
    _setShapes((prev) => {
      const next = typeof producer === "function" ? producer(prev) : producer;
      if (!isApplyingHistory.current && next !== prev) {
        pushUndo(prev);
      }
      return next;
    });
  };

  const undo = () => {
    const stack = undoStackRef.current;
    if (!stack.length) return;
    const prevSnap = stack.pop();
    isApplyingHistory.current = true;
    _setShapes((prev) => {
      redoStackRef.current.push(deepClone(prev));
      return prevSnap;
    });
    setTimeout(() => { isApplyingHistory.current = false; }, 0);
  };

  const redo = () => {
    const stack = redoStackRef.current;
    if (!stack.length) return;
    const nextSnap = stack.pop();
    isApplyingHistory.current = true;
    _setShapes((prev) => {
      undoStackRef.current.push(deepClone(prev));
      return nextSnap;
    });
    setTimeout(() => { isApplyingHistory.current = false; }, 0);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const inText =
        e.target &&
        (e.target.tagName === "TEXTAREA" ||
          e.target.tagName === "INPUT" ||
          e.target.isContentEditable);
      if (inText) return;
      const meta = e.metaKey || e.ctrlKey;
      if (!meta) return;
      const key = e.key.toLowerCase();
      if (key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---- AUTOSAVE ---- */
  useEffect(() => {
    const autosaved = localStorage.getItem("design_autosave");
    if (autosaved) {
      try {
        _setShapes(JSON.parse(autosaved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("design_autosave", JSON.stringify(shapes));
  }, [shapes]);

  /* ---------- Text edit helpers (Canva-like in-place) ---------- */

  // Recalculate textarea placement to exactly match the Konva Text
  const openTextEditorForNode = (shape, textNode) => {
    const stage = stageRef.current;
    if (!stage || !textNode) return;

    const stageBox = stage.container().getBoundingClientRect();
    // Absolute (global) position of the text node
    const absPos = textNode.getAbsolutePosition();
    const rotation = textNode.rotation();
    const offsetX = textNode.offsetX() || 0;
    const offsetY = textNode.offsetY() || 0;

    // Use node's width/height (before rotation) to match text wrapping precisely
    const nodeWidth = textNode.width();
    const nodeHeight = textNode.height();

    // Note: If you add stage scale/position later, add them here.
    const left = stageBox.left + absPos.x;
    const top = stageBox.top + absPos.y;

    const fontSize = shape.fontSize ?? 22;
    const fontFamily = shape.fontFamily ?? 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    const fontStyle = (shape.fontStyle ?? "normal").toLowerCase();
    const isBold = fontStyle.includes("bold");
    const isItalic = fontStyle.includes("italic");

    setEditor({
      id: shape.id,
      x: left,
      y: top,
      width: nodeWidth,
      height: nodeHeight,
      rotation,
      offsetX,
      offsetY,
      padding: shape.padding ?? 0,
      lineHeight: shape.lineHeight ?? 1,
      letterSpacing: shape.letterSpacing ?? 0,
      align: shape.align ?? "left",
      fontSize,
      color: shape.fill ?? "#111",
      value: shape.text ?? "",
      fontFamily,
      fontWeight: isBold ? 700 : 400,
      fontStyle: isItalic ? "italic" : "normal",
    });

    // Auto-grow shortly after mount
    requestAnimationFrame(() => {
      const ta = document.querySelector("textarea.konva-textarea");
      if (ta) {
        ta.style.height = "auto";
        ta.style.height = ta.scrollHeight + "px";
      }
    });
  };

  const commitTextEdit = () => {
    if (!editor) return;
    const s = shapes.find((x) => x.id === editor.id);
    if (s) {
      performSetShapes((prev) =>
        prev.map((x) =>
          x.id === editor.id
            ? {
                ...x,
                text: editor.value,
                fontSize: editor.fontSize,
                fill: editor.color,
                width: editor.width,
                letterSpacing: editor.letterSpacing,
                lineHeight: editor.lineHeight,
                align: editor.align,
                padding: editor.padding,
                fontFamily: editor.fontFamily,
                fontStyle: `${editor.fontWeight >= 600 ? "bold " : ""}${editor.fontStyle === "italic" ? "italic" : "normal"}`
              }
            : x
        )
      );
    }
    setEditor(null);
  };

  // Live preview without polluting history
  const liveUpdateText = (id, textValue) => {
    isApplyingHistory.current = true;
    _setShapes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text: textValue } : s))
    );
    isApplyingHistory.current = false;
  };

  const cancelTextEdit = () => setEditor(null);

  /* ---------- Stage handlers ---------- */

  const deselectStage = (e) => {
    // only left-click on empty stage deselects
    if (e.target === e.target.getStage() && e.evt.button === 0) {
      if (editor) commitTextEdit(); // commit BEFORE closing editor
      setSelectedId(null);
      setContextMenu(null);
    }
  };

  const addShape = (type) => {
    const base = {
      id: Date.now().toString(),
      type,
      x: 150 + Math.random() * 300,
      y: 100 + Math.random() * 250,
      width: 240,
      height: 90,
      fill: "#111",
      stroke: "#000",
      strokeWidth: 1,
      opacity: 1,
      locked: false,
      // Text defaults (so editor matches perfectly)
      fontSize: 22,
      text: "Double-click to edit",
      letterSpacing: 0,
      lineHeight: 1.2,
      align: "left",
      padding: 0,
      fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      fontStyle: "normal",
    };
    const preset =
      type === "circle"
        ? { width: 120, height: 120 }
        : type === "rect"
        ? { width: 160, height: 100 }
        : type === "triangle"
        ? { width: 120, height: 100 }
        : {};
    performSetShapes((prev) => [...prev, { ...base, ...preset, type }]);
  };

  const updateShape = (id, newAttrs) => {
    performSetShapes((prev) => prev.map((s) => (s.id === id ? newAttrs : s)));
  };

  const deleteShape = (id) => {
    performSetShapes((prev) => prev.filter((s) => s.id !== id));
    setContextMenu(null);
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateShape = (id) => {
    performSetShapes((prev) => {
      const s = prev.find((x) => x.id === id);
      if (!s) return prev;
      const copy = { ...s, id: Date.now().toString(), x: s.x + 20, y: s.y + 20 };
      return [...prev, copy];
    });
    setContextMenu(null);
  };

  const bringToFront = (id) => {
    performSetShapes((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const arr = [...prev];
      const [item] = arr.splice(idx, 1);
      arr.push(item);
      return arr;
    });
    setContextMenu(null);
  };

  const sendToBack = (id) => {
    performSetShapes((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const arr = [...prev];
      const [item] = arr.splice(idx, 1);
      arr.unshift(item);
      return arr;
    });
    setContextMenu(null);
  };

  const toggleLock = (id) => {
    performSetShapes((prev) => prev.map((s) => (s.id === id ? { ...s, locked: !s.locked } : s)));
  };

  const saveSnapshot = () => {
    localStorage.setItem("design_backup", JSON.stringify(shapes));
    alert("✅ Saved snapshot!");
  };

  const loadSnapshot = () => {
    const saved = localStorage.getItem("design_backup");
    if (saved) {
      if (window.confirm("Load saved snapshot")) {
        const parsed = JSON.parse(saved);
        performSetShapes(parsed);
      }
    } else {
      alert("No saved snapshot found.");
    }
  };

  const clearDesign = () => {
    if (window.confirm("Clear all shapes?")) {
      performSetShapes([]);
      setSelectedId(null);
      setContextMenu(null);
      setEditor(null);
    }
  };

  const handleRightClick = (shape, e) => {
    if (editor) commitTextEdit(); // commit before opening menu
    const stage = e.target.getStage();
    const p = stage.getPointerPosition();
    setSelectedId(shape.id);
    setContextMenu({ id: shape.id, x: p.x, y: p.y });
  };

  const onStartTextEdit = (shape, node) => {
    if (editor && editor.id !== shape.id) {
      commitTextEdit();
    }
    const textNode = node || stageRef.current?.findOne(`#${shape.id}`);
    if (!textNode) return;

    setSelectedId(shape.id);
    setContextMenu(null);
    openTextEditorForNode(shape, textNode);
  };

  // Keep editor stuck to the node if the window resizes/scrolls
  useEffect(() => {
    if (!editor) return;
    const sync = () => {
      const s = shapes.find((x) => x.id === editor.id);
      const node = stageRef.current?.findOne(`#${editor.id}`);
      if (s && node) openTextEditorForNode(s, node);
    };
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, true);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync, true);
    };
  }, [editor, shapes]);

  return (
    <div className="canvas-layout" onContextMenu={(e) => e.preventDefault()}>
      <aside className={`left-panel ${sidebarOpen ? "open" : ""}`}>
        <button className="toggle-btn" onClick={() => setSidebarOpen((p) => !p)}>
          {sidebarOpen ? "◀" : "▶"}
        </button>

        <div className="sidebar-content">
          <button onClick={saveSnapshot}>Save</button>
          <button onClick={loadSnapshot}>Load</button>
          <button onClick={clearDesign}>Clear</button>
        </div>
      </aside>

      {/* Canvas */}
      <main className="canvas-main">
        <div className="canvas-surface" ref={surfaceRef}>
          <Stage
            ref={stageRef}
            width={surfaceW}
            height={surfaceH}
            onMouseDown={deselectStage}
            onTouchStart={deselectStage}
          >
            <Layer>
              {shapes.map((shape) => (
                <Shape
                  key={shape.id}
                  shape={shape}
                  isSelected={shape.id === selectedId}
                  isEditingText={editor?.id === shape.id}
                  onSelect={() => {
                    if (editor && editor.id !== shape.id) commitTextEdit();
                    setSelectedId(shape.id);
                    setContextMenu(null);
                  }}
                  onChange={(newAttrs) => updateShape(shape.id, newAttrs)}
                  onRightClick={handleRightClick}
                  onStartTextEdit={onStartTextEdit}
                />
              ))}
            </Layer>
          </Stage>

          {/* Toolbar */}
          <div className="bottom-toolbar">
            <button onClick={undo} title="Undo (Ctrl/Cmd+Z)" aria-label="Undo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M9 7l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 12h-13" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={redo} title="Redo (Ctrl/Cmd+Shift+Z or Y)" aria-label="Redo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 12h13" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="sep" />

            <button onClick={() => addShape("rect")} title="Rectangle" aria-label="Rectangle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.2"><path d="M4 4H20V20H4V4Z" /></svg>
            </button>
            <button onClick={() => addShape("circle")} title="Ellipse" aria-label="Ellipse">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.2"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" /></svg>
            </button>
            <button onClick={() => addShape("triangle")} title="Triangle" aria-label="Triangle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.2"><path d="M12 2L2 22h20L12 2z" /></svg>
            </button>
            <button onClick={() => addShape("text")} title="Text" aria-label="Text">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M17 6H7M12 6v12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Context Menu */}
          {contextMenu && (() => {
            const s = shapes.find((x) => x.id === contextMenu.id);
            if (!s) return null;
            const isText = s.type === "text";
            return (
              <div
                className="context-menu"
                style={{ top: Math.max(8, contextMenu.y + 8), left: Math.max(8, contextMenu.x + 8) }}
              >
                <div className="row">
                  <label>Fill <input type="color" value={s.fill || "#111"}
                    onChange={(e) => updateShape(s.id, { ...s, fill: e.target.value })} /></label>
                  <label>Stroke <input type="color" value={s.stroke || "#000"}
                    onChange={(e) => updateShape(s.id, { ...s, stroke: e.target.value })} /></label>
                </div>

                <div className="row">
                  <label>Stroke W
                    <input type="range" min="0" max="12" step="1" value={s.strokeWidth ?? 1}
                      onChange={(e) => updateShape(s.id, { ...s, strokeWidth: +e.target.value })} />
                  </label>
                  <label>Opacity
                    <input type="range" min="0.1" max="1" step="0.05" value={s.opacity ?? 1}
                      onChange={(e) => updateShape(s.id, { ...s, opacity: +e.target.value })} />
                  </label>
                </div>

                {isText && (
                  <div className="row">
                    <label>Font Size
                      <input type="range" min="10" max="96" step="1" value={s.fontSize ?? 22}
                        onChange={(e) => updateShape(s.id, { ...s, fontSize: +e.target.value })} />
                    </label>
                  </div>
                )}

                <div className="full">
                  <button className="ghost-btn" onClick={() => duplicateShape(s.id)}>Duplicate</button>
                  <button className="ghost-btn" onClick={() => bringToFront(s.id)}>Bring front</button>
                  <button className="ghost-btn" onClick={() => sendToBack(s.id)}>Send back</button>
                </div>

                <div className="full">
                  <button className="ghost-btn" onClick={() => toggleLock(s.id)}>
                    {s.locked ? "Unlock" : "Lock"}
                  </button>
                  <button className="ghost-btn" style={{ color: "#b00020", borderColor: "rgba(176,0,32,0.2)" }}
                          onClick={() => deleteShape(s.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })()}

          {/* In-place Textarea (Canva-like) */}
          {editor && (
            <textarea
              className="konva-textarea"
              style={{
                position: "absolute",
                left: editor.x - 1 + "px",
                top: editor.y - 80 + "px",
                width: editor.width + "px",
                // height auto-grow
                minHeight: editor.height + "px",
                transform: `rotate(${editor.rotation}deg)`,
                transformOrigin: `${editor.offsetX}px ${editor.offsetY}px`,
                color: editor.color,
                fontSize: editor.fontSize + "px",
                fontFamily: editor.fontFamily,
                fontWeight: editor.fontWeight,
                fontStyle: editor.fontStyle,
                textAlign: editor.align,
                lineHeight: String(editor.lineHeight),
                letterSpacing: editor.letterSpacing + "px",
                padding: editor.padding + "px",
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                overflow: "hidden",
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                zIndex: 20,
              }}
              autoFocus
              value={editor.value}
              onChange={(e) => {
                const val = e.target.value;
                setEditor((v) => ({ ...v, value: val }));
                // live preview on canvas
                liveUpdateText(editor.id, val);
                // auto-grow
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
              }}
              onBlur={commitTextEdit}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  cancelTextEdit();
                }
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  commitTextEdit();
                }
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}