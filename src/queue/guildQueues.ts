import { GuildId } from "../types";
import PlayerQueue from "./playerQueue";

const guildQueues = new Map<GuildId, PlayerQueue>();

export default guildQueues;
