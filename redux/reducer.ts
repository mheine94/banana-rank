import { UserState, UserActionTypes, User} from "./types";
import leaderBoard from "./leaderboard.json"


interface LeaderBoardData {
    [key: string]: User;
  }

const loadUsers = () : User[] => {
    const leaderBoardData : LeaderBoardData  = leaderBoard;
    const userIds = Object.keys(leaderBoard);
    const users : User[] = []
    userIds.forEach(userId => users.push(leaderBoardData[userId]))
    users.sort((a, b) => (a.bananas - b.bananas) * -1);
    return users;
}

const initialState: UserState = {
  users: loadUsers(),
};

export function userReducer(state = initialState, action: UserActionTypes): UserState {
  switch (action.type) {
    default:
      return state;
  }
}
