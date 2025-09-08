import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI não está definido nas variáveis de ambiente');
}

function getDatabaseNameFromUri(uri: string): string {
  try {
    const urlParts = uri.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    const dbName = lastPart.split('?')[0];
    
    if (!dbName) {
      throw new Error('Nome do banco de dados não encontrado na URI do MongoDB');
    }
    
    return dbName;
  } catch (error) {
    console.error('Erro ao extrair nome do banco de dados da URI:', error);
    throw new Error('Não foi possível determinar o nome do banco de dados da URI do MongoDB. Verifique sua variável MONGODB_URI no arquivo .env');
  }
}

export const connectDB = async () => {
  try {
    const dbName = getDatabaseNameFromUri(MONGODB_URI);
    console.log('Conectando ao banco de dados:', dbName);

    if (mongoose.connection.readyState === 1) {
      const currentDb = mongoose.connection.db?.databaseName;
      if (currentDb !== dbName) {
        console.log(`Trocando conexão de ${currentDb} para ${dbName}`);
        await mongoose.disconnect();
      } else {
        return;
      }
    }

    const conn = await mongoose.connect(MONGODB_URI);

    console.log('MongoDB Conectado:', {
      host: conn.connection.host,
      database: conn.connection.db?.databaseName
    });

  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error);
    throw error;
  }
};
