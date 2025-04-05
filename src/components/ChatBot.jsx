import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { 
      text: '¡Hola! Soy CaféBot 🤖☕ Estoy aquí para responder tus preguntas sobre café, métodos de preparación, y más.', 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    setMessages([...messages, { text: input, sender: 'user' }]);
    const userMessage = input;
    setInput('');
    
    // Simular bot escribiendo
    setIsTyping(true);
    setIsError(false);
    
    try {
      // Llamar al endpoint con el formato correcto
      const response = await fetch('https://597d-135-237-130-232.ngrok-free.app/coffee-expert/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          pregunta: userMessage,
          user_id: 'web_user',
          session_id: Date.now().toString()
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        throw new Error('Error en la respuesta del servidor');
      }
      
      const data = await response.json();
      
      // Añadir respuesta del bot
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        text: data.respuesta || 'Lo siento, no pude procesar tu solicitud.', 
        sender: 'bot' 
      }]);
      
    } catch (error) {
      console.error('Error al comunicarse con el bot:', error);
      setIsTyping(false);
      setIsError(true);
      setMessages(prev => [...prev, { 
        text: 'Lo siento, estoy teniendo problemas para responder. Por favor, intenta de nuevo más tarde.', 
        sender: 'bot',
        isError: true
      }]);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      className={`rounded-lg shadow-xl border border-amber-200 overflow-hidden bg-white flex flex-col ${isExpanded ? 'h-[500px]' : 'h-[420px]'}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-600 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base">CaféBot</h3>
            <p className="text-xs text-amber-100">Tu asistente virtual sobre café</p>
          </div>
        </div>
        <motion.button 
          onClick={toggleExpand}
          className="bg-white/10 rounded-full p-1.5 hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </motion.button>
      </div>
      
      {/* Chat window */}
      <motion.div 
        className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-amber-50 to-white"
        layout
      >
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <motion.div 
              key={index} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.sender === 'bot' && (
                <div className="h-8 w-8 rounded-full bg-amber-700 flex-shrink-0 mr-2 flex items-center justify-center text-white text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              )}
              
              <motion.div 
                className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white' 
                    : msg.isError
                      ? 'bg-red-50 border border-red-200 text-red-700'
                      : 'bg-white border border-amber-100 text-gray-800'
                }`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <p className="text-sm">{msg.text}</p>
                
                {/* Mostrar timestamp para los mensajes */}
                <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-amber-100' : 'text-gray-400'}`}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </motion.div>
              
              {msg.sender === 'user' && (
                <div className="h-8 w-8 rounded-full bg-amber-500 flex-shrink-0 ml-2 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
          
          <AnimatePresence>
            {isTyping && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="h-8 w-8 rounded-full bg-amber-700 flex-shrink-0 mr-2 flex items-center justify-center text-white text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <motion.div 
                  className="p-3 rounded-2xl shadow-sm bg-white border border-amber-100"
                >
                  <motion.div 
                    className="flex space-x-1"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                  >
                    <motion.div 
                      className="h-2 w-2 bg-amber-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                    />
                    <motion.div 
                      className="h-2 w-2 bg-amber-500 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                    />
                    <motion.div 
                      className="h-2 w-2 bg-amber-600 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div ref={messagesEndRef} />
      </motion.div>
      
      {/* Input area */}
      <div className="p-3 bg-amber-50 border-t border-amber-200">
        <div className="flex items-center gap-2">
          <motion.input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu pregunta sobre café..."
            className="flex-1 border border-amber-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white shadow-sm"
            whileFocus={{ boxShadow: '0px 0px 0px 2px rgba(217, 119, 6, 0.2)' }}
          />
          <motion.button 
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-amber-700 to-amber-600 text-white p-2.5 rounded-full shadow-sm flex items-center justify-center"
            whileHover={{ scale: 1.05, boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            disabled={isTyping || input.trim() === ''}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </motion.button>
        </div>
        
        {/* Footer info */}
        <div className="mt-2 flex justify-between text-xs text-amber-800 px-2">
          <p>Powered by CaféIA™</p>
          <p>
            {isTyping ? 'CaféBot está escribiendo...' : 
             isError ? 'Error de conexión' : 
             'Listo para ayudarte'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}