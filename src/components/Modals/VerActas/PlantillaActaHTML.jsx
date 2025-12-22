// src/components/Modals/VerActas/PlantillaActaHTML.jsx
import React, { useEffect, useRef } from 'react';
import './PlantillaActa.css';

const PlantillaActaHTML = ({ acta, proyecto, onRendered }) => {
    const hasRendered = useRef(false);

    useEffect(() => {
        if (onRendered && !hasRendered.current) {
            onRendered();
            hasRendered.current = true;
        }
    }, [onRendered]);

    if (!acta || !proyecto) return null;

    // Helper function to render signatures
    const renderFirma = (firmaData) => {
        if (firmaData && (firmaData.startsWith('data:image/') || firmaData.startsWith('http'))) {
            return <img src={firmaData} alt="Firma" style={{ maxWidth: '100px', maxHeight: '50px' }} />;
        }
        return firmaData; // Render as text if it's not an image
    };

    return (
        <div id="acta-pdf-content" className="acta-container">
            <table className="acta-table">
                <tbody>
                    <tr>
                        <td className="header-cell logo-cell">
                            <img src="/images/logo_sena.png" alt="Logo SENA" style={{ width: '80px' }} />
                        </td>
                        <td className="header-cell title-cell">
                            <p>GESTIÓN DE FORMACIÓN PROFESIONAL INTEGRAL</p>
                            <p>FORMATO ACTA</p>
                        </td>
                        <td className="code-cell">
                            <p>Código: GOR-F-084</p>
                            <p>Versión: 02</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <br />

            <table className="acta-table">
                <tbody>
                    <tr><td colSpan="2" className="acta-section-title">INFORMACIÓN GENERAL</td></tr>
                    <tr><td className="info-key">Proyecto:</td><td className="info-value">{proyecto.nombreProyecto}</td></tr>
                    <tr><td className="info-key">Acta No.:</td><td className="info-value">{acta.actaNo}</td></tr>
                    <tr><td className="info-key">Nombre del comité o reunión:</td><td className="info-value">{acta.reunion}</td></tr>
                    <tr><td className="info-key">Ciudad y fecha:</td><td className="info-value">{acta.ciudad}, {new Date(acta.fecha).toLocaleDateString('es-CO', { timeZone: 'UTC' })}</td></tr>
                    <tr><td className="info-key">Hora inicio / Hora fin:</td><td className="info-value">{acta.horaInicio} / {acta.horaFin}</td></tr>
                    <tr><td className="info-key">Lugar y/o enlace:</td><td className="info-value">{acta.lugar}</td></tr>
                    <tr><td className="info-key">Agenda o puntos a desarrollar:</td><td className="info-value"><ul>{(acta.agenda || []).map((item, i) => <li key={i}>{item}</li>)}</ul></td></tr>
                    <tr><td className="info-key">Objetivo(s) de la reunión:</td><td className="info-value"><ul>{(acta.objetivos || []).map((item, i) => <li key={i}>{item}</li>)}</ul></td></tr>
                </tbody>
            </table>

            <br />

            <table className="acta-table">
                <tbody>
                    <tr><td colSpan="2" className="acta-section-title">ESTADO DEL PROYECTO</td></tr>
                    <tr><td className="info-key">Progreso Total del Proyecto:</td><td className="info-value">{proyecto.progreso || 0}%</td></tr>
                    <tr><td className="info-key">Estado Actual del Proyecto:</td><td className="info-value">{proyecto.estado}</td></tr>
                    <tr><td className="info-key">Avance de esta Acta:</td><td className="info-value">{acta.avancePorcentaje}%</td></tr>
                </tbody>
            </table>
            
            <br />

            <table className="acta-table">
                 <tbody>
                    <tr><td className="acta-section-title">DESARROLLO DE LA REUNIÓN</td></tr>
                    <tr><td>{acta.desarrollo}</td></tr>
                </tbody>
            </table>

            <br />

            <table className="acta-table">
                 <tbody>
                    <tr><td className="acta-section-title">CONCLUSIONES</td></tr>
                    <tr><td>{acta.conclusiones}</td></tr>
                </tbody>
            </table>
            
            <br />

            <table className="acta-table">
                 <tbody>
                    <tr><td className="acta-section-title">ESTABLECIMIENTO Y ACEPTACIÓN DE COMPROMISOS</td></tr>
                    <tr>
                        <td className="full-width-cell">
                            <table className="nested-table">
                                <thead>
                                    <tr>
                                        <th>Actividad / Decisión</th>
                                        <th>Fecha</th>
                                        <th>Responsable</th>
                                        <th>Firma o participación virtual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(acta.compromisos || []).map((c, i) => (
                                        <tr key={i}>
                                            <td>{c.actividad}</td>
                                            <td>{c.fecha}</td>
                                            <td>{c.responsable}</td>
                                            <td>{renderFirma(c.firma)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>

            <br />

             <table className="acta-table">
                 <tbody>
                    <tr><td className="acta-section-title">ASISTENTES Y APROBACIÓN DE DECISIONES</td></tr>
                    <tr>
                        <td className="full-width-cell">
                             <table className="nested-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Dependencia / Empresa</th>
                                        <th>Aprueba (Sí / No)</th>
                                        <th>Observación</th>
                                        <th>Firma o participación virtual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(acta.asistentes || []).map((a, i) => (
                                        <tr key={i}>
                                            <td>{a.nombre}</td>
                                            <td>{a.dependencia}</td>
                                            <td>{a.aprueba}</td>
                                            <td>{a.observacion}</td>
                                            <td>{renderFirma(a.firma)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>

            <br />

            <table className="acta-table">
                <tbody>
                    <tr><td className="footer-text">De acuerdo con La Ley 1581 de 2012, Protección de Datos Personales, el Servicio Nacional de Aprendizaje SENA, se compromete a garantizar la seguridad y protección de los datos personales que se encuentran almacenados en este documento, y les dará el tratamiento correspondiente en cumplimiento de lo establecido legalmente.</td></tr>
                </tbody>
            </table>

            <br />

            <table className="acta-table">
                 <tbody>
                    <tr><td className="acta-section-title">ANEXOS</td></tr>
                    <tr><td>{acta.anexos}</td></tr>
                </tbody>
            </table>
        </div>
    );
};

export default PlantillaActaHTML;
