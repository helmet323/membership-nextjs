import { onRequest } from "firebase-functions/v2/https";

type Indexable = { [key: string]: any };

export const helloworld = onRequest((req, res) => {
  const name = req.params[0];
  const items: Indexable = { lamp: "This is a lamp", chair: "Good chair" };
  const message = items[name];
  res.send(`<h1>${message}</h1>`);
});
