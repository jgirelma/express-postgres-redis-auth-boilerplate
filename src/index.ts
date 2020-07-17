require("dotenv").config();
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { errorMiddleware } from "./api/middleware/error";
import { apiRouter } from "./api";
import { createTable } from "./db";

(async () => {
  //Wait for db and redis to start
  await new Promise((res) =>
    setTimeout(res, process.env.NODE_ENV === "production" ? 5000 : 500)
  );

  const app = express();

  const RedisStore = connectRedis(session);

  const client = new Redis({
    port: 6379,
    host: process.env.NODE_ENV === "production" ? "redis" : "localhost",
    password: process.env.REDIS_SECRET,
  });

  app.use(express.json());

  app.use(
    session({
      store: new RedisStore({ client }),
      secret: process.env.COOKIE_SECRET!,
      name: "sid",
      resave: false,
      saveUninitialized: true,
      cookie: { sameSite: true, secure: false, maxAge: 1000 * 60 * 60 * 7 },
    })
  );

  app.use("/api", apiRouter);

  app.use(errorMiddleware);

  await createTable();

  app.listen(3000, async () => {
    console.log("Listining on 3000");
  });
})();
