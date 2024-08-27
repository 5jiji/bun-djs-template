import { REST, Routes } from "discord.js";
import { loadCommands } from "./load";

const rest = new REST().setToken((await import("../config.json")).bot.token);

const botData = await rest.get(Routes.user("@me"));

if (!botData || typeof botData != "object" || !("id" in botData) || typeof botData.id != "string") {
  console.error(`Couldn't validate the bot's data.\nIs the token valid?\n${botData}`);
  process.exit();
};

const commands = await loadCommands();

const data = await rest.put(Routes.applicationCommands(botData.id), {body: commands.map((k) => k.data.toJSON())});

if (data instanceof Array)
  console.log(`Successfully deployed commands`);
else 
  console.error(`Error while deploying commands:\n${data}`);