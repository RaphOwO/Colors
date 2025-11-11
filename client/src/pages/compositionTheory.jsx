import { useEffect, useRef } from 'react';
import infoData from '../content/composition.json';
import '../styles/compositionTheory.css';

function CompositionPage() {
	const itemRefs = useRef([]);

	const setItemRef = (el) => {
		if (el && !itemRefs.current.includes(el)) {
			itemRefs.current.push(el);
		}
	};

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
					} else {
						entry.target.classList.remove('visible');
					}
				});
			},
			{ threshold: 0.5, rootMargin: '-10% 0px -10% 0px' }
		);

		itemRefs.current.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	}, []);

	return (
		<div className="composition-page">
			<div className="info-item" ref={setItemRef}>
				<div className="info-text">
					<h2>{infoData[0].topic}</h2>
					<p>{infoData[0].content}</p>
				</div>
			</div>

			<div className="info-item" ref={setItemRef}>
				<div className="info-img">
					<img src={infoData[1].img} alt={infoData[1].topic} />
				</div>
				<div className="info-text">
					<h2>{infoData[1].topic}</h2>
					<p>{infoData[1].content}</p>
				</div>
			</div>

			<div className="info-item" ref={setItemRef}>
				<div className="info-text">
					<h2>{infoData[2].topic}</h2>
					<p>{infoData[2].content}</p>
				</div>
				<div className="info-img">
					<img src={infoData[2].img} alt={infoData[2].topic} />
				</div>
			</div>

			<div className="info-item" ref={setItemRef}>
				<div className="info-img">
					<img src={infoData[3].img} alt={infoData[3].topic} />
				</div>
				<div className="info-text">
					<h2>{infoData[3].topic}</h2>
					<p>{infoData[3].content}</p>
				</div>
			</div>

			<div className="info-item" ref={setItemRef}>
				<div className="info-text">
					<h2>{infoData[4].topic}</h2>
					<p>{infoData[4].content}</p>
				</div>
				<div className="info-img">
					<img src={infoData[4].img} alt={infoData[4].topic} />
				</div>
			</div>

			<div className="info-item" ref={setItemRef}>
				<div className="info-img">
					<img src={infoData[5].img} alt={infoData[5].topic} />
				</div>
				<div className="info-text">
					<h2>{infoData[5].topic}</h2>
					<p>{infoData[5].content}</p>
				</div>
			</div>

			<div className="info-item" ref={setItemRef}>
				<div className="info-text">
					<h2>{infoData[6].topic}</h2>
					<p>{infoData[6].content}</p>
				</div>
				<div className="info-img">
					<img src={infoData[6].img} alt={infoData[6].topic} />
				</div>
			</div>
		</div>
	);
}

export default CompositionPage;
