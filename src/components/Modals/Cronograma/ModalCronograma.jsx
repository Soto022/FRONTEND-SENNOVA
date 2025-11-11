import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './ModalCronograma.css'; // Import specific styles

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const ModalCronograma = ({ isOpen, onClose, project }) => { // isOpen prop added back
  // State for AG-Grid
  const [rowData, setRowData] = useState(null);
  const [columnDefs, setColumnDefs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Derived data for downloader
  const nombreProyecto = project?.name || 'Proyecto Desconocido';
  const cronogramaFile = project?.cronogramaFile;

  let dataUrl = '';
  if (cronogramaFile && typeof cronogramaFile === 'object' && cronogramaFile.content && cronogramaFile.name) {
    const fileName = cronogramaFile.name.toLowerCase();
    const mimeType = fileName.endsWith('.xlsx') 
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      : 'application/vnd.ms-excel';
    dataUrl = `data:${mimeType};base64,${cronogramaFile.content}`;
  }

  // Effect to parse Excel data for AG-Grid
  useEffect(() => {
    // This effect now runs when the component mounts or project/dataUrl changes
    if (!isOpen) { // Check isOpen here again
      setRowData(null);
      setColumnDefs(null);
      setIsLoading(false);
      setError('');
      return;
    }

    if (dataUrl) {
      setIsLoading(true);
      try {
        const workbook = XLSX.read(cronogramaFile.content, { type: 'base64' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (json.length > 0) {
          const header = json[0];
          const rows = json.slice(1);

          const cols = header.map(h => ({
            field: h,
            headerName: h,
            sortable: true,
            filter: true,
            resizable: true,
          }));

          const rData = rows.map(row => {
            const rowObject = {};
            header.forEach((h, index) => {
              rowObject[h] = row[index];
            });
            return rowObject;
          });

          setColumnDefs(cols);
          setRowData(rData);
        } else {
          setError('El archivo de Excel está vacío.');
        }
      } catch (e) {
        console.error('Error parsing Excel file:', e);
        setError('No se pudo leer el archivo de Excel.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Reset if dataUrl becomes empty
      setRowData(null);
      setColumnDefs(null);
      setIsLoading(false);
      setError('');
    }
  }, [isOpen, cronogramaFile, dataUrl]); // isOpen added back to dependency array

  // Effect for Escape key (added back)
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null; // Guard added back

  const renderViewer = () => {
    if (isLoading) return <p>Cargando vista previa...</p>;
    if (error) return <p className="modal-no-cronograma-message">{error}</p>;
    if (rowData && columnDefs) {
      return (
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{ flex: 1, minWidth: 150 }}
          />
        </div>
      );
    }
    return null; // Don't render anything if there's no data to show
  };

  return (
    <div className="modal-overlay" onClick={onClose}> {/* Class name changed */}
      <div className="modal-content-viewer-downloader" onClick={(e) => e.stopPropagation()}> {/* Class name changed */}
        <button onClick={onClose} className="modal-close-button-top-right">✕</button> {/* Class name changed */}
        
        <h2 className="modal-title-downloader">{nombreProyecto}</h2> {/* Class name changed */}

        {dataUrl ? (
          <>
            <div className="modal-viewer-container"> {/* Class name changed */}
              {renderViewer()}
            </div>
            <div className="modal-download-section"> {/* Class name changed */}
              <a href={dataUrl} download={cronogramaFile.name} className="modal-download-button"> {/* Class name changed */}
                Descargar cronograma
              </a>
            </div>
          </>
        ) : (
          <p className="modal-no-cronograma-message"> {/* Class name changed */}
            Este proyecto aún no tiene un cronograma cargado.
          </p>
        )}
      </div>
    </div>
  );
};

export default ModalCronograma;
