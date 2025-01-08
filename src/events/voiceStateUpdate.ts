import { Client } from "discord.js";
import Groups from "../group/groups";

const OnVoceStateUpdate = (client: Client) => {
  client.on("voiceStateUpdate", (oldState, newState) => {
    const guild = newState.guild;
    const user = newState.member?.user;
    console.debug(
      `UID[${user?.id}]:[${user?.globalName}] CID[${newState.channelId}]:[${newState.channel?.name}] GID[${guild?.id}]:[${guild?.name}]`
    );
    if (newState.channelId === null) {
      console.log(
        `user ${user?.displayName} left channel ${oldState.channelId} in guild ${guild?.name}`
      );
    } else if (oldState.channelId === null) {
      console.log(
        `user ${user?.displayName} joined channel ${newState.channelId} in guild ${guild?.name}`
      );
      const group = Groups.getInstance().findGroupByChannel(newState.channelId);
      if (group && user) {
        const joinedSlot = group.acceptInvite(user.id);
        if (joinedSlot) {
          console.log(`user ${user.displayName} joined group`);
          newState.channel?.send({
            content: `${user} has joined the group as role [${joinedSlot.classTypes.join(
              ", "
            )}]`,
          });
        }
      }
    } else {
      console.log(
        "user moved channels",
        oldState.channelId,
        newState.channelId
      );
    }
  });
};

export default OnVoceStateUpdate;
