import type { Note } from "@prisma/client";
import { prisma } from "~/db.server";

export function getNote({ id, userId }: Pick<Note, "id" | "userId">) {
  return prisma.note.findFirst({
    select: { id: true, body: true },
    where: { id, userId },
  });
}

export function getNotesListItemsByDate({
  userId,
  date,
}: Pick<Note, "userId" | "date">) {
  return prisma.note.findMany({
    where: { userId, date },
    select: { id: true, body: true, date: true },
    orderBy: { updatedAt: "asc" },
  });
}

export function createNote({
  body,
  userId,
  date,
}: Pick<Note, "body" | "date" | "userId">) {
  return prisma.note.create({
    data: {
      body,
      date,
      userId,
    },
  });
}

export function deleteNote({ id, userId }: Pick<Note, "id" | "userId">) {
  return prisma.note.deleteMany({
    where: { id, userId },
  });
}

export function updateNote({
  id,
  body,
  userId,
}: Pick<Note, "id" | "body" | "userId">) {
  return prisma.note.update({
    where: { id, userId },
    data: { body },
  });
}
