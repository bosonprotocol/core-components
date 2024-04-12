import morgan from "morgan";
import { httpWinstonLogger } from "../utils/logger";

export const httpLogger = morgan(
  "date=:date[iso] method=:method status=:status url=:url response-time=:response-time ms",
  {
    skip: (req) => {
      return ["/", "/health"].includes(req.url || "");
    },
    stream: {
      write: (message) => {
        httpWinstonLogger.http(message.substring(0, message.lastIndexOf("\n")));
      }
    }
  }
);
