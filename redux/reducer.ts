import { AppState, UserActionTypes, User, UserJson, SortStrategy, SelectionStrategy} from "./types";
import leaderBoard from "./leaderboard.json"
import { compareAlphabetically } from "./util";


interface LeaderBoardData {
    [key: string]: UserJson;
  }

const loadUsers = () : User[] => {
    const leaderBoardData : LeaderBoardData  = leaderBoard;
    const userIds = Object.keys(leaderBoard);
    let usersJsonObjs : UserJson[] = userIds.map(userId => leaderBoardData[userId]);

    usersJsonObjs.forEach(user => user.name = user.name.trim())
    usersJsonObjs.sort(byComparingBananasAndName)

    return usersJsonObjs.map((userJson, index) => ({name: userJson.name, bananas: userJson.bananas, rank: index + 1}))
}

const byComparingBananasAndName = (a: UserJson, b: UserJson) => {
  const A_GREATER_B = 1;
  const B_GREATER_A = -1;

  if(a.bananas < b.bananas){
    return A_GREATER_B;
  }
  if(b.bananas < a.bananas){
    return B_GREATER_A;
  }

  return compareAlphabetically(a.name, b.name);
}

const initialState: AppState = {
  users: loadUsers(),
  sorting: SortStrategy.BY_RANK,
  selection: SelectionStrategy.TOP_TEN
};

export function userReducer(state = initialState, action: UserActionTypes): AppState {
  switch (action.type) {
    case "SET_SORTING":
      return {
        ...state,
        sorting: action.payload
      }
    case "SET_SELECTION":
      return {
        ...state,
        selection: action.payload
      }
    default:
      return state;
  }
}
