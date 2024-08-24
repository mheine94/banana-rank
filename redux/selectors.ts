import { LeaderBoardEntry, UserState } from './types';


export const selectLeaderBoardUsers = (state: UserState, searchQuery: string | undefined) => {
  const topTen = state.users
    .slice(0, 10)
    .map((user, index) => {
        let entry : LeaderBoardEntry = {user, selected: user.name ===searchQuery}
        return entry
    });

    const searchedUserIsInTopTen = topTen.some(entry  => entry.selected);

    if(searchedUserIsInTopTen){
      return topTen;
    }

    const searchedUser = state.users.find(user => user.name === searchQuery);
    if(searchedUser !== undefined){
      var entry = {user: searchedUser, selected: true}
      const result = topTen.slice(0,9);
      result.push(entry);
      return result;
    }

    return [];
}