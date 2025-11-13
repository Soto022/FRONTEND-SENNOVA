import { useState } from 'react';
import './Instructores.css';
import Button from '../../components/Button/Button';
import Table from '../../components/Tables/Table/Table';
import { useProjects } from '../../hook/useProjects'; // Import useProjects
import { useInstructores } from '../../hook/useInstructores';
import ModalAgregarInstructor from '../../components/Modals/AgregarInstructor/ModalAgregarInstructor';
import ModalVerInstructor from '../../components/Modals/VerInstructor/ModalVerInstructor';

const Instructores = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [viewingInstructorId, setViewingInstructorId] = useState(null); // Changed to store ID
  const { allProjects, updateProject } = useProjects(); // Get projects and updateProject
  const { instructores, addInstructor, updateInstructor, deleteInstructor } = useInstructores();

  const handleOpenAddModal = () => {
    setEditingInstructor(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenViewModal = (instructorId) => { // Accepts ID
    setViewingInstructorId(instructorId);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingInstructorId(null);
  };

  const handleSaveInstructor = (instructorData) => {
    if (editingInstructor) {
      updateInstructor(editingInstructor.id, instructorData);
    } else {
      addInstructor(instructorData);
    }
    handleCloseAddModal();
  };

  const handleEditInstructor = (instructor) => {
    setEditingInstructor(instructor);
    setIsAddModalOpen(true);
  };

  const handleDeleteInstructor = (id) => {
    const deletedId = deleteInstructor(id); // deleteInstructor now returns the ID
    if (deletedId) {
      // Update all projects that contained this instructor
      allProjects.forEach(project => {
        const updatedInstructores = project.instructores.filter(i => i.id !== deletedId);
        if (updatedInstructores.length !== project.instructores.length) {
          // Only update if the instructor was actually in this project
          updateProject(project.id, { instructores: updatedInstructores });
        }
      });
    }
  };

  const headers = [
    'Nombre',
    'Teléfono',
    'Correo',
    'Rol',
    'Estado', // Nueva cabecera
    'Fecha de inactivación', // Nueva cabecera
    'Acciones',
  ];

  const renderRow = (instructor) => (
    <tr key={instructor.id} className="table__row">
      <td className="table__cell">{instructor.nombre}</td>
      <td className="table__cell">{instructor.contacto}</td>
      <td className="table__cell">{instructor.email}</td>
      <td className="table__cell">{instructor.rol}</td>
      <td className="table__cell">
        <span className={`estado-aprendiz ${instructor.estado ? instructor.estado.toLowerCase() : 'desconocido'}`}>
          {instructor.estado || 'Desconocido'}
        </span>
      </td> {/* Celda para el estado */}
      <td className="table__cell">
        {instructor.estado === 'Inactivo' && instructor.fechaInactivacion ? (
          instructor.fechaInactivacion
        ) : (
          '-'
        )}
      </td> {/* Celda para la fecha de inactivación */}
      <td className="table__cell">
        <button 
          className="action-button action-button--view"
          onClick={() => handleOpenViewModal(instructor.id)} // Pass ID
          aria-label="Ver detalles del instructor"
        >
          👁️
        </button>
        <button 
          className="action-button action-button--edit"
          onClick={() => handleEditInstructor(instructor)}
          aria-label="Editar instructor"
        >
          ✏️
        </button>
        <button 
          className="action-button action-button--delete"
          onClick={() => handleDeleteInstructor(instructor.id)}
          aria-label="Eliminar instructor"
        >
          🗑️
        </button>
      </td>
    </tr>
  );

  return (
    <div className="instructores">
      <div className="instructores__header">
        <h1 className="instructores__title">Gestión de Instructores</h1>
        <Button 
          variant="primary" 
          size="medium" 
          icon="+"
          onClick={handleOpenAddModal}
        >
          Agregar instructor
        </Button>
      </div>
      <div className="instructores__content">
        <Table headers={headers} data={instructores} renderRow={renderRow} />
      </div>
      <ModalAgregarInstructor 
        isOpen={isAddModalOpen} 
        onClose={handleCloseAddModal} 
        onSave={handleSaveInstructor}
        instructorToEdit={editingInstructor}
      />
      <ModalVerInstructor
        isOpen={isViewModalOpen}
        instructorId={viewingInstructorId} // Pass ID
        allInstructores={instructores} // Pass full list
        onClose={handleCloseViewModal}
      />
    </div>
  );
};

export default Instructores;
