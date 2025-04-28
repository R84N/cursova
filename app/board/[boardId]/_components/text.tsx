// Компонент відповідаючий за замітки

//Імпортуємо залежності 

import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { TextLayer } from "@/types/canvas";
import { cn, colorToCss } from "@/lib/utils";
import { useMutation } from "@liveblocks/react";

// Налаштуваня шрифтів

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

// Функція для розрахунку розмірів шрифта

const calculateFontSie = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.5;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

// Типізуємо пропси
interface TextProps {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const Text = ({ layer, onPointerDown, id, selectionColor }: TextProps) => {

  // Отримуємо данні про фігуру 

  const { x, y, width, height, fill, value } = layer;

  // Функція для зміни текста 

  const updateValue = useMutation(({ storage }, newValue: string) => {

    // Отримуємо нотатки

    const liveLayers = storage.get("layers");

    // Отримуємо наш нотаток, та перезаписуємо в ньому текст 

    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
      }}>
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className={cn("h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none", font.className)}
        style={{
          color: fill ? colorToCss(fill) : "#000",
          fontSize: calculateFontSie(width, height),
        }}
      />
    </foreignObject>
  );
};

export default Text;
