// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ProfileUser, UsersServerAPI } from "../../../data";

type Data = {
  data?: ProfileUser | User | User[] | null;
  error?: {
    message: string;
    code: number;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let data = {};
  try {
    switch (req.method) {
      case "GET":
        data = await UsersServerAPI.getList();
        res.status(200).json({
          data: data && (data as User[]),
        });
        return;
      case "POST":
        data = await UsersServerAPI.create(JSON.parse(req.body));
      case "PUT":
        data = await UsersServerAPI.upsert(JSON.parse(req.body));
    }
  } catch (e) {
    console.log("E", e);
  }
  res.status(200).json({
    data: data && (data as User),
  });
}
