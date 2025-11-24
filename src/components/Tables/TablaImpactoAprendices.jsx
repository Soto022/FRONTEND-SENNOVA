// src/components/Tables/TablaImpactoAprendices.jsx
import React from 'react';
import './TablaImpactoAprendices.css';

const TablaImpactoAprendices = ({ value, onChange }) => {
  const handleInputChange = (index, field, fieldValue) => {
    const newRows = [...value];
    newRows[index] = { ...newRows[index], [field]: fieldValue };
    onChange(newRows);
  };

  const addRow = () => {
    onChange([...value, { aprendiz: '', programa: '', ficha: '' }]);
  };

  const removeRow = (index) => {
    const newRows = value.filter((_, i) => i !== index);
    onChange(newRows);
  };

  return (
    <div className="impacto-aprendices-table-container">
      <table className="impacto-aprendices-table editable-table">
        <thead>
          <tr>
            <th>Aprendiz</th>
            <th>Programa de formación</th>
            <th>Ficha</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {value.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.aprendiz}
                  onChange={(e) => handleInputChange(index, 'aprendiz', e.target.value)}
                  placeholder="Nombre del aprendiz"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.programa}
                  onChange={(e) => handleInputChange(index, 'programa', e.target.value)}
                  placeholder="Programa"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.ficha}
                  onChange={(e) => handleInputChange(index, 'ficha', e.target.value)}
                  placeholder="Ficha"
                />
              </td>
              <td>
                {value.length > 1 && (
                  <button type="button" onClick={() => removeRow(index)} className="btn-remove">
                    🗑️
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={addRow} className="btn-add-row">+ Añadir Aprendiz</button>
    </div>
  );
};

export default TablaImpactoAprendices;
