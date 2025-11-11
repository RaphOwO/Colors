import { useEffect, useRef, useState } from 'react';
import Section from '../components/section.jsx';
import transition from '../components/transition.jsx';
import '../styles/theory.css';
import '../App.css';

const ColorWheelPicker = ({ onColorChange }) => {
  const canvasRef = useRef(null);
  const handleRef = useRef(null);
  const brightnessRef = useRef(null);
  const brightnessHandleRef = useRef(null);
  const previewRef = useRef(null);

  const [colorPicker, setColorPicker] = useState({
    radius: 125,
    brightness: 50,
    hue: 0,
    saturation: 100,
  });

  const [colorValues, setColorValues] = useState({
    rgb: "rgb(0,0,0)",
    hex: "#000000",
  });

  function hsbToRgb(h, s, b) {
    h /= 360;
    s /= 100;
    b /= 100;

    let r, g, bb;

    if (s === 0) {
      r = g = bb = b;
    } else {
      const hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = b < 0.5 ? b * (1 + s) : b + s - b * s;
      const p = 2 * b - q;

      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      bb = hueToRgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(bb * 255)];
  }

  function rgbToHex(r, g, b) {
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  function updateColor(picker) {
    const [r, g, b] = hsbToRgb(picker.hue, picker.saturation, picker.brightness);
    const hex = rgbToHex(r, g, b);

    setColorValues({
      rgb: `rgb(${r}, ${g}, ${b})`,
      hex: hex,
    });

    if (previewRef.current) {
      previewRef.current.style.backgroundColor = hex;
    }
  }

  useEffect(() => {
    if (onColorChange) {
      const { hue, saturation, brightness } = colorPicker;
      const [r, g, b] = hsbToRgb(hue, saturation, brightness);
      const hex = rgbToHex(r, g, b);
      onColorChange({ r, g, b, hex, h: hue, s: saturation, br: brightness });
    }
  }, [colorPicker]);


  function generateColorGradient(picker) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createConicGradient(0, picker.radius, picker.radius);
    const angleStep = (2 * Math.PI) / 360;

    for (let angle = 0; angle < 2 * Math.PI; angle += angleStep) {
      const [r, g, b] = hsbToRgb(
        ((angle * 180) / Math.PI + 180),
        100,
        picker.brightness
      );
      const colorStop = angle / (2 * Math.PI);
      gradient.addColorStop(colorStop, `rgb(${r}, ${g}, ${b})`);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient2 = ctx.createRadialGradient(
      picker.radius,
      picker.radius,
      0,
      picker.radius,
      picker.radius,
      picker.radius
    );
    let [r, g, b] = hsbToRgb(0, 0, picker.brightness);
    gradient2.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
    gradient2.addColorStop(0.05, `rgba(${r}, ${g}, ${b}, 1)`);
    gradient2.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const handleColorCanvas = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const dx = x - colorPicker.radius;
    const dy = y - colorPicker.radius;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= colorPicker.radius) {
      const angle = Math.atan2(dy, dx);
      const hue = (angle * 180) / Math.PI + 180;
      const saturation = (distance / colorPicker.radius) * 100;

      setColorPicker((prev) => {
        const updated = { ...prev, hue, saturation };
        updateColor(updated);
        return updated;
      });

      handleRef.current.style.left = `${colorPicker.radius + Math.cos(angle) * distance}px`;
      handleRef.current.style.top = `${colorPicker.radius + Math.sin(angle) * distance}px`;
    }
  };

  const handleBrightnessSlider = (event) => {
    const slider = brightnessRef.current;
    const rect = slider.getBoundingClientRect();
    const y = event.clientY - rect.top;

    if (y >= 0 && y <= rect.height - 8) {
      const brightness = (1 - y / (rect.height - 8)) * 100;

      setColorPicker((prev) => {
        const updated = { ...prev, brightness };
        updateColor(updated);
        generateColorGradient(updated);
        return updated;
      });

      brightnessHandleRef.current.style.top = `${(1 - brightness / 100) * (rect.height - 8)}px`;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = colorPicker.radius * 2;
    canvas.height = colorPicker.radius * 2;
    generateColorGradient(colorPicker);
    updateColor(colorPicker);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    const resizeObserver = new ResizeObserver(() => {
    const rect = canvas.getBoundingClientRect();
    const newRadius = rect.width / 2;

    setColorPicker((prev) => {
      const updated = { ...prev, radius: newRadius };
      canvas.width = rect.width;
      canvas.height = rect.height;
      generateColorGradient(updated);
      updateColor(updated);
      return updated;
    });
  });

  resizeObserver.observe(canvas);
  return () => resizeObserver.disconnect();
}, []);


  return (
    <div id="color-picker">
      <div id="color-canvas-area">
        <canvas
          id="color-canvas"
          ref={canvasRef}
          onMouseDown={(e) => {
            handleColorCanvas(e);
            const move = (ev) => handleColorCanvas(ev);
            const up = () => {
              document.removeEventListener("mousemove", move);
              document.removeEventListener("mouseup", up);
            };
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
          }}
        ></canvas>
        <div id="color-handle" ref={handleRef}></div>
      </div>

      <div
        id="brightness-slider"
        ref={brightnessRef}
        onMouseDown={(e) => {
          handleBrightnessSlider(e);
          const move = (ev) => handleBrightnessSlider(ev);
          const up = () => {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", up);
          };
          document.addEventListener("mousemove", move);
          document.addEventListener("mouseup", up);
        }}
      >
        <div id="brightness-handle" ref={brightnessHandleRef}></div>
      </div>
    </div>
  );
};


function ColorTheory() {
  const [selectedColor, setSelectedColor] = useState("#29abe2");
  const [colorSet, setColorSet] = useState([]);
  const [currentMode, setCurrentMode] = useState("monochromatic");

  // --- Utility: HEX <-> HSL ---
  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l;
    l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = (x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
  };

  const getBrightness = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 * 10;
  };

  const generateColors = (mode, baseColor) => {
    const [h, s, l] = hexToHsl(baseColor);
    let others = [];

    switch (mode) {
      case "monochromatic":
        others = [
          hslToHex(h, s, Math.min(l + 20, 95)),
          hslToHex(h, Math.max(s - 10, 10), Math.max(l - 10, 8)),
          hslToHex(h, s, Math.max(l - 25, 5)),
        ];
        break;

      case "complementary":
        others = [
          hslToHex((h + 180) % 360, s, l),
          hslToHex((h + 170) % 360, Math.max(s - 8, 8), Math.min(l + 8, 92)),
          hslToHex((h + 190) % 360, Math.min(s + 6, 100), Math.max(l - 8, 6)),
        ];
        break;

      case "analogous":
        others = [
          hslToHex((h + 30) % 360, s, l),
          hslToHex((h - 30 + 360) % 360, s, l),
          hslToHex((h + 15) % 360, Math.max(s - 6, 8), Math.min(l + 10, 92)),
        ];
        break;

      case "triadic":
        others = [
          hslToHex((h + 120) % 360, s, l),
          hslToHex((h + 240) % 360, s, l),
          hslToHex((h + 120) % 360, Math.max(s - 6, 8), Math.max(l - 12, 6)),
        ];
        break;

      case "tetradic":
        others = [
          hslToHex((h + 90) % 360, s, l),
          hslToHex((h + 180) % 360, s, l),
          hslToHex((h + 270) % 360, s, l),
        ];
        break;

      case "shade":
        others = [
          hslToHex(h, s, Math.max(l - 10, 5)),
          hslToHex(h, s, Math.max(l - 25, 5)),
          hslToHex(h, s, Math.max(l - 40, 0)),
        ];
        break;

      case "tint":
        others = [
          hslToHex(h, s, Math.min(l + 10, 95)),
          hslToHex(h, s, Math.min(l + 25, 98)),
          hslToHex(h, s, Math.min(l + 40, 100)),
        ];
        break;

      case "tones":
        others = [
          hslToHex(h, Math.max(s - 20, 0), l),
          hslToHex(h, Math.max(s - 35, 0), Math.min(l + 5, 95)),
          hslToHex(h, Math.max(s - 50, 0), Math.max(l - 5, 5)),
        ];
        break;

      default:
        others = [
          hslToHex(h, s, Math.min(l + 20, 95)),
          hslToHex((h + 60) % 360, s, l),
          hslToHex((h + 120) % 360, s, l),
        ];
    }

    // ensure 3 other colors exist; slice/pad just in case
    others = others.slice(0, 3);
    while (others.length < 3) others.push(baseColor);

    // final array: [background (base), group1, group2, group3]
    return [baseColor, ...others];
  };

  // --- Apply colors: set background rect and group fills ---
  useEffect(() => {
    if (!colorSet || colorSet.length === 0) return;

    // background rect (first color)
    const bgRect = document.getElementById("background");
    if (bgRect) bgRect.style.fill = colorSet[0];

    // groups -> use colorSet[1..3]
    const groups = ["group1", "group2", "group3"];
    groups.forEach((id, i) => {
      const g = document.getElementById(id);
      if (!g) return;
      const fillColor = colorSet[1 + i] || colorSet[1]; // fallback
      g.querySelectorAll("*").forEach((el) => {
        el.style.transition = "fill 0.45s ease";
        el.style.fill = fillColor;
      });
    });
  }, [colorSet]);


  // --- Update nav color ---
  useEffect(() => {
    const brightness = getBrightness(selectedColor);
    const navColor = brightness < 6 ? "white" : "black";
    document.documentElement.style.setProperty("--nav-color", navColor);
  }, [selectedColor]);

  // --- Update color set when base color or mode changes ---
  useEffect(() => {
    setColorSet(generateColors(currentMode, selectedColor));
  }, [selectedColor, currentMode]);

  // --- Intersection Observer to detect mode sections ---
  useEffect(() => {
    const sections = document.querySelectorAll(".color-mode-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentMode(entry.target.dataset.mode);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const secRefs = useRef([]);

  const setSecRef = (el) => {
    if (el && !secRefs.current.includes(el)) {
      secRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { 
        threshold: 0.5,
        rootMargin: "-20% 0px -25% 0px"
       }
    );

    secRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);


  return (
    <div className="theory-page" style={{ height: "100%", width: "100%" }}>
      <Section color="white">
        <div className="theory-content">
          <svg
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1920 971.8"
              preserveAspectRatio='none'
              style={{ width: '100%', height: '100vh', display: 'block' }}
            >
              <rect id="background" width="1920" height="1080" style={{"--bg-color": selectedColor}}/>
              <g id="group3">
                <path d="M1489.22,125.12c0,8.61-6.98,15.58-15.58,15.58s-15.59-6.97-15.59-15.58,6.98-15.58,15.59-15.58,15.58,6.97,15.58,15.58Z"/>
                <circle cx="63.25" cy="510.13" r="20.78" transform="translate(-450.42 490.85) rotate(-80.78)"/>
                <path d="M466.67,838.12c-102.55-74.23-277.02-71.79-336.36-2.28-25.41,29.76-22.94,69.92-19.46,150.28,1.73,40.16,3.06,70.59,7.33,95.22h429.48c7.31-24.33,13.72-55.72,11.21-87.25-4.52-56.71-38.13-116.83-92.21-155.97Z"/>
                <path d="M1920,146.91c-60.99-31.7-122.13-34.91-157.91-36.78-147.14-7.67-267.39,61.19-263.58,77.82,3.38,14.75,102.49-20.29,200.22,37.76,30.38,18.05,49.13,38.26,56.89,46.76,108.11,118.31,34.92,273.32,115.08,336.36,13.88,10.92,30.93,17.93,49.3,21.5V146.91Z"/>
              </g>
              <g id="group2">
                <circle cx="1629.48" cy="762.61" r="22.73"/>
                <path d="M679.31,959.45c-50.52-12.35-78.42,4.64-148.9,16.32-64.54,10.69-260.32,43.14-342.47-43.84-71.68-75.89-21.43-205.23-95.89-276.71-38.87-37.32-84.47-52.18-92.05-54.47v479.25h824.77c-32.26-51.89-79.18-104.35-145.46-120.55Z"/>
                <path d="M1920,1079.14v-476.24c-42.55-6.61-101.69-14.07-145.68-5.41-4.43.87-11.86,2.53-19.48,7.79-14.7,10.15-20.49,27.06-23.38,40.26-13.15,60.1-4.78,219.97-4.41,227.27,6.13,118.37-17.42,133.19,7,167.01,12.61,17.46,31.51,30.98,53.02,40.18h131.45c.5-.28.99-.57,1.48-.86Z"/>
              </g>
              <g id="group1">
                <circle cx="833.38" cy="932.21" r="35.06" transform="translate(-346.79 1345.41) rotate(-67.5)"/>
                <path d="M1920,1080v-40.17c-4.01.53-6.57,1.13-6.57,1.13-17.62,4.23-99.65,19-126.23-8.36-10.13-10.43-9.57-42.86-8.46-107.73.49-28.74,3.03-46.08-9.4-59.34-10.36-11.04-25.49-16.12-50.12-20.64-64.83-11.89-110.34-15.16-180.12,0-41.36,8.98-62.03,13.47-75.17,24.03-44.8,35.98-35.46,98.19-48.05,190.91-.86,6.35-1.86,13.09-3.03,20.17h507.15Z"/>
              </g>
          </svg>
          <ColorWheelPicker onColorChange={(color) => setSelectedColor(color.hex)} />
          <div className="color-mode-section" data-mode="monochromatic">
            <section ref={setSecRef} className='section'>
              <h1>Color Theory</h1>
              <p style={{margin: "1.2rem 0 0 1rem", fontSize: "clamp(1.5rem, 3vw, 2rem)"}}>Want to know what colors look good together?</p>
            </section>
          </div>
          <div className='color-mode-section' data-mode="monochromatic">
            <section ref={setSecRef} className='section'>
              <h2>Monochromatic</h2>
              <p>Three shades, tones and tints of one base color. Provides a subtle and conservative color combination. This is a versatile color combination that is easy to apply to design projects for a harmonious look.</p>
            </section>
          </div>
          <div className="color-mode-section" data-mode="complementary">
            <section ref={setSecRef} className='section'>
              <h2>Complementary</h2>
              <p>Two colors that are on opposite sides of the color wheel. This combination provides a high contrast and high impact color combination – together, these colors will appear brighter and more prominent.</p>
            </section>
          </div>
          <div className="color-mode-section" data-mode="analogous">
            <section ref={setSecRef} className='section'>
              <h2>Analogous</h2>
              <p>Three colors that are side by side on the color wheel. This color combination is versatile, but can be overwhelming. To balance an analogous color scheme, choose one dominant color, and use the others as accents.</p>
            </section>
          </div>
          <div className="color-mode-section" data-mode="triadic">
            <section ref={setSecRef} className='section'>
              <h2>Triadic</h2>
              <p>Three colors that are evenly spaced on the color wheel. This provides a high contrast color scheme, but less so than the complementary color combination — making it more versatile. This combination creates bold, vibrant color palettes.</p>
            </section>
          </div>
          <div className="color-mode-section" data-mode="tetradic">
            <section ref={setSecRef} className='section'>
              <h2>Tetradic</h2>
              <p>Four colors that are evenly spaced on the color wheel. Tetradic color schemes are bold and work best if you let one color be dominant, and use the others as accents. The more colors you have in your palette, the more difficult it is to balance,</p>
            </section>
          </div>
          <div className="color-mode-section" data-mode="analogous">
            <section ref={setSecRef} className='section'>
              <h2>Warm & Cool Color</h2>
              <p>Warm colors are the colors from red through to yellow. These colors are said to bring to mind warmth, like the sun. 
                <br/>
                <br/>
                Cool colors are the colors from blue to green and purple. These colors are said to bring to mind coolness, like water.</p>
            </section>
          </div>
          <div className="color-mode-section" data-mode="shade">
            <section ref={setSecRef} className='section'>
              <h2>Shade</h2>
              <p>A shade is created by adding black to a base hue, darkening the color. This creates a deeper, richer color. Shades can be quite dramatic and can be overpowering.</p>
            </section>
          </div> 
          <div className="color-mode-section" data-mode="tint">
            <section ref={setSecRef} className='section'>
              <h2>Tint</h2>
              <p>A tint is created by adding white to a base hue, lightening the color. This can make a color less intense, and is useful when balancing more vivid color combinations.</p>
            </section>
          </div> 
          <div className="color-mode-section" data-mode="tones">
            <section ref={setSecRef} className='section'>
              <h2>Tones</h2>
              <p>A tone is created by combining black and white—or grey—with a base hue. Like tints, tones are subtler versions of the original color. Tones are less likely to look pastel, and can reveal complexities not apparent in the base color.</p>
            </section>
          </div> 
        </div>
      </Section>
    </div>
  );
}

export default transition(ColorTheory);
