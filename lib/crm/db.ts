import { PrismaClient } from "@prisma/client";

// A single PrismaClient per process. In dev, Next.js hot-reload would otherwise
// spawn a new client on every change and exhaust the connection pool, so we stash
// it on globalThis.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
