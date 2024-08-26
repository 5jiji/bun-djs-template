import { loadClient } from "./load";

const client = await loadClient()

client.login((await import("../config.json")).bot.token)
