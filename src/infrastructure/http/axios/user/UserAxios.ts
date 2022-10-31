import axiosInstance from "../AxiosInstance";
import { PostgresSQLRepository } from "../../../repository/PostgreSQLRepository";
import { UserCrudUseCase } from "../../../../domain/usecase/user/UserCrudUseCase";
import { UserEntity } from "../../../data/UserEntity";

const repository = new PostgresSQLRepository(UserEntity);
const crudUseCase = new UserCrudUseCase(repository);

const getAllPokemonAndRegister = async () => {
  const result = await axiosInstance.get("");
  const pokemons: any[] = result.data.results;
  for (const pokemon of pokemons) {
    await crudUseCase.registerUser({
      name: pokemon.name,
      email: pokemon.name.concat("@mail.com"),
      description: null,
    });
  }
};

const userAxiosInit = async () => {
  await getAllPokemonAndRegister();
};

export default userAxiosInit;
