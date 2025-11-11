// src/components/Modals/CrearProyecto/Paso4.jsx
import { useState, useEffect } from 'react';

const Paso4 = ({ data, updateData, instructores }) => {
  const [showInstructorTable, setShowInstructorTable] = useState(false);
  const [selectedInstructores, setSelectedInstructores] = useState(data.instructores || []);

  useEffect(() => {
    updateData(prev => ({ ...prev, instructores: selectedInstructores }));
  }, [selectedInstructores, updateData]);

  const handleToggleInstructorTable = () => {
    setShowInstructorTable(prev => !prev);
  };

  const handleInstructorSelection = (instructor) => {
    setSelectedInstructores(prev => {
      if (prev.some(i => i.id === instructor.id)) {
        return prev.filter(i => i.id !== instructor.id);
      } else {
        return [...prev, instructor];
      }
    });
  };

  const isInstructorSelected = (instructor) => {
    return selectedInstructores.some(i => i.id === instructor.id);
  };

  return (
    <div className="form-step">
      <h3 className="step-title">Asignación de instructores</h3>
      <button className="btn-add" type="button" onClick={handleToggleInstructorTable}>
        {showInstructorTable ? 'Ocultar instructores' : 'Agregar instructor'}
      </button>

      {selectedInstructores.length > 0 && (
        <div className="table-container">
          <h4>Instructores seleccionados:</h4>
          <table>
            <thead>
              <tr>
                <th>Nombre del instructor</th>
                <th>Correo</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {selectedInstructores.map(instructor => (
                <tr key={instructor.id}>
                  <td>{instructor.nombre}</td>
                  <td>{instructor.email}</td>
                  <td>{instructor.rol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showInstructorTable && (instructores && instructores.length > 0 ? (
        <div className="table-container">
          <h4>Seleccionar instructores:</h4>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Nombre del instructor</th>
                <th>Correo</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {instructores.map(instructor => (
                <tr key={instructor.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isInstructorSelected(instructor)}
                      onChange={() => handleInstructorSelection(instructor)}
                    />
                  </td>
                  <td>{instructor.nombre}</td>
                  <td>{instructor.email}</td>
                  <td>{instructor.rol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        showInstructorTable && <p>No hay instructores disponibles para seleccionar.</p>
      ))}
    </div>
  );
};
export default Paso4;
