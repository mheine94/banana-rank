import { SET_SORTING, SET_SELECTION, UserActionTypes, SortStrategy, SelectionStrategy } from "./types";

export function setSorting(sorting: SortStrategy): UserActionTypes {
  return {
    type: SET_SORTING,
    payload: sorting,
  };
}

export function setSelection(selection: SelectionStrategy): UserActionTypes {
    return {
      type: SET_SELECTION,
      payload: selection,
    };
  }