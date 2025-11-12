import React, { useState } from "react";
import { isLoggedIn } from "../utils/checkLogin";
import "./../styles/forbidden.css";
import "./../styles/testpage.css";
import transition from "../components/transition";
import Section from "../components/section";
import testData from "../content/test.json";

function TestPage({ user }) {

  const shuffleQ = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const [questions] = useState(() => shuffleQ(testData));

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!isLoggedIn()) {
    return (
      <div className="forbidden-container">
        <div className="forbidden-box">
          <h2>Access Denied</h2>
          <p>You need to log in first to take the test.</p>
        </div>
      </div>
    );
  }

  const question = questions[current];

  const handleOptionClick = (option) => {
    if (!submitted) setSelected(option);
  };

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    if (selected === question.answer) setScore((prev) => prev + 1);
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelected(null);
    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setFinished(false);
  };

  return (
    <Section color="black">
      <div className="testpage-container">
        <div className="test-box">
          {!finished ? (
            <>
              <h1>Colors Test</h1>
              <h3>
                Question {current + 1} of {questions.length}
              </h3>
              <p className="question">{question.question}</p>

              <div className="options">
                {question.options.map((option, index) => {
                  let className = "option-btn";
                  if (submitted) {
                    if (option === question.answer) className += " correct";
                    else if (option === selected) className += " wrong";
                    else className += " disabled";
                  } else if (selected === option) className += " selected";
                  return (
                    <button
                      key={index}
                      className={className}
                      onClick={() => handleOptionClick(option)}
                      disabled={submitted}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {submitted ? (
                <div className="explain-box">
                  <p>{selected === question.answer ? "Correct!" : "Wrong!"}</p>
                  <p>{question.explanation}</p>
                  <button className="next-btn" onClick={handleNext}>
                    {current + 1 === questions.length ? "Finish" : "Next"}
                  </button>
                </div>
              ) : (
                <button
                  className="next-btn"
                  onClick={handleSubmit}
                  disabled={!selected}
                >
                  Submit
                </button>
              )}
            </>
          ) : (
            <div className="result-box">
              <img
                className="color-img"
                src="https://www.pngmart.com/files/23/Color-Wheel-PNG-Photos.png"
                alt="Good image"
              />
              <h2>Test Completed!</h2>
              <p>
                You scored {score} out of {questions.length}.
              </p>
              <button className="next-btn" onClick={handleRestart}>
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

export default transition(TestPage);