import { deleteClient } from "@/data/clients/deleteClient";
import { Client } from "@/interfaces/client/Client";

export async function deleteClientAction(clientId: Client["id"]) {
  return deleteClient(clientId);
}
