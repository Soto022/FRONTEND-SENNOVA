// src/components/Tables/TablaCompromisos.jsx
import React from 'react';
import './TablaCompromisos.css';

const TablaCompromisos = ({ value, onChange }) => {
  const handleInputChange = (index, field, fieldValue) => {
    const newRows = [...value];
    newRows[index] = { ...newRows[index], [field]: fieldValue };
    onChange(newRows);
  };

  const addRow = () => {
    onChange([...value, { actividad: '', fecha: '', responsable: '', firma: '' }]);
  };

  const removeRow = (index) => {
    const newRows = value.filter((_, i) => i !== index);
    onChange(newRows);
  };

  return (
    <div className="compromisos-table-container">
      <table className="compromisos-table editable-table">
        <thead>
          <tr>
            <th>Actividad / Decisión</th>
            <th>Fecha</th>
            <th>Responsable</th>
            <th>Firma o participación virtual</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {value.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.actividad}
                  onChange={(e) => handleInputChange(index, 'actividad', e.target.value)}
                  placeholder="Actividad / Decisión"
                />
              </td>
              <td>
                <input
                  type="date"
                  value={row.fecha}
                  onChange={(e) => handleInputChange(index, 'fecha', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.responsable}
                  onChange={(e) => handleInputChange(index, 'responsable', e.target.value)}
                  placeholder="Responsable"
                />
              </td>
              <td>
                {row.firma && row.firma.startsWith('data:image/') ? (
                  <div className="firma-preview">
                    <img src={row.firma} alt="Firma digital" className="firma-image-preview" />
                    <button type="button" onClick={() => handleInputChange(index, 'firma', '')} className="btn-clear-firma">
                      Limpiar
                    </button>
                  </div>
                ) : (
                  <textarea
                    value={row.firma}
                    onChange={(e) => handleInputChange(index, 'firma', e.target.value)}
                    onPaste={(e) => {
                      const clipboardData = e.clipboardData || window.clipboardData;
                      const items = clipboardData.items;

                      for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        if (item.type.indexOf('image') !== -1) {
                          const file = item.getAsFile();
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (readerEvent) => {
                              handleInputChange(index, 'firma', readerEvent.target.result);
                            };
                            reader.readAsDataURL(file);
                            e.preventDefault();
                            return;
                          }
                        }
                      }
                    }}
                    placeholder="Pega tu firma digital (texto o imagen)"
                    rows="3"
                  ></textarea>
                )}
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
      <button type="button" onClick={addRow} className="btn-add-row">+ Añadir Compromiso</button>
    </div>
  );
};

export default TablaCompromisos;
