import { prisma } from "../config/prisma.js";

const reservationSelect = {
  id: true, debut: true, fin: true, statut: true, creeLe: true, modifieLe: true,
  motifAnnulation: true, annuleLe: true,
  materiel: { select: { id: true, nom: true, modeSuivi: true, statut: true } },
  projet: { select: { id: true, nom: true, visibilite: true } },
  reservePar: { select: { id: true, identifiant: true } },
  annulePar: { select: { id: true, identifiant: true } },
};

export function findReservableMaterial(id) {
  return prisma.materiel.findFirst({ where: { id, statut: "actif" }, select: { id: true, nom: true, modeSuivi: true } });
}

export function hasConflict(materielId, debut, fin, exceptId) {
  return prisma.reservation.findFirst({
    where: { materielId, statut: "active", ...(exceptId ? { id: { not: exceptId } } : {}), debut: { lt: fin }, fin: { gt: debut } },
    select: { id: true },
  });
}

export function findReservation(id, projetId) {
  return prisma.reservation.findFirst({ where: { id, projetId }, select: reservationSelect });
}

export function listProjectReservations(projetId) {
  return prisma.reservation.findMany({ where: { projetId }, orderBy: [{ debut: "asc" }, { creeLe: "asc" }], select: reservationSelect });
}

export function listMaterialReservations(materielId) {
  return prisma.reservation.findMany({
    where: { materielId }, orderBy: [{ debut: "desc" }, { creeLe: "desc" }],
    select: { ...reservationSelect, historique: { orderBy: { creeLe: "desc" }, select: { id: true, type: true, details: true, creeLe: true, auteur: { select: { id: true, identifiant: true } } } } },
  });
}

export function createReservation(projetId, data, auteurId) {
  return prisma.$transaction(async (transaction) => {
    const reservation = await transaction.reservation.create({
      data: { projetId, materielId: data.materielId, debut: data.debut, fin: data.fin, reserveParId: auteurId }, select: reservationSelect,
    });
    await transaction.historiqueReservation.create({ data: { reservationId: reservation.id, auteurId, type: "creation", details: { debut: data.debut, fin: data.fin } } });
    return reservation;
  });
}

export function updateReservation(id, data, auteurId, before) {
  return prisma.$transaction(async (transaction) => {
    const reservation = await transaction.reservation.update({ where: { id }, data: { debut: data.debut, fin: data.fin }, select: reservationSelect });
    await transaction.historiqueReservation.create({ data: { reservationId: id, auteurId, type: "modification", details: { avant: { debut: before.debut, fin: before.fin }, apres: { debut: data.debut, fin: data.fin } } } });
    return reservation;
  });
}

export function cancelReservation(id, auteurId) {
  return prisma.$transaction(async (transaction) => {
    const reservation = await transaction.reservation.update({ where: { id }, data: { statut: "annulee", annuleLe: new Date(), annuleParId: auteurId, motifAnnulation: "annulation_utilisateur" }, select: reservationSelect });
    await transaction.historiqueReservation.create({ data: { reservationId: id, auteurId, type: "annulation", details: { motif: "annulation_utilisateur" } } });
    return reservation;
  });
}

export const reservationRepository = { findReservableMaterial, hasConflict, findReservation, listProjectReservations, listMaterialReservations, createReservation, updateReservation, cancelReservation };
