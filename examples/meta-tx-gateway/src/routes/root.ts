import { Router } from "express";
import healthRouter from "./health";
import { metaTxRouter } from "./meta-tx";

const rootRouter = Router();

rootRouter.get("/", (req, res) => res.sendStatus(200));
rootRouter.use("/", healthRouter);
rootRouter.use("/meta-tx/native", metaTxRouter);

export default rootRouter;
