// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Production } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ProductionsServerAPI } from "../../../data";

type Data = {
  data?: Production | Production[] | null;
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
        data = await ProductionsServerAPI.getList();
        res.status(200).json({
          data: data && (data as Production[]),
        });
        return;
      case "POST":
        data = await ProductionsServerAPI.create(JSON.parse(req.body));
      case "PUT":
        data = await ProductionsServerAPI.upsert(JSON.parse(req.body));
    }
  } catch (e) {
    console.log("E", e);
  }
  res.status(200).json({
    data: data && (data as Production),
  });
}
