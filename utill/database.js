import * as SQLite from "expo-sqlite";

import { Memory } from "../Models/memory";

export async function openDatabase() {
  try {
    const db = await SQLite.openDatabaseAsync("memory.db");
    return db;
  } catch (error) {
    console.log("Lỗi: ", error);
  }
}

export async function init() {
  const db = await openDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        imageUri TEXT NOT NULL,
        address TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
      )
    `);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(new Error("Lỗi: ", error));
  }
}

// Chèn một memory vào database
export async function insertMemory(memory) {
  const db = await openDatabase();
  try {
    // Sử dụng runAsync để thực hiện câu lệnh chèn dữ liệu
    await db.runAsync(
      `INSERT INTO memories (title, imageUri, address, latitude, longitude) VALUES (?, ?, ?, ?, ?)`,
      [
        memory.title,
        memory.imageUri,
        memory.address,
        memory.location.latitude,
        memory.location.longitude,
      ]
    );
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(new Error("Lỗi: ", error));
  }
}

export async function fetchMemories() {
  const db = await openDatabase();
  try {
    const result = await db.getAllAsync("SELECT * FROM memories");
    const memories = result.map((item) => {
      return new Memory(
        item.title,
        item.imageUri,
        {
          address: item.address,
          latitude: item.latitude,
          longitude: item.longitude,
        },
        item.id
      );
    });
    return memories;
  } catch (error) {
    console.log("Lỗi khi lấy dữ liệu memories:", error);
    return Promise.reject(
      new Error("Lỗi khi lấy dữ liệu memories: " + error.message)
    );
  }
}

export async function fetchMemoryDetail(id) {
  const db = await openDatabase();

  try {
    const result = await db.getAllAsync("SELECT * FROM memories WHERE id = ?", [
      id,
    ]);
    console.log(result);
    const memory = new Memory(
      result[0].title,
      result[0].imageUri,
      {
        address: result[0].address,
        latitude: result[0].latitude,
        longitude: result[0].longitude,
      },
      result[0].id
    );

    console.log(memory);
    return memory;
  } catch (error) {
    console.log("Lỗi khi lấy dữ liệu memory:", error);
    return Promise.reject(
      new Error("Lỗi khi lấy dữ liệu memory: " + error.message)
    );
  }
}

export async function deleteMemory(id) {
  const db = await openDatabase();
  try {
    await db.runAsync(`DELETE FROM memories WHERE id = ?`, [id]);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(new Error("Lỗi khi xóa memory: " + error.message));
  }
}
