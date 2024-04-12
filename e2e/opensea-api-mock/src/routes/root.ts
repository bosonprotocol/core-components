import { Router } from "express";
import healthRouter from "./health";
import { openseaV2 } from "./opensea";

const rootRouter = Router();

rootRouter.get("/", (req, res) => res.sendStatus(200));
rootRouter.use("/", healthRouter);
rootRouter.use("/v2", openseaV2);
rootRouter.use("/api/v2", openseaV2);

export default rootRouter;
