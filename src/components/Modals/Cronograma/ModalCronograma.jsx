// src/components/ModalCronograma/ModalCronograma.jsx
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./ModalCronograma.css";

const getMimeType = (fileName = "") => {
  const ext = (fileName || "").toLowerCase().split(".").pop();
  const map = {
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    doc: "application/msword",
    docx:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };
  return map[ext] || "application/octet-stream";
};

const isPdf = (mimeOrName) =>
  (mimeOrName || "").toLowerCase().includes("pdf") ||
  (mimeOrName || "").toLowerCase().endsWith(".pdf");

const isImage = (mimeOrName) =>
  (mimeOrName || "").toLowerCase().startsWith("image/") ||
  [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".svg"].some((e) =>
    (mimeOrName || "").toLowerCase().endsWith(e)
  );

const isVideo = (mimeOrName) =>
  (mimeOrName || "").toLowerCase().startsWith("video/") ||
  [".mp4", ".webm", ".mov"].some((e) =>
    (mimeOrName || "").toLowerCase().endsWith(e)
  );

const isOfficeDocument = (mimeOrName) =>
  [".doc", ".docx", ".xls", ".xlsx"].some((e) =>
    (mimeOrName || "").toLowerCase().endsWith(e)
  );

export default function ModalCronograma({ isOpen, onClose, cronogramaFile }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [objectUrl, setObjectUrl] = useState(null);

  const fileName = cronogramaFile?.name || (typeof cronogramaFile === "string" ? cronogramaFile.split("/").pop() : "");
  const mimeType = useMemo(() => getMimeType(fileName), [fileName]);

  useEffect(() => {
    setError("");
    setObjectUrl(null);

    if (!isOpen) return;

    if (!cronogramaFile) {
      setError("No hay archivo para mostrar.");
      return;
    }
    
    setLoading(true);

    if (typeof cronogramaFile === "string") {
      setObjectUrl(cronogramaFile);
    } else if (cronogramaFile?.content && cronogramaFile?.name) {
      try {
        const byteCharacters = atob(cronogramaFile.content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const url = URL.createObjectURL(blob);
        setObjectUrl(url);
      } catch (e) {
        console.error("Error creating blob:", e);
        setError("No se pudo procesar el archivo.");
      }
    } else {
      setError("Formato de archivo no soportado.");
    }
    
    setLoading(false);

  }, [isOpen, cronogramaFile, fileName, mimeType]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!objectUrl) return;
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName || "descarga";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleOpenNewTab = () => {
    if (!objectUrl) return;
    window.open(objectUrl, "_blank", "noopener,noreferrer");
  };

  const renderPreview = () => {
    if (loading) return <div className="mc-loading">Cargando...</div>;
    if (error) return <div className="mc-error">{error}</div>;
    if (!objectUrl) return <div className="mc-error">Sin archivo para previsualizar.</div>;

    if (isPdf(fileName, mimeType)) {
      return <iframe className="mc-iframe" src={objectUrl} title={fileName} />;
    }

    if (isImage(fileName, mimeType)) {
      return <img className="mc-image" src={objectUrl} alt={fileName} />;
    }

    if (isVideo(fileName, mimeType)) {
      return <video className="mc-video" src={objectUrl} controls />;
    }

    if (isOfficeDocument(fileName)) {
      if (typeof cronogramaFile === 'string') {
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(cronogramaFile)}&embedded=true`;
        return <iframe src={viewerUrl} style={{ width: '100%', height: '80vh', border: 'none' }} title={fileName} />;
      }
      return <div className="mc-no-preview">La vista previa para documentos de Office solo está disponible para archivos remotos. Intenta descargándolo.</div>;
    }
    
    if (typeof cronogramaFile === "string") {
      return (
        <iframe
          className="mc-iframe"
          src={`https://docs.google.com/gview?url=${encodeURIComponent(objectUrl)}&embedded=true`}
          title={fileName}
        />
      );
    }

    return <div className="mc-no-preview">No hay vista previa disponible para este tipo de archivo. Intenta descargándolo.</div>;
  };

  return (
    <div className="mc-overlay" onClick={onClose}>
      <div className="mc-modal" onClick={(e) => e.stopPropagation()}>
        <header className="mc-header">
          <div className="mc-title">{fileName || "Cronograma"}</div>
          <div className="mc-actions">
            <button className="mc-btn" onClick={handleOpenNewTab} disabled={!objectUrl}>
              Abrir en nueva pestaña
            </button>
            <button className="mc-btn" onClick={handleDownload} disabled={!objectUrl}>
              Descargar
            </button>
            <button className="mc-btn mc-close" onClick={onClose}>Cerrar</button>
          </div>
        </header>

        <main className="mc-body">
          {renderPreview()}
        </main>

        <footer className="mc-footer">
          <small>Si el archivo no se previsualiza, intenta abrirlo en una nueva pestaña o descargarlo.</small>
        </footer>
      </div>
    </div>
  );
}

ModalCronograma.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  cronogramaFile: PropTypes.any,
};

ModalCronograma.defaultProps = {
  isOpen: false,
  onClose: () => {},
  cronogramaFile: null,
};