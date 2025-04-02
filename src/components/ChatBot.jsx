import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { text: '¡Hola! Soy CaféBot 🤖☕ ¿En qué puedo ayudarte hoy?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isError, setIsError] = useState(false);

  // Auto-scroll al recibir nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enviar mensaje al endpoint y obtener respuesta
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Añadir mensaje del usuario
    setMessages([...messages, { text: input, sender: 'user' }]);
    const userMessage = input;
    setInput('');
    
    // Simular bot escribiendo
    setIsTyping(true);
    setIsError(false);
    
    try {
      // Llamar al endpoint con el formato correcto
      const response = await fetch('https://d691-135-237-130-232.ngrok-free.app/coffee-expert/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          pregunta: userMessage,  // Cambiado de 'query' a 'pregunta'
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
        sender: 'bot' 
      }]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Ventana de chat */}
      <motion.div 
        className="flex-1 p-4 overflow-y-auto bg-amber-50 rounded-t-lg" 
        style={{ maxHeight: '300px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {messages.map((msg, index) => (
          <motion.div 
            key={index} 
            className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
            initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className={`inline-block p-3 rounded-lg ${
                msg.sender === 'user' 
                  ? 'bg-amber-600 text-white rounded-tr-none' 
                  : 'bg-gray-200 text-gray-800 rounded-tl-none'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              {msg.text}
            </motion.div>
          </motion.div>
        ))}
        
        <AnimatePresence>
          {isTyping && (
            <motion.div 
              className="mb-3 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800 rounded-tl-none"
              >
                <motion.div 
                  className="flex gap-1"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                >
                  <span className="h-2 w-2 bg-gray-500 rounded-full"></span>
                  <span className="h-2 w-2 bg-gray-500 rounded-full"></span>
                  <span className="h-2 w-2 bg-gray-500 rounded-full"></span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </motion.div>
      
      <motion.div 
        className="border-t border-gray-200 p-3 flex"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Escribe tu pregunta..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          whileFocus={{ boxShadow: '0px 0px 0px 2px rgba(217, 119, 6, 0.2)' }}
        />
        <motion.button 
          onClick={handleSendMessage}
          className="bg-amber-600 text-white px-4 py-2 rounded-r-lg hover:bg-amber-700"
          whileHover={{ scale: 1.05, backgroundColor: '#b45309' }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
}