import { PrismaClient } from './generated/client';

// Global declaration for development hot reload
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Prevent multiple instances during development
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });
};

// Use global variable in development to prevent multiple instances
export const db = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = db;
}

// Database connection helpers
export async function connectDatabase() {
  try {
    await db.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    await db.$disconnect();
    console.log('Database disconnected successfully');
  } catch (error) {
    console.error('Failed to disconnect from database:', error);
    throw error;
  }
}

// Health check
export async function checkDatabaseHealth() {
  try {
    await db.$queryRaw`SELECT 1`;
    return { healthy: true, message: 'Database is healthy' };
  } catch (error) {
    return { 
      healthy: false, 
      message: `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

// Transaction helper
export async function withTransaction<T>(
  fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>
): Promise<T> {
  return db.$transaction(fn);
}

export default db;