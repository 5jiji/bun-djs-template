import type { CommandInteraction, SharedSlashCommand } from "discord.js";

export abstract class Command {
  abstract data: SharedSlashCommand;
  abstract execute(interaction: CommandInteraction): any;

}