import { useEffect, useRef } from 'react';
import transition from '../components/transition';
import Section from '../components/section';
import infoData from '../content/composition.json';
import '../styles/compositionTheory.css';

function CompositionPage() {
	return (
		<div className='principles-page'>
			<Section color="black">
				<div className='titleDiv'>
					<h2 className='num'>4</h2>
					<h2 className='principles'>PRINCI
						PLES</h2>
					<h2 className='design'>UI
						DESIGN</h2>
				</div>	
				<div style={{width: '100%', height: '220vh'}}>
					<div className='stickypage'>
						<h2 className='crap' id='first'><label style={{color: 'transparent'}}>C</label>.R.A.P</h2>
						<h2 className='c'>C</h2>
					</div>
				</div>
				<div style={{width: '100%', height: '470vh'}}>
					<h3 className='topic'><label style={{color: 'transparent'}}>C</label>ontrast</h3>
					<h4 className='content'>Organize your design, establish hierarchy, emphasizes the <label style={{color: 'rgba(68, 203, 0, 1)'}}>focal point</label>, add visual interest.</h4>
					<h4 className='content'>This can be achieve through the contrast of <label style={{color: 'rgba(203, 20, 0, 1)'}}>COLORS</label></h4>
					<h4 className='content'>The contrast of <label style={{fontSize: 'clamp(4.5rem, 8vw, 15rem)'}}>SIZE</label></h4>
					<h4 className='content'>The contrast of <label style={{fontFamily: 'Ananias'}}>FONTS</label></h4>
					<h4 className='content'>The contrast of <label className='shape'>SHAPE</label></h4>
					<h4 className='content'>Basically, anything that'd make it <label style={{fontStyle: 'italic', textDecoration: 'underline', color: 'rgba(203, 20, 0, 1)'}}>STAND OUT</label></h4>
					<h4 className='content'>Here's an example layout {" ("}the contrast will be added as you scroll{")"}</h4>
				</div>
				<div style={{width: '100%', height: '300vh'}}>
					<div className='contrastEx'>
						<div className='conExDiv'>
							<p className='conExTitle'>Let's go outside and ride <label className='bikeText' style={{color: 'black'}}>bikes</label></p><br/>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
							<button className='conButton'>Select Shopping</button>
						</div>
						<img src='https://www.reidcycles.com.au/cdn/shop/files/MTB-Sport-MY24-1_1.png?v=1726010849&width=1100' className='conBike'></img>
					</div>
				</div>
				<div style={{width: '100%', height: '220vh'}}>
					<div className='stickypage'>
						<h2 className='crap' id='second'>C.<label style={{color: 'transparent'}}>R</label>.A.P</h2>
						<h2 className='r'>R</h2>
					</div>
				</div>			
				<div style={{width: '100%', height: '350vh'}}>
					<h3 className='topic'><label style={{color: 'transparent'}}>R</label>epetition</h3>
					<h4 className='content'>Repetition is all about creating <label style={{color: 'rgba(0, 132, 203, 1)'}}>Consistency</label> throughout your design</h4>
					<h4 className='content'>By repeating certain design elements, such as colors, typography, icons, and layouts</h4>
					<h4 className='content'>This increase user's <label style={{color: 'rgba(0, 132, 203, 1)'}}>Learnablilty</label></h4>
					<h4 className='content'>Hence, <label style={{fontStyle: 'italic'}}>reduces</label> <label style={{color: 'rgba(203, 24, 0, 1)'}}>Confusion</label></h4>
					<h4 className='content'>Here's an example layout</h4>
				</div>
				<div style={{width: '100%', height: '300vh', overflowX: 'clip'}}>
					<div className='repeatEx'>
						<div className='repeat'>
							<img className='firstImg' src='https://www.reidcycles.com.au/cdn/shop/files/MTB-Sport-MY24-1_1.png?v=1726010849&width=1100'></img>
							<div className='firstMes'>
								<h4>Let's go outside and ride </h4>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
							</div>
						</div>
						<div className='repeat' id='secondBlock'>
							<img className='secondImg' src='https://www.reidcycles.com.au/cdn/shop/files/MTB-Sport-MY24-1_1.png?v=1726010849&width=1100'></img>
							<div className='secondMes'>
								<h4>Let's go outside and ride </h4>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
							</div>
						</div>
						<div className='repeat'>
							<img className='thirdImg' src='https://www.reidcycles.com.au/cdn/shop/files/MTB-Sport-MY24-1_1.png?v=1726010849&width=1100'></img>
							<div className='thirdMes'>
								<h4>Let's go outside and ride </h4>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
							</div>
						</div>
					</div>
				</div>
			</Section>
			<Section color="black">
				<div style={{width: '100%', height: '220vh'}}>
					<div className='stickypage'>
						<h2 className='crap' id='third'>C.R.<label style={{color: 'transparent'}}>A</label>.P</h2>
						<h2 className='a'>A</h2>
					</div>
				</div>			
				<div style={{width: '100%', height: '350vh'}}>
					<h3 className='topic'><label style={{color: 'transparent'}}>A</label>lignment</h3>
					<h4 className='content'><label style={{color: 'rgba(0, 132, 203, 1)'}}>Organizes</label> and
						<label style={{color: 'rgba(0, 132, 203, 1)'}}> Group</label> elements with in your design</h4>
					<h4 className='content'>It creates a sense of <label style={{color: 'gold'}}>Structure</label></h4>
					<h4 className='content'>It also creates<label style={{color: 'gold'}}> Rhythm</label> and
						<label style={{color: 'rgba(0, 132, 203, 1)'}}> Flow</label></h4>
					<h4 className='content'>This can be achieved through the use of grids, guides, and the careful placement of text, images, and other UI components</h4>
					<h4 className='content'>Now, let's us continue from the previous example</h4>
				</div>
				<div style={{width: '100%', height: '300vh', overflowX: 'clip'}}>
					<div className='repeatEx'>
						<div className='repeat'>
							<img className='firstImg' src='https://www.reidcycles.com.au/cdn/shop/files/MTB-Sport-MY24-1_1.png?v=1726010849&width=1100'></img>
							<div className='firstMes'>
								<h4>Let's go outside and ride </h4>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
							</div>
						</div>
						<div className='repeat' id='secondBlock'>
							<img className='secondImg' src='https://www.reidcycles.com.au/cdn/shop/files/MTB-Sport-MY24-1_1.png?v=1726010849&width=1100'></img>
							<div className='secondMes'>
								<h4>Let's go outside and ride </h4>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
							</div>
						</div>
						<div className='repeat'>
							<img className='thirdImg' src='https://www.reidcycles.com.au/cdn/shop/files/MTB-Sport-MY24-1_1.png?v=1726010849&width=1100'></img>
							<div className='thirdMes'>
								<h4>Let's go outside and ride </h4>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
							</div>
						</div>
					</div>
				</div>
				<div style={{width: '100%', height: '220vh'}}>
					<div className='stickypage'>
						<h2 className='crap' id='fourth'>C.R.A.<label style={{color: 'transparent'}}>P</label></h2>
						<h2 className='p'>P</h2>
					</div>
				</div>			
				<div style={{width: '100%', height: '320vh'}}>
					<h3 className='topic'><label style={{color: 'transparent'}}>P</label>roximity</h3>
					<h4 className='content'>This refers to the spatial relationship between elements in your design</h4>
					<h4 className='content'>It is about making elements that are <label style={{color: 'gold'}}>Related</label> to each other visually appear closer together</h4>
					<h4 className='content'>help users understand the <label style={{color: 'gold'}}> Relationships</label> and
						<label style={{color: 'rgba(0, 132, 203, 1)'}}> Associations</label> between different parts of the interface</h4>
					<h4 className='content'>Here, let's go back and work with the first example</h4>
				</div>
				<div style={{width: '100%', height: '300vh'}}>
					<div className='contrastEx'>
						<div className='conExDiv'>
							<p className='conExTitle'>Let's go outside and ride <label className='bikeText' style={{color: 'black'}}>bikes</label></p><br/>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
							<button className='conButton'>Select Shopping</button>
						</div>
						<img src='https://www.reidcycles.com.au/cdn/shop/files/MTB-Sport-MY24-1_1.png?v=1726010849&width=1100' className='conBike'></img>
					</div>
				</div>
				<div style={{width: '100%', height: '100vh', display: 'flex', textAlign: 'center',
					justifyContent: 'center', alignItems: 'center', marginTop: '20vh'}}>
					<h2 style={{fontSize: 'clamp(3rem, 10vw, 15rem)'}}>THAT'S ALL ABOUT UI <label style={{fontFamily: 'Ananias'}}>COMPOSITION</label></h2>
				</div>
			</Section>
		</div>
	);
}

export default transition(CompositionPage);
