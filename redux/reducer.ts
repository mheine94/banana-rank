import {
  AppState,
  UserActionTypes,
  User,
  UserJson,
  SortStrategy,
  SelectionStrategy,
  UserMap,
  LeaderBoardData,
} from "./types";
import leaderBoard from "./leaderboard.json";
import { compareByBananasAndName } from "./util";

const loadUsers = (): User[] => {
  const leaderBoardData: LeaderBoardData = leaderBoard;
  const userIds = Object.keys(leaderBoard);
  let usersJsonObjs: UserJson[] = userIds.map(
    (userId) => leaderBoardData[userId],
  );

  usersJsonObjs.forEach((user) => (user.name = user.name.trim()));
  usersJsonObjs.sort(compareByBananasAndName);

  // I assume users list is correct and does not need to be filtered
  // The user with the empty name will be included
  return usersJsonObjs.map((userJson, index) => ({
    name: userJson.name,
    bananas: userJson.bananas,
    rank: index + 1,
  }));
};

const loadInitialState = (): AppState => {
  const users = loadUsers();

  // build users map for O(1) search speed for users outsite of top 10 or bottom 10
  const usersMap: UserMap = {};
  users.reduce((map, nextUser) => {
    // users with duplicate names are not covered by requirement
    // the example sais display one found user
    // so we choose the one with higher score
    if (map[nextUser.name] == undefined) {
      map[nextUser.name] = nextUser;
    }

    return map;
  }, usersMap);

  // precompute top and bottom 10
  const top10 = users.slice(0, 10);
  const bottom10 = users.slice(users.length - 10, users.length);

  const initialState: AppState = {
    users: usersMap,
    top10,
    bottom10,
    sorting: SortStrategy.BY_RANK,
    selection: SelectionStrategy.TOP_TEN,
  };
  return initialState;
};

const initialState: AppState = loadInitialState();

export function userReducer(
  state = initialState,
  action: UserActionTypes,
): AppState {
  switch (action.type) {
    case "SET_SORTING":
      return {
        ...state,
        sorting: action.payload,
      };
    case "SET_SELECTION":
      return {
        ...state,
        selection: action.payload,
      };
    default:
      return state;
  }
}
