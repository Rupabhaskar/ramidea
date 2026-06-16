const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();
const db = getFirestore();

exports.checkScreenHealth = onSchedule("every 5 minutes", async () => {
  const screens = await db.collection("screens").get();
  const now = Timestamp.now();
  const batch = db.batch();
  let offlineCount = 0;

  screens.forEach((doc) => {
    const data = doc.data();
    const lastSeen = data.lastSeen?.toDate?.() ?? new Date(0);
    const minutesSinceSeen = (now.toDate().getTime() - lastSeen.getTime()) / 60000;

    if (minutesSinceSeen > 10 && data.status === "online") {
      batch.update(doc.ref, { status: "offline" });
      offlineCount++;
    }
  });

  if (offlineCount > 0) {
    await batch.commit();
    console.log(`Marked ${offlineCount} screens offline`);
  }
});

exports.expireCampaigns = onSchedule("every 1 hours", async () => {
  const now = Timestamp.now();
  const campaigns = await db.collection("campaigns")
    .where("status", "in", ["active", "scheduled"])
    .get();

  const batch = db.batch();
  campaigns.forEach((doc) => {
    const data = doc.data();
    if (data.endDate && data.endDate.toDate() < now.toDate()) {
      batch.update(doc.ref, { status: "expired" });
    }
  });

  await batch.commit();
});

exports.onPlayLogCreated = onDocumentCreated("playLogs/{logId}", async (event) => {
  const data = event.data?.data();
  if (!data) return;

  const screenDoc = await db.collection("screens").doc(data.screenId).get();
  if (screenDoc.exists) {
    await screenDoc.ref.update({ lastSeen: Timestamp.now() });
  }
});

exports.sendNotification = onDocumentCreated("notifications/{notificationId}", async (event) => {
  const data = event.data?.data();
  if (!data) return;

  try {
    const userDoc = await db.collection("users").doc(data.userId).get();
    const fcmToken = userDoc.data()?.fcmToken;
    if (!fcmToken) return;

    await getMessaging().send({
      token: fcmToken,
      notification: { title: data.title, body: data.message },
    });
  } catch (error) {
    console.error("FCM send failed:", error);
  }
});

exports.generateDailyReport = onSchedule("every day 00:00", async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const logs = await db.collection("playLogs")
    .where("playedAt", ">=", Timestamp.fromDate(yesterday))
    .get();

  const report = {
    date: yesterday.toISOString().split("T")[0],
    totalPlays: logs.size,
    generatedAt: Timestamp.now(),
  };

  await db.collection("reports").add(report);
  console.log(`Daily report generated: ${report.totalPlays} plays`);
});
