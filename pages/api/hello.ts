// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import fs from 'fs';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = req.body

  fs.writeFile("test.txt", data, function(err) {
    if (err) {
      console.log(err);
    }
  });
}
