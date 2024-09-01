/*
 *   Test helpers
 */

import { User, UserJson } from "@/redux/types";

export const createUser = (
  name: string,
  rank: number,
  bananas: number,
): User => {
  const user = {
    name,
    bananas,
    rank,
  };
  return user;
};

export const createUserData = (name: string, bananas: number): UserJson => {
  const userJson = {
    name,
    bananas,
    lastDayPlayed: "",
    longestStreak: 0,
    stars: 1,
    subscribed: false,
    uid: "",
  };
  return userJson;
};
