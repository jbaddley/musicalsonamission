// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { UsersServerAPI } from "../../../../data";

type Data = {
  data?: User | null;
  error?: {
    message: string;
    code: number;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let data: User | null = null;
  const { uid } = req.query;
  switch (req.method) {
    case "GET":
      if (Number.isNaN(+String(uid))) {
        data = await UsersServerAPI.getByEmail(String(uid));
      } else {
        data = await UsersServerAPI.get(+String(uid));
      }
      break;
    case "PATCH":
      data = await UsersServerAPI.update(+String(uid), JSON.parse(req.body));
      break;
    case "DELETE":
      data = await UsersServerAPI.delete(+String(uid));
      break;
  }
  res.status(200).json({
    data: data && (data as User),
  });
}
