import { createTypedHooks } from "easy-peasy";
import { StoreModel } from "app/state/api/interfaces";

const typedHooks = createTypedHooks<StoreModel>();

export const { useStoreActions } = typedHooks;
export const { useStoreDispatch } = typedHooks;
export const { useStoreState } = typedHooks;
export const { useStore } = typedHooks;
