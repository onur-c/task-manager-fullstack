import axios from "axios";

export const getTasks = async () => {
  return axios.get("/api/tasks");
};
