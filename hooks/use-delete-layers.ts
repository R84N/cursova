// Хук для видалення фігури на дошці

// Імпортуємо залежності 

import { useMutation, useSelf } from "@liveblocks/react";

export const useDeleteLayers = () => {
  
  

  const selection = useSelf((me) => me.presence.selection);

  return useMutation(
    ({ storage, setMyPresence }) => {
      // Отримуємо Live Map з усіма шарами (layers)
      const liveLayers = storage.get("layers");

      // Отримуємо Live List з усіма ID шарів у порядку рендерингу
      const liveLayerIds = storage.get("layerIds");

      //@ts-ignore 
      for (const id of selection) {
        // Видаляємо сам шар з мапи
        liveLayers.delete(id);

        // Шукаємо індекс ID у списку шарів
        const index = liveLayerIds.indexOf(id);

        // Якщо ID знайдено у списку — видаляємо його з LiveList
        if(index !== -1){
            liveLayerIds.delete(index);
        }

        // Очищаємо вибір (selection) користувача після видалення
        setMyPresence(
          { selection: [] },        // Нова присутність — порожній вибір
          { addToHistory: true }    // Додаємо цю зміну до історії (для undo/redo)
        );
      }
    },
    [selection] // Залежність — запускається лише коли selection змінюється
  );
};

