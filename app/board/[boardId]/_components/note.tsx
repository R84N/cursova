// Компонент записки 

// Імпортуємо залежності 

import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { NoteLayer } from "@/types/canvas";
import { cn, colorToCss, getContrastingTextColor } from "@/lib/utils";
import { useMutation } from "@liveblocks/react";

// Імпортуємо шрифти 

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

// Функція для розрахування розміру шрифта в залежності від розміру записки
                
const calculateFontSie = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.15;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

// Типізуємо пропси
interface TextProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const Note = ({ layer, onPointerDown, id, selectionColor }: TextProps) => {

  // Отримуємо данні про фігуру 

  const { x, y, width, height, fill, value } = layer;

  // Функції для оновлення тексту в записці 

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");

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
        backgroundColor: fill ? colorToCss(fill) :"#000"
      }}
      className="shadow-md drop-shadow-xl"
      >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className={cn("h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none", font.className)}
        style={{
          color: fill ? getContrastingTextColor(fill) : "#000",
          fontSize: calculateFontSie(width, height),
        }}
      />
    </foreignObject>
  );
};

export default Note;
