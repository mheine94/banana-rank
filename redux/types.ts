export interface User {
    bananas: number
    lastDayPlayed: string;
    longestStreak: number;
    name: string;
    stars: number
    subscribed: boolean;
    uid: string;
  }
  
  export interface UserState {
    users: User[];
  }
  
  interface DummyActionType {
    type: string;
    payload: string;
  }

  export type LeaderBoardEntry = { user: User; rank: number; selected: boolean };

  
  export type UserActionTypes = DummyActionType;
  