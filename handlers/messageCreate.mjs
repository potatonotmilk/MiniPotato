export default async(message) => {
  if (message.content.match(/てるぬい|テルぬい|テルルぬい|テルルのぬい/)) {
    await message.react("<:tellur:1375039865879662653>");
  }
  
  if (message.content.match(/にゃん|にゃーん|にゃ～ん/)) {
    await message.reply("にゃ～ん");
  }
};
