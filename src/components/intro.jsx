import { useEffect, useState } from "react";
import "./../styles/intro.css";

function Intro({ onDone }) {
  const [transition, setTransition] = useState(false);

  const handleClick = () => {
    setTransition(true);
  };

  useEffect(() => {
    if (transition) {
      const timeout = setTimeout(onDone, 1000);
      return () => clearTimeout(timeout);
    }
  }, [transition]);

  return (
    <div className={'intro ${transition ? "fade-out" : ""}'}>
        <h1 data-text="COLORS" onClick={handleClick}>
            COLORS
        </h1>
        <h2>Click the logo to Continue</h2>
    </div>
  );
};

export default Intro;

