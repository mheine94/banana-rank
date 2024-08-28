import { Alert } from "react-native";
import {
  LeaderBoardEntry,
  AppState,
  SelectionStrategy,
  User,
  SortStrategy,
  UserMap,
} from "./types";
import { compareAlphabetically, compareByUserName } from "./util";
import { createSelector } from "reselect";

// return the same instance of empty list in case that there are no results
// that prevents unnecessary rerendering
const EMPTY_LIST: LeaderBoardEntry[] = [];

export const FUZZY_TOKEN: string = "~";

const getTop10 = (state: AppState) => state.top10;
const getBottom10 = (state: AppState) => state.bottom10;
const getUsers = (state: AppState) => state.users;

export const selectSortingStrategy = (state: AppState) => {
  return state.sorting;
};

export const selectSelectionStrategy = (state: AppState) => {
  return state.selection;
};

export const memoizedLeaderBoardUsers = createSelector(
  [
    selectSelectionStrategy,
    selectSortingStrategy,
    getTop10,
    getBottom10,
    getUsers,
  ],
  (selection, sorting, top10, bottom10, users) =>
    (searchQuery: string | null) => {
      let leaderBoard: LeaderBoardEntry[] | null = null;

      if (searchQuery === null) {
        leaderBoard = EMPTY_LIST;
      } else if (
        selection === SelectionStrategy.FUZZY &&
        searchQuery.startsWith(FUZZY_TOKEN)
      ) {
        let searchWithoutToken = searchQuery.slice(1);
        leaderBoard = selectLeaderBoardUsersFuzzy(
          users,
          searchWithoutToken,
          top10,
        );
      } else {
        leaderBoard = selectLeaderBoardUsersTopOrBottom(
          selection,
          searchQuery,
          users,
          top10,
          bottom10,
        );
      }

      applySorting(leaderBoard, sorting);

      return leaderBoard;
    },
);

const selectLeaderBoardUsersFuzzy = (
  users: Record<string, User>,
  searchQuery: string,
  top10: User[],
): LeaderBoardEntry[] => {
  if (searchQuery.length === 0) {
    // If search query is empty, return the top 10 users
    return top10.map((user) => ({ user, selected: true }));
  } else {
    const leaderBoardUsers = Object.keys(users)
      .filter((username) => username.includes(searchQuery))
      .map((userName) => users[userName])
      .slice(0, 10);

    if (leaderBoardUsers.length === 0) {
      return EMPTY_LIST;
    }

    return leaderBoardUsers.map((user) => ({ user, selected: true }));
  }
};

const selectLeaderBoardUsersTopOrBottom = (
  selection: SelectionStrategy,
  searchQuery: string,
  users: Record<string, User>,
  top10: User[],
  bottom10: User[],
): LeaderBoardEntry[] => {
  let selectedUsers =
    selection === SelectionStrategy.TOP_TEN ? top10 : bottom10;

  let leaderBoardUsers = selectedUsers.map((user) => ({
    user,
    selected: user.name === searchQuery,
  }));

  const searchedUserIsInTopTen = leaderBoardUsers.some(
    (entry) => entry.selected,
  );

  if (!searchedUserIsInTopTen) {
    const searchedUser = users[searchQuery];
    if (searchedUser) {
      const entry = { user: searchedUser, selected: true };
      addSearchedUserToLeaderboard(entry, selection, leaderBoardUsers);
    } else {
      return EMPTY_LIST;
    }
  }

  return leaderBoardUsers;
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
