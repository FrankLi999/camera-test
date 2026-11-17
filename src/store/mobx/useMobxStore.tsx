"use client";
import { createContext, useContext } from "react";
import { enableStaticRendering } from "mobx-react-lite";
import { MediapipeMobxStore } from "./MediapipeMobxStore";

// Prevent memory leaks during Next.js Server-Side Rendering (SSR)
enableStaticRendering(typeof window === "undefined");

interface MobxStoreType {
  mediapipeStore: MediapipeMobxStore
}

const MobxStore: MobxStoreType = {
  mediapipeStore: new MediapipeMobxStore()
}
const MobxStoreContext = createContext<MobxStoreType>(MobxStore);

export function useMobxStore() {
  const context = useContext(MobxStoreContext);
  if (!context) {
    throw new Error("useModelStore must be used within a StoreProvider");
  }
  return context;
}