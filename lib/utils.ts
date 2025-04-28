import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { camera, Color, LayerType, PathLayer, Point, Side, XYWH } from "@/types/canvas"

// Набір кольорів для вибору (наприклад, кольори користувачів)
const COLORS = [
  "#DC2626",
  "#D97706",
  "#059669",
  "#7C3AED",
  "DB27777"
]

// Універсальна утиліта для поєднання класів Tailwind із пріоритетом останніх
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Функція, що обирає колір на основі ID підключення (user/session ID)
// Завдяки модулю кольори циклічно повторюються
export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length]
}

// Перетворення координат вказівника миші в координати канвасу з урахуванням положення камери
export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: camera
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}

// Перетворення RGB-об'єкта в HEX-рядок для CSS
export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`
}

// Функція зміни розмірів елемента (напр., прямокутника) за вказану сторону (кут)
// Використовується для ресайзу з обчисленням нових координат і розмірів
export function resizeBounds(
  bounds: XYWH,
  corner: Side,
  point: Point
): XYWH {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height
  }

  // Якщо тягнемо за лівий край — змінюємо x і ширину
  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width)
    result.width = Math.abs(bounds.x + bounds.width - point.x)
  }

  // Якщо тягнемо за правий край — оновлюємо ширину
  if ((corner & Side.Right) == Side.Right) {
    result.x = Math.min(point.x, bounds.x)
    result.width = Math.abs(point.x - bounds.x)
  }

  // Якщо тягнемо за верхній край — змінюємо y і висоту
  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height)
    result.height = Math.abs(bounds.y + bounds.height - point.y)
  }

  // Якщо тягнемо за нижній край — оновлюємо висоту
  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y)
    result.height = Math.abs(point.y - bounds.y)
  }

  return result
}

// Функція визначає контрастний колір тексту на основі кольору фону (білий або чорний)
// Використовується для забезпечення читабельності
export function getContrastingTextColor(color: Color) {
  const luminanca = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  return luminanca > 182 ? "black" : "white";
}

// Перетворення масиву координат точок малювання в об'єкт шару PathLayer
// Використовується для збереження малюнку користувача
export function penPointsToPathLayer(points: number[][], color: Color): PathLayer {
  if (points.length < 2) {
    throw new Error("Cannot transform points with less than 2 points")
  }

  // Обчислення меж фігури (bounding box)
  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    const [x, y] = point;

    if (left > x) left = x;
    if (top > y) top = y;
    if (right < x) right = x;
    if (bottom < y) bottom = y;
  }

  // Повертаємо об'єкт типу PathLayer з локалізованими точками (відносно верхнього лівого кута)
  return {
    type: LayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure])
  }
}

// Побудова SVG path з масиву точок stroke 
// Повертає рядок, який можна напряму вставити в атрибут `d` елемента <path>
export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z"); // Закриває path
  return d.join(" ");
};
