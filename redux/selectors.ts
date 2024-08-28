import {
  LeaderBoardEntry,
  AppState,
  SelectionStrategy,
  User,
  SortStrategy,
} from "./types";
import { compareAlphabetically, compareByUserName } from "./util";

// return the same instance of empty list in case that there are no results
// that prevents unnecessary rerendering
const EMPTY_LIST: LeaderBoardEntry[] = [];
export const FUZZY_TOKEN: string = "~";

export const selectLeaderBoardUsers = (
  state: AppState,
  searchQuery: string | undefined,
) => {
  // if multiple users have the same name then only one of them will be found
  // the requirement does say what should be done in case mutliple users have the same name
  let leaderBoard = null;

  // initial state of the ui nothing is typed we display top 10
  // would be cooler than just empty page
  // requirement sais to display after searching...
  // maybe I should remove this to follow requirement strictly
  if (searchQuery === undefined) {
    leaderBoard = selectTopOrBottomTenWithNoSearch(state);
  } else if (state.selection === SelectionStrategy.FUZZY) {
    let searchWithoutToken = searchQuery!.slice(1);
    leaderBoard = selectLeaderBoardUsersFuzzy(state, searchWithoutToken);
  } else {
    leaderBoard = selectLeaderBoardUsersTopOrBottom(state, searchQuery);
  }

  applySorting(leaderBoard, state.sorting);

  return leaderBoard;
};

const selectLeaderBoardUsersFuzzy = (
  state: AppState,
  searchQuery: string,
): LeaderBoardEntry[] => {
  var sorting = state.sorting;

  let leaderBoardUsers = [];

  // if search query is empty then we will just show top 10
  if (searchQuery.length === 0) {
    leaderBoardUsers = state.top10;
  } else {
    leaderBoardUsers = Object.keys(state.users)
      .filter((username) => username.includes(searchQuery))
      .map((userName) => state.users[userName])
      .slice(0, 10);
  }

  let leaderBoardEntries = leaderBoardUsers.map((user) => ({
    user,
    selected: true,
  }));

  if (leaderBoardEntries.length === 0) {
    return EMPTY_LIST;
  }

  return leaderBoardEntries;
};

const selectLeaderBoardUsersTopOrBottom = (
  state: AppState,
  searchQuery: string | undefined,
) => {
  var selection = state.selection;
  var sorting = state.sorting;

  let selectedUsers =
    state.selection == SelectionStrategy.TOP_TEN ? state.top10 : state.bottom10;

  let leaderBoardUsers = selectedUsers.map((user) => ({
    user,
    selected: user.name === searchQuery,
  }));

  if (searchQuery === undefined) {
    return leaderBoardUsers;
  }

  const searchedUserIsInTopTen = leaderBoardUsers.some(
    (entry) => entry.selected,
  );

  if (!searchedUserIsInTopTen) {
    const searchedUser = state.users[searchQuery];
    if (searchedUser !== undefined) {
      var entry = { user: searchedUser, selected: true };
      addSearchedUserToLeaderboard(entry, selection, leaderBoardUsers);
    } else {
      return EMPTY_LIST;
    }
  }

  return leaderBoardUsers;
};

const selectTopOrBottomTenWithNoSearch = (state: AppState) => {
  let selectedUsers =
    state.selection == SelectionStrategy.TOP_TEN ? state.top10 : state.bottom10;
  return selectedUsers.map((user) => ({ user, selected: false }));
};

const applySorting = (
  leaderBoard: LeaderBoardEntry[],
  sorting: SortStrategy,
): void => {
  if (sorting === SortStrategy.BY_NAME) {
    leaderBoard.sort(compareByUserName);
  }
};

const addSearchedUserToLeaderboard = (
  user: LeaderBoardEntry,
  selection: SelectionStrategy,
  leaderBoard: LeaderBoardEntry[],
) => {
  if (selection === SelectionStrategy.TOP_TEN) {
    leaderBoard.splice(9, 1, user);
  } else {
    leaderBoard.splice(0, 1, user);
  }
};

export const selectSortingStrategy = (state: AppState) => {
  return state.sorting;
};

export const selectSelectionStrategy = (state: AppState) => {
  return state.selection;
};
