import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Масив із зображеннями для дошки (наразі одне зображення)
const images = ["/board.webp"];

// 🟢 Створення нової дошки
export const create = mutation({
  args: {
    orgId: v.string(),  // ID організації
    title: v.string(),  // Назва дошки
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // Отримуємо дані про поточного користувача

    if (!identity) {
      throw new Error("Unauthorized"); // Якщо користувач не автентифікований — помилка
    }

    // Випадкове зображення з доступного масиву
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Створення запису дошки в базі даних
    const board = await ctx.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,    // ID користувача
      authorName: identity.name!,    // Ім’я автора (не null)
      imageUrl: randomImage,         // URL зображення
    });

    return board;
  },
});

// 🔴 Видалення дошки (і видалення з улюбленого, якщо треба)
export const remove = mutation({
  args: { id: v.id("boards") }, // ID дошки
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;

    // Перевірка: чи ця дошка в улюблених у користувача
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", args.id)
      )
      .unique();

    // Якщо так — видаляємо з улюбленого
    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id);
    }

    // Видаляємо саму дошку
    await ctx.db.delete(args.id);
  },
});

// 🟡 Оновлення назви дошки
export const update = mutation({
  args: { id: v.id("boards"), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();

    // Валідація назви
    if (!title) {
      throw new Error("Title is required");
    }

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters");
    }

    // Оновлення назви дошки
    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });

    return board;
  },
});

// ⭐ Додати дошку до улюбленого
export const favorite = mutation({
  args: { id: v.id("boards"), orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.id);
    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    // Перевірка: чи вже є дошка в улюбленому
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board_org", (q) =>
        q.eq("userId", userId).eq("boardId", board._id).eq("orgId", args.orgId)
      )
      .unique();

    if (existingFavorite) {
      throw new Error("Board already favorited");
    }

    // Додаємо до таблиці улюблених
    await ctx.db.insert("userFavorites", {
      userId,
      boardId: board._id,
      orgId: args.orgId,
    });

    return board;
  },
});

// 🚫 Видалити дошку з улюбленого
export const unfavorite = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.id);
    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    // Знаходимо улюблений запис
    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (!existingFavorite) {
      throw new Error("Помилка видалення з улюблених");
    }

    // Видаляємо з улюблених
    await ctx.db.delete(existingFavorite._id);

    return board;
  },
});

// 🔍 Отримання однієї дошки за ID
export const get = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const board = ctx.db.get(args.id); // Проста вибірка з бази
    return board;
  },
});
