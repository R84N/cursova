"use client";

// Основний компонент дошки

// Імпортуємо залежності
import React, { useCallback, useMemo } from "react";
import Info from "./info";
import Participance from "./participance";
import Toolbar from "./toolbar";
import { nanoid } from "nanoid";
import { useSelf, useStorage } from "@liveblocks/react";
import { useState } from "react";
import { camera, CanvasMode, CanvasState, Color, LayerType, Side, XYWH } from "@/types/canvas";
import { useHistory, useCanUndo, useCanRedo, useMutation } from "@liveblocks/react";
import CursorPresence from "./CursorPresence";
import { colorToCss, connectionIdToColor, penPointsToPathLayer, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils";
import { Point } from "@/types/canvas";
import { LiveObject } from "@liveblocks/client";
import LayerPreview from "./LayerPreview";
import { useOthersMapped } from "@liveblocks/react";
import SelectionBox from "./SelectionBox";
import SelectionTools from "./SelectionTools";
import Path from "./path";

// Максимальна кількість об'єктів на дошці
const MAX_LAYERS = 100;

// Типи для пропсів компонента Canvas
interface CanvasProps {
  boardId: string;
}

const Canvas = ({ boardId }: CanvasProps) => {
  // Отримуємо масив ID шарів з Liveblocks storage
  const layerIds = useStorage((root)=>root.layerIds);

  // Поточний ескіз олівця (якщо користувач малює)
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

  // Стан дошки, що зберігає активний режим (малювання, переміщення тощо)
  const [CanvasState, setCanvasState] = useState<CanvasState>({
    mode:CanvasMode.None,
  });

  // Стан камери (зміщення полотна)
  const [camera, setCamera] = useState<camera>({x:0,y:0});

  // Останній використаний колір, який застосовується до нових об'єктів
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r:255,
    g:255,
    b:255
  });

  // Історія змін для можливості undo/redo
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  // Додавання нового шару на дошку
  const insertLayer = useMutation(({storage, setMyPresence}, layerType:LayerType.Ellipse | LayerType.Note | LayerType.Rectangle | LayerType.Text,position:Point)=>{
    const liveLayers = storage.get("layers");
    if(liveLayers.size >= MAX_LAYERS){
      return;
    }

    const liveLayerIds = storage.get("layerIds");
    const layerId = nanoid();
    const layer = new LiveObject({
      type:layerType,
      x:position.x,
      y:position.y,
      height:100,
      width:100,
      fill: lastUsedColor
    });

    liveLayerIds.push(layerId);
    liveLayers.set(layerId, layer);

    // Позначаємо новий шар як вибраний
    setMyPresence({selection:[layerId]},{addToHistory:true});
    setCanvasState({mode:CanvasMode.None});
  },[lastUsedColor]);

  // Переміщення вибраного шару
  const translateSelectedLayers = useMutation(({storage, self}, point:Point)=>{
    if(CanvasState.mode !== CanvasMode.Translating){
      return;
    }

    const offset = {
      x:point.x - CanvasState.current.x,
      y:point.y - CanvasState.current.y
    };

    const liveLayers = storage.get("layers");

    for(const id of self.presence.selection){
      const layer = liveLayers.get(id);
      if(layer){
        layer.update({
          x:layer.get("x") + offset.x,
          y:layer.get("y") + offset.y
        });
      }
    }

    setCanvasState({mode:CanvasMode.Translating, current:point});
  },[CanvasState]);

  // Зняття виділення з шарів
  const unselectLayers = useMutation(({self, setMyPresence})=>{
    if(self.presence.selection.length > 0 ){
      setMyPresence({selection:[]}, {addToHistory:true});
    }
  },[]);

  // Продовження малювання олівцем
  const continueDrawing = useMutation((
    {self, setMyPresence},
    point: Point,
    e:React.PointerEvent
  )=>{
    const {pencilDraft} = self.presence;

    if(CanvasState.mode !== CanvasMode.Pencil || e.buttons !== 1 || pencilDraft === null){
      return;
    }

    setMyPresence({
      cursor:point,
      pencilDraft:
        pencilDraft.length ===1 && pencilDraft[0][0] === point.x && pencilDraft[0][1] === point.y
        ? pencilDraft
        : [...pencilDraft, [point.x, point.y, e.pressure]]
    });

  },[CanvasState.mode]);

  // Завершення малювання та створення об'єкта шляху
  const insertPath = useMutation((
    {storage,self,setMyPresence}
  )=>{
    const LiveLayers = storage.get("layers");
    const {pencilDraft} = self.presence;

    if(pencilDraft == null || pencilDraft.length < 2 || LiveLayers.size >= MAX_LAYERS){
      setMyPresence({pencilDraft:null});
      return;
    }

    const id = nanoid();
    LiveLayers.set(
      id,
      new LiveObject(penPointsToPathLayer(
        pencilDraft,
        lastUsedColor
      ))
    );

    const liveLayerIds = storage.get("layerIds");
    liveLayerIds.push(id);

    setMyPresence({pencilDraft: null});
    setCanvasState({mode: CanvasMode.Pencil});
  },[lastUsedColor]);

  // Початок малювання
  const startDrawing = useMutation((
    {setMyPresence},
    point:Point,
    pressure:number
  )=>{
    setMyPresence({
      pencilDraft: [[point.x, point.y, pressure]],
      penColor: lastUsedColor
    });
  },[lastUsedColor]);

  // Зміна розміру шару
  const resizeSelectedLayer = useMutation((
    {storage, self},
    point:Point
  )=>{
    if(CanvasState.mode !== CanvasMode.Resizing){
      return;
    }

    const bounds = resizeBounds(
      CanvasState.initialBounds,
      CanvasState.corner,
      point
    );

    const liveLayers = storage.get("layers");
    const layer = liveLayers.get(self.presence.selection[0]);

    if(layer){
      layer.update(bounds);
    }
  },[CanvasState]);

  // Початок операції зміни розміру шару
  const onResizedPointerDown = useCallback((corner:Side, initialBounds:XYWH)=>{
    history.pause();
    setCanvasState({
      mode:CanvasMode.Resizing,
      initialBounds,
      corner
    });
  },[history]);

  // Прокрутка полотна
  const onWheel = useCallback((e:React.WheelEvent)=>{
    setCamera((camera)=>({
      x:camera.x - e.deltaX,
      y:camera.y - e.deltaY
    }));
  },[]);

  // Рух миші на дошці
  const onPointerMove = useMutation(({setMyPresence},e:React.PointerEvent)=>{
    e.preventDefault();
    const current = pointerEventToCanvasPoint(e,camera);

    // Виконання відповідної дії залежно від режиму
    if(CanvasState.mode === CanvasMode.Translating){
      translateSelectedLayers(current);
    }else if(CanvasState.mode === CanvasMode.Resizing){
      resizeSelectedLayer(current);
    }else if(CanvasState.mode === CanvasMode.Pencil){
      continueDrawing(current, e);
    }

    setMyPresence({cursor:current});
  },[CanvasState, resizeSelectedLayer, camera, translateSelectedLayers, continueDrawing]);

  // Коли мишка покидає дошку
  const onPointerLeave = useMutation(({setMyPresence})=>{
    setMyPresence({cursor:null});
  },[]);

  // Натискання мишки на дошці
  const onPointerDown = useCallback((e:React.PointerEvent)=>{
    const point = pointerEventToCanvasPoint(e, camera);

    if (CanvasState.mode === CanvasMode.Inserting){
      return;
    }

    if(CanvasState.mode === CanvasMode.Pencil){
      startDrawing(point,e.pressure);
      return;
    }

    setCanvasState({origin:point, mode:CanvasMode.Pressing});
  },[camera, CanvasState.mode, setCanvasState, startDrawing]);

  // Відпускання мишки
  const onPointerUp = useMutation((
    {},
    e
  )=>{
    const point = pointerEventToCanvasPoint(e, camera);

    if(CanvasState.mode === CanvasMode.None || CanvasState.mode === CanvasMode.Pressing){
      unselectLayers();
      setCanvasState({
        mode:CanvasMode.None
      });
    }else if (CanvasState.mode === CanvasMode.Pencil){
      insertPath();
    }else if(CanvasState.mode === CanvasMode.Inserting){
      insertLayer(CanvasState.layerType, point);
    }else{
      setCanvasState({
        mode: CanvasMode.None
      });
    }

    history.resume();
  },[camera,CanvasState, history, insertLayer, unselectLayers, insertPath, setCanvasState]);

  // Отримання вибраних шарів інших користувачів
  const selections = useOthersMapped((other)=>other.presence.selection);

  // Обробка кліку по шару
  const onLayerPointerDown = useMutation (({self, setMyPresence},e:React.PointerEvent, layerId:string)=>{
    if(CanvasState.mode === CanvasMode.Pencil || CanvasState.mode === CanvasMode.Inserting){
      return;
    }
    history.pause();
    e.stopPropagation();

    const point = pointerEventToCanvasPoint(e, camera);

    if(!self.presence.selection.includes(layerId)){
      setMyPresence({selection:[layerId]},{addToHistory:true});
      setCanvasState({mode:CanvasMode.Translating, current:point});
    }
  },[setCanvasState, camera, history, CanvasState.mode]);

  // Прив'язка кольору користувача до виділеного шару
  const layerIdsToColorSelection = useMemo(()=>{
    const layerIdsToColorSelection: Record<string, string> = {};

    for(const user of selections){
      const [connectionId, selection] = user;

      for (const layerId of selection){
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  },[selections]);

  // JSX повернення компонента (залишив як було)
  return (
    <main className="h-full w-full relative bg-neutral-100 toch-none">
      <Info boardId={boardId} />
      <Participance />
      <Toolbar
        canvasState={CanvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />
      <SelectionTools 
      camera={camera}
      setLastUsedColor={setLastUsedColor}
      />
      <svg className="h-[100vh] w-[100vw]" onWheel={onWheel} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} onPointerUp={onPointerUp} onPointerDown={onPointerDown}>
        <g style={{transform:`translate(${camera.x}px, ${camera.y}px)`}}>
        {layerIds?.map((layerId)=>(
            <LayerPreview
            key={layerId}
            id={layerId}
            onLayerPointerDown={onLayerPointerDown}
            selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox
            onReziHandlePointerDown={onResizedPointerDown}
          />
          <CursorPresence />
          {pencilDraft != null && pencilDraft.length >0 &&(
            <Path 
            points={pencilDraft}
            fill={colorToCss(lastUsedColor)}
            x={0}
            y={0}
            />
          ) }
        </g>
      </svg>
    </main>
);
};

export default Canvas;
