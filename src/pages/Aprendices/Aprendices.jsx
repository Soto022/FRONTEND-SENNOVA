import { useState } from 'react';
import './Aprendices.css';
import Button from '../../components/Button/Button';
import ModalAgregarAprendiz from '../../components/Modals/AgregarAprendiz/ModalAgregarAprendiz';
import ModalVerAprendiz from '../../components/Modals/VerAprendiz/ModalVerAprendiz';
import Table from '../../components/Tables/Table/Table';
import { useProjects } from '../../hook/useProjects';
import { useAprendices } from '../../hook/useAprendices';

const Aprendices = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingAprendiz, setEditingAprendiz] = useState(null);
  const [viewingAprendiz, setViewingAprendiz] = useState(null);
  const { allProjects, updateProject } = useProjects(); // Get projects and updateProject
  const { aprendices, addAprendiz, updateAprendiz, deleteAprendiz } = useAprendices();

  const handleOpenAddModal = () => {
    setEditingAprendiz(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenViewModal = (aprendiz) => {
    setViewingAprendiz(aprendiz);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingAprendiz(null);
  };

  const handleSaveAprendiz = (aprendizData) => {
    if (editingAprendiz) {
      updateAprendiz(editingAprendiz.id, aprendizData);
    } else {
      addAprendiz(aprendizData);
    }
    handleCloseAddModal();
  };

  const handleEditAprendiz = (aprendiz) => {
    setEditingAprendiz(aprendiz);
    setIsAddModalOpen(true);
  };

  const handleDeleteAprendiz = (id) => {
    const deletedId = deleteAprendiz(id); // deleteAprendiz now returns the ID
    if (deletedId) {
      // Update all projects that contained this apprentice
      allProjects.forEach(project => {
        const updatedAprendices = project.aprendices.filter(a => a.id !== deletedId);
        if (updatedAprendices.length !== project.aprendices.length) {
          // Only update if the apprentice was actually in this project
          updateProject(project.id, { aprendices: updatedAprendices });
        }
      });
    }
  };

  const headers = [
    'Nombre',
    'Teléfono',
    'Correo',
    'Documento',
    'Fecha inicio',
    'Estado',
    'Fecha de inactivación', // Nueva cabecera
    'Acciones',
  ];

  const renderRow = (aprendiz) => (
    <tr key={aprendiz.id} className="table__row">
      <td className="table__cell">{aprendiz.nombre}</td>
      <td className="table__cell">{aprendiz.telefono}</td>
      <td className="table__cell">{aprendiz.email}</td>
      <td className="table__cell">{aprendiz.documento}</td>
      <td className="table__cell">{aprendiz.fechaInicio}</td>
      <td className="table__cell">
        <span className={`estado-aprendiz ${aprendiz.estado ? aprendiz.estado.toLowerCase() : 'desconocido'}`}>
          {aprendiz.estado || 'Desconocido'}
        </span>
      </td> {/* Celda para el estado con estilo */}
      <td className="table__cell">
        {aprendiz.estado === 'Inactivo' && aprendiz.fechaInactivacion ? (
          aprendiz.fechaInactivacion
        ) : (
          '-'
        )}
      </td> {/* Celda para la nueva columna */}
      <td className="table__cell">
        <button 
          className="action-button action-button--view"
          onClick={() => handleOpenViewModal(aprendiz)}
          aria-label="Ver detalles del aprendiz"
        >
          👁️
        </button>
        <button 
          className="action-button action-button--edit"
          onClick={() => handleEditAprendiz(aprendiz)}
          aria-label="Editar aprendiz"
        >
          ✏️
        </button>
        <button 
          className="action-button action-button--delete"
          onClick={() => handleDeleteAprendiz(aprendiz.id)}
          aria-label="Eliminar aprendiz"
        >
          🗑️
        </button>
      </td>
    </tr>
  );

  return (
    <div className="aprendices">
      <div className="aprendices__header">
        <h1 className="aprendices__title">Gestión de Aprendices</h1>
        <Button 
          variant="primary" 
          size="medium" 
          icon="+"
          onClick={handleOpenAddModal}
        >
          Agregar aprendiz
        </Button>
      </div>
      <div className="aprendices__content">
        <Table headers={headers} data={aprendices} renderRow={renderRow} />
      </div>
      <ModalAgregarAprendiz 
        isOpen={isAddModalOpen} 
        onClose={handleCloseAddModal} 
        onSave={handleSaveAprendiz}
        aprendizToEdit={editingAprendiz}
        projects={allProjects}
      />
      <ModalVerAprendiz
        isOpen={isViewModalOpen}
        aprendiz={viewingAprendiz}
        onClose={handleCloseViewModal}
      />
    </div>
  );
};

export default Aprendices;
