import { useEffect, useRef } from 'react';
import Section from './../components/section.jsx';
import '../styles/theory.css';
import '../App.css';

function Color() {
  return (
    <div className="color-page" style={{width: '100%'}}>
      <Section color="#FF6347">
        <h1 className='red'>Red Section</h1>
      </Section>

      <Section color="#4682B4">
        <h1>Blue Section</h1>
      </Section>

      <Section color="#3CB371">
        <h1>Green Section</h1>
      </Section>
    </div>
  );
}

export default Color;
