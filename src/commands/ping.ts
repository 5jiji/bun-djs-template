import { EmbedBuilder, SlashCommandBuilder, type CommandInteraction } from "discord.js";
import { Command } from "../types/commands";

export default new class Ping extends Command {
  public data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong!');

  async execute(interaction: CommandInteraction) {
    const replyEmbed = new EmbedBuilder()
      .setColor(Math.floor(Math.random() * 16777215))
      .setTitle("Pong!")
      .setDescription(`Latency: ${interaction.createdTimestamp - Date.now()}ms`)
    
    await interaction.reply({embeds: [replyEmbed], ephemeral: true})

    replyEmbed.setDescription(replyEmbed.data.description + `\nRound-trip: ${Date.now() - interaction.createdTimestamp}ms`);
    
    return await interaction.editReply({embeds: [replyEmbed]})
  }
}
