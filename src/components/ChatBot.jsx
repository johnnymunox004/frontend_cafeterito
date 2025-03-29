import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { text: '¡Hola! Soy CaféBot 🤖☕ ¿En qué puedo ayudarte hoy?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll al recibir nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simular respuestas del bot
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Añadir mensaje del usuario
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    
    // Simular bot escribiendo
    setIsTyping(true);
    
    // Simular respuesta después de 1-2 segundos
    setTimeout(() => {
      setIsTyping(false);
      let response;
      const userMessage = input.toLowerCase();
      
      if (userMessage.includes('precio') || userMessage.includes('costo')) {
        response = 'Nuestros precios varían entre $10 y $25 dependiendo del tipo de café. ¿Te interesa alguno en particular?';
      } else if (userMessage.includes('origen') || userMessage.includes('procedencia')) {
        response = 'Trabajamos con cafés de Colombia, Etiopía, Brasil y Guatemala. ¡Todos cultivados de manera sostenible!';
      } else if (userMessage.includes('envío') || userMessage.includes('entrega')) {
        response = 'Realizamos envíos a todo el país en 2-3 días hábiles. ¡Envío gratis en compras mayores a $50!';
      } else {
        response = 'Gracias por tu mensaje. ¿Puedo ayudarte con información sobre nuestros cafés, proceso de compra o métodos de preparación?';
      }
      
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    }, Math.random() * 1000 + 1000); // Entre 1 y 2 segundos
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