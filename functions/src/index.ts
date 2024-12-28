import { onRequest } from "firebase-functions/v2/https";

// Simple HTTP function to return "Hello, Firebase!".
export const helloWorld = onRequest((req, res) => {
  res.send("Hello, Firebase!");
});
