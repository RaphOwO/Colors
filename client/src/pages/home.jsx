import { useState, useEffect, useRef } from "react";
import Section from "../components/section.jsx";
import "../App.css";
import "../styles/home.css";

function getComplementaryColor(hex) {
  const clean = hex.replace("#", "");
  const r = 255 - parseInt(clean.substring(0, 2), 16);
  const g = 255 - parseInt(clean.substring(2, 4), 16);
  const b = 255 - parseInt(clean.substring(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function Home() {
    const gradients = [
        ["#FF6B6B", "#FFD93D"],
        ["#6BCB77", "#4D96FF"],
        ["#F72585", "#7209B7"],
        ["#FF9F1C", "#2EC4B6"],
        ["#F4D03F", "#16A085"],
    ];

    const [gradient, setGradient] = useState(["#6BCB77", "#4D96FF"]);
    const [complimentary, setComplimentary] = useState("#ffffff");
    const topicRefs = useRef([]);
    const heroRef = useRef(null);

    useEffect(() => {
        const randomGradient =
        gradients[Math.floor(Math.random() * gradients.length)];
        setGradient(randomGradient);
        setComplimentary(getComplementaryColor(randomGradient[0]));
    }, []);

    const setTopicRef = (el) => {
        if (el && !topicRefs.current.includes(el)) {
          topicRefs.current.push(el);
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
            { threshold: 0.2 }
        );

        if (heroRef.current) observer.observe(heroRef.current);

        topicRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []); 

  return (
    <div className="page">
      <Section color="white">
        <div
          className="home-page"
          style={{
            "--grad1": gradient[0],
            "--grad2": gradient[1],
          }}
        >
          <div ref={heroRef} className="title-content fade-section">
            <label className="title-message">Designs</label>
            <h1 className="home-title">COLORS</h1>
          </div>

          <div className="home-content">
            <section ref={setTopicRef} className="topic-section left">
              <div className="topic-text">
                <h2>About <label style={{fontFamily: "Ananias"}}>COLORS</label></h2>
                <p>
                  COLORS is an educational website focused on the fundamentals of graphic design.
                  It provides clear and engaging explanations about color theory and composition,
                  with interactive examples and hands-on learning.
                </p>
              </div>
              <p>Add something</p>
            </section>

            <section ref={setTopicRef} className="topic-section right">
              <div className="topic-text">
                <h2>Color Theory</h2>
                <p>
                  Understand how colors interact, evoke emotions, and influence visual hierarchy.
                  Learn about contrast, harmony, and the psychology behind each hue.
                </p>
              </div>
            </section>

            <section ref={setTopicRef} className="topic-section left">
              <div className="topic-text">
                <h2>Composition</h2>
                <p>
                  Discover the art of arranging elements with balance and rhythm.
                  Explore the rules of thirds, symmetry, and flow that guide the viewer’s eye.
                </p>
              </div>
            </section>

            <section ref={setTopicRef} className="topic-section right">
              <div className="topic-text">
                <h2>Tools & Practice</h2>
                <p>
                  Access creative exercises and digital tools that help reinforce key design concepts,
                  improving both understanding and visual intuition.
                </p>
              </div>
            </section>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default Home;
