import lfg from "./lfg";
import lfm from "./lfm";

export type Command = {
  data: any;
  execute: (interaction: any) => Promise<void>;
};

export const commands = {
  lfg,
  lfm,
};
