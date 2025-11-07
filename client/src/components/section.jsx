import { useEffect, useRef } from 'react';

function Section({ color, children }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const root = document.documentElement;
    const navEl = document.querySelector('nav');
    const navHeight = navEl ? navEl.getBoundingClientRect().height : 0;
    const probeX = Math.floor(window.innerWidth / 2); // horizontally center probe
    const probeY = Math.min(window.innerHeight - 1, Math.ceil(navHeight) + 1); // just below navbar

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;

          const enteringFromTop = rect.top < 0;
          const enteringFromBottom = rect.bottom > viewportHeight;

          if (entry.isIntersecting) {
            const newColor = entry.target.getAttribute('data-nav-color');

            // If entering from top and at least 10% visible
            if (enteringFromTop && entry.intersectionRatio >= 0.1) {
              root.style.setProperty('--nav-color', newColor);
              console.log('↓ Entered from above →', newColor);
            }

            // If entering from bottom and at least 90% visible
            if (enteringFromBottom && entry.intersectionRatio >= 0.9) {
              root.style.setProperty('--nav-color', newColor);
              console.log('↑ Entered from below →', newColor);
            }
          }
        });
      },
      { threshold: [0.1, 0.9] }
    );

    observer.observe(section);

    // ---- reliable initial check: only set if this section is really under the navbar ----
    // Use elementsFromPoint so we test the actual top-most element at the probe coordinate.
    try {
      const elements = document.elementsFromPoint(probeX, probeY);
      // find the closest ancestor section in the elements list (could be a child inside the section)
      const topSection = elements.find((el) => {
        // walk up until document or null, check if matches our section
        let cur = el;
        while (cur && cur !== document.body && cur !== document.documentElement) {
          if (cur === section) return true;
          cur = cur.parentElement;
        }
        return false;
      });

      if (topSection) {
        // This section is actually the one under the navbar — set the color.
        const initialColor = section.getAttribute('data-nav-color');
        root.style.setProperty('--nav-color', initialColor);
        console.log('Initial color set (by elementsFromPoint) →', initialColor);
      }
    } catch (err) {
      // elementsFromPoint can throw in some weird cases; fallback to boundingClientRect check
      const rect = section.getBoundingClientRect();
      if (rect.top <= probeY && rect.bottom >= probeY) {
        const initialColor = section.getAttribute('data-nav-color');
        root.style.setProperty('--nav-color', initialColor);
        console.log('Initial color set (fallback) →', initialColor);
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-color={color}
      style={{
        width: '100%',
      }}
    >
      {children}
    </section>
  );
}

export default Section;