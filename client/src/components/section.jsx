import { useEffect, useRef } from 'react';

function Section({ color, children }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const root = document.documentElement;
    const probeX = Math.floor(window.innerWidth / 2);
    const probeY = Math.floor(window.innerHeight * 0.15); 

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ir = entry.intersectionRect;

          if (!entry.isIntersecting || !ir || ir.width === 0 || ir.height === 0) {
            return;
          }

          const visibleTop = ir.top;       
          const visibleBottom = ir.bottom;

          if (visibleTop <= probeY && visibleBottom >= probeY) {
            const newColor = entry.target.getAttribute('data-nav-color');
            root.style.setProperty('--nav-color', newColor);
          }
        });
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      }
    );

    observer.observe(section);

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
        const rect = section.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom >= probeY) {
          const initialColor = section.getAttribute('data-nav-color');
          root.style.setProperty('--nav-color', initialColor);
        }
      }
    } catch (err) {
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
