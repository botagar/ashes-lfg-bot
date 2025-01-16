import { MappedInteractionTypes } from "discord.js";
import { Activities } from "../../enums/activities";

const ValidateActivity = (
  activity: string | number | boolean | undefined
): Activities => {
  if (typeof activity === "string") {
    if (Object.values(Activities).includes(activity as Activities)) {
      return activity as Activities;
    }
  }

  throw new Error(`Invalid activity: ${activity}`);
};

export default ValidateActivity;
