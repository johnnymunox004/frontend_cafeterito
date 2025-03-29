import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function SplineScene() {
  const [loaded, setLoaded] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  // Detectar scroll para animar el botón
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newOpacity = Math.max(1 - scrollY / 200, 0);
      setScrollOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="h-screen w-full relative">
      <motion.div 
        className="absolute inset-0 bg-amber-900"
        initial={{ opacity: 1 }}
        animate={{ opacity: loaded ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="h-full w-full flex items-center justify-center">
          <motion.div
            animate={{ 
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }}
            className="text-amber-200"
          >
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 8H19C20.1046 8 21 8.89543 21 10V16C21 17.1046 20.1046 18 19 18H5C3.89543 18 3 17.1046 3 16V10C3 8.89543 3.89543 8 5 8H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 16V4M12 4L15 7M12 4L9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="mt-2 text-amber-200 animate-pulse">Cargando experiencia de café...</p>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute inset-0">
        <Spline 
          scene="https://prod.spline.design/u6fQL0FW5dRBJXlX/scene.splinecode" 
          onLoad={() => setLoaded(true)}
        />
      </div>
      
      <motion.div 
        className="absolute bottom-10 left-0 right-0 text-center"
        style={{ opacity: scrollOpacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <motion.a 
          href="#content" 
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-lg transition-colors inline-block"
          whileHover={{ scale: 1.05, backgroundColor: '#b45309' }}
          whileTap={{ scale: 0.95 }}
        >
          Explorar Cafeterito
          <motion.div 
            animate={{ y: [0, 5, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mt-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </motion.a>
      </motion.div>
    </div>
  );
}