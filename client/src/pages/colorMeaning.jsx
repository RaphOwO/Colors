import { useState, useEffect, useRef } from "react";
import { CheckCircle, Languages } from "lucide-react";
import transition from "../components/transition";
import Section from "../components/section";
import { Snackbar } from "../components/snackbar";
import { snackbarAlert } from "../components/snackbarAlert";
import '../styles/meaning.css'

function RestaurantButton({ name, color, gradient, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "80%",
        backgroundColor: color,
        border: "none",
        borderRadius: "1.2rem",
        padding: "1rem 1.5rem",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "transform 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "50%",
            background: gradient,
          }}
        />
        <div style={{ textAlign: "left" }}>
          <div style={{ fontWeight: "bold", color: "#3a3a3a" }}>{name}</div>
          <div style={{ fontSize: "0.9rem", color: "#555" }}>Subheading</div>
        </div>
      </div>
      <div
        style={{
          width: "2rem",
          height: "2rem",
          borderRadius: "50%",
          background: "#fff4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        →
      </div>
    </button>
  );
}



function Meaning() {
    const [answer, setAnswer] = useState("Click on the one you think would sell Fried Chicken");
    const [correct, setCorrect] = useState(false);
    const sectionRef = useRef(null);
    const [lockScrollPos, setLockScrollPos] = useState(null);

    const handleAnswer = (choice) => {
        if (choice === "Restaurant1") {
        setAnswer("Of course, it'd be that one!");
        setCorrect(true);
        setLockScrollPos(false);
        } else {
        setAnswer("Please take this seriously");
        }
    };

    useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !correct) {
          setLockScrollPos(window.scrollY);
        }
      },
      { threshold: 1,
        rootMargin: '0px 0px -30% 0px'
       }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [correct]);

  useEffect(() => {
    const handleScroll = () => {
      if (lockScrollPos !== null && !correct) {
        if (window.scrollY > lockScrollPos + 20) {
          window.scrollTo({ top: lockScrollPos, behavior: "instant" });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lockScrollPos, correct]);

    const restaurantsData = [
        { name: "Restaurant1", color: "#fff4e3", gradient: "linear-gradient(45deg, orange, brown)" },
        { name: "Restaurant2", color: "#eef2ff", gradient: "linear-gradient(45deg, #3b82f6, #60a5fa)" },
        { name: "Restaurant3", color: "#f9ebff", gradient: "linear-gradient(45deg, #a855f7, #d8b4fe)" },
        { name: "Restaurant4", color: "#f4ffe3", gradient: "linear-gradient(45deg, #22c55e, #86efac)" },
    ];

    return (
        <div className="meaning-page">
            <Section color="black">
                <div className="titleArea">
                    <div className="meaning-title">
                        <h2><label style={{fontFamily: "Ananias"}}>COLORS</label> HAVE</h2>
                        <h1>MEANING</h1>
                    </div>
                </div>
            </Section>
            <Section color="white">
                <div className="ondebox">
                    <svg
                        className="onde"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 24 150 28"
                        preserveAspectRatio="none"
                        shapeRendering="auto"
                    >
                        <defs>
                        <path
                            id="onda"
                            d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352Z"
                        />
                        </defs>
                        <g className="parallaxonde">
                        <use xlinkHref="#onda" x="48" y="0" fill="rgba(81, 81, 81, 0.6)" />
                        <use xlinkHref="#onda" x="48" y="3" fill="rgba(64, 67, 67, 0.4)" />
                        <use xlinkHref="#onda" x="48" y="5" fill="rgba(85, 96, 95, 0.1)" />
                        <use xlinkHref="#onda" x="48" y="7" fill="#121212" />
                        </g>
                    </svg>
                </div>
                <div className="area">
                    <div className="lArea1">
                        <div style={{height: "50vh"}}>
                            <h2 className="header" id="shrinkInOut">Let me first Ask you</h2>
                        </div>
                        <div style={{height: "170vh"}}>
                            <div style={{position: 'sticky', top: '0', paddingTop: '30vh'}}>
                                <h4 className="bigtext" id="shrinkInOut" style={{marginBottom: "10vh"}}>What color should this be?</h4>
                                <Snackbar
                                    iconType="error"
                                    message="This is a snackbar"
                                    iconBg="lightgray"
                                    iconColor="white"
                                    textColor="#333"
                                    canClose={false}
                                    snackScale={2}
                                    id="shrinkInOut"
                                    className="snackbar"
                                    iconBgClass="firstBar"
                                />
                                <div className="circling"></div>
                            </div>
                        </div>
                        <h4 className="bigtext" style={{marginTop: '60vh'}} id="shrinkInOut">Well, it depends</h4>
                        <div style={{width: '100%', height: '240vh'}}>
                            <div className="successBar">
                                <Snackbar
                                    iconType="success"
                                    message="Successfully login!"
                                    iconBg="lightgray"
                                    iconColor="white"
                                    textColor="#333"
                                    canClose={false}
                                    snackScale={1.5}
                                    id="shrinkInOut"
                                    iconBgClass="success"
                                />
                            </div>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'end'}}>
                                <div className="successtext">
                                    <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>Now, what about this?<br/>What color should this icon be?</h4>
                                    <h4 className="text" id="shrinkInOut">Of course, it'd be a 
                                        <label style={{color: 'rgba(122, 214, 103, 1)'}}> SUCCESS</label> color</h4>
                                </div>
                            </div>
                        </div>
                        <h4 className="bigtext" style={{width: '70%', padding: '40vh 0'}} id="shrinkInOut">But why is it 
                            <label style={{color: 'rgba(122, 214, 103, 1)'}}> SUCCESS</label> and not just 
                            <label style={{color: 'rgba(122, 214, 103, 1)'}}> GREEN</label></h4>
                        <div style={{width: '100%', paddingBottom: '10vh'}}>
                            <h4 className="text" id="fadeIn" style={{position: 'sticky', top: '20vh', marginBottom: '40vh'}}>That's because <label style={{fontFamily: "Ananias"}}>COLORS</label> have 
                            <label style={{color: 'rgb(213, 213, 0)'}}> MEANING</label></h4>
                            <h4 className="text" id="fadeIn" style={{position: 'sticky', top: '30vh', color: 'rgb(208, 0, 0)', marginBottom: '40vh'}}>Love • Passion • Energy • Danger • Anger</h4>
                            <h4 className="text" id="fadeIn" style={{position: 'sticky', top: '40vh', color: 'rgb(255, 140, 0)', marginBottom: '40vh'}}>Creativity • Warmth • Enthusiasm • Change</h4>
                            <h4 className="text" id="fadeIn" style={{position: 'sticky', top: '50vh', color: 'rgb(255, 215, 0)', marginBottom: '40vh'}}>Happiness • Optimism • Energy • Joy</h4>
                            <h4 className="text" id="fadeIn" style={{position: 'sticky', top: '60vh', color: 'rgb(34, 139, 34)', marginBottom: '40vh'}}>Nature • Growth • Balance • Renewal</h4>
                            <h4 className="text" id="fadeIn" style={{position: 'sticky', top: '70vh', color: 'rgb(30, 144, 255)', marginBottom: '40vh'}}>Trust • Calm • Stability • Peace</h4>
                            <h4 className="text" id="fadeIn" style={{position: 'sticky', top: '80vh', color: 'rgb(138, 43, 226)', marginBottom: '40vh'}}>Wisdom • Royalty • Mystery • Imagination</h4>
                        </div>
                    </div>
                </div>
            </Section>
            <Section color="white">
                <div className="area">
                    <div className="lArea2">
                        <div style={{width: '100%', height: '150vh'}}>
                            <h4 className="text" style={{position: 'sticky', top: '30vh', marginBottom: '30vh'}}>However, that's not without <label style={{color: 'gold'}}>CONTEXT</label></h4>
                            <h4 className="text" id="fadeIn" style={{position: 'sticky', top: '40vh', marginBottom: '30vh'}}><label style={{fontFamily: 'Ananias'}}>COLORS</label> would be meaningless without it</h4>
                            <h4 className="text" id="fadeIn" style={{position: 'sticky', top: '50vh', marginBottom: '30vh'}}>Here're what give them <label style={{color: 'rgb(213, 213, 0)'}}>MEANING</label></h4>
                        </div>
                        <div style={{width: '100%', height: '150vh'}}>
                            <h4 className="header" style={{position: 'sticky', top: '30vh', marginBottom: '40vh', paddingTop: '15vh'}}>LITERAL CONTEXT</h4>
                        </div>
                        <div style={{width: '100%'}}>
                            <div style={{position: 'sticky', top: '15vh', width: '50%', justifySelf: 'end', paddingTop: '2vh', paddingRight: '10vw',
                                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'end'}}>
                                <button 
                                id="goesOut"
                                className="colorButton"
                                style={{"--after-bg": "rgba(234, 84, 84, 1)"}}
                                onClick={() => {
                                    snackbarAlert({
                                        iconType: "error",
                                        message: "Something went wrong!",
                                        iconBgClass: "redfade",
                                        iconColor: "white",
                                        duration: 2500,
                                    });
                                }}>X</button>
                                <button 
                                id="goesOut"
                                className="colorButton"
                                style={{"--after-bg": "rgba(234, 224, 84, 1)"}}
                                onClick={() => {
                                    snackbarAlert({
                                        iconType: "warning",
                                        message: "Warning!",
                                        iconBgClass: "yellowfade",
                                        iconColor: "white",
                                        duration: 2500,
                                    });
                                }}>X</button>
                                <button 
                                id="goesUp"
                                className="colorButton"
                                style={{"--after-bg": "rgba(149, 234, 84, 1)"}}
                                onClick={() => {
                                    snackbarAlert({
                                        iconType: "success",
                                        message: "Something went well!",
                                        iconBgClass: "greenfade",
                                        iconColor: "white",
                                        duration: 2500,
                                    });
                                }}>X</button>
                            </div>
                            <div className="literalText1">
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>Here're some buttons for example</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>The button itself doesn't convey any message despite being colored</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>That's because the message doesn't exist</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>Now try to <label style={{color: 'gold'}}>press</label> the buttons</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>The snackbars give colors the <label style={{color: 'gold'}}>context </label>
                                 and <label style={{color: 'gold'}}>meaning</label></h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>In this context, we see
                                    <label style={{color: 'rgba(255, 32, 32, 1)'}}> ERROR</label>, <label style={{color: 'rgba(251, 224, 74, 1)'}}> WARNING</label>, and 
                                    <label style={{color: 'rgba(107, 237, 81, 1)'}}> SUCCESS</label></h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>Now, let's try to remove the colors</h4>
                            </div>
                            <div className="literalText2">
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>Now try to <label style={{color: 'gold'}}>press</label> the buttons again</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>The <label style={{color: 'gold'}}>Meaning</label> is not lost when color gets removed. It's just not as 
                                    <label style={{color: 'gold'}}> obvious</label> at a glance</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>However, colors are not meaningless at all without the message</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>We can still get a <label style={{color: 'gold'}}>vague</label> feeling from each button:
                                    <label style={{color: 'rgba(255, 32, 32, 1)'}}> NEGATIVE</label>, <label style={{color: 'rgba(251, 224, 74, 1)'}}> TENTATIVE</label>, and 
                                    <label style={{color: 'rgba(107, 237, 81, 1)'}}> AFFIRMATIVE</label></h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>Unlike snackbar, that indicates that something BAD
                                    <label style={{color: 'rgba(255, 32, 32, 1)', fontStyle: 'italic'}}> just</label> happened</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}><label style={{color: 'gold'}}>Interactive</label> elements, like buttons, indicate that something BAD
                                    <label style={{color: 'rgba(255, 32, 32, 1)', fontStyle: 'italic'}}> will</label> happen</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '90vh'}}>Literal Context can justify doing things that seemingly make no sense</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>Like putting <label style={{color: 'rgba(107, 237, 81, 1)'}}>X</label> on this Affirmative button</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>This can actually create some really useful <label style={{color: 'rgba(107, 237, 81, 1)'}}>Contradiction</label></h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>Here's a common example</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>Notice that the NO has an <label style={{color: 'rgba(34, 98, 187, 1)'}}>Affirmative</label> color</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>That's to encourage the user to press <label style={{color: 'rgba(34, 98, 187, 1)'}}>NO</label></h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>Now what if we remove icon?</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>So now we only have <label style={{fontFamily: "Ananias"}}>COLORS</label>, and we leave the realm of Literal Context</h4>
                                <h4 className="text" id="shrinkInOut" style={{paddingBottom: '40vh'}}>So, does these still have <label style={{color: 'gold'}}>Meaning</label>?</h4>
                            </div>
                        </div>
                        <img src="https://europe1.discourse-cdn.com/unity/original/4X/6/0/1/6018354e9e7bd9516c06935239543000b7ccd244.png" className="window"></img>
                    </div>
                </div>
            </Section>
            <Section color='white'>
                <div className="area">
                    <div className="cArea1">
                        <div style={{width: '100%', height: '150vh'}}>
                            <h4 className="header" style={{position: 'sticky', top: '30vh', marginBottom: '40vh', paddingTop: '15vh'}}>CULTURAL CONTEXT</h4>
                        </div>
                        <div style={{width: '100%', height: '700vh', display: 'flex'}}>
                            <div style={{width: '100%', height: '100vh', position: 'sticky', top: '0',
                                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                            }}>
                                <h4 className="bigtext" id="fadeIn" style={{width: '85%', justifySelf: 'center', marginBottom: '10vh'}}>Everything we see, we associate with something else</h4>
                                <div className="threeColors" id="fadeIn">
                                    <div className="colorRed"/>
                                    <div className="colorYellow"/>
                                    <div className="colorGreen"/>
                                </div>
                                <img src="https://png.pngtree.com/png-clipart/20230529/ourmid/pngtree-traffic-lights-png-image_7113828.png" className="traffic"></img>
                                <img src="https://i.sstatic.net/n2VDy.png" className="macIcon"></img>
                                <label className="stoptext">Red here doesn't literally mean 
                                    <label style={{color: 'red'}}> Stop</label>. 
                                    But there's this vague feeling of <label style={{color: 'red'}}>Stopiness</label></label>
                            </div>
                        </div>
                        <div style={{width: '100%', height: '840vh', display: 'flex'}}>
                            <div style={{width: '50%', position: 'absolute', right: '0', 
                                textAlign: 'right', paddingTop: '80vh', paddingRight: '5vw'}}>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>Now, which one of these do you think would be selling 
                                    <label style={{color: 'gold'}}> Fried Chicken</label>?</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}} ref={sectionRef}>{answer}</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '80vh'}}>Now, <label style={{color: 'gold'}}>WHY</label> would you think that?</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '60vh'}}>That's because we see these palettes in it</h4>
                                <h4 className="text" id="shrinkInOut" style={{marginBottom: '100vh'}}>And where else could we see these?</h4>
                                <h4 className="chickenText" style={{marginBottom: '60vh'}}>Of course, it's not like we have a clear symbolic representation in our mind like this</h4>
                                <h4 className="chickenText" style={{marginBottom: '110vh'}}>But, we only have <label style={{color: 'gold'}}>vague</label> feelings about it. Like this</h4>
                                <h4 className="chickenText">All we know is that they have something to do with each other</h4>
                            </div>
                            <div
                                className="res"
                                style={{
                                width: "50%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "1.2rem",
                                }}
                            >
                                {restaurantsData.map((r) => (
                                <RestaurantButton
                                    key={r.name}
                                    name={r.name}
                                    color={r.color}
                                    gradient={r.gradient}
                                    onClick={() => handleAnswer(r.name)}
                                />
                                ))}
                            </div>
                            <div className="palette1" id="palette" style={{backgroundColor: '#fff4e3'}}/>
                            <div className="palette2" id="palette" style={{backgroundColor: 'rgba(240, 154, 49, 1)'}}/>
                            <div className="palette3" id="palette" style={{backgroundColor: 'rgba(202, 87, 0, 1)'}}/>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJXz2mbSj2k8HxibqZpvDSiTF2Y3sD9bHrVg&s" className="friedChicken"></img>
                        </div>
                        <div></div>
                    </div>
                    <div style={{width: '100%', height: '100vh', display: 'flex', textAlign: 'center',
                        justifyContent: 'center', alignItems: 'center'}}>
                        <h2 style={{fontSize: 'clamp(3rem, 10vw, 15rem)'}}>THAT'S ALL ABOUT <label style={{fontFamily: 'Ananias'}}>COLORS</label></h2>
                    </div>
                </div>
            </Section>
        </div>
    );
}

export default transition(Meaning);