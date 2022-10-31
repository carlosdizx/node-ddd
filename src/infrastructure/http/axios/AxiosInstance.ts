import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.HTTP_AXIOS_HOST_POKEAPI,
});

export default axiosInstance;
