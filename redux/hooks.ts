import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { AppDispatch } from "./store";
import { AppState } from "./types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;