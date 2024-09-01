import {
  AppState,
  LeaderBoardEntry,
  SelectionStrategy,
  SortStrategy,
} from "@/redux/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectSelectionStrategy,
  selectSortingStrategy,
} from "@/redux/selectors";
import { setSelection, setSorting } from "@/redux/actions";

interface OptionsProps {
  leaderBoard: LeaderBoardEntry[];
}

export default function Options({ leaderBoard }: OptionsProps) {
  const dispatch = useAppDispatch();
  const selectionStrategy = useAppSelector((state: AppState) =>
    selectSelectionStrategy(state),
  );

  const sortStrategy = useAppSelector((state: AppState) =>
    selectSortingStrategy(state),
  );

  const sort = (strategy: SortStrategy) => {
    dispatch(setSorting(strategy));
  };

  const select = (strategy: SelectionStrategy) => {
    dispatch(setSelection(strategy));
  };

  const getRankButton = () =>
    selectionStrategy === SelectionStrategy.TOP_TEN ? (
      <Button
        mode="contained"
        onPress={() => select(SelectionStrategy.BOTTOM_TEN)}
      >
        Top 10
      </Button>
    ) : (
      <Button
        mode="contained"
        onPress={() => select(SelectionStrategy.TOP_TEN)}
      >
        Last 10
      </Button>
    );

  const getSortButton = () =>
    sortStrategy === SortStrategy.BY_RANK ? (
      <Button mode="contained" onPress={() => sort(SortStrategy.BY_NAME)}>
        Sort by Name
      </Button>
    ) : (
      <Button mode="contained" onPress={() => sort(SortStrategy.BY_RANK)}>
        Sort by Rank
      </Button>
    );
  return (
    <View style={styles.container}>
      {leaderBoard.length > 0 && getSortButton()}
      {leaderBoard.length > 0 &&
        selectionStrategy !== SelectionStrategy.FUZZY &&
        getRankButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});
