import React, { useState, useEffect } from 'react';

const initialConversations = [
  { id: 1, name: 'Alice Johnson', lastMessage: 'Thank you for the clarification!', unread: 2, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Bob Smith', lastMessage: 'When is the next assignment due?', unread: 0, avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Charlie Brown', lastMessage: 'I\'ve submitted my project.', unread: 1, avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Diana Ross', lastMessage: 'Can we schedule a meeting?', unread: 0, avatar: 'https://i.pravatar.cc/150?img=4' },
];

const initialMessages = [
  { id: 1, sender: 'Alice Johnson', content: 'Hello, professor! I have a question about the last lecture.', timestamp: '10:30 AM', isSent: false },
  { id: 2, sender: 'You', content: 'Sure, Alice. What would you like to know?', timestamp: '10:32 AM', isSent: true },
  { id: 3, sender: 'Alice Johnson', content: 'Could you explain the concept of polymorphism again?', timestamp: '10:33 AM', isSent: false },
  { id: 4, sender: 'You', content: 'Of course! Polymorphism is a concept in object-oriented programming...', timestamp: '10:35 AM', isSent: true },
];

export default function Messages() {
  const [conversations, setConversations] = useState(initialConversations);
  const [filteredConversations, setFilteredConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showConversations, setShowConversations] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filtered = conversations.filter(conversation =>
      conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [searchTerm, conversations]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: true
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    setShowConversations(false);
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* Conversation list */}
      <div className={`w-full md:w-1/3 bg-white border-r border-gray-200 ${showConversations ? 'block' : 'hidden md:block'}`}>
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="overflow-y-auto h-full">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleConversationClick(conversation)}
            >
              <img src={conversation.avatar} alt={conversation.name} className="w-12 h-12 rounded-full mr-3" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{conversation.name}</h3>
                  <span className="text-xs text-gray-500">12:30 PM</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
              </div>
              {conversation.unread > 0 && (
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                  {conversation.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className={`flex-1 flex flex-col bg-gray-100 ${!showConversations ? 'block' : 'hidden md:block'}`}>
        {selectedConversation ? (
          <>
            <div className="bg-gray-200 p-4 flex items-center border-b border-gray-300">
              <button className="md:hidden mr-2 text-gray-600" onClick={() => setShowConversations(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-10 h-10 rounded-full mr-3" />
              <h2 className="text-lg font-semibold">{selectedConversation.name}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isSent ? 'bg-green-100' : 'bg-white'}`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-right text-xs text-gray-500 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="bg-gray-200 p-4 flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded-full ml-2 hover:bg-green-600 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}