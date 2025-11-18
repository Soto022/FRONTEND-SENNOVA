// src/components/Modals/CrearProyecto/CrearProyectoModal.jsx
import { useState, useEffect } from 'react';
import './CrearProyectoModal.css';
import Paso1 from './Paso1';
import Paso2 from './Paso2';
import Paso3 from './Paso3';
import Paso4 from './Paso4';
import Paso5 from './Paso5';
import { useInstructores } from '../../../hook/useInstructores';
import { useAprendices } from '../../../hook/useAprendices'; // Import useAprendices

const CrearProyectoModal = ({ isOpen, onClose, onSave, semilleros, projectToEdit }) => { // Eliminar 'aprendices' de las props
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({});
  const { instructores, updateInstructor } = useInstructores(); // Get instructores and updateInstructor
  const { aprendices, updateAprendiz } = useAprendices(); // Extraer 'aprendices' del hook

  useEffect(() => {
    if (isOpen) {
      if (projectToEdit) {
        // Mapea los datos del proyecto a editar a la nueva estructura camelCase
        const mappedData = {
          ...projectToEdit, // Conserva todos los demás datos como están
          nombreProyecto: projectToEdit.name || projectToEdit.nombreProyecto,
          programaFormacion: projectToEdit['programa-formacion'] || projectToEdit.programaFormacion,
          lineaInvestigacion: projectToEdit.lineaTecnologica || projectToEdit.lineaInvestigacion,
          fechaInicio: projectToEdit['fecha-inicio'] || projectToEdit.fechaInicio,
          fechaFin: projectToEdit['fecha-fin'] || projectToEdit.fechaFin,
          liderProyecto: projectToEdit.lider || projectToEdit.liderProyecto,
          // Asegura que los arrays existan
          aprendices: projectToEdit.aprendices || [],
          instructores: projectToEdit.instructores || [],
          // Nuevos campos
          impactos: projectToEdit.impactos || '',
          palabrasClave: projectToEdit.palabrasClave || '',
          beneficiarios: projectToEdit.beneficiarios || '',
          bibliografia: projectToEdit.bibliografia || '',
        };
        setProjectData(mappedData);
      } else {
        // Estado inicial con claves camelCase para consistencia
        setProjectData({
          programaFormacion: '',
          nombreProyecto: '',
          semillero: '',
          lineaInvestigacion: '',
          fechaInicio: '',
          fechaFin: '',
          liderProyecto: '',
          aprendices: [],
          instructores: [],
          // Campos existentes de Paso2
          resumen: '',
          problema: '',
          objetivo: '',
          objetivosEspecificos: '',
          justificacion: '',
          metodologia: '',
          alcance: '',
          // Nuevos campos de Paso2
          impactos: '', 
          palabrasClave: '', 
          beneficiarios: '', 
          bibliografia: '', 
        });
      }
      setStep(1); // Reinicia al primer paso cada vez que se abre el modal
    }
  }, [isOpen, projectToEdit]);


  if (!isOpen) return null;

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = () => {
    onSave(projectData);
    // After saving the project, update the assigned apprentices' projectAsignado field
    if (projectData.aprendices && projectData.aprendices.length > 0) {
      projectData.aprendices.forEach(aprendiz => {
        updateAprendiz(aprendiz.id, { proyectoAsignado: projectData.nombreProyecto });
      });
    }
    // Also update assigned instructors' proyectoAsignado field
    if (projectData.instructores && projectData.instructores.length > 0) {
      projectData.instructores.forEach(instructor => {
        updateInstructor(instructor.id, { proyectoAsignado: projectData.nombreProyecto });
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      // Se pasa 'updateData' en lugar de 'setData' a todos los pasos
      case 1:
        return <Paso1 data={projectData} updateData={setProjectData} semilleros={semilleros} />;
      case 2:
        return <Paso2 data={projectData} updateData={setProjectData} />;
      case 3:
        return <Paso3 data={projectData} updateData={setProjectData} aprendices={aprendices} updateAprendiz={updateAprendiz} />;
      case 4:
        return <Paso4 data={projectData} updateData={setProjectData} instructores={instructores} updateInstructor={updateInstructor} />;
      case 5:
        return <Paso5 data={projectData} updateData={setProjectData} />;
      default:
        return <Paso1 data={projectData} updateData={setProjectData} semilleros={semilleros} />;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{projectToEdit ? 'Editar Proyecto' : 'Crear Proyecto'} - Paso {step} de 5</h2>
        </div>
        <div className="modal-content">
          {renderStep()}
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancelar X</button>
          <div className="step-navigation">
            {step > 1 && <button className="btn-prev" onClick={prevStep}>← Anterior</button>}
            {step < 5 && <button className="btn-next" onClick={nextStep}>Siguiente ➜</button>}
            {step === 5 && <button className="btn-save" onClick={handleSave}>Guardar proyecto 💾</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearProyectoModal;
