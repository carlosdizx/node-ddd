import { RabbitMQConfig } from "../RabbitMQConfig";
import { PostgresSQLRepository } from "../../../repository/PostgreSQLRepository";
import { UserEntity } from "../../../data/UserEntity";
import { UserCrudUseCase } from "../../../../domain/usecase/user/UserCrudUseCase";

const exchange = "ex.ddd.finaktiva";
const type = "direct";
const routingKey = "rk.users.send";
const queue: string = "users.listener";

const userConfig: RabbitMQConfig = new RabbitMQConfig(
  exchange,
  type,
  routingKey,
  queue
);
const repository = new PostgresSQLRepository(UserEntity);
const crudUseCase = new UserCrudUseCase(repository);

const registerUser = async () => {
  await userConfig.createChannel();

  await userConfig.channel.consume(queue, async (message) => {
    const data = JSON.parse(
      JSON.parse(JSON.stringify(message.content.toString()))
    );
    const users = await crudUseCase.getAllUsers();

    if (users.find((user) => user.email === data.email))
      throw new Error("User already exist!");
    await crudUseCase.registerUser(data);
    userConfig.channel.ack(message);

    await userConfig.publishMessage(data);
  });
};

const userConfigInit = async () => {
  await registerUser();
};

export default userConfigInit;
