import { useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Card, List, Searchbar, Text } from "react-native-paper";
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
    memoizedLeaderBoardUsers(state)(searched),
  );
  const sortStrategy = useAppSelector((state: AppState) =>
    selectSortingStrategy(state),
  );
  const selectionStrategy = useAppSelector((state: AppState) =>
    selectSelectionStrategy(state),
  );

  const searchUser = (search: string) => {
    let newStrategy = selectionStrategy;
    if (search !== undefined && search.startsWith(FUZZY_TOKEN)) {
      newStrategy = SelectionStrategy.FUZZY;
    } else if (selectionStrategy === SelectionStrategy.FUZZY) {
      newStrategy = SelectionStrategy.TOP_TEN;
    }

    if (newStrategy !== selectionStrategy) {
      dispatch(setSelection(newStrategy));
    }

    setSearched(search);
    setSilenceAlert(false);
  };

  const sort = (strategy: SortStrategy) => {
    dispatch(setSorting(strategy));
  };

  const select = (strategy: SelectionStrategy) => {
    dispatch(setSelection(strategy));
  };

  if (!silenceAlert && leaderBoardUsers.length === 0 && searched !== null) {
    Alert.alert(
      "No results",
      "This user name does not exist! Please specify an existing user name!",
    );
    setSilenceAlert(true);
  }

  const renderIt = (entry: LeaderBoardEntry) => (
    <Card style={{ marginVertical: 5, marginHorizontal: 10 }}>
      <Card.Content>
        <List.Item
          title={entry.user.name}
          description={`Rank: ${entry.user.rank}, Bananas: ${entry.user.bananas}`}
          right={(props) =>
            entry.selected && (
              <Text style={{ fontWeight: "bold", color: "green" }}>
                Selected
              </Text>
            )
          }
        />
      </Card.Content>
    </Card>
  );

  const getRankButton = () =>
    selectionStrategy === SelectionStrategy.TOP_TEN ? (
      <Button
        mode="contained"
        onPress={() => select(SelectionStrategy.BOTTOM_TEN)}
      >
        Show Bottom Ten
      </Button>
    ) : (
      <Button
        mode="contained"
        onPress={() => select(SelectionStrategy.TOP_TEN)}
      >
        Show Top Ten
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
    <View style={{ flex: 1, padding: 10 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Searchbar
          style={{ flex: 1, marginRight: 10 }}
          placeholder="Search user"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        <Button mode="contained" onPress={() => searchUser(searchQuery.trim())}>
          Search
        </Button>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        {getSortButton()}
        {selectionStrategy !== SelectionStrategy.FUZZY && getRankButton()}
      </View>

      <FlatList
        data={leaderBoardUsers}
        renderItem={({ item }) => renderIt(item)}
        keyExtractor={(item) => item.user.name}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
