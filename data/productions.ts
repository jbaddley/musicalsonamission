import { PrismaClient, Production } from "@prisma/client";

export class ProductionsServerAPI {
  static async getList() {
    const prisma = new PrismaClient();
    const productions = await prisma.production.findMany();
    console.log("productions", productions);
    return productions;
  }

  static async get(productionId: number) {
    const prisma = new PrismaClient();
    const production = await prisma.production.findFirst({
      where: {
        id: productionId,
      },
    });
    return production;
  }

  static async getBySlug(slug: string) {
    const prisma = new PrismaClient();
    const production = await prisma.production.findFirst({
      where: {
        slug,
      },
    });
    return production;
  }

  static async create(production: Production) {
    const prisma = new PrismaClient();
    const created = await prisma.production.create({ data: production });
    return created;
  }

  static async update(productionId: number, production: Partial<Production>) {
    const prisma = new PrismaClient();
    const created = await prisma.production.update({
      where: {
        id: productionId,
      },
      data: production,
    });
    return created;
  }

  static async upsert(production: Production) {
    if (production.id) {
      return this.update(production.id, production);
    } else {
      return this.create(production);
    }
  }

  static async delete(productionId: number) {
    const prisma = new PrismaClient();
    const created = await prisma.production.delete({
      where: {
        id: productionId,
      },
    });
    return created;
  }
}

export class ProductionsClientAPI {
  static async getList(): Promise<Production[]> {
    return fetch("/api/productions")
      .then((r) => r.json())
      .then(({ data }) => data);
  }

  static async get(productionId: number): Promise<Production> {
    return fetch(`/api/productions/${productionId}`)
      .then((r) => r.json())
      .then(({ data }) => data);
  }

  static async create(production: Production): Promise<Production> {
    return fetch("/api/productions", { body: JSON.stringify(production), method: "POST" })
      .then((r) => r.json())
      .then(({ data }) => data);
  }

  static async update(productionId: number, production: Partial<Production>): Promise<Production> {
    return fetch(`/api/productions/${productionId}`, { body: JSON.stringify(production), method: "PATCH" })
      .then((r) => r.json())
      .then(({ data }) => data);
  }

  static async upsert(production: Production): Promise<Production> {
    return fetch(`/api/productions`, { body: JSON.stringify(production), method: "PUT" })
      .then((r) => r.json())
      .then(({ data }) => data);
  }

  static async delete(productionId: number) {
    return fetch(`/api/productions/${productionId}`, { method: "DELETE" })
      .then((r) => r.json())
      .then(({ data }) => data);
  }

  static async getBySlug(slug: string) {
    return fetch(`/api/productions/${slug}`, { method: "GET" })
      .then((r) => r.json())
      .then(({ data }) => data);
  }
}
