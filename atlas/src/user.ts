import { Base } from "@/base";
import { FindMeResponse, IUser } from "@litespace/types";

export class User extends Base {
  async create(params: {
    name: string;
    email: string;
    password: string;
    role: IUser.Role;
  }): Promise<void> {
    await this.client.post("/api/v1/user/", JSON.stringify(params));
  }

  async findById(id: number | string): Promise<IUser.Self> {
    const { data } = await this.client.get<IUser.Self>(`/api/v1/user/${id}`);
    return data;
  }

  async findMe(): Promise<FindMeResponse> {
    return await this.client
      .get<FindMeResponse>("/api/v1/user/me")
      .then((response) => response.data);
  }

  async list(): Promise<IUser.Self[]> {
    return await this.client
      .get<IUser.Self[]>("/api/v1/user/list")
      .then((response) => response.data);
  }

  async update(id: number, payload: IUser.UpdatePayload): Promise<void> {
    await this.client.put(`/api/v1/user/${id}`, JSON.stringify(payload));
  }
}
