import { Router } from "express";
import healthRouter from "./health";
import { metaTxRouterV2, metaTxRouterV1 } from "./meta-tx";

const rootRouter = Router();

rootRouter.get("/", (req, res) => res.sendStatus(200));
rootRouter.use("/", healthRouter);
rootRouter.use("/api/v2/meta-tx", metaTxRouterV2);
rootRouter.use("/api/v1/meta-tx", metaTxRouterV1);

export default rootRouter;
