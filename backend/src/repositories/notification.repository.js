import { prisma } from "../config/prisma.js";

const select = { id: true, type: true, titre: true, message: true, details: true, luLe: true, creeLe: true };
export function listNotifications(destinataireId) { return prisma.notification.findMany({ where: { destinataireId }, orderBy: { creeLe: "desc" }, take: 100, select }); }
export function countUnread(destinataireId) { return prisma.notification.count({ where: { destinataireId, luLe: null } }); }
export function markRead(id, destinataireId) { return prisma.notification.updateMany({ where: { id, destinataireId, luLe: null }, data: { luLe: new Date() } }); }
export const notificationRepository = { listNotifications, countUnread, markRead };
