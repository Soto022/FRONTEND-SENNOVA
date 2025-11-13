import React, { useEffect, useState } from 'react';
import './ModalVerInstructor.css';

const ModalVerInstructor = ({ isOpen, onClose, instructorId, allInstructores }) => {
    const [instructor, setInstructor] = useState(null);

    useEffect(() => {
        if (isOpen && instructorId && allInstructores) {
            const foundInstructor = allInstructores.find(i => i.id === instructorId);
            setInstructor(foundInstructor);
        } else {
            setInstructor(null);
        }
    }, [isOpen, instructorId, allInstructores]);

    if (!isOpen || !instructor) return null;

    return (
        <div className="modal-ver-overlay" onClick={onClose}>
            <div className="modal-ver-container" onClick={e => e.stopPropagation()}>
                <h2 className="modal-ver-title">INFORMACIÓN DEL INSTRUCTOR</h2>
                <div className="instructor-card">
                    <div className="instructor-card-body">
                        <div className="instructor-info-item">
                            <span className="label">NOMBRE COMPLETO:</span>
                            <span className="value">{instructor.nombre}</span>
                        </div>
                        <div className="instructor-info-item">
                            <span className="label">DOCUMENTO:</span>
                            <span className="value">{instructor.documento}</span>
                        </div>
                        <div className="instructor-info-item">
                            <span className="label">CORREO ELECTRÓNICO:</span>
                            <span className="value">{instructor.email}</span>
                        </div>
                        <div className="instructor-info-item">
                            <span className="label">CONTACTO:</span>
                            <span className="value">{instructor.contacto}</span>
                        </div>
                        <div className="instructor-info-item">
                            <span className="label">ROL:</span>
                            <span className="value">{instructor.rol}</span>
                        </div>
                        <div className="instructor-info-item">
                            <span className="label">ESTADO:</span>
                            <span className={`status-capsule ${instructor.estado === 'Activo' ? 'active' : 'inactive'}`}>
                                {instructor.estado}
                            </span>
                        </div>
                        {instructor.estado === 'Inactivo' && instructor.fechaInactivacion && (
                            <div className="instructor-info-item">
                                <span className="label">FECHA DE INACTIVACIÓN:</span>
                                <span className="value">{instructor.fechaInactivacion}</span>
                            </div>
                        )}
                        <div className="instructor-info-item">
                            <span className="label">PROYECTO ASIGNADO:</span>
                            <span className="value">{instructor.proyectoAsignado || 'No asignado'}</span>
                        </div>
                        <hr className="card-separator" />
                        <div className="instructor-dates">
                            <div className="date-item">
                                <span>🗓️</span>
                                <span className="label">FECHA DE INICIO:</span>
                                <span className="value">{instructor.fechaInicio}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default ModalVerInstructor;
