// src/components/Modals/CrearProyecto/Paso5.jsx
import { useState } from 'react';

const Paso5 = ({ data, updateData }) => {
  const [fileName, setFileName] = useState(data.cronogramaFile?.name || '');

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // --- VALIDACIÓN DE TIPO DE ARCHIVO ---
      const acceptedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      const isExcelFile = acceptedTypes.includes(file.type) || 
                          file.name.endsWith('.xls') || 
                          file.name.endsWith('.xlsx') || 
                          file.name.endsWith('.csv');

      if (!isExcelFile) {
        alert('Solo se permiten archivos de Excel (.xls, .xlsx, .csv).');
        e.target.value = null; // Limpiar el input para permitir seleccionar de nuevo
        setFileName('');
        updateData(prev => ({ ...prev, cronogramaFile: null })); // Asegurar que el estado no guarde el archivo inválido
        return;
      }
      // --- FIN VALIDACIÓN ---

      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = {
          name: file.name,
          content: event.target.result.split(',')[1]
        };
        console.log('[Paso 5] Archivo procesado. Llamando a updateData con:', { cronogramaFile: fileData });
        updateData(prev => ({ ...prev, cronogramaFile: fileData }));
      };
      reader.readAsDataURL(file);
    } else {
      setFileName('');
      updateData(prev => ({ ...prev, cronogramaFile: null }));
    }
  };

  return (
    <div className="form-step">
      <h3 className="step-title">Subir cronograma del proyecto</h3>
      <p className="step-subtitle">Sube el cronograma del proyecto aquí</p>
      <div className="file-upload-container">
        <input 
          type="file" 
          id="file-upload" 
          accept=".xls,.xlsx,.csv" /* Actualizado el atributo accept */
          onChange={handleFileChange} 
        />
        <label htmlFor="file-upload" className="file-upload-label">
          Seleccionar archivo (.xls, .xlsx, .csv) {/* Actualizado el texto de la etiqueta */}
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
