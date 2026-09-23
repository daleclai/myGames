import express from "express";
import cors from "cors";
import session from "express-session";
import authRouter from "./routes/auth";
import gamesRouter from "./routes/games";
import collectionRouter from "./routes/collection";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/games", gamesRouter);
app.use("/api/collection", collectionRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
