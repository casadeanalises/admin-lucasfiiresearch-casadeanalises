const fs = require('fs-extra');
const path = require('path');

async function copyPdfJs() {
  const source = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.js');
  const destination = path.join(__dirname, '../public/pdfjs');

  try {
    // Criar diretório se não existir
    await fs.ensureDir(destination);

    // Copiar worker
    await fs.copy(source, path.join(destination, 'pdf.worker.js'));

    // Copiar viewer
    await fs.copy(
      path.join(__dirname, '../node_modules/pdfjs-dist/web'),
      path.join(destination, 'web')
    );

    console.log('PDF.js files copied successfully!');
  } catch (err) {
    console.error('Error copying PDF.js files:', err);
    process.exit(1);
  }
}

copyPdfJs(); 