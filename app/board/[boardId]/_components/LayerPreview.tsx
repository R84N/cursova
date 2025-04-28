"use client";

// Компонент відповідаючий за вибір елемента на дошці (коло, квадрат, олівець)

// Імпортуємо залежності

import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react";
import { memo } from "react";
import Rectangle from "./rectangle";
import Ellipse from "./ellipce";
import Text from "./text";
import Note from "./note";
import Path from "./path";
import { colorToCss } from "@/lib/utils";

// Типізуємо пропси 
interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

const LayerPreview = memo(({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {

  // Отримуємо інформацію про вибраний елемент

  const layer = useStorage((root) => root.layers.get(id));

  // Якщо нема інформації, повертаємо

  if (!layer) {
    return null;
  }

  // В залежності від обраного типу вкористовуємо відповідний елемент

  switch (layer.type) {

    case LayerType.Path:
      return (
        <Path 
          key={id}
          points={layer.points}
          onPointerDown={(e)=>onLayerPointerDown(e,id)}
          x={layer.x}
          y={layer.y}
          fill={layer.fill ? colorToCss(layer.fill) : "#000"}
          stroke={selectionColor}
        />
      )

    case LayerType.Note:
      return <Note id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColor={selectionColor} />;

    case LayerType.Text:
      return <Text id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColor={selectionColor} />;

    case LayerType.Ellipse:
      return <Ellipse id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColor={selectionColor} />;

    case LayerType.Rectangle:
      return <Rectangle id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColor={selectionColor} />;

    default:
      return null;
  }
});

export default LayerPreview;
