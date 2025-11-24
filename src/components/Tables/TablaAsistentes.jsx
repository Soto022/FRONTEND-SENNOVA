// src/components/Tables/TablaAsistentes.jsx
import React from 'react';
import './TablaAsistentes.css';

const TablaAsistentes = ({ value, onChange }) => {
  const handleInputChange = (index, field, fieldValue) => {
    const newRows = [...value];
    newRows[index] = { ...newRows[index], [field]: fieldValue };
    onChange(newRows);
  };

  const addRow = () => {
    onChange([...value, { nombre: '', dependencia: '', aprueba: false, observacion: '', firma: '' }]);
  };

  const removeRow = (index) => {
    const newRows = value.filter((_, i) => i !== index);
    onChange(newRows);
  };

  return (
    <div className="asistentes-table-container">
      <table className="asistentes-table editable-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dependencia / Empresa</th>
            <th>Aprueba</th>
            <th>Observación</th>
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
                  value={row.nombre}
                  onChange={(e) => handleInputChange(index, 'nombre', e.target.value)}
                  placeholder="Nombre"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.dependencia}
                  onChange={(e) => handleInputChange(index, 'dependencia', e.target.value)}
                  placeholder="Dependencia / Empresa"
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={row.aprueba}
                  onChange={(e) => handleInputChange(index, 'aprueba', e.target.checked)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.observacion}
                  onChange={(e) => handleInputChange(index, 'observacion', e.target.value)}
                  placeholder="Observación"
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
      <button type="button" onClick={addRow} className="btn-add-row">+ Añadir Asistente</button>
    </div>
  );
};

export default TablaAsistentes;
