import { currentUser, auth } from "@clerk/nextjs/server"; // Отримання поточного користувача та авторизації з Clerk
import { Liveblocks } from "@liveblocks/node"; // Імпорт серверного SDK Liveblocks
import { ConvexHttpClient } from "convex/browser"; // Клієнт для викликів Convex API
import { api } from "@/convex/_generated/api"; // Імпорт автогенерованих API-запитів Convex

// Ініціалізація клієнта Convex з публічного URL
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Ініціалізація Liveblocks SDK з секретним ключем 
const liveblocks = new Liveblocks({
  secret: "sk_dev_qX7jflDNZ55FLflSdxkGybU82F_8V3ULfS96vkJRGTzZcbiI2SM5bQa0C1-DDhEt",
});

export async function POST(request: Request) {
  // Отримання авторизаційної інформації користувача
  const authorization = await auth();
  const user = await currentUser();

  // Лог для дебагу авторизації
  console.log("AUTH_INFO", {
    authorization,
    user,
  });

  // Якщо користувач не авторизований — повертаємо 403
  if (!authorization || !user) {
    return new Response("Unauthorized", { status: 403 });
  }

  // Отримання ідентифікатора кімнати з тіла запиту
  const { room } = await request.json();

  // Отримання дошки (board) з Convex по ID
  const board = await convex.query(api.board.get, { id: room });

  // Лог для дебагу кімнати та дошки
  console.log("AUTH_INFO", {
    room,
    board,
  });

  // Якщо дошка не належить організації користувача — забороняємо доступ
  if (board?.orgId !== authorization.orgId) {
    return new Response("Unauthorized", { status: 403 });
  }

  // Формування даних користувача для Liveblocks
  const userInfo = {
    name: user.firstName || "Teammeate", // Якщо ім’я не задане — дефолтне "Teammeate"
    picture: user.imageUrl, // Аватарка користувача
  };

  // Підготовка сесії Liveblocks з ID користувача та додатковими даними
  const session = liveblocks.prepareSession(user.id, { userInfo });

  // Якщо кімната задана — дозволяємо повний доступ до неї
  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  // Авторизуємо сесію та отримуємо тіло і статус
  const { status, body } = await session.authorize();

  // Повертаємо відповідь з авторизаційними даними Liveblocks
  return new Response(body, { status });
}
