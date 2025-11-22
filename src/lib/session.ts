import { authOptions } from "./auth";
import { getServerSession } from "next-auth";

export async function getSessionServer() {
  return await getServerSession(authOptions);
}
