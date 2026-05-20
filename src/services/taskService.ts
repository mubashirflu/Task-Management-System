import { db } from "@/firebase"
import type { Task, TaskCreatePayload } from "@/types"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore"

const tasksRef = collection(db, "tasks")

export const taskService = {
  // ───────────────────────── GET ALL
  async getAll() {
    const snapshot = await getDocs(tasksRef)

    const data: Task[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Task, "id">)
    }))

    return { data }
  },

  // ───────────────────────── CREATE
  async create(payload: TaskCreatePayload) {
    const now = new Date().toISOString()

    const docRef = await addDoc(tasksRef, {
      ...payload,
      createdAt: now,
      updatedAt: now
    })

    return {
      data: {
        id: docRef.id,
        ...payload,
        createdAt: now,
        updatedAt: now
      }
    }
  },

  // ───────────────────────── UPDATE
  async update(id: string, payload: Partial<TaskCreatePayload>) {
    const ref = doc(db, "tasks", id)

    const now = new Date().toISOString()

    await updateDoc(ref, {
      ...payload,
      updatedAt: now
    })

    return {
      data: {
        id,
        ...payload,
        updatedAt: now
      }
    }
  },

  // ───────────────────────── DELETE
  async delete(id: string) {
    await deleteDoc(doc(db, "tasks", id))
    return { success: true }
  }
}