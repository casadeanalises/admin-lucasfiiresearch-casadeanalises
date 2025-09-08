import React from "react";

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  return (
    <iframe
      src={fileUrl}
      width="100%"
      height="600"
      title="PDF Viewer"
      frameBorder="0"
    />
  );
};

export default PDFViewer;
