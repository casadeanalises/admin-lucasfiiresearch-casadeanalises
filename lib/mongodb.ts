import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Por favor, defina a variável de ambiente MONGODB_URI");
}

const uri = process.env.MONGODB_URI;
const options = {
  connectTimeoutMS: 20000,        // 20 segundos 
  socketTimeoutMS: 45000,         // 45 segundos
  serverSelectionTimeoutMS: 20000, // 20 segundos
  maxPoolSize: 10,                // Pool de conexões
  retryWrites: true,              // Retry em escritas
  retryReads: true               // Retry em leituras
};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect()
      .catch(error => {
        console.error("Erro na conexão MongoDB:", error);
        throw error;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  
  client = new MongoClient(uri, options);
  clientPromise = client.connect()
    .catch(error => {
      console.error("Erro na conexão MongoDB:", error);
      throw error;
    });
}


client?.on('error', (error) => {
  console.error('Erro na conexão MongoDB:', error);
});

client?.on('timeout', () => {
  console.warn('Timeout na conexão MongoDB - tentando reconectar...');
});

client?.on('close', () => {
  console.warn('Conexão MongoDB fechada - tentando reconectar...');
});

export default clientPromise;

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db();
  return { client, db };
}
