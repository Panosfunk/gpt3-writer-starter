import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useEffect, useState } from 'react';

const Home = () => {

  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  const callGenerateEndpoint = async () => {
    if (isGenerating) {
      return;
    }
    setIsGenerating(true);

    console.log("Calling OpenAI...")

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userInput}),
    });

    const data = await response.json();
    const {output} = data;

    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }

  useEffect(() => {
    const listener = event => {
      if (event.keyCode === 13 && event.ctrlKey) {
        callGenerateEndpoint();
      }
    };

    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Transform Your Ideas into Python Code</h1>
          </div>
          <div className="header-subtitle">
            <h2 align='center'>
              Unleash the Power of Python with Automated Code Generation. <br/>
              Generate Python Code Instantly - No Coding Required
            </h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea
            placeholder="Give me a task to do. Make sure to type it in plain English :) &#13;&#10;
            e.g Generate 100 random integers."
            className="prompt-box"
            value={userInput}
            onChange={onUserChangedText}
          />
          <div className="prompt-buttons">
            <a className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
              <div className='generate'>
                {isGenerating ? <span className='loader'></span> : <p>Generate</p>}
              </div>
            </a>
          </div>

          <div className='output'>
            <div className='output-content'>
              <p className='droid'></p>
            </div>
          </div>

          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p align='left'>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
