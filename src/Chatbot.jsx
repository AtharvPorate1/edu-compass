import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css'; // Import CSS file for styling

function Chatbot({ inputText }) {
  const [chatbotResponse, setChatbotResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChatbotRequest = () => {
    setLoading(true);
    axios.get(`http://localhost:3000/generate?prompt=${userInput}`)
      .then(response => {
        setChatbotResponse(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching chatbot response:', error);
        setLoading(false);
      });
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleChatbotRequest();
  };

  // Function to convert markdown to HTML
  const convertMarkdownToHtml = (markdownText) => {
    // Replace markdown syntax with corresponding HTML tags
    let htmlText = markdownText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
    htmlText = htmlText.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
    htmlText = htmlText.replace(/`(.*?)`/g, '<code>$1</code>'); // Code

    return htmlText;
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {chatbotResponse && (
          <div className="chat-message">
            <span className="chat-message-sender">Chatbot:</span>
            {/* Convert markdown response to HTML */}
            <span dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(chatbotResponse) }}></span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Enter your message..."
          className="input-field"
        />
        <button type="submit" disabled={loading} className="send-button">
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
