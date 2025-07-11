import fs from "fs";
import path from "path";
import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

export default async function registerCommands() {
  const commands = [];

  const categoryFoldersPath = path.join(process.cwd(), "commands");
  const commandFolders = fs.readdirSync(categoryFoldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(categoryFoldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".mjs"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);

      try {
        const module = await import(filePath);
        const command = module.default;

        if (!command?.data?.toJSON) {
          console.warn(`⚠️ 無効なコマンドファイル: ${file}（data.toJSON が見つかりません）`);
          continue;
        }

        commands.push(command.data.toJSON());
      } catch (err) {
        console.error(`❌ コマンド登録エラー: ${file}`, err);
      }
    }
  }

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log("🔄 コマンドを登録中...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("✅ 登録完了！");
  } catch (error) {
    console.error("❌ コマンド登録に失敗:", error);
  }
}