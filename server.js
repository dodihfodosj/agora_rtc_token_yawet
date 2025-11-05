const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.send("AGORA RTC TOKEN SERVER");
});

app.get("/rtcToken", (req, res) => {
  const appID = process.env.APP_ID;
  const appCertificate = process.env.APP_CERT;

  const channelName = req.query.channelName;
  if (!channelName) {
    return res.status(400).json({ error: "channelName not provided" });
  }

  const uid = 0;
  const role = RtcRole.PUBLISHER;
  const expireTime = 3600;
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTime + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  return res.json({ token });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
