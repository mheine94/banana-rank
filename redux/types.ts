export interface UserJson {
    bananas: number
    lastDayPlayed: string;
    longestStreak: number;
    name: string;
    stars: number
    subscribed: boolean;
    uid: string;
    rank?: number;
  }

  export interface User {
    bananas: number
    name: string;
    rank: number;
  }
  
  export interface UserState {
    users: User[];
  }
  
  interface DummyActionType {
    type: string;
    payload: string;
  }

  export enum SortStrategy {
    BY_RANK,
    BY_NAME
  }

  export type LeaderBoardEntry = { user: User; selected: boolean };

  
  export type UserActionTypes = DummyActionType;
  