import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.match('image.*')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    setError(null);
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setUploading(true);
    
    // Simulación de carga
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
      
      // Reset después de 3 segundos
      setTimeout(() => {
        setSuccess(false);
        setImage(null);
        setPreviewUrl(null);
      }, 3000);
    }, 2000);
  };

  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold text-amber-900 mb-4">Comparte tu momento café</h3>
      <p className="text-gray-600 mb-6">Sube una foto disfrutando de nuestro café y participa en nuestro concurso mensual</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div 
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            isDragging 
              ? 'border-amber-500 bg-amber-50' 
              : 'border-amber-300 hover:bg-amber-50'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ boxShadow: '0px 5px 15px rgba(0,0,0,0.1)' }}
          animate={isDragging ? 
            { scale: 1.02, borderColor: '#f59e0b' } : 
            { scale: 1, borderColor: '#fcd34d' }
          }
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <AnimatePresence mode="wait">
            {previewUrl ? (
              <motion.div 
                className="relative"
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-64 mx-auto rounded-md" 
                />
                <motion.button 
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="py-8"
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 text-amber-400 mx-auto mb-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </motion.svg>
                <motion.label 
                  className="cursor-pointer bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Seleccionar imagen
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                </motion.label>
                <p className="text-gray-500 text-sm mt-2">o arrastra y suelta una imagen aquí</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              className="text-red-600 text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex gap-4 items-center">
          <motion.input 
            type="text" 
            placeholder="Describe tu experiencia con nuestro café" 
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            whileFocus={{ boxShadow: '0px 0px 0px 2px rgba(217, 119, 6, 0.2)' }}
          />
          
          <motion.button 
            type="submit" 
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              uploading 
                ? 'bg-amber-400 cursor-not-allowed' 
                : success 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-amber-600 hover:bg-amber-700'
            } transition-colors`}
            disabled={uploading}
            whileHover={!uploading ? { scale: 1.05 } : {}}
            whileTap={!uploading ? { scale: 0.95 } : {}}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full"
                />
                Subiendo...
              </span>
            ) : success ? '¡Compartido!' : 'Compartir'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}