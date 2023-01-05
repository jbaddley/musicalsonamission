import { Prisma, PrismaClient, Profile, User } from "@prisma/client";

export type ProfileUser = User & { profile: Partial<Profile> };

const fixProfile = (profile: Partial<Profile>) => {
  return {
    ...(profile as Profile),
    avatarDesignState: profile.avatarDesignState as Prisma.JsonObject,
  };
};

export class UsersServerAPI {
  static async getList() {
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany();
    return users?.sort((a, b) => (String(a.lastName) < String(b.lastName) ? -1 : 1));
  }

  static async get(userId: number): Promise<ProfileUser> {
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });
    return user as ProfileUser;
  }

  static async getByEmail(email: string) {
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    });
    return user;
  }

  static async create(user: ProfileUser) {
    const prisma = new PrismaClient();
    const { profile, ...rest } = user;
    const created = await prisma.user.create({ data: rest });

    profile.userId = created.id;
    const createdProfile = await prisma.profile.create({
      data: fixProfile(profile),
    });
    return { ...created, profile: createdProfile };
  }

  static async update(userId: number, user: ProfileUser) {
    const prisma = new PrismaClient();
    const { profile, ...rest } = user;
    const updated = await prisma.user.update({
      where: {
        id: userId,
      },
      data: rest,
    });
    profile.userId = userId;
    if (profile?.id) {
      await prisma.profile.update({
        where: {
          userId,
        },
        data: fixProfile(profile),
      });
    } else {
      await prisma.profile.create({
        data: fixProfile(profile),
      });
    }

    return this.get(userId);
  }

  static async upsert(user: ProfileUser) {
    if (user.id) {
      return this.update(user.id, user);
    } else {
      return this.create(user);
    }
  }

  static async delete(userId: number) {
    const prisma = new PrismaClient();
    const created = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return created;
  }
}

export class UsersClientAPI {
  static async getList(): Promise<User[]> {
    return fetch("/api/users")
      .then((r) => r.json())
      .then(({ data }) => data);
  }

  static async get(userId: string | number): Promise<ProfileUser> {
    return fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then(({ data }) => data);
  }

  static async create(user: User): Promise<User> {
    return fetch("/api/users", { body: JSON.stringify(user), method: "POST" })
      .then((r) => r.json())
      .then(({ data }) => data);
  }

  static async update(userId: number, user: Partial<User>): Promise<User> {
    return fetch(`/api/users/${userId}`, { body: JSON.stringify(user), method: "PATCH" })
      .then((r) => r.json())
      .then(({ data }) => data);
  }

  static async upsert(user: ProfileUser): Promise<ProfileUser> {
    return fetch(`/api/users`, { body: JSON.stringify(user), method: "PUT" })
      .then((r) => r.json())
      .then(({ data }) => data);
  }

  static async delete(userId: number) {
    return fetch(`/api/users/${userId}`, { method: "DELETE" })
      .then((r) => r.json())
      .then(({ data }) => data);
  }

  static async getBySlug(slug: string) {
    return fetch(`/api/users/${slug}`, { method: "GET" })
      .then((r) => r.json())
      .then(({ data }) => data);
  }
}
