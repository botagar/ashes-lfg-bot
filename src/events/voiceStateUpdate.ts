import { Client } from "discord.js";
import Groups from "../group/groups";
import logger from "../utils/logger";

const OnVoceStateUpdate = (client: Client) => {
  client.on("voiceStateUpdate", (oldState, newState) => {
    const guild = newState.guild;
    const user = newState.member?.user;

    logger.debug({
      msg: "Voice state update",
      user: { id: user?.id, name: user?.username },
      oldState: oldState.channelId,
      newState: newState.channelId,
      guild: guild?.id,
    });
    if (newState.channelId === null) {
      console.log(
        `user ${user?.displayName} left channel ${oldState.channelId} in guild ${guild?.name}`
      );
      logger.debug({
        msg: "User left channel",
        user: user?.id,
        channel: oldState.channelId,
        guild: guild?.id,
      });
    } else if (oldState.channelId === null) {
      logger.debug({
        msg: "User joined channel",
        user: user?.id,
        channel: newState.channelId,
        guild: guild?.id,
      });
      const group = Groups.getInstance().findGroupByChannel(newState.channelId);
      if (group && user) {
        const joinedSlot = group.acceptInvite(user.id);
        if (joinedSlot) {
          logger.info({
            msg: "User joined group",
            user: { id: user.id, name: user.username },
            group: group.channelId,
            guild: { id: guild?.id, name: guild?.name },
          });
          newState.channel?.send({
            content: `${user} has joined the group as role [${joinedSlot.classTypes.join(
              ", "
            )}]`,
          });
        }
      }
    } else {
      logger.debug({
        msg: "User moved channels",
        user: { id: user?.id, name: user?.username },
        oldChannel: oldState.channelId,
        newChannel: newState.channelId,
        guild: { id: guild?.id, name: guild?.name },
      });
    }
  });
};

export default OnVoceStateUpdate;
