import { notFound } from "../errors/app.error.js";

export function createNotificationService(repository) {
  return {
    async list(user) { return { notifications: await repository.listNotifications(user.id), nonLues: await repository.countUnread(user.id) }; },
    async markRead(user, id) { const result = await repository.markRead(id, user.id); if (!result.count) throw notFound("NOTIFICATION_INTROUVABLE"); },
  };
}
