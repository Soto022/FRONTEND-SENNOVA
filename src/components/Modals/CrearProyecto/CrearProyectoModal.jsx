// src/components/Modals/CrearProyecto/CrearProyectoModal.jsx
import { useState, useEffect } from 'react';
import './CrearProyectoModal.css';
import Paso1 from './Paso1';
import Paso2 from './Paso2';
import Paso3 from './Paso3';
import Paso4 from './Paso4';
import Paso5 from './Paso5';
import { useInstructores } from '../../../hook/useInstructores';
import { useAprendices } from '../../../hook/useAprendices';

const CrearProyectoModal = ({ isOpen, onClose, onSave, semilleros, projectToEdit }) => {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({});
  const [errors, setErrors] = useState({});
  const { instructores, updateInstructor } = useInstructores();
  const { aprendices, updateAprendiz } = useAprendices();

  useEffect(() => {
    if (isOpen) {
      if (projectToEdit) {
        const mappedData = {
          ...projectToEdit,
          nombreProyecto: projectToEdit.name || projectToEdit.nombreProyecto,
          programaFormacion: projectToEdit["programa-formacion"] || projectToEdit.programaFormacion,
          lineaInvestigacion: projectToEdit.lineaTecnologica || projectToEdit.lineaInvestigacion,
          fechaInicio: projectToEdit["fecha-inicio"] || projectToEdit.fechaInicio,
          fechaFin: projectToEdit["fecha-fin"] || projectToEdit.fechaFin,
          liderProyecto: projectToEdit.lider || projectToEdit.liderProyecto,
          aprendices: projectToEdit.aprendices || [],
          instructores: projectToEdit.instructores || [],
          objetivosEspecificos: Array.isArray(projectToEdit.objetivosEspecificos)
            ? projectToEdit.objetivosEspecificos
            : (projectToEdit.objetivosEspecificos ? [projectToEdit.objetivosEspecificos] : [""]),
          impactos: projectToEdit.impactos || "",
          palabrasClave: projectToEdit.palabrasClave || "",
          beneficiarios: projectToEdit.beneficiarios || "",
          bibliografia: projectToEdit.bibliografia || "",
          cronogramaFile: projectToEdit.cronogramaFile || null,
        };
        setProjectData(mappedData);
      } else {
        setProjectData({
          programaFormacion: "",
          nombreProyecto: "",
          semillero: "",
          lineaInvestigacion: "",
          fechaInicio: "",
          fechaFin: "",
          liderProyecto: "",
          aprendices: [],
          instructores: [],
          resumen: "",
          problema: "",
          objetivo: "",
          objetivosEspecificos: [""],
          justificacion: "",
          metodologia: "",
          alcance: "",
          impactos: "",
          palabrasClave: "",
          beneficiarios: "",
          bibliografia: "",
          cronogramaFile: null,
        });
      }
      setStep(1);
      setErrors({});
    }
  }, [isOpen, projectToEdit]);


  if (!isOpen) return null;

  const validateStep = (currentStep) => {
    const newErrors = {};
    const requiredError = "Este campo es requerido.";

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
        if (!projectData.objetivosEspecificos || projectData.objetivosEspecificos.some(obj => !obj.trim())) {
          newErrors.objetivosEspecificos = "Debe haber al menos un objetivo específico y no puede estar vacío.";
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
        if (!projectData.aprendices.length) newErrors.aprendices = "Debe seleccionar al menos un aprendiz.";
        break;
      case 4:
        if (!projectData.instructores.length) newErrors.instructores = "Debe seleccionar al menos un instructor.";
        break;
    }
    return newErrors;
  };

  const nextStep = () => {
    const newErrors = validateStep(step);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setErrors({});
    setStep(prev => prev - 1);
  };

  const handleSave = () => {
    const finalErrors = validateStep(5);
    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      onSave(projectData);
      projectData.aprendices?.forEach(a =>
        updateAprendiz(a.id, { proyectoAsignado: projectData.nombreProyecto })
      );
      projectData.instructores?.forEach(i =>
        updateInstructor(i.id, { proyectoAsignado: projectData.nombreProyecto })
      );
    } else {
      for (let i = 1; i <= 4; i++) {
        if (Object.keys(validateStep(i)).length > 0) {
          setStep(i);
          break;
        }
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Paso1 data={projectData} updateData={setProjectData} semilleros={semilleros} errors={errors} />;
      case 2: return <Paso2 data={projectData} updateData={setProjectData} errors={errors} />;
      case 3: return <Paso3 data={projectData} updateData={setProjectData} aprendices={aprendices.filter(a => a.estado === "Activo")} updateAprendiz={updateAprendiz} errors={errors} />;
      case 4: return <Paso4 data={projectData} updateData={setProjectData} instructores={instructores.filter(i => i.estado === "Activo")} updateInstructor={updateInstructor} errors={errors} />;
      case 5: return <Paso5 data={projectData} updateData={setProjectData} errors={errors} />;
      default: return null;
    }
  };

  return (
    <div className="modal-overlay crear-proyecto-wrapper">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{projectToEdit ? "Editar Proyecto" : "Crear Proyecto"} - Paso {step} de 5</h2>
        </div>

        {/* 🔥 ESTA ES LA LÍNEA QUE ASEGURA EL ANCHO CORRECTO */}
        <div className="modal-content modal-content-fix">
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
 