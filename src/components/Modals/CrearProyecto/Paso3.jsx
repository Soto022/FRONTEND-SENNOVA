// src/components/Modals/CrearProyecto/Paso3.jsx
import { useState, useEffect } from 'react';

const Paso3 = ({ data, updateData, aprendices, updateAprendiz, errors }) => {
  const [selectedAprendices, setSelectedAprendices] = useState(data.aprendices || []);
  const [showApprenticeTable, setShowApprenticeTable] = useState(false);

  useEffect(() => {
    // Llama a updateData para actualizar el estado en el componente padre
    updateData(prev => ({ ...prev, aprendices: selectedAprendices }));
  }, [selectedAprendices, updateData]);

  const handleToggleApprenticeTable = () => {
    setShowApprenticeTable(prev => !prev);
  };

  const handleApprenticeSelection = (aprendiz) => {
    setSelectedAprendices(prev => {
      if (prev.some(a => a.id === aprendiz.id)) {
        return prev.filter(a => a.id !== aprendiz.id);
      } else {
        return [...prev, aprendiz];
      }
    });
  };

  const handleRemoveApprentice = (id) => {
    setSelectedAprendices(prev => {
      const removedAprendiz = prev.find(aprendiz => aprendiz.id === id);
      if (removedAprendiz) {
        updateAprendiz(id, { proyectoAsignado: '' }); // Clear assigned project
      }
      return prev.filter(aprendiz => aprendiz.id !== id);
    });
  };

  const isApprenticeSelected = (aprendiz) => {
    return selectedAprendices.some(a => a.id === aprendiz.id);
  };

  return (
    <div className="form-step">
      <h3 className="step-title">Asignación de aprendices</h3>
      <button className="btn-add" type="button" onClick={handleToggleApprenticeTable}>
        {showApprenticeTable ? 'Ocultar aprendices' : 'Agregar aprendiz'}
      </button>
      {errors.aprendices && <span className="error-message">{errors.aprendices}</span>}

      {selectedAprendices.length > 0 && (
        <div className="table-container">
          <h4>Aprendices seleccionados:</h4>
          <table>
            <thead>
              <tr>
                <th>Nombre del aprendiz</th>
                <th>N° Ficha</th>
                <th>Documento</th>
                <th>Estado</th>
                <th>Acción</th> {/* Added Acción column for removal */}
              </tr>
            </thead>
            <tbody>
              {selectedAprendices.map(aprendiz => (
                <tr key={aprendiz.id}>
                  <td>{aprendiz.nombre}</td>
                  <td>{aprendiz.ficha}</td>
                  <td>{aprendiz.documento}</td>
                  <td>{aprendiz.estado}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRemoveApprentice(aprendiz.id)}
                      className="btn-remove" // You might want to define this class in your CSS
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showApprenticeTable && (aprendices && aprendices.length > 0 ? (
        <div className="table-container">
          <h4>Seleccionar aprendices:</h4>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Nombre del aprendiz</th>
                <th>N° Ficha</th>
                <th>Documento</th>
                <th>Estado</th> {/* Added Estado column */}
              </tr>
            </thead>
            <tbody>
              {aprendices.map(aprendiz => (
                <tr key={aprendiz.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isApprenticeSelected(aprendiz)}
                      onChange={() => handleApprenticeSelection(aprendiz)}
                    />
                  </td>
                  <td>{aprendiz.nombre}</td>
                  <td>{aprendiz.ficha}</td>
                  <td>{aprendiz.documento}</td>
                  <td>{aprendiz.estado}</td> {/* Display Estado */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        showApprenticeTable && <p>No hay aprendices disponibles para seleccionar.</p>
      ))}
    </div>
  );
};
export default Paso3;
