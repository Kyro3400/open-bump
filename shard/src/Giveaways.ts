import Discord, { MessageEmbedOptions } from "discord.js";
import Giveaway from "./models/Giveaway";
import GiveawayRequirement from "./models/GiveawayRequirement";
import Guild from "./models/Guild";
import OpenBump from "./OpenBump";
import Utils, { TextBasedGuildChannel } from "./Utils";

export interface RequirementData {
  type: "GUILD" | "ROLE" | "VOTE";
  target?: string;
  invite?: string;
}

export default class Giveaways {
  public static async start(
    guild: Discord.Guild,
    channel: TextBasedGuildChannel,
    prize: string,
    time: number,
    winnersCount: number,
    requirements: Array<RequirementData> = []
  ) {
    const message = await channel.send(`Loading giveaway...`);

    const giveaway = await Giveaway.create({
      id: message.id,
      guildId: guild.id,
      channel: channel.id,
      prize,
      time,
      winnersCount
    });

    if (!giveaway.requirements) giveaway.requirements = [];
    for (const requirement of requirements) {
      giveaway.requirements.push(
        await GiveawayRequirement.create({
          giveawayId: giveaway.id,
          type: requirement.type,
          target: requirement.target,
          invite: requirement.invite
        })
      );
    }

    const embed = await this.giveawayToEmbed(giveaway);

    if (embed) {
      await message.edit("", { embed });
    } else {
      await message.delete();
      // TODO: Error
    }
  }

  public static async giveawayToEmbed(
    giveaway: Giveaway,
    guild?: Discord.Guild
  ) {
    if (!guild)
      guild = OpenBump.instance.client.guilds.cache.get(giveaway.guildId);
    if (!guild) throw new Error(); // TODO: Error

    let description = [`React with ${Utils.Emojis.TADA} to enter!`];

    if (giveaway.winnersCount !== 1)
      description.push(`Winners: **${giveaway.winnersCount}**`);

    for (const requirement of giveaway.requirements) {
      if (requirement.type === "GUILD") {
        const requirementGuildDatabase = await Guild.findOne({
          where: { id: requirement.target as string }
        });
        if (!requirement) return; // TODO: Throw error
        description.push(
          `Must join: **[${requirementGuildDatabase?.name}](${requirement.invite})**`
        );
      } else if (requirement.type === "ROLE") {
        const role = guild.roles.fetch(requirement.target);
        if (!role) return; // TODO: Throw error
        description.push(`Must have role: ${role}`);
      } else if (requirement.type === "VOTE")
        description.push(
          `Must vote for: **[${
            OpenBump.instance.client.user?.username
          }](${Utils.Lists.getLinkTopGG()})**`
        );
      else return; // TODO: Throw error
    }

    const embed: MessageEmbedOptions = {
      color: Utils.Colors.GREEN,
      title: `${Utils.Emojis.GIFT} ${giveaway.prize}`,
      description: description.join("\n"),
      footer: {
        text: `${giveaway.winnersCount} Winner${
          giveaway.winnersCount === 1 ? "" : "s"
        } | Ends at`
      },
      timestamp: Date.now() // TODO: Use correct date
    };

    return embed;
  }
}
