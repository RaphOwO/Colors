import { useEffect, useRef } from 'react';

function Section({ color, children }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const root = document.documentElement;
    const probeX = Math.floor(window.innerWidth / 2);
    const probeY = Math.floor(window.innerHeight * 0.15); // 15% from top

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // intersectionRect describes the visible portion of the element (in viewport coords)
          const ir = entry.intersectionRect;

          // if not intersecting, skip
          if (!entry.isIntersecting || !ir || ir.width === 0 || ir.height === 0) {
            return;
          }

          // Check if the 15%-from-top line lies within the visible portion
          const visibleTop = ir.top;       // distance from viewport top to top of visible part
          const visibleBottom = ir.bottom; // distance from viewport top to bottom of visible part

          if (visibleTop <= probeY && visibleBottom >= probeY) {
            const newColor = entry.target.getAttribute('data-nav-color');
            root.style.setProperty('--nav-color', newColor);
          }
        });
      },
      {
        // fine-grained thresholds so intersectionRect updates frequently
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      }
    );

    observer.observe(section);

    // Initial reliable check using elementsFromPoint (preferred) with the same probe coords
    try {
      const elements = document.elementsFromPoint(probeX, probeY);
      const topSection = elements.find((el) => {
        let cur = el;
        while (cur && cur !== document.body && cur !== document.documentElement) {
          if (cur === section) return true;
          cur = cur.parentElement;
        }
        return false;
      });

      if (topSection) {
        const initialColor = section.getAttribute('data-nav-color');
        root.style.setProperty('--nav-color', initialColor);
      } else {
        // fallback: check visible intersectionRect at load
        const rect = section.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom >= probeY) {
          const initialColor = section.getAttribute('data-nav-color');
          root.style.setProperty('--nav-color', initialColor);
        }
      }
    } catch (err) {
      // fallback for environments where elementsFromPoint might fail
      const rect = section.getBoundingClientRect();
      if (rect.top <= probeY && rect.bottom >= probeY) {
        const initialColor = section.getAttribute('data-nav-color');
        root.style.setProperty('--nav-color', initialColor);
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-color={color}
      style={{ width: '100%' }}
    >
      {children}
    </section>
  );
}

export default Section;
