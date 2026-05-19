import { botState } from "../handler.js";

export async function blockCmd(sock, msg, { jid, args, owner }) {
  if (!owner) return sock.sendMessage(jid, { text: "❌ Owner only." });
  const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    || (args[0] ? `${args[0].replace(/\D/g,"")}@s.whatsapp.net` : null);
  if (!target) return sock.sendMessage(jid, { text: "❌ Mention or provide a number.\nUsage: .block @user" });
  botState.blockedUsers.add(target);
  await sock.sendMessage(jid, { text: `🚫 Blocked *${target.split("@")[0]}*` });
}

export async function unblockCmd(sock, msg, { jid, args, owner }) {
  if (!owner) return sock.sendMessage(jid, { text: "❌ Owner only." });
  const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    || (args[0] ? `${args[0].replace(/\D/g,"")}@s.whatsapp.net` : null);
  if (!target) return sock.sendMessage(jid, { text: "❌ Mention or provide a number." });
  botState.blockedUsers.delete(target);
  await sock.sendMessage(jid, { text: `✅ Unblocked *${target.split("@")[0]}*` });
}
