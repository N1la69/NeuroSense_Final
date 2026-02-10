import * as SecureStore from "expo-secure-store";

export const saveParent = (id: string) =>
  SecureStore.setItemAsync("parentId", id);

export const getParent = () => SecureStore.getItemAsync("parentId");

export const clearParent = () => SecureStore.deleteItemAsync("parentId");

export const saveChild = (id: string) =>
  SecureStore.setItemAsync("childId", id);

export const getChild = () => SecureStore.getItemAsync("childId");
