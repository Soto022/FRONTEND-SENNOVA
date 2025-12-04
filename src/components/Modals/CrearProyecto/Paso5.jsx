// src/components/Modals/CrearProyecto/Paso5.jsx
import { useState } from 'react';

const Paso5 = ({ data, updateData }) => {
  // Muestra el nombre del archivo. Si 'cronogramaFile' es un objeto, usa su propiedad 'name'.
  const [fileName, setFileName] = useState(data.cronogramaFile?.name || '');

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);

      // Leer el contenido del archivo como Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        // Guardar un objeto con el nombre y el contenido en Base64
        const fileData = {
          name: file.name,
          content: event.target.result.split(',')[1] // Extraer solo la data Base64
        };
        console.log('[Paso 5] Archivo procesado. Llamando a updateData con:', { cronogramaFile: fileData });
        updateData(prev => ({ ...prev, cronogramaFile: fileData }));
      };
      reader.readAsDataURL(file); // Inicia la lectura
    }
  };

  return (
    <div className="form-step">
      <h3 className="step-title">Subir cronograma del proyecto</h3>
      <p className="step-subtitle">Sube el cronograma del proyecto aquí</p>
      <div className="file-upload-container">
        <input type="file" id="file-upload" accept=".pdf, .png, .jpg, .jpeg, .gif" onChange={handleFileChange} />
        <label htmlFor="file-upload" className="file-upload-label">
          Seleccionar archivo (.pdf, .png, .jpg, .jpeg, .gif)
        </label>
      </div>
      {fileName && (
        <div className="file-info">
          <span>{fileName}</span>
          <span className="check-icon">✅</span>
        </div>
      )}
    </div>
  );
};
export default Paso5;
