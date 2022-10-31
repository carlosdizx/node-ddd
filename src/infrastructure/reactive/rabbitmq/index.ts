import userConfigInit from "./user/UserRabbitMQ";

const rabbitmqConfigs: any[] = [];

const initAMQP = async () => {
  rabbitmqConfigs.push(userConfigInit());
};

export default initAMQP;
