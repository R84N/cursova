import { v } from "convex/values";
import { query } from "./_generated/server";

// Створюємо запит get, який повертає список дошок певної організації з можливістю пошуку
export const get = query({
  args: {
    orgId: v.string(), // ID організації, обов'язковий параметр
    search: v.optional(v.string()) // Пошуковий запит по заголовку дошки, необов'язковий
  },
  handler: async (ctx, args) => {
    // Отримуємо ідентичність користувача
    const identity = await ctx.auth.getUserIdentity();

    // Якщо користувач неавторизований — зупиняємо виконання
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.search as string; // Витягуємо пошуковий запит (якщо є)
    let boards = []; // Ініціалізуємо масив для дошок

    if (title) {
      // Якщо є пошук — виконуємо пошук по заголовку з урахуванням організації
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q
            .search("title", title) // пошук по полю title
            .eq("orgId", args.orgId) // фільтрація по організації
        )
        .collect(); // збираємо результат
    } else {
      // Якщо пошуку немає — просто отримуємо всі дошки цієї організації
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId)) // фільтрація по orgId
        .order("desc") // сортування у зворотному порядку (ймовірно, по часу створення)
        .collect();
    }

    // Для кожної дошки перевіряємо, чи вона додана в улюблені поточним користувачем
    const boardsWithFavoriteRelation = boards.map((board) => {
      return ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) =>
          q
            .eq("userId", identity.subject) // шукаємо по userId
            .eq("boardId", board._id) // і по boardId
        )
        .unique() // очікуємо максимум один результат
        .then((favorite) => {
          return {
            ...board, // повертаємо саму дошку
            isFavorite: !!favorite // додаємо прапорець isFavorite (true/false)
          };
        });
    });

    // Чекаємо завершення всіх запитів на улюблені
    const boardsWithFavoriteBoolean = Promise.all(boardsWithFavoriteRelation);

    // Повертаємо фінальний результат — масив дошок з isFavorite
    return boardsWithFavoriteBoolean;
  }
});
