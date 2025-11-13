import React, { useState, useRef, useEffect, useMemo } from "react";
import Konva from "konva";
import {
  Stage,
  Layer,
  Rect,
  Ellipse,
  Text,
  Line,
  Transformer,
  Image as KonvaImage,
} from "react-konva";
import "../styles/Canvas.css";
import transition from "../components/transition";
import Section from "../components/section";
import { confirmAlert } from "../components/confirm.jsx";
import { snackbarAlert } from "../components/snackbarAlert";



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

const IconLock = ({ locked = false, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {locked ? (
      <>
        <path d="M7 9V7a5 5 0 1 1 10 0v2" />
        <rect x="5" y="9" width="14" height="12" rx="2" />
        <path d="M12 14v4" />
      </>
    ) : (
      <>
        <path d="M7 9V7a5 5 0 0 1 9.5-2" />
        <rect x="5" y="9" width="14" height="12" rx="2" />
        <path d="M12 14v4" />
      </>
    )}
  </svg>
);

function useHTMLImage(src) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);
    img.src = src;
    return () => setImage(null);
  }, [src]);
  return image;
}

const Shape = ({
  shape,
  isSelected,
  isEditingText,
  onSelect,
  onChange,
  onRightClick,
  onStartTextEdit,
  registerRef,
}) => {
  const shapeRef = useRef();

  useEffect(() => {
    if (shapeRef.current) registerRef(shape.id, shapeRef.current);
    return () => registerRef(shape.id, null);
  }, [shape.id]);

  const handleRightClick = (e) => {
    e.evt.preventDefault();
    e.cancelBubble = true;
    onRightClick(shape, e);
  };

  const handlePointerDown = (e) => {
    if (e.evt.button === 0) onSelect(e);
  };

  const commonProps = {
    id: shape.id,
    name: "selectable",
    draggable: !shape.locked && !isEditingText,
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
        width: Math.max(5, (shape.width ?? node.width()) * scaleX),
        height: Math.max(5, (shape.height ?? node.height()) * scaleY),
        rotation: typeof node.rotation === "function" ? node.rotation() : (shape.rotation ?? 0),
      });
    },
    opacity: shape.opacity ?? 1,
  };

  if (shape.type === "rect") {
    return (
      <Rect
        ref={shapeRef}
        {...shape}
        {...commonProps}
        width={shape.width}
        height={shape.height}
      />
    );
  }

  if (shape.type === "circle") {
    return (
      <Ellipse
        ref={shapeRef}
        {...shape}
        {...commonProps}
        radiusX={(shape.width || 0) / 2}
        radiusY={(shape.height || 0) / 2}
      />
    );
  }

  if (shape.type === "triangle") {
    return (
      <Line
        ref={shapeRef}
        {...commonProps}
        x={shape.x}
        y={shape.y}
        points={[shape.width / 2, 0, 0, shape.height, shape.width, shape.height]}
        closed
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
      />
    );
  }

  if (shape.type === "line") {
    return (
      <Line
        ref={shapeRef}
        {...commonProps}
        x={shape.x}
        y={shape.y}
        points={[0, 0, shape.width, shape.height]}
        stroke={shape.stroke || "#111"}
        strokeWidth={shape.strokeWidth ?? 3}
        lineCap="round"
        lineJoin="round"
        draggable={!shape.locked}
      />
    );
  }

  if (shape.type === "image") {
    const image = useHTMLImage(shape.src);
    return (
      <KonvaImage
        ref={shapeRef}
        {...commonProps}
        image={image}
        width={shape.width ?? (image?.width || 200)}
        height={shape.height ?? (image?.height || 150)}
      />
    );
  }

  if (shape.type === "text") {
    return (
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
        fontFamily={
          shape.fontFamily ??
          'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
        }
        fontStyle={shape.fontStyle ?? "normal"}
        draggable={!shape.locked && !isEditingText}
        listening={!isEditingText}
        opacity={isEditingText ? 0.2 : shape.opacity ?? 1}
        onDblClick={(e) => onStartTextEdit(shape, e.target)}
        onDblTap={(e) => onStartTextEdit(shape, e.target)}
      />
    );
  }

  return null;
};


function Canvas() {
  const [shapes, _setShapes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); 
  const [contextMenu, setContextMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editor, setEditor] = useState(null);
  const surfaceRef = useRef(null);
  const stageRef = useRef(null);
  const trRef = useRef(null); 
  const nodeRefs = useRef({}); 
  const { width: surfaceW, height: surfaceH } = useContainerSize(surfaceRef);
  const dragProxyPosRef = useRef(null);
  const [selRect, setSelRect] = useState(null);
  const selState = useRef({ active: false, origin: { x: 0, y: 0 } });
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
      if (!isApplyingHistory.current && next !== prev) pushUndo(prev);
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
    setTimeout(() => (isApplyingHistory.current = false), 0);
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
    setTimeout(() => (isApplyingHistory.current = false), 0);
  };

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

  useEffect(() => {
    if (!trRef.current || !stageRef.current) return;
    const nodes = selectedIds
      .map((id) => nodeRefs.current[id])
      .filter(Boolean);
    trRef.current.nodes(nodes);
    trRef.current.getLayer()?.batchDraw();
  }, [selectedIds, shapes]);

  const selectionBBox = useMemo(() => {
    if (!stageRef.current || selectedIds.length <= 1) return null;
    const rects = selectedIds
      .map((id) => nodeRefs.current[id])
      .filter(Boolean)
      .map((n) => n.getClientRect());
    if (!rects.length) return null;

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    rects.forEach((r) => {
      minX = Math.min(minX, r.x);
      minY = Math.min(minY, r.y);
      maxX = Math.max(maxX, r.x + r.width);
      maxY = Math.max(maxY, r.y + r.height);
    });
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }, [selectedIds, shapes]);

  const openTextEditorForNode = (shape, textNode) => {
    const stage = stageRef.current;
    if (!stage || !textNode) return;

    const stageBox = stage.container().getBoundingClientRect();
    const absPos = textNode.getAbsolutePosition();
    const rotation = textNode.rotation();
    const offsetX = textNode.offsetX() || 0;
    const offsetY = textNode.offsetY() || 0;

    const nodeWidth = textNode.width();
    const nodeHeight = textNode.height();

    const left = stageBox.left + absPos.x;
    const top = stageBox.top + absPos.y;

    const fontSize = shape.fontSize ?? 22;
    const fontFamily =
      shape.fontFamily ??
      'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
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
                fontStyle: `${editor.fontWeight >= 600 ? "bold " : ""}${
                  editor.fontStyle === "italic" ? "italic" : "normal"
                }`,
              }
            : x
        )
      );
    }
    setEditor(null);
  };

  const liveUpdateText = (id, textValue) => {
    isApplyingHistory.current = true;
    _setShapes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text: textValue } : s))
    );
    isApplyingHistory.current = false;
  };

  const cancelTextEdit = () => setEditor(null);

  const registerRef = (id, node) => {
    if (!node) delete nodeRefs.current[id];
    else nodeRefs.current[id] = node;
  };

  const beginMarquee = (pos) => {
    selState.current.active = true;
    selState.current.origin = pos;
    setSelRect({ x: pos.x, y: pos.y, width: 0, height: 0, visible: true });
  };

  const updateMarquee = (pos) => {
    if (!selState.current.active) return;
    const { origin } = selState.current;
    const rect = {
      x: Math.min(origin.x, pos.x),
      y: Math.min(origin.y, pos.y),
      width: Math.abs(pos.x - origin.x),
      height: Math.abs(pos.y - origin.y),
      visible: true,
    };
    setSelRect(rect);
  };

  const finishMarquee = () => {
    if (!selState.current.active || !selRect) return;
    const box = selRect;
    const stage = stageRef.current;
    if (!stage) return;

    const nodes = stage.find(".selectable");
    const ids = [];
    nodes.forEach((n) => {
      if (Konva.Util.haveIntersection(box, n.getClientRect())) {
        ids.push(n._id ? n.id() : n.id());
      }
    });
    setSelectedIds(ids);
    selState.current.active = false;
    setSelRect(null);
  };

  const handleStageMouseDown = (e) => {
    const isEmpty = e.target === e.target.getStage();
    const isLeft = e.evt.button === 0;

    if (isEmpty && isLeft) {
      if (editor) commitTextEdit();
      setContextMenu(null);
      beginMarquee(e.target.getStage().getPointerPosition());
    }
  };

  const handleStageMouseMove = (e) => {
    if (!selState.current.active) return;
    updateMarquee(e.target.getStage().getPointerPosition());
  };

  const handleStageMouseUp = () => {
    if (selState.current.active) finishMarquee();
  };

  const onShapeSelect = (id) => (evt) => {
    const shift = !!evt?.evt?.shiftKey;
    setContextMenu(null);
    if (shift) {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    } else {
      setSelectedIds((prev) =>
        prev.length === 1 && prev[0] === id ? prev : [id]
      );
    }
  };
  const deleteSelected = () => {
    if (!selectedIds.length) return;
    performSetShapes((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
    setSelectedIds([]);
    setContextMenu(null);
  };

  const duplicateSelected = () => {
    if (!selectedIds.length) return;
    performSetShapes((prev) => {
      const add = [];
      selectedIds.forEach((id) => {
        const s = prev.find((x) => x.id === id);
        if (s) {
          add.push({
            ...s,
            id: Date.now().toString() + Math.random(),
            x: (s.x ?? 0) + 20,
            y: (s.y ?? 0) + 20,
          });
        }
      });
      return [...prev, ...add];
    });
  };

  const bringToFrontSelected = () => {
    if (!selectedIds.length) return;
    performSetShapes((prev) => {
      const arr = [...prev];
      selectedIds.forEach((id) => {
        const idx = arr.findIndex((s) => s.id === id);
        if (idx >= 0) {
          const [item] = arr.splice(idx, 1);
          arr.push(item);
        }
      });
      return arr;
    });
  };

  const sendToBackSelected = () => {
    if (!selectedIds.length) return;
    performSetShapes((prev) => {
      const arr = [...prev];
      [...selectedIds].reverse().forEach((id) => {
        const idx = arr.findIndex((s) => s.id === id);
        if (idx >= 0) {
          const [item] = arr.splice(idx, 1);
          arr.unshift(item);
        }
      });
      return arr;
    });
  };

  const toggleLockSelected = () => {
    if (!selectedIds.length) return;
    performSetShapes((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id) ? { ...s, locked: !s.locked } : s
      )
    );
  };

  const updateShape = (id, newAttrs) => {
    performSetShapes((prev) => prev.map((s) => (s.id === id ? newAttrs : s)));
  };

  const addShape = (type) => {
    const base = {
      id: Date.now().toString(),
      type,
      x: 150 + Math.random() * 300,
      y: 100 + Math.random() * 250,
      width: 240,
      height: 90,
      fill: "#fff",
      stroke: "#000",
      strokeWidth: 1,
      opacity: 1,
      locked: false,
      
      fontSize: 22,
      text: "Double-click to edit",
      letterSpacing: 0,
      lineHeight: 1.2,
      align: "left",
      padding: 0,
      fontFamily:
        'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      fontStyle: "normal",
    };

    const preset =
      type === "circle"
        ? { width: 120, height: 120 }
        : type === "rect"
        ? { width: 160, height: 100 }
        : type === "triangle"
        ? { width: 120, height: 100 }
        : type === "line"
        ? {
            width: 160,
            height: 0,
            fill: "transparent",
            stroke: "#111",
            strokeWidth: 3,
          }
        : type === "text"
        ? { width: 240, height: 40, fill: "#111", stroke: "transparent" }
        : {};

    performSetShapes((prev) => [...prev, { ...base, ...preset, type }]);
  };

  const fileInputRef = useRef(null);
  const triggerAddImage = () => fileInputRef.current?.click();
  const onFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    performSetShapes((prev) => {
      const added = files.map((f, idx) => ({
        id: Date.now().toString() + "_" + idx,
        type: "image",
        src: URL.createObjectURL(f),
        x: 120 + Math.random() * 240,
        y: 90 + Math.random() * 180,
        width: 220,
        height: 160,
        opacity: 1,
        locked: false,
      }));
      return [...prev, ...added];
    });
    e.target.value = ""; // allow re-select same file
  };

  const handleRightClick = (shape, e) => {
    if (editor) commitTextEdit();
    const stage = e.target.getStage();
    const p = stage.getPointerPosition();
    if (!selectedIds.includes(shape.id)) setSelectedIds([shape.id]);
    setContextMenu({ id: shape.id, x: p.x, y: p.y });
  };

  const onStartTextEdit = (shape, node) => {
    if (selectedIds.length > 1) return; 
    if (editor && editor.id !== shape.id) commitTextEdit();
    const textNode = node || stageRef.current?.findOne(`#${shape.id}`);
    if (!textNode) return;
    setSelectedIds([shape.id]);
    setContextMenu(null);
    openTextEditorForNode(shape, textNode);
  };

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

  useEffect(() => {
    const onKey = (e) => {
      const inText =
        e.target &&
        (e.target.tagName === "TEXTAREA" ||
          e.target.tagName === "INPUT" ||
          e.target.isContentEditable);
      if (inText) return;
      const meta = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      if (meta && key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (meta && key === "y") {
        e.preventDefault();
        redo();
        return;
      }
      if (key === "delete" || key === "backspace") {
        e.preventDefault();
        deleteSelected();
        return;
      }
      if (meta && key === "d") {
        e.preventDefault();
        duplicateSelected();
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIds, shapes]);

  const saveSnapshot = () => {
    localStorage.setItem("design_backup", JSON.stringify(shapes));
      snackbarAlert({
        iconType: "success",
        message: "Snapshot Saved!",
        iconBg: "rgba(176, 247, 148, 1)",
        iconColor: "white",
        duration: 2500,
      });
  };
  const loadSnapshot = async() => {
    const saved = localStorage.getItem("design_backup");
    if (saved) {
      const ok = await confirmAlert({
        iconType: "warning",
        title: "LOAD SNAPSHOT",
        message: "Load saved snapshot?",
        iconBg: "#FEF3C7",  
        iconColor: "#92400E",
        snackScale: 1.1,
      });
      if(ok){
        const parsed = JSON.parse(saved);
        performSetShapes(parsed);
      }
    } else {
      alert("No saved snapshot found.");
    }
  };
  const clearDesign = async() => {
    const ok = await confirmAlert({
      iconType: "warning",
      title: "CLEAR SHAPES",
      message: "Clear all shapes?",
      iconBg: "#FEF3C7",  
      iconColor: "#92400E",
      snackScale: 1.1,
    });
    if(ok){
      performSetShapes([]);
      setSelectedIds([]);
      setContextMenu(null);
      setEditor(null);
    }
  };

  const allLocked =
    selectedIds.length > 0 &&
    selectedIds.every((id) => (shapes.find((s) => s.id === id) || {}).locked);

  return (
    <Section color="black">
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

        <main className="canvas-main">
          <div className="canvas-surface" ref={surfaceRef}>
            <Stage
              ref={stageRef}
              width={surfaceW}
              height={surfaceH}
              onMouseDown={handleStageMouseDown}
              onMouseMove={handleStageMouseMove}
              onMouseUp={handleStageMouseUp}
            >
              <Layer>
                {shapes.map((shape) => (
                  <Shape
                    key={shape.id}
                    shape={shape}
                    isSelected={selectedIds.includes(shape.id)}
                    isEditingText={editor?.id === shape.id}
                    onSelect={onShapeSelect(shape.id)}
                    onChange={(newAttrs) => updateShape(shape.id, newAttrs)}
                    onRightClick={handleRightClick}
                    onStartTextEdit={onStartTextEdit}
                    registerRef={registerRef}
                  />
                ))}

                {selRect && selRect.visible && (
                  <Rect
                    x={selRect.x}
                    y={selRect.y}
                    width={selRect.width}
                    height={selRect.height}
                    fill="rgba(0, 120, 255, 0.1)"
                    stroke="rgba(0, 120, 255, 0.6)"
                    dash={[4, 4]}
                  />
                )}
              </Layer>

              {selectionBBox && (
                <Layer>
                  <Rect
                    x={selectionBBox.x}
                    y={selectionBBox.y}
                    width={selectionBBox.width}
                    height={selectionBBox.height}
                    fill="rgba(0,0,0,0.001)"         
                    strokeEnabled={false}
                    draggable
                    onDragStart={(e) => {
                      dragProxyPosRef.current = e.target.getAbsolutePosition();
                    }}
                    onDragMove={(e) => {
                      if (!dragProxyPosRef.current) return;
                      const p = e.target.getAbsolutePosition();
                      const dx = p.x - dragProxyPosRef.current.x;
                      const dy = p.y - dragProxyPosRef.current.y;

                      isApplyingHistory.current = true;
                      _setShapes((prev) =>
                        prev.map((s) =>
                          selectedIds.includes(s.id)
                            ? { ...s, x: (s.x || 0) + dx, y: (s.y || 0) + dy }
                            : s
                        )
                      );
                      isApplyingHistory.current = false;

                      dragProxyPosRef.current = p;
                    }}
                    onDragEnd={() => {
                      dragProxyPosRef.current = null;
                    }}
                    listening
                  />
                </Layer>
              )}

              <Layer>
                <Transformer
                  ref={trRef}
                  rotateEnabled={true}
                />
              </Layer>
            </Stage>

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
              <button onClick={() => addShape("line")} title="Line" aria-label="Line">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.6">
                  <path d="M4 18L20 6" strokeLinecap="round" />
                </svg>
              </button>
              <button onClick={() => addShape("text")} title="Text" aria-label="Text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M17 6H7M12 6v12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={triggerAddImage} title="Image" aria-label="Image">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.6">
                  <path d="M4 6h16v12H4z" />
                  <path d="M7 13l3-3 4 4 3-3 2 2" />
                  <circle cx="9" cy="9" r="1.5" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={onFilesSelected}
              />

              <div className="sep" />

              <button onClick={duplicateSelected} title="Duplicate (Cmd/Ctrl+D)" aria-label="Duplicate">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="9" y="9" width="10" height="10" rx="2" />
                  <rect x="5" y="5" width="10" height="10" rx="2" />
                </svg>
              </button>
              <button onClick={bringToFrontSelected} title="Bring front" aria-label="Bring front">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 7V3" />
                  <path d="M8 7h8" />
                  <rect x="6" y="7" width="12" height="10" rx="2" />
                  <path d="M8 21h8" />
                </svg>
              </button>
              <button onClick={sendToBackSelected} title="Send back" aria-label="Send back">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 17v4" />
                  <path d="M8 17h8" />
                  <rect x="6" y="7" width="12" height="10" rx="2" />
                  <path d="M8 3h8" />
                </svg>
              </button>
              <button onClick={deleteSelected} title="Delete (Del/Backspace)" aria-label="Delete">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>

            {contextMenu && (() => {
              const isSingle = selectedIds.length === 1;
              const s = isSingle ? shapes.find((x) => x.id === selectedIds[0]) : null;
              const isText = isSingle && s?.type === "text";
              const isLineOrShape =
                isSingle &&
                (s?.type === "rect" ||
                  s?.type === "circle" ||
                  s?.type === "triangle" ||
                  s?.type === "line");

              return (
                <div
                  className="context-menu"
                  style={{
                    top: Math.max(8, contextMenu.y + 8),
                    left: Math.max(8, contextMenu.x + 8),
                  }}
                >
                  {isSingle && isLineOrShape && (
                    <>
                      <div className="row">
                        <label>
                          Fill
                          <input
                            type="color"
                            value={s.fill || "#111"}
                            onChange={(e) =>
                              updateShape(s.id, { ...s, fill: e.target.value })
                            }
                          />
                        </label>
                        <label>
                          Stroke
                          <input
                            type="color"
                            value={s.stroke || "#000"}
                            onChange={(e) =>
                              updateShape(s.id, { ...s, stroke: e.target.value })
                            }
                          />
                        </label>
                      </div>
                      <div className="row">
                        <label>
                          Stroke W
                          <input
                            type="range"
                            min="0"
                            max="12"
                            step="1"
                            value={s.strokeWidth ?? 1}
                            onChange={(e) =>
                              updateShape(s.id, {
                                ...s,
                                strokeWidth: +e.target.value,
                              })
                            }
                          />
                        </label>
                        <label>
                          Opacity
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={s.opacity ?? 1}
                            onChange={(e) =>
                              updateShape(s.id, {
                                ...s,
                                opacity: +e.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                    </>
                  )}

                  {isSingle && isText && (
                    <div className="row">
                      <label>
                        Font Size
                        <input
                          type="range"
                          min="10"
                          max="96"
                          step="1"
                          value={s.fontSize ?? 22}
                          onChange={(e) =>
                            updateShape(s.id, {
                              ...s,
                              fontSize: +e.target.value,
                            })
                          }
                        />
                      </label>
                      <button
                        className="ghost-btn"
                        onClick={() =>
                          onStartTextEdit(
                            s,
                            stageRef.current.findOne(`#${s.id}`)
                          )
                        }
                      >
                        Edit text
                      </button>
                    </div>
                  )}

                  <div className="full">
                    <button className="ghost-btn" onClick={duplicateSelected} title="Duplicate">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="9" y="9" width="10" height="10" rx="2" />
                        <rect x="5" y="5" width="10" height="10" rx="2" />
                      </svg>
                    </button>
                    <button className="ghost-btn" onClick={bringToFrontSelected} title="Bring front">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M12 7V3" />
                        <path d="M8 7h8" />
                        <rect x="6" y="7" width="12" height="10" rx="2" />
                        <path d="M8 21h8" />
                      </svg>
                    </button>
                    <button className="ghost-btn" onClick={sendToBackSelected} title="Send back">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M12 17v4" />
                        <path d="M8 17h8" />
                        <rect x="6" y="7" width="12" height="10" rx="2" />
                        <path d="M8 3h8" />
                      </svg>
                    </button>

                    <button
                      className="ghost-btn"
                      onClick={toggleLockSelected}
                      title={allLocked ? "Unlock" : "Lock"}
                      aria-label={allLocked ? "Unlock selected" : "Lock selected"}
                    >
                      <IconLock locked={allLocked} />
                    </button>

                    <button
                      className="ghost-btn"
                      style={{ color: "#b00020", borderColor: "rgba(176,0,32,0.2)" }}
                      onClick={deleteSelected}
                      title="Delete"
                      aria-label="Delete selected"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
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
                  left: editor.x -1 + "px",
                  top: editor.y -80 + "px",
                  width: editor.width + "px",
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
                  liveUpdateText(editor.id, val);
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
    </Section>
  );
}

export default transition(Canvas);