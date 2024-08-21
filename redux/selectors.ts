import { LeaderBoardEntry, UserState } from './types';


export const selectFilteredUsers = (state: UserState, searchQuery: string) =>
  state.users
    .filter(user => user.name.includes(searchQuery))
    .slice(0, 10)
    .map((user, index) => {
        let entry : LeaderBoardEntry = {user, rank: index + 1, selected: false}
        return entry
    });