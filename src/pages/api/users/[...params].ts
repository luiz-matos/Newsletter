import { NextApiRequest, NextApiResponse } from "next";

export default function getAll(req: NextApiRequest, res: NextApiResponse) {
  const users = [
    { id: 1, name: 'Diego'},
    { id: 2, name: 'Eduardo'},
    { id: 3, name: 'Luiz'},
    { id: 4, name: 'Melissa'},
  ]
  return res.json(users)
}
