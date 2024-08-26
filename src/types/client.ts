import type { Collection } from "discord.js";
import config from "../../config.json";
import type { Command } from "./commands";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>
    config: typeof config;
    fullUsername(user: User): string
  }
}