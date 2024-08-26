import { Events as DjsEvents, type Interaction } from "discord.js";
import { Events } from "../../types/events";

export default new class InteractionCreate extends Events {
  once = false;
  name = DjsEvents.InteractionCreate;
  async execute(interaction: Interaction) {
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return interaction.reply({content: "Command isn't supposed to exist"});
      try {
        command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (!interaction.replied)
          return interaction.reply(`An error occured while executing this command:\n\n\`\`\`\n${error}\`\`\``);

        const reply = await interaction.fetchReply().catch();
        interaction.editReply({content: (reply.content ?? "") + "\n\nAn error occured while executing this command:\n\n\`\`\`\n${error}\`\`\``"})
      }
    }
  }
}