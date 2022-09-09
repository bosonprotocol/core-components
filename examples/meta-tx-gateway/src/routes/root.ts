import { Router } from "express";
import healthRouter from "./health";

const rootRouter = Router();

rootRouter.get("/", (req, res) => res.sendStatus(200));
rootRouter.use("/", healthRouter);

export default rootRouter;
