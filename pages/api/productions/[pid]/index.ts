// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Production } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ProductionsServerAPI } from "../../../../data";

type Data = {
  data?: Production | null;
  error?: {
    message: string;
    code: number;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let data: Production | null = null;
  const { pid } = req.query;
  switch (req.method) {
    case "GET":
      console.log("PID", pid, Number.isNaN(+String(pid)));
      if (Number.isNaN(+String(pid))) {
        data = await ProductionsServerAPI.getBySlug(String(pid));
      } else {
        data = await ProductionsServerAPI.get(+String(pid));
      }
      break;
    case "PATCH":
      data = await ProductionsServerAPI.update(+String(pid), JSON.parse(req.body));
      break;
    case "DELETE":
      data = await ProductionsServerAPI.delete(+String(pid));
      break;
  }
  res.status(200).json({
    data: data && (data as Production),
  });
}
