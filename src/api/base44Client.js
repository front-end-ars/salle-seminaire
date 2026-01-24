// src/api/base44Client.js
// Stub client: à remplacer par une vraie API/DB si besoin.

export const base44 = {
  entities: {
    ChecklistSession: {
      async create(data) {
        console.warn("base44Client stub: create", data);
        return { id: crypto?.randomUUID?.() || String(Date.now()), ...data };
      },
      async update(id, data) {
        console.warn("base44Client stub: update", id, data);
        return { id, ...data };
      },
      async get(id) {
        console.warn("base44Client stub: get", id);
        return null;
      },
      async list() {
        console.warn("base44Client stub: list");
        return [];
      },
    },
  },
};
