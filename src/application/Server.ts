import "dotenv/config";
import express from "express";
import cors from "express";
import dbMongoInit from "./db/MongoConfig";
import { registerRouters } from "./routes";
import dbMySQLInit from "./db/MySQLConfig";
import dbPostgresSQLInit from "./db/PostgreSQLConfig";
import initScheduler from "../infrastructure/scheduler";
import initAMQP from "../infrastructure/reactive/rabbitmq";
import allAxiosInit from "../infrastructure/http/axios";

export class Server {
  private readonly port: string;
  private readonly app: express.Express;

  constructor(port: string) {
    this.port = port;
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.connectToDatabase().then();
    registerRouters(this.app);
    initScheduler().then();
    initAMQP().then();
    allAxiosInit().then();
  }

  connectToDatabase = async () => {
    await dbMongoInit();
    await dbMySQLInit();
    await dbPostgresSQLInit();
  };

  listen = async (): Promise<void> => {
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        console.log(
          `App is running at http://localhost:${this.port} in
           ${this.app.get("env")} mode`
        );
        console.log("  Press CTRL-C to stop\n");
        resolve();
      });
    });
  };
}
