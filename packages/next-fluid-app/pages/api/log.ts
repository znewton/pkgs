import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
    console.log(req.body);
    res.status(200).send("OK");
};

export default handler;
