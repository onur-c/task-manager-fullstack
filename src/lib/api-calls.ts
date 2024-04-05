import axios from "axios";
import { formSchema } from "./schema";
import { z } from "zod";

export const getTasks = async () => {
  return axios.get("/api/tasks");
};

export const postTask = async (values: z.infer<typeof formSchema>) => {
  return axios.post(`/api/task`, values);
};

export const deleteTask = (id: string) => {
  return axios.delete(`/api/task/${id}`);
};

export const updateTask = ({
  payload,
  id,
}: {
  payload:
    | Record<string, boolean>
    | { title: string; description: string; date: Date };
  id: string;
}) => {
  return axios.put(`/api/task/${id}`, payload);
};
