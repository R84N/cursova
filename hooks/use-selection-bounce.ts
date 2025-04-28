// Імпортуємо необхідні типи та функції
import { shallow } from "@liveblocks/client";
import { Layer, XYWH } from "@/types/canvas"; // Layer — тип шару, XYWH — координати та розміри

import { useStorage, useSelf } from "@liveblocks/react"; // Хуки Liveblocks для роботи зі сховищем і користувачем

/**
 * Функція для обчислення прямокутника, який обгортає всі виділені шари
 * @param layers - масив шарів
 * @returns координати прямокутника обгортки або null
 */
const boundingBox = (layers: Layer[]): XYWH | null => {
    const first = layers[0];

    // Якщо шарів немає — повертаємо null
    if (!first) {
        return null;
    }

    // Ініціалізуємо межі за першим шаром
    let left = first.x;
    let right = first.x + first.width;
    let top = first.y;
    let bottom = first.y + first.height;

    // Перебираємо всі інші шари, щоб знайти найлівішу, найправішу, найвищу і найнижчу точки
    for (let i = 1; i < layers.length; i++) {
        const { x, y, width, height } = layers[i];

        if (left > x) {
            left = x;
        }

        if (right < x + width) {
            right = x + width;
        }

        if (top > y) {
            top = y;
        }

        if (bottom < y + height) {
            bottom = y + height;
        }
    }

    // Повертаємо координати й розміри прямокутника, що обгортає всі шари
    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
    };
};

/**
 * Кастомний хук, що повертає координати та розміри прямокутника,
 * який обгортає всі виділені користувачем шари
 */
export const useSelectionBounds = () => {

    // Отримуємо масив ID виділених шарів для поточного користувача
    const selection = useSelf((me) => me.presence.selection);

    // Використовуємо useStorage для читання об'єктів шарів зі сховища
    // shallow — оптимізація, яка не тригерить перерендер, якщо значення не змінилося поверхнево
    return useStorage((root) => {
        // Перетворюємо масив ID у масив об'єктів шарів
        const selectedLayers = selection
            ?.map((layerId) => root.layers.get(layerId)!) // витягуємо шар по ID
            .filter(Boolean); // фільтруємо, щоб виключити неіснуючі шари

        // Повертаємо координати bounding box'а, якщо є виділені шари
        return boundingBox(selectedLayers!);
    }, shallow);
};
