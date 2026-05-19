import { downloadContentFromMessage } from "@whiskeysockets/baileys";

export async function downloadViewOnceCmd(sock, msg, { jid }) {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!quoted) return sock.sendMessage(jid, { text: "❌ Reply to a view-once message with .dlviewonce" });

  const voImage = quoted.viewOnceMessage?.message?.imageMessage || quoted.imageMessage;
  const voVideo = quoted.viewOnceMessage?.message?.videoMessage || quoted.videoMessage;
  const voAudio = quoted.viewOnceMessage?.message?.audioMessage || quoted.audioMessage;
  const media = voImage || voVideo || voAudio;
  if (!media) return sock.sendMessage(jid, { text: "❌ No view-once media found in quoted message." });

  await sock.sendMessage(jid, { text: "⏳ Downloading..." });
  try {
    const type = voImage ? "image" : voVideo ? "video" : "audio";
    const stream = await downloadContentFromMessage(media, type);
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    if (type === "image") await sock.sendMessage(jid, { image: buffer, caption: "👁️ View-Once saved" }, { quoted: msg });
    else if (type === "video") await sock.sendMessage(jid, { video: buffer, caption: "👁️ View-Once saved" }, { quoted: msg });
    else await sock.sendMessage(jid, { audio: buffer, mimetype: "audio/mp4" }, { quoted: msg });
  } catch (err) {
    await sock.sendMessage(jid, { text: `❌ Failed: ${err.message}` });
  }
}
