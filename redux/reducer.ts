import { UserState, UserActionTypes, User, UserJson} from "./types";
import leaderBoard from "./leaderboard.json"


interface LeaderBoardData {
    [key: string]: UserJson;
  }

const loadUsers = () : User[] => {
    const leaderBoardData : LeaderBoardData  = leaderBoard;
    const userIds = Object.keys(leaderBoard);
    let usersJsonObjs : UserJson[] = userIds.map(userId => leaderBoardData[userId]);

    usersJsonObjs.forEach(user => user.name = user.name.trim())
    usersJsonObjs.filter(userJson => userJson.name.length > 0)
    usersJsonObjs.sort((a, b) => (a.bananas - b.bananas) * -1);

    return usersJsonObjs.map((userJson, index) => ({name: userJson.name, bananas: userJson.bananas, rank: index + 1}))
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
