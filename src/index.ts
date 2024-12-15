import { Hono } from "hono";
import { upgradeWebSocket } from "hono/cloudflare-workers";

import { decode, sign, verify } from "hono/jwt";
import { errorHandler, notFound } from "./middlewares";

import { Environment } from "../bindings";

const app = new Hono<Environment>().basePath("/api/v1");
// app.use("*",async (c, next) => {
//   const data: {
//     token: string;
//   } = await c.req.json();

//   const secret = "mySecretKey";
//   const token = await verify(data.token, secret).catch((e) => {
//     return { error: e };
//   });
//   if (token.error) {
//     return c.json({ error: token.error }, 400);
//   }
//   await next();
// });

app.post("/", async (c) => {
  const data: {
    token: string;
  } = await c.req.json();
  const dddd = c.env.SECRET_KEY;
  const name = c.req.query("name");
  return c.json({ message: "Hello World!" + name });
});

app.get(
  "/ws",
  upgradeWebSocket(() => {
    return {
      onMessage: (event, ws) => {
        console.log(JSON.parse(event.data));
        ws.send("Hello from server!");
      },

      onClose: () => {
        console.log("Connection closed");

      },
    };
  })
);

// const app = new Hono()

app.get("/", async (c) => {
  const payload = {
    sub: "user123",
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 1, // Token expires in 5 minutes
  };
  const secret = "mySecretKey";
  const token = await sign(payload, secret);
  const decode = await verify(
    token,
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzM0MjA3NzAwfQ.xz1s7cNCQJywhrnOh3ef_Y9Anq6M5DwNZZKEZYzZiro",
    secret
  ).catch((e) => {
    return { error: e };
  });
  if (decode.error) {
    return c.json({ error: decode.error }, 400);
  }
  return c.json(decode);
});
app.onError((err, c) => {
  const error = errorHandler(c);
  return error;
});

// Not Found Handler
app.notFound((c) => {
  const error = notFound(c);
  return error;
});

export default app;
