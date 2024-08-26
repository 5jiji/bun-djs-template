import { readdir, stat } from "node:fs/promises";
import { Client, Collection } from "discord.js";
import config from "../config.json";
import type { Events } from "./types/events";
import type { Command } from "./types/commands";

async function getScripts<T>(baseFolder: string, subdirs = Infinity): Promise<Set<T>> {
  if (subdirs - 1 < 0) return new Set<T>();

  const entries = await readdir(`${__dirname}/${baseFolder}`);
  let set = new Set<T>();

  const folders = [];
  for (const entry of entries) {
    let path = `${__dirname}/${baseFolder}/${entry}`;
    let entryStat = await stat(path);

    if (entryStat.isDirectory()) {
      folders.push(entry);
      continue;
    }

    try {
      const { default: script } = await import(path);
      set.add(script);
    } catch (err) {
      console.error(`File at path ${path} couldn't get imported.\n\n${err}`);
    }
  }

  for (const folder of folders) {
    const sub = await getScripts<T>(`${baseFolder}/${folder}`, subdirs - 1);
    set = set.union(sub);
  }

  return set;
}

async function loadEvents(client: Client) {
  const events = await getScripts<Events>("")

  for (const event of events) {
    if (event.once) client.once(event.name, event.execute.bind(event));
    else client.on(event.name, event.execute.bind(event))
  }
}

async function loadCommands(client: Client) {
  client.commands = new Collection();

  let commands = await getScripts<Command>("commands");
  for (const command of commands) {
    client.commands.set(command.data.name, command);
  } 
}

export async function loadClient() {
  const client = new Client({
    intents: [
      //GatewayIntentBits.Guilds,
      //GatewayIntentBits.GuildMembers,
      //GatewayIntentBits.GuildModeration,
      //GatewayIntentBits.GuildEmojisAndStickers,
      //GatewayIntentBits.GuildIntegrations,
      //GatewayIntentBits.GuildWebhooks,
      //GatewayIntentBits.GuildInvites,
      //GatewayIntentBits.GuildVoiceStates,
      //GatewayIntentBits.GuildPresences,
      //GatewayIntentBits.GuildMessages,
      //GatewayIntentBits.GuildMessageReactions,
      //GatewayIntentBits.GuildMessageTyping,
      //GatewayIntentBits.DirectMessages,
      //GatewayIntentBits.DirectMessageTyping,
      //GatewayIntentBits.MessageContent,
      //GatewayIntentBits.GuildScheduledEvents,
      //GatewayIntentBits.AutoModerationConfiguration,
      //GatewayIntentBits.AutoModerationExecution,
      //GatewayIntentBits.GuildMessagePolls,
      //GatewayIntentBits.DirectMessagePolls,
    ]
  });

  client.config = config;

  Promise.all([
    loadEvents(client),
    loadCommands(client)
  ]);

  client.fullUsername = (user) => {
    return user.discriminator != "0" ? `${user.username}#${user.discriminator}` : user.username
  }

  return client;
}