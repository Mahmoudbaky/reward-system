// import { Pool, neonConfig } from "@neondatabase/serverless";
// import { PrismaNeon } from "@prisma/adapter-neon";
// import ws from "ws";

// // Sets up WebSocket connections, which enables Neon to use WebSocket communication.
// neonConfig.webSocketConstructor = ws;
// const connectionString = `${process.env.DATABASE_URL}`;

// // Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
// const pool = new Pool({ connectionString });

// // Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
// const adapter = new PrismaNeon(pool);

// // Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
// export const prisma = new PrismaClient({ adapter });

// import { PrismaClient } from '@prisma/client';

import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "@/config/database";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Initialize Prisma with retry logic and connection pooling for production
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "minimal",
  });
};

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Helper function to safely execute Prisma queries with proper error handling
export async function prismaQuery<T>(
  queryFn: () => Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const result = await queryFn();
    return [result, null];
  } catch (error) {
    console.error("Prisma query error:", error);
    return [null, error as Error];
  }
}
