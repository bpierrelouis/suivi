import test from "node:test";
import assert from "node:assert/strict";
import { createNotificationService } from "../src/services/notification.service.js";

test("une notification ne peut être lue que par son destinataire", async () => {
  const service = createNotificationService({ async markRead() { return { count: 0 }; } });
  await assert.rejects(() => service.markRead({ id: "intrus" }, "notification-1"), { code: "NOTIFICATION_INTROUVABLE" });
});

test("la liste retourne le compteur personnel", async () => {
  const service = createNotificationService({ async listNotifications(id) { return [{ id, titre: "Test" }]; }, async countUnread() { return 1; } });
  const result = await service.list({ id: "user-1" });
  assert.equal(result.nonLues, 1);
  assert.equal(result.notifications[0].id, "user-1");
});
