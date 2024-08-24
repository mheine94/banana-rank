import { LeaderBoardEntry, AppState, SelectionStrategy, User, SortStrategy } from './types';
import { compareAlphabetically } from './util';

// return the same instance of empty list in case that there are no results
// that prevents unnecessary rerendering
const EMPTY_LIST : LeaderBoardEntry[] = [];
export const FUZZY_TOKEN : string = "~";


export const selectLeaderBoardUsers = (state: AppState, searchQuery: string | undefined) => {
  if(state.selection === SelectionStrategy.FUZZY){
    let searchWithoutToken = searchQuery!.slice(1);
    return selectLeaderBoardUsersFuzzy(state, searchWithoutToken);
  }

  return selectLeaderBoardUsersTopOrBottom(state, searchQuery);
}

const selectLeaderBoardUsersFuzzy = (state: AppState, searchQuery: string) : LeaderBoardEntry[] => {
  var sorting = state.sorting;


  let leaderBoardUsers = [];

  if(searchQuery.length === 0){
    leaderBoardUsers = state.users.slice(0, 10);
  }else{
    leaderBoardUsers = state.users
    .filter(user => user.name.includes(searchQuery))
  }

  let leaderBoardEntries = leaderBoardUsers
    .map((user, index) => {
        let entry : LeaderBoardEntry = {user, selected: true}
        return entry
   }).slice(0, 10);

  if(sorting === SortStrategy.BY_NAME){
    leaderBoardEntries.sort(byUserName)
  }

  if(leaderBoardEntries.length === 0){
    return EMPTY_LIST;
  }

  return leaderBoardEntries;
}

const selectLeaderBoardUsersTopOrBottom = (state: AppState, searchQuery: string | undefined) => {
  var selection = state.selection;
  var sorting = state.sorting;

  let selectedUsers = getTopOrBottom10(state.users, selection);

  let leaderBoardUsers = selectedUsers
    .map((user, index) => {
        let entry : LeaderBoardEntry = {user, selected: user.name ===searchQuery}
        return entry
    });

    const searchedUserIsInTopTen = leaderBoardUsers.some(entry  => entry.selected);

    if(!searchedUserIsInTopTen){
      const searchedUser = state.users.find(user => user.name === searchQuery);
      if(searchedUser !== undefined){
        var entry = {user: searchedUser, selected: true}
        addSearchedUserToLeaderboard(entry, selection, leaderBoardUsers)
      }else{
        return EMPTY_LIST;
      }
    }

    if(sorting === SortStrategy.BY_NAME){
      leaderBoardUsers.sort(byUserName)
    }

    return leaderBoardUsers;
}

const byUserName = (entryA: LeaderBoardEntry, entryB: LeaderBoardEntry) => {
  return compareAlphabetically(entryA.user.name, entryB.user.name);
}

const addSearchedUserToLeaderboard = (user: LeaderBoardEntry, selection: SelectionStrategy, leaderBoard: LeaderBoardEntry[]) => {
  if(selection === SelectionStrategy.TOP_TEN){
    leaderBoard.splice(9, 1, user);
  }else{
    leaderBoard.splice(0, 1, user);
  }
}

const getTopOrBottom10 = (users: User[], selection: SelectionStrategy) : User[] => {
  if(selection === SelectionStrategy.TOP_TEN){
    return users.slice(0, 10);
  }else{
    return users.slice(users.length - 11, users.length)
  }
}


export const selectSortingStrategy = (state: AppState) =>{
  return state.sorting;
}

export const selectSelectionStrategy = (state: AppState) =>{
  return state.selection;
}