import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css'; // Import CSS file for styling

function Chatbot() {
  const [messagePairs, setMessagePairs] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatbotResponse, setChatbotResponse] = useState(''); // Define state for chatbot response

  const handleChatbotRequest = () => {
    setLoading(true);
    const userMessage = `YOU: ${userInput}`;
    axios.get(`http://localhost:3000/generate?prompt=${userInput}`)
      .then((response) => {
        const chatbotMessage = `CHATBOT: ${response.data}`;
        setMessagePairs((prevPairs) => [
          ...prevPairs,
          { user: userMessage, chatbot: chatbotMessage },
        ]);
        setChatbotResponse(response.data); // Set chatbot response
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching chatbot response:', error);
        setLoading(false);
      });
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userInput.trim() !== '') {
      handleChatbotRequest();
      setUserInput('');
    }
  };

  const convertMarkdownToHtml = (markdownText) => {
    let htmlText = markdownText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    htmlText = htmlText.replace(/^\*\*([^:]+):\*\*$/gm, '<br><strong>$1:</strong><br>');
    htmlText = htmlText.replace(/^\* ([^\*]+)/gm, '<li>$1</li>');
    htmlText = htmlText.replace(/(<li>[^<]+<\/li>)+/gs, '<ul>$&</ul>');
    return htmlText;
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messagePairs.map((pair, index) => (
          <div key={index} className="chat-message-pair">
            <div className="chat-message">
              <span className="chat-message-sender">{pair.user}</span>
            </div>
            <div className="chat-message">
              <span dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(pair.chatbot) }}></span>
            </div>
            <div className="blank-line"></div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input type="text" value={userInput} onChange={handleInputChange} placeholder="Enter your message..." className="input-field"/>
        <button type="submit" disabled={loading} className="send-button">{loading ? 'Loading...' : 'Send'}</button>
      </form>
    </div>
  );
}

export default Chatbot;
