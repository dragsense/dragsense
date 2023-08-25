import { storeAction, getAction, deleteAction, clearStore, UNDO_STORE_NAME, REDO_STORE_NAME } from "../utils/db";

export default function useUndos() {
  const clearStack = async () => {
    await clearStore(UNDO_STORE_NAME);
    await clearStore(REDO_STORE_NAME);
  };

  const onAdd = async (action) => {
    await storeAction(action, UNDO_STORE_NAME);
  };

  const performAction = async (STORE1, STORE2) => {
    const action = await getAction(STORE1);
    await deleteAction(STORE1);
    await storeAction(action, STORE2);
  };

  const goBack = async () => {
    await performAction(UNDO_STORE_NAME, REDO_STORE_NAME);
  };

  const goForward = async () => {
    await performAction(REDO_STORE_NAME, UNDO_STORE_NAME);
  };

  return {
    onAdd,
    goBack,
    goForward,
    clearStack
  };
}