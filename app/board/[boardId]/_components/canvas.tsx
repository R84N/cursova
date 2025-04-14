"use client";

import React, { useCallback, useMemo } from "react";
import Info from "./info";
import Participance from "./participance";
import Toolbar from "./toolbar";
import { nanoid } from "nanoid";
import {useStorage } from "@liveblocks/react";
import { useState } from "react";
import { camera, CanvasMode, CanvasState, Color, LayerType, Side, XYWH } from "@/types/canvas";
import { useHistory, useCanUndo, useCanRedo, useMutation } from "@liveblocks/react";
import CursorPresence from "./CursorPresence";
import { connectionIdToColor, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils";
import { Point } from "@/types/canvas";
import { LiveObject } from "@liveblocks/client";

import LayerPreview from "./LayerPreview";
import { useOthersMapped } from "@liveblocks/react";
import SelectionBox from "./SelectionBox";
import SelectionTools from "./SelectionTools";

// максимальна кількість об'єктів на дошці

const MAX_LAYERS = 100;

// типи для пропсів

interface CanvasProps {
  boardId: string;
}

const Canvas = ({ boardId }: CanvasProps) => {

  // отримуємо id об'єкті дошки

  const layerIds = useStorage((root)=>root.layerIds)

  // стан меню інструментів ( Змінюючи цей параметри буде пееключатись меню. Наприклад, якщо вибрати  CanvasMode.Rectangle включиться квадрат)

  const [CanvasState, setCanvasState] = useState<CanvasState>({
    mode:CanvasMode.None,
  });

  const [camera, setCamera] = useState<camera>({x:0,y:0});
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r:255,
    g:255,
    b:255
  })

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

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

    setMyPresence({selection:[layerId]},{addToHistory:true});
    setCanvasState({mode:CanvasMode.None});


  },[lastUsedColor])

    const translateSelectedLayers = useMutation(({storage, self}, point:Point)=>{
      if(CanvasState.mode !== CanvasMode.Translating){
        return
      }
        const offset = {
          x:point.x - CanvasState.current.x,
          y:point.y - CanvasState.current.y
        }

        const liveLayers = storage.get("layers");

        for(const id of self.presence.selection){
          const layer = liveLayers.get(id);

          if(layer){
            layer.update({
              x:layer.get("x") + offset.x,
              y:layer.get("y")  + offset.y
            })
          }
        }

      
      setCanvasState({mode:CanvasMode.Translating, current:point})
    },[CanvasState]) 

    
  const unselectLayers = useMutation(({self, setMyPresence})=>{
    if(self.presence.selection.length > 0 ){
      setMyPresence({selection:[]}, {addToHistory:true})
    }
  },[])

  const resizeSelectedLayer = useMutation((
    {storage, self},
    point:Point
  )=>{
    if(CanvasState.mode !== CanvasMode.Resizing){
      return
    }

    const bounds = resizeBounds(
      CanvasState.initialBounds,
      CanvasState.corner,
      point
    )

    const  liveLayers = storage.get("layers")

    const layer = liveLayers.get(self.presence.selection[0])

    if(layer){
      layer.update(bounds)
    }

  },[CanvasState])

  const onResizedPointerDown = useCallback((corner:Side, initialBounds:XYWH)=>{
    history.pause();
    setCanvasState({
      mode:CanvasMode.Resizing,
      initialBounds,
      corner
    })
  },[history])

  const onWheel = useCallback((e:React.WheelEvent)=>{
    setCamera((camera)=>({
      x:camera.x - e.deltaX,
      y:camera.y - e.deltaY
    }))

    
  },[])

  const onPointerMove = useMutation(({setMyPresence},e:React.PointerEvent)=>{
    e.preventDefault();

    const current = pointerEventToCanvasPoint(e,camera);

    if(CanvasState.mode === CanvasMode.Translating){
      console.log('dfhjdfhashjadfs')
      translateSelectedLayers(current)
    }else if(CanvasState.mode === CanvasMode.Resizing){
      resizeSelectedLayer(current)
    }

    



    setMyPresence({cursor:current})
  },[CanvasState, resizeSelectedLayer, camera, translateSelectedLayers])

  // коли мишка виходить за межі поля

  const onPointerLeave = useMutation(({setMyPresence})=>{
    setMyPresence({cursor:null})
  },[])

  const onPointerDown = useCallback((e:React.PointerEvent)=>{
    const point = pointerEventToCanvasPoint(e, camera);

    if (CanvasState.mode === CanvasMode.Inserting){
      return
    }

    setCanvasState({origin:point, mode:CanvasMode.Pressing})
  },[camera, CanvasState.mode, setCanvasState])


  // події відпускання мишки 

  const onPointerUp = useMutation((
    {},
    e
  )=>{
    const point = pointerEventToCanvasPoint(e, camera);

    if(CanvasState.mode === CanvasMode.None || CanvasState.mode === CanvasMode.Pressing){

      unselectLayers();

      setCanvasState({
        mode:CanvasMode.None
      })
    }else if(CanvasState.mode === CanvasMode.Inserting){
      insertLayer(CanvasState.layerType, point)
    }else{
      setCanvasState({
        mode: CanvasMode.None
      })
    }

   
    

    history.resume();
  },[camera,CanvasState, history, insertLayer, unselectLayers])

  const selections = useOthersMapped((other)=>other.presence.selection);

    // Функція, яка відповідає за вибір об'єкта  

    const onLayerPointerDown = useMutation (({self, setMyPresence},e:React.PointerEvent, layerId:string)=>{

      

      if(CanvasState.mode === CanvasMode.Pencil || CanvasState.mode === CanvasMode.Inserting){
        return
      }
        history.pause();
        e.stopPropagation();

        const point = pointerEventToCanvasPoint(e, camera);

        if(!self.presence.selection.includes(layerId)){
          setMyPresence({selection:[layerId]},{addToHistory:true});

          setCanvasState({mode:CanvasMode.Translating, current:point})
        }
    },[setCanvasState, camera, history, CanvasState.mode])

    // Функція, яка прив'язує колір користувача до об'єктів з якими він буде працювати(Наприклад якщо користувач вибере якийсь об'єкт, то інший побачить рамочку відповідного кольору )

    const layerIdsToColorSelection = useMemo(()=>{
      const layerIdsToColorSelection: Record<string, string> = {}
      
      for(const user of selections){
        const [connectionId, selection] = user;

        for (const layerId of selection){
          layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId)
        }
      }


      return layerIdsToColorSelection
    },[selections])

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
          </g>
        </svg>
      </main>
  );
};

export default Canvas;
