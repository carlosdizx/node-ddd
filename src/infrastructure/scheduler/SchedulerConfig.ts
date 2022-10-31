import cron from "node-cron";

export class SchedulerConfig {
  private readonly _expression: string;

  private readonly _lamda: Function;

  constructor(expression: string, lambda: Function) {
    this._expression = expression;
    this._lamda = lambda;
  }

  start = async () => {
    cron.schedule(this._expression, async () => {
      const result = await this._lamda();
      console.log("result => ", result);
    });
  };
}
