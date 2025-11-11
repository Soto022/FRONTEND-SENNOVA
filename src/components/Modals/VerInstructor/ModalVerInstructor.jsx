import React from 'react';
import './ModalVerInstructor.css';

const ModalVerInstructor = ({ isOpen, onClose, instructor }) => {
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
