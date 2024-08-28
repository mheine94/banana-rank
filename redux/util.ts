import { LeaderBoardEntry, UserJson } from "./types";

export const compareAlphabetically = (stringA: string, stringB: string) => {
  if (stringA < stringB) {
    return -1;
  }
  if (stringB < stringA) {
    return 1;
  }
  return 0;
};

export const compareByUserName = (
  entryA: LeaderBoardEntry,
  entryB: LeaderBoardEntry,
) => {
  return compareAlphabetically(entryA.user.name, entryB.user.name);
};

export const compareByBananasAndName = (a: UserJson, b: UserJson) => {
  const A_GREATER_B = 1;
  const B_GREATER_A = -1;

  if (a.bananas < b.bananas) {
    return A_GREATER_B;
  }
  if (b.bananas < a.bananas) {
    return B_GREATER_A;
  }

  return compareAlphabetically(a.name, b.name);
};
