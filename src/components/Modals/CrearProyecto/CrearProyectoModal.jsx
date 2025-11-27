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
  const [errors, setErrors] = useState({}); // State for validation errors
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
          // Asegura que los arrays existan y maneja objetivosEspecificos
          aprendices: projectToEdit.aprendices || [],
          instructores: projectToEdit.instructores || [],
          objetivosEspecificos: Array.isArray(projectToEdit.objetivosEspecificos)
            ? projectToEdit.objetivosEspecificos
            : (projectToEdit.objetivosEspecificos ? [projectToEdit.objetivosEspecificos] : ['']),
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
          objetivosEspecificos: [''], // Corrección: inicializado como array
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
      setErrors({}); // Clear errors when modal opens
    }
  }, [isOpen, projectToEdit]);


  if (!isOpen) return null;

  // Validation logic
  const validateStep = (currentStep) => {
    const newErrors = {};
    const requiredError = 'Este campo es requerido.';

    switch (currentStep) {
      case 1:
        if (!projectData.nombreProyecto) newErrors.nombreProyecto = requiredError;
        if (!projectData.semillero) newErrors.semillero = requiredError;
        if (!projectData.lineaInvestigacion) newErrors.lineaInvestigacion = requiredError;
        if (!projectData.fechaInicio) newErrors.fechaInicio = requiredError;
        if (!projectData.fechaFin) newErrors.fechaFin = requiredError;
        if (!projectData.liderProyecto) newErrors.liderProyecto = requiredError;
        break;
      case 2:
        if (!projectData.resumen) newErrors.resumen = requiredError;
        if (!projectData.problema) newErrors.problema = requiredError;
        if (!projectData.objetivo) newErrors.objetivo = requiredError;
        if (!projectData.objetivosEspecificos || projectData.objetivosEspecificos.some(obj => !obj || obj.trim() === '')) {
          newErrors.objetivosEspecificos = 'Debe haber al menos un objetivo específico y no puede estar vacío.';
        }
        if (!projectData.justificacion) newErrors.justificacion = requiredError;
        if (!projectData.metodologia) newErrors.metodologia = requiredError;
        if (!projectData.alcance) newErrors.alcance = requiredError;
        if (!projectData.impactos) newErrors.impactos = requiredError;
        if (!projectData.palabrasClave) newErrors.palabrasClave = requiredError;
        if (!projectData.beneficiarios) newErrors.beneficiarios = requiredError;
        if (!projectData.bibliografia) newErrors.bibliografia = requiredError;
        break;
      case 3:
        if (!projectData.aprendices || projectData.aprendices.length === 0) {
          newErrors.aprendices = 'Debe seleccionar al menos un aprendiz.';
        }
        break;
      case 4:
        if (!projectData.instructores || projectData.instructores.length === 0) {
          newErrors.instructores = 'Debe seleccionar al menos un instructor.';
        }
        break;
      case 5: {
        const step1Errors = validateStep(1);
        const step2Errors = validateStep(2);
        const step3Errors = validateStep(3);
        const step4Errors = validateStep(4);
        return { ...step1Errors, ...step2Errors, ...step3Errors, ...step4Errors };
      }
      default:
        break;
    }
    return newErrors;
  };

  const nextStep = () => {
    const newErrors = validateStep(step);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep(prev => prev + 1);
    }
  };
  const prevStep = () => {
    setErrors({}); // Clear errors when going back
    setStep(prev => prev - 1);
  };

  const handleSave = () => {
    const finalErrors = validateStep(5);
    setErrors(finalErrors);
    if (Object.keys(finalErrors).length === 0) {
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
    } else {
      // Find the first step with an error and navigate to it
      for (let i = 1; i <= 4; i++) {
        const stepErrors = validateStep(i);
        if (Object.keys(stepErrors).length > 0) {
          setStep(i);
          break;
        }
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      // Se pasa 'updateData' y 'errors' a todos los pasos
      case 1:
        return <Paso1 data={projectData} updateData={setProjectData} semilleros={semilleros} errors={errors} />;
      case 2:
        return <Paso2 data={projectData} updateData={setProjectData} errors={errors} />;
      case 3:
        const activeAprendices = aprendices.filter(ap => ap.estado === 'Activo');
        return <Paso3 data={projectData} updateData={setProjectData} aprendices={activeAprendices} updateAprendiz={updateAprendiz} errors={errors} />;
      case 4:
        const activeInstructores = instructores.filter(inst => inst.estado === 'Activo');
        return <Paso4 data={projectData} updateData={setProjectData} instructores={activeInstructores} updateInstructor={updateInstructor} errors={errors} />;
      case 5:
        return <Paso5 data={projectData} updateData={setProjectData} errors={errors} />;
      default:
        return <Paso1 data={projectData} updateData={setProjectData} semilleros={semilleros} errors={errors} />;
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
