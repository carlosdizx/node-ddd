import amqp from "amqplib";

const rabbitSettings = {
  protocol: "amqp",
  hostname: process.env.BROKER_RABBIT_HOSTBROKER_RABBIT_HOST,
  port: parseInt(process.env.BROKER_RABBIT_PORT),
  username: process.env.BROKER_RABBIT_USERNAME,
  password: process.env.BROKER_RABBIT_PASSWORD,
  vhost: process.env.BROKER_RABBIT_VHOST,
  authMechanism: ["PLAIN", "AMQPLAIN", "EXTERNAL"],
};

export class RabbitMQConfig {
  private readonly exchange: string;
  private readonly type: string;
  private readonly routingKey: string;
  private readonly queue: string;
  private _channel: any;

  constructor(
    exchange: string,
    type: string,
    routingKey: string,
    queue: string
  ) {
    this.exchange = exchange;
    this.type = type;
    this.routingKey = routingKey;
    this.queue = queue;
  }

  async createChannel() {
    const connection = await amqp.connect(rabbitSettings);
    this._channel = await connection.createChannel();
  }

  publishMessage = async (message: any) => {
    if (!this._channel) {
      await this.createChannel();
    }

    await this._channel.assertExchange(this.exchange, this.type);

    await this._channel.publish(
      this.exchange,
      this.routingKey,
      Buffer.from(JSON.stringify(message))
    );
  };

  get channel(): any {
    return this._channel;
  }
}
