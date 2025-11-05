import express from "express";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

const app = express();
app.use(express.json());

const APP_ID = process.env.APP_ID;
const APP_CERT = process.env.APP_CERT;

if (!APP_ID || !APP_CERT) {
  console.warn("Warning: APP_ID or APP_CERT env vars are not set.");
}

app.get("/", (req, res) => {
  res.send("AGORA RTC TOKEN SERVER ✅");
});

app.get("/rtcToken", (req, res) => {
  const channelName = req.query.channelName;
  if (!channelName) return res.status(400).json({ error: "channelName is required" });

  const uid = req.query.uid ? Number(req.query.uid) : 0;
  const role = RtcRole.PUBLISHER;
  const expireSeconds = 60 * 60;

  const now = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = now + expireSeconds;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERT,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );
    return res.json({ token, expiresAt: privilegeExpiredTs });
  } catch (err) {
    console.error("Token creation error:", err.message || err);
    return res.status(500).json({ error: "Token generation failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
