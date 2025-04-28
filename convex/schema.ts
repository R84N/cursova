import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

// Експортуємо схему бази даних для Convex
export default defineSchema({
  // Таблиця "boards" — зберігає інформацію про дошки
  boards: defineTable({
    title: v.string(),        // Назва дошки
    orgId: v.string(),        // ID організації, до якої належить дошка
    authorId: v.string(),     // ID користувача, який створив дошку
    authorName: v.string(),   // Ім'я автора
    imageUrl: v.string(),     // Зображення, пов'язане з дошкою
  })
    // Індекс для вибірки дошок за організацією (для швидкого доступу)
    .index("by_org", ["orgId"])

    // Пошуковий індекс для фільтрації дошок за заголовком із можливістю фільтрації по orgId
    .searchIndex("search_title", {
      searchField: "title",       // Поле, за яким буде виконуватись пошук
      filterFields: ["orgId"],    // Додаткове поле для фільтрації
    }),

  // Таблиця "userFavorites" — зберігає улюблені дошки користувача
  userFavorites: defineTable({ 
    orgId: v.string(),             // ID організації
    userId: v.string(),            // ID користувача
    boardId: v.id("boards")        // ID дошки, яка додана в улюблені
  }) 
    // Індекс для вибірки всіх улюблених дошок за boardId
    .index("by_board", ["boardId"]) 

    // Індекс для перевірки, які дошки в улюблених у користувача в межах певної організації
    .index("by_user_org", ["userId", "orgId"]) 

    // Індекс для перевірки, чи є конкретна дошка в улюблених у конкретного користувача
    .index("by_user_board", ["userId", "boardId"]) 

    // Індекс для пошуку улюбленої дошки користувача з урахуванням організації
    .index("by_user_board_org", ["userId", "boardId", "orgId"]) 
});
