import  { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [links, setLinks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [displayVideos, setDisplayVideos] = useState(true);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = () => {
    setLoadingLinks(true);
    axios.get(`http://localhost:3000/generate?prompt=Only return 5 website-links where I can learn the topics ${inputText}`)
      .then(response => {
        const linksArray = response.data.split('\n').filter(link => link.trim() !== '');
        setLinks(linksArray);
        console.log("links are there")
        setSubmitted(true);
        setLoadingLinks(false);
      })
      .catch(error => {
        console.error('Error fetching links:', error);
        setLoadingLinks(false);
      });
  };

  useEffect(() => {
    if (submitted) {
      setLoadingVideos(true);
      axios.get(`http://localhost:3000/searchVideos?q=learn ${inputText} full course`)
        .then(response => {
          setVideos(response.data.slice(0, 6)); // Limiting to 6 videos
          setLoadingVideos(false);
        })
        .catch(error => {
          console.error('Error fetching videos:', error);
          setLoadingVideos(false);
        });
    }
  }, [submitted, inputText]);

  const toggleDisplay = () => {
    setDisplayVideos(!displayVideos);
  };

  return (
    <div className={`App ${submitted ? 'submitted' : ''}`}>
      <div className="input-container">
  <h1>Edu-Compass</h1>
  <input
    type="text"
    value={inputText}
    onChange={handleInputChange}
    placeholder="Type anything..."
  />
  <br /> {/* Add line break */}
  <button onClick={handleSubmit} className="submit-button">
    {loadingLinks ? 'Loading...' : 'Submit'}
  </button>
</div>
      {submitted && (
        <div className="submitted-container">
          <div className="toggle-container">
            <h1>{inputText}</h1>
            <button onClick={toggleDisplay} className="toggle-button">
              {displayVideos ? 'Show Links' : 'Show Videos'}
            </button>
          </div>
          {displayVideos ? (
            <div className="videos-container">
              <h3>Videos</h3>
              {loadingVideos ? (
                <p>Loading videos...</p>
              ) : (
                <div className="video-cards">
                  {videos.map((video, index) => (
                    <div key={index} className="video-card">
                      <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                        <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                        <div className="video-info">
                          <h4 className="video-title">{video.snippet.title}</h4>
                          <p className="video-channel">{video.snippet.channelTitle}</p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="links-container">
              <h3>Links</h3>
              {links.map((link, index) => {
                // Extracting the actual link from markdown format if present
                const match = link.match(/\[(.*?)\]\((.*?)\)/);
                const extractedLink = match ? match[2] : link;

                return (
                  <div key={index} className="link-card">
                    <a href={extractedLink.substring(3)} target="_blank" rel="noopener noreferrer">
                      <span className="link-icon">🔗</span>
                      <span className="link-text">{extractedLink}</span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
