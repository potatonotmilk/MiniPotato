import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("janken")
    .setDescription("じゃんけんで対決！"),

  async execute(interaction) {
    const rock = new ButtonBuilder()
      .setCustomId("rock")
      .setEmoji("✊")
      .setLabel("グー")
      .setStyle(ButtonStyle.Primary);

    const scissors = new ButtonBuilder()
      .setCustomId("scissors")
      .setEmoji("✌")
      .setLabel("チョキ")
      .setStyle(ButtonStyle.Primary);

    const paper = new ButtonBuilder()
      .setCustomId("paper")
      .setEmoji("🖐️")
      .setLabel("パー")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(rock, scissors, paper);

    const response = await interaction.reply({
      content: `じゃんけん...`,
      components: [row],
    });

    try {
      const result = ["(あいこ)", "ﾏｹﾀ-!", "ｶｯﾀ-!"];
      const collectorFilter = (i) => i.user.id === interaction.user.id;

      let confirmation = await response.awaitMessageComponent({
        filter: collectorFilter,
        time: 30000,
      });
      let solve = await janken(confirmation);

      while (solve === 0) {
        await confirmation.followUp({
          content: `あいこで...`,
          components: [row],
        });
        confirmation = await response.awaitMessageComponent({
          filter: collectorFilter,
          time: 30000,
        });
        solve = await janken(confirmation);
      }

      await confirmation.followUp(result[solve]);
    } catch (e) {
      await interaction.editReply({
        content: "じかんぎれ…(もしくはエラー)",
        components: [],
      });
    }
  },
};

async function janken(confirmation) {
  const hands = { rock: 0, scissors: 1, paper: 2 };
  const handsEmoji = ["✊", "✌", "🖐️"];

  const botHand = Math.floor(Math.random() * 3);
  const playersHand = hands[confirmation.customId];

  const solve = (botHand - playersHand + 3) % 3;

  const playersHandButton = new ButtonBuilder()
    .setCustomId("disabled")
    .setEmoji(confirmation.component.emoji)
    .setLabel(`${confirmation.component.label}を出したよ`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);

  const confirmedRow = new ActionRowBuilder().addComponents(playersHandButton);

  const text =
    confirmation.message.content === "じゃんけん..."
      ? "じゃんけん...\nぽん！"
      : "あいこで...\nしょ！";

  await confirmation.update({
    content: `${text} ${handsEmoji[botHand]}`,
    components: [confirmedRow],
  });

  return solve;
}