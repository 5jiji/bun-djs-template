import { type Client, Events as DjsEvents } from "discord.js";
import { Events } from "../../types/events";

export default new class Ready extends Events {
  once = true;
  name = DjsEvents.ClientReady;
  execute(client: Client<true>) {
    console.log(`Logged in as ${client.fullUsername(client.user)}`)
  }
}