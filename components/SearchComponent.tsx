import { useState } from "react";
import { Alert, Keyboard, View, StyleSheet } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { FUZZY_TOKEN, selectSelectionStrategy } from "@/redux/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { LeaderBoardEntry, SelectionStrategy } from "@/redux/types";
import { setSelection } from "@/redux/actions";

interface SearchComponentProps {
  onSearch?: (query: string | null) => void;
  leaderBoard: LeaderBoardEntry[];
}

export default function SearchComponent({
  onSearch,
  leaderBoard,
}: SearchComponentProps) {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searched, setSearched] = useState<string | null>(null);
  const [silenceAlert, setSilenceAlert] = useState(false);

  const selectionStrategy = useAppSelector((state: AppState) =>
    selectSelectionStrategy(state),
  );

  const searchUser = (search: string) => {
    Keyboard.dismiss();
    if (searched !== search) {
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

      if (onSearch) {
        onSearch(search);
      }
    }
  };

  const clearSearch = () => {
    setSearched(null);
    if (onSearch) {
      onSearch(null);
    }
  };

  if (!silenceAlert && leaderBoard.length === 0 && searched !== null) {
    Alert.alert(
      "No results",
      "This user name does not exist! Please specify an existing user name!",
    );
    setSilenceAlert(true);
  }

  return (
    <View style={styles.container}>
      <Searchbar
        style={styles.searchbar}
        placeholder="Search user"
        onChangeText={setSearchQuery}
        onClearIconPress={clearSearch}
        value={searchQuery}
      />

      <Button mode="contained" onPress={() => searchUser(searchQuery.trim())}>
        Search
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  searchbar: {
    flex: 1,
    marginRight: 10,
  },
});
