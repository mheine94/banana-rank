export interface UserJson {
    bananas: number;
    lastDayPlayed: string;
    longestStreak: number;
    name: string;
    stars: number;
    subscribed: boolean;
    uid: string;
    rank?: number;
  }

  export interface User {
    bananas: number;
    name: string;
    rank: number;
  }

  export interface UserMap {
    [key: string]: User;
  }
  
  export interface AppState {
    users: UserMap;
    top10: User[];
    bottom10: User[];
    sorting: SortStrategy;
    selection: SelectionStrategy;
  }

 export interface LeaderBoardData {
    [key: string]: UserJson;
}


  export const SET_SORTING = "SET_SORTING";
  export const SET_SELECTION = "SET_SELECTION";

  interface SortingAction {
    type: typeof SET_SORTING;
    payload: SortStrategy;
  }

  interface SelectionAction {
    type: typeof SET_SELECTION;
    payload: SelectionStrategy;
  }

  export enum SortStrategy {
    BY_RANK,
    BY_NAME
  }

  export enum SelectionStrategy {
    TOP_TEN,
    BOTTOM_TEN,
    FUZZY
  }

  export type LeaderBoardEntry = { user: User; selected: boolean };

  
  export type UserActionTypes = SortingAction | SelectionAction;
  