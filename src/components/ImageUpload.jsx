import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setUploading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch('https://597d-135-237-130-232.ngrok-free.app/analyze-roast/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al analizar la imagen');
      }

      const result = await response.json();
      setAnalysisResult(result);
      setSuccess(true);

      // Reset después de 3 segundos
      setTimeout(() => {
        setSuccess(false);
        setImage(null);
        setPreviewUrl(null);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const openImageModal = (imageData) => {
    setModalImage(imageData);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <motion.div 
        className="bg-gradient-to-br from-white to-amber-50 p-8 rounded-2xl shadow-lg border border-amber-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-amber-900 mb-2 flex items-center">
          <span className="bg-amber-500 text-white p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          Analiza tu café
        </h3>
        <p className="text-gray-600 mb-6 ml-14">Sube una imagen de tus granos de café para analizar el nivel de tostión</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-amber-500 bg-amber-50 shadow-inner' 
                : 'border-amber-300 hover:bg-amber-50/50'
            }`}
            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const files = e.dataTransfer.files;
              if (files && files.length > 0) {
                processFile(files[0]);
              }
            }}
          >
            <AnimatePresence mode="wait">
              {previewUrl ? (
                <motion.div 
                  className="relative"
                  key="preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <img 
                    src={previewUrl} 
                    alt="Vista previa" 
                    className="max-h-72 mx-auto rounded-lg shadow-md object-contain" 
                  />
                  <motion.button 
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600/90 backdrop-blur-sm text-white rounded-full p-2 hover:bg-red-700 hover:scale-105 transition-all shadow-lg"
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div 
                  className="py-12"
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <motion.label 
                    className="cursor-pointer bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 inline-block font-medium"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
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
                  <p className="text-gray-500 text-sm mt-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    o arrastra y suelta una imagen aquí
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {error && (
            <motion.div 
              className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200 flex items-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}
          
          {analysisResult && (
            <motion.div 
              className="bg-gradient-to-br from-amber-50 to-amber-100/70 p-5 rounded-xl text-amber-900 text-sm space-y-5 border border-amber-200 shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-lg text-amber-800">Resultado del Análisis</h4>
                <span className="bg-amber-200 text-amber-900 py-1 px-3 rounded-full text-xs font-medium">
                  {analysisResult.is_simulated ? "Simulación" : "Análisis Real"}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-amber-200">
                    <h5 className="font-medium mb-3 flex items-center text-amber-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Clasificación
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Nivel de tostión:</span>
                        <span className="font-bold text-base">{analysisResult.roast_level}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Confianza:</span>
                        <div className="flex items-center">
                          <div className="bg-gray-200 rounded-full h-2 w-20 mr-2">
                            <div 
                              className="bg-amber-600 h-2 rounded-full" 
                              style={{ width: `${analysisResult.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{(analysisResult.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {analysisResult.analysis && analysisResult.analysis.recommended_brewing ? (
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-amber-200">
                      <h5 className="font-medium mb-3 flex items-center text-amber-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Recomendación
                      </h5>
                      <p className="text-sm">{analysisResult.analysis.recommended_brewing}</p>
                    </div>
                  ) : (
                    analysisResult.recommended_brewing && (
                      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-amber-200">
                        <h5 className="font-medium mb-3 flex items-center text-amber-900">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Recomendación
                        </h5>
                        <p className="text-sm">{analysisResult.recommended_brewing}</p>
                      </div>
                    )
                  )}
                </div>
                
                <div className="space-y-4">
                  {analysisResult && analysisResult.analysis && analysisResult.analysis.chart_image ? (
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-amber-200">
                      <h5 className="font-medium mb-3 flex items-center text-amber-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Gráfico de análisis
                      </h5>
                      <div className="relative">
                        {analysisResult.analysis.chart_image.length > 100 ? (
                          <motion.div 
                            className="relative cursor-pointer group"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            onClick={() => openImageModal(analysisResult.analysis.chart_image)}
                          >
                            <img 
                              src={`data:image/png;base64,${analysisResult.analysis.chart_image}`} 
                              alt="Gráfico de análisis" 
                              className="max-w-full rounded-md shadow-sm border border-amber-300 bg-white"
                              onError={(e) => {
                                console.error("Error al cargar la imagen");
                                e.target.style.display = 'none';
                                document.getElementById('chart-error').style.display = 'block';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="p-4 bg-amber-100 border border-amber-300 rounded-md text-amber-800 text-xs">
                            Los datos de la imagen son insuficientes para mostrar el gráfico.
                          </div>
                        )}
                        <div id="chart-error" className="hidden p-4 bg-amber-100 border border-amber-300 rounded-md text-amber-800 mt-2 text-xs">
                          No se pudo cargar el gráfico. Los datos de imagen están incompletos o en un formato no compatible.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-amber-200">
                      <h5 className="font-medium mb-3 flex items-center text-amber-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Gráfico de análisis
                      </h5>
                      <p className="italic text-amber-700 text-xs">No hay gráfico disponible para este análisis.</p>
                    </div>
                  )}
                  
                  {analysisResult.analysis && analysisResult.analysis.class_probabilities && (
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-amber-200">
                      <h5 className="font-medium mb-3 flex items-center text-amber-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Probabilidades
                      </h5>
                      <div className="space-y-2">
                        {Object.entries(analysisResult.analysis.class_probabilities).map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{key}</span>
                              <span>{(value * 100).toFixed(1)}%</span>
                            </div>
                            <div className="bg-gray-200 rounded-full h-2 w-full">
                              <div 
                                className={`h-2 rounded-full ${
                                  key === "Dark" ? "bg-amber-800" : 
                                  key === "Medium" ? "bg-amber-600" : 
                                  key === "Light" ? "bg-amber-400" : 
                                  "bg-green-500"
                                }`}
                                style={{ width: `${value * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="flex gap-4 items-center pt-2">
      
            
            <motion.button 
              type="submit" 
              className={`px-6 py-3 rounded-xl text-white font-medium shadow-md transition-all ${
                uploading 
                  ? 'bg-amber-400 cursor-not-allowed' 
                  : success 
                    ? 'bg-gradient-to-r from-green-600 to-green-500 hover:shadow-lg' 
                    : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:shadow-lg'
              }`}
              disabled={uploading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {uploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizando...
                </span>
              ) : success ? (
                <span className="flex items-center">
                  <svg className="mr-1.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ¡Analizado!
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="mr-1.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Analizar Café
                </span>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && modalImage && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImageModal}
          >
            <motion.div 
              className="bg-white rounded-xl overflow-hidden relative max-w-4xl max-h-[90vh] w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2 bg-gradient-to-r from-amber-600 to-amber-500 flex justify-between items-center">
                <h3 className="text-white font-medium px-2">Gráfico detallado</h3>
                <button 
                  onClick={closeImageModal}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="overflow-auto max-h-[calc(90vh-3rem)] p-4 flex items-center justify-center">
                <motion.img 
                  src={`data:image/png;base64,${modalImage}`}
                  alt="Gráfico ampliado"
                  className="max-w-full object-contain rounded shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onError={(e) => {
                    e.target.src = '/placeholder-chart.png';
                  }}
                />
              </div>
              
              <div className="p-3 bg-gray-50 border-t flex justify-between items-center text-xs text-gray-500">
                <span>Haz zoom con la rueda del ratón o pellizca para ampliar</span>
                <button 
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 rounded text-amber-800 transition-colors"
                  onClick={closeImageModal}
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}