import prisma from "@/lib/prisma";

export type PrismaOrderBy = Parameters<typeof prisma.product.findMany>['0']['orderBy']