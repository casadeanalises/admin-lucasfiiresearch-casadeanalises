import { PrismaClient } from "@prisma/client";

const MAX_RETRIES = 3;

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Otimizações para o Neon Database
    // https://neon.tech/docs/connect/connection-pooling
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = global.prisma ?? prismaClientSingleton();

export async function queryWithRetry<T>(
  queryFn: () => Promise<T>,
  retries = MAX_RETRIES,
): Promise<T> {
  try {
    return await queryFn();
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P1017" &&
      retries > 0
    ) {
      console.warn(
        `Conexão com banco de dados fechada. Tentando reconectar... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`,
      );

      const delay = 1000 * Math.pow(2, MAX_RETRIES - retries);
      await new Promise((resolve) => setTimeout(resolve, delay));

      return queryWithRetry(queryFn, retries - 1);
    }

    throw error;
  }
}

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
