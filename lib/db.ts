/**
 * JSON file-based storage for likes (server-side).
 * Key: likes:{username}:{imageId} → Value: { likedAt: number }
 * In production, replace with a proper DB (e.g. PostgreSQL, SQLite).
 */
import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), ".db", "likes.json");

interface LikeData {
  likedAt: number;
}

type LikeStore = Record<string, LikeData>;

declare global {
  // eslint-disable-next-line no-var
  var _likeStore: LikeStore | undefined;
  // eslint-disable-next-line no-var
  var _likeStorePromise: Promise<LikeStore> | undefined;
}

async function loadStore(): Promise<LikeStore> {
  if (global._likeStore) {
    return global._likeStore;
  }

  if (global._likeStorePromise) {
    return global._likeStorePromise;
  }

  global._likeStorePromise = (async () => {
    try {
      const dir = path.dirname(DB_PATH);
      await fs.mkdir(dir, { recursive: true });
      const content = await fs.readFile(DB_PATH, "utf-8");
      const store = JSON.parse(content) as LikeStore;
      global._likeStore = store;
      return store;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        const store: LikeStore = {};
        global._likeStore = store;
        return store;
      }
      throw error;
    }
  })();

  return global._likeStorePromise;
}

async function saveStore(store: LikeStore): Promise<void> {
  const dir = path.dirname(DB_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(store, null, 2), "utf-8");
  global._likeStore = store;
}

export const likes = {
  key(username: string, imageId: string): string {
    return `likes:${username}:${imageId}`;
  },

  async toggle(username: string, imageId: string): Promise<boolean> {
    const store = await loadStore();
    const key = this.key(username, imageId);

    if (store[key]) {
      delete store[key];
      await saveStore(store);
      return false;
    } else {
      store[key] = { likedAt: Date.now() };
      await saveStore(store);
      return true;
    }
  },

  async getUserLikes(username: string): Promise<string[]> {
    const store = await loadStore();
    const prefix = `likes:${username}:`;
    const imageIds: string[] = [];

    for (const key in store) {
      if (key.startsWith(prefix)) {
        imageIds.push(key.replace(prefix, ""));
      }
    }

    return imageIds;
  },

  async isLiked(username: string, imageId: string): Promise<boolean> {
    const store = await loadStore();
    const key = this.key(username, imageId);
    return Boolean(store[key]);
  },
};

// For DELETE endpoint compatibility
export const db = {
  async del(key: string): Promise<void> {
    const store = await loadStore();
    if (store[key]) {
      delete store[key];
      await saveStore(store);
    }
  },
};
