import userAxiosInit from "./user/UserAxios";

const allAxiosInit = async () => {
  await userAxiosInit();
};

export default allAxiosInit;
