import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = () => {
    setLoading(true);
    axios.get(`http://localhost:3000/generate?prompt=Only return 5 website-links where I can learn the topics ${inputText}`)
      .then(response => {
        const linksArray = response.data.split('\n').filter(link => link.trim() !== '');
        setLinks(linksArray);
        setSubmitted(true);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching links:', error);
        setLoading(false);
      });
  };

  return (
    <div className={`App ${submitted ? 'submitted' : ''}`}>
      <div className={`input-container`}>
        {!submitted && (
          <>
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type anything..."
            />
            <button onClick={handleSubmit} className="submit-button">
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </>
        )}
      </div>
      {submitted && (
        <div className="submitted-container">
          <h2 className="submitted-title">{inputText}</h2>
          <div className="links-container">
          <h3>Links</h3>
          {links.map((link, index) => (
  <div key={index} className="link-card">
    
    <a href={link.substring(3)} target="_blank" rel="noopener noreferrer">
      <span className="link-icon">🔗</span>
      <span className="link-text">{link}</span>
    </a>
  </div>
))}

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
