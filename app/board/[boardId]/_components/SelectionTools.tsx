"use client"

// Компонент кнопок при натисканні на фігуру

// Імпортуємо залежності 

import { useSelectionBounds } from "@/hooks/use-selection-bounce";
import { Color , camera } from "@/types/canvas"
import { useMutation, useSelf } from "@liveblocks/react";
import { memo } from "react";
import ColorPicker from "./ColorPicker";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { Button } from "@/components/ui/button";
import Hint from "@/components/hint";
import { BringToFront, SendToBack, Trash2} from "lucide-react";

// Типізуємо пропси 
interface SelectionToolsProps{
    camera: camera,
    setLastUsedColor: (color:Color) =>void;
}

const SelectionTools = memo(({camera, setLastUsedColor}:SelectionToolsProps) => {

    // Отримуємо обраний елемент 

    const selection = useSelf((me)=> me.presence.selection )

    // Функція для переміщення вибраних фігур на задній план
const moveToBack = useMutation(({ storage }) => {
    // Отримуємо посилання на список усіх ID шарів (фігур)
    const liveLayersIds = storage.get("layerIds");

    // Масив, у який зберігатимемо індекси вибраних фігур
    const indices: number[] = [];

    // Копіюємо список ID у звичайний масив для зручності обробки
    const arr = liveLayersIds.toArray();

    // Знаходимо індекси всіх вибраних фігур у масиві
    for (let i = 0; i < arr.length; i++) {
        if (selection?.includes(arr[i])) {
            indices.push(i);
        }
    }

    // Переміщаємо кожну вибрану фігуру на передній план свого блоку — у напрямку до початку списку
    for (let i = 0; i < indices.length; i++) {
        liveLayersIds.move(indices[i], i); // переміщуємо на позицію i (чим менше значення, тим глибше шар)
    }
}, [selection]);

// Функція для переміщення вибраних фігур на передній план
const moveToFront = useMutation(({ storage }) => {
    // Отримуємо список усіх ID шарів (фігур)
    const liveLayersIds = storage.get("layerIds");

    // Масив для зберігання індексів вибраних фігур
    const indices: number[] = [];

    // Копіюємо список ID у звичайний масив
    const arr = liveLayersIds.toArray();

    // Знаходимо індекси вибраних фігур
    for (let i = 0; i < arr.length; i++) {
        if (selection?.includes(arr[i])) {
            indices.push(i);
        }
    }

    // Переміщаємо вибрані фігури на кінець списку — тобто на передній план
    // Робимо це у зворотному порядку, щоб уникнути конфліктів індексів при зміні порядку
    for (let i = indices.length - 1; i >= 0; i--) {
        liveLayersIds.move(indices[i], arr.length - 1 - i); // чим вище значення, тим "вище" фігура
    }
}, [selection]);

// Функція для встановлення кольору заливки (fill) для вибраних фігур
const setFill = useMutation(({ storage }, fill: Color) => {
    // Отримуємо всі шари (фігури), що зараз є на дошці
    const liveLayers = storage.get("layers");

    // Запам'ятовуємо останній використаний колір (можливо, для повторного використання чи інтерфейсу)
    setLastUsedColor(fill);

    // Для кожної вибраної фігури:
    selection?.forEach((id) => {
        // Знаходимо фігуру за її ID та встановлюємо їй новий колір заливки
        liveLayers.get(id)?.set("fill", fill);
    });
}, [selection, setLastUsedColor]);


    // Видалення фігури 

    const deleteLayers = useDeleteLayers();

    // От римуємо інформацію про фігуру, яка обертає фігуру при натиску 

    const selectionBounds = useSelectionBounds();

    // Якщо інформації немає - повертаємо

    if(!selectionBounds) {
        return null
    }

    // Вираховуємо кординати кнопок меню

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y

      

  return (
    <div
        className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none" 
        style={{ 
            transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%)) `
            }} 
    >
        <ColorPicker 
        onChange={setFill}
        />

        <div className="flex flex-col gap-y-0.5">
            <Hint label="Вперед">
                <Button onClick={moveToFront} variant="board" size="icon">
                    <BringToFront />
                </Button>
            </Hint>
            <Hint label="Назад" side="bottom">
                <Button onClick={moveToBack} variant="board" size="icon">
                    <SendToBack />
                </Button>
            </Hint>
        </div>
        
        <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
            <Hint label="Delete" >
                <Button variant="board" size="icon" onClick={deleteLayers}>
                    <Trash2 />
                </Button>
            </Hint>
        </div>
    </div>
  )
})

export default SelectionTools