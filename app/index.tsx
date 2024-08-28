import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Button, SearchBar } from "@rneui/themed";
import { Alert } from "react-native";
import {
  FUZZY_TOKEN,
  memoizedLeaderBoardUsers,
  selectSelectionStrategy,
  selectSortingStrategy,
} from "@/redux/selectors";
import { LeaderBoardEntry, AppState, SelectionStrategy } from "@/redux/types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSelection, setSorting } from "../redux/actions";
import { SortStrategy } from "../redux/types";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searched, setSearched] = useState<string | null>(null);
  const [silenceAlert, setSilenceAlert] = useState(false);

  const dispatch = useAppDispatch();

  const leaderBoardUsers = useAppSelector((state: AppState) =>
    memoizedLeaderBoardUsers(state)(searched)
  );
  const sortStrategy = useAppSelector((state: AppState) =>
    selectSortingStrategy(state),
  );
  const selectionStrategy = useAppSelector((state: AppState) =>
    selectSelectionStrategy(state),
  );

  let searchUser = (search: any) => {
    let newStrategy = selectionStrategy;
    if (search !== undefined && search.startsWith(FUZZY_TOKEN)) {
      newStrategy = SelectionStrategy.FUZZY;
    } else if (selectionStrategy === SelectionStrategy.FUZZY) {
      newStrategy = SelectionStrategy.TOP_TEN;
    }

    if (newStrategy !== selectionStrategy) {
      let setSelectionAction = setSelection(newStrategy);
      dispatch(setSelectionAction);
    }

    setSearched(search);
    setSilenceAlert(false);
  };

  let sort = (strategy: SortStrategy) => {
    let sortingAction = setSorting(strategy);
    dispatch(sortingAction);
  };

  let select = (strategy: SelectionStrategy) => {
    let selectionStrategy = setSelection(strategy);
    dispatch(selectionStrategy);
  };

  if (!silenceAlert && leaderBoardUsers.length === 0 && searched !== null) {
    Alert.alert(
      "No results",
      "This user name does not exist! Please specify an existing user name!",
    );
    // we don't want to alert on every rerender
    // only alert again when the user searched something new
    setSilenceAlert(true);
  }

  let renderIt = (entry: LeaderBoardEntry) => {
    return (
      <View>
        <Text>
          Name: {entry.user.name} Rank: {entry.user.rank} Bananas:{" "}
          {entry.user.bananas} {entry.selected ? "<---" : ""}
        </Text>
      </View>
    );
  };

  let getRankButton = () => {
    return selectionStrategy === SelectionStrategy.TOP_TEN ? (
      <Button
        title="Show Bottom Ten"
        onPress={() => select(SelectionStrategy.BOTTOM_TEN)}
      ></Button>
    ) : (
      <Button
        title="Show Top Ten"
        onPress={() => select(SelectionStrategy.TOP_TEN)}
      ></Button>
    );
  };

  let getSortButton = () => {
    return sortStrategy === SortStrategy.BY_RANK ? (
      <Button
        title="Sort by name"
        onPress={() => sort(SortStrategy.BY_NAME)}
      ></Button>
    ) : (
      <Button
        title="Sort by rank"
        onPress={() => sort(SortStrategy.BY_RANK)}
      ></Button>
    );
  };

  return (
    <View>
      <View
       style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
      }}>
      <SearchBar
        containerStyle={{minWidth: "45%"}}
        placeholder="Search user"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <Button
        title="Search"
        onPress={() => searchUser(searchQuery.trim())}
      ></Button>
      </View>
     
      <View   style={{
        display: "flex",
        flexDirection: "row",
        marginBottom: 10
      }}>
      {getSortButton()}

        {selectionStrategy !== SelectionStrategy.FUZZY && getRankButton()}
        </View>
     
        <View   style={{
          justifyContent: "center",
          alignItems: "center"
      }}>
      {leaderBoardUsers.length > 0 && (
        <FlatList
          data={leaderBoardUsers}
          renderItem={({ item, index }) => renderIt(item)}
        ></FlatList>
      )}
        </View>
     
     
    </View>
  );
}
