import { useMemo, useState } from "react";
import { View, Animated, Dimensions } from "react-native";
import { Button, DataTable, Searchbar } from "react-native-paper";
import { Alert } from "react-native";
import {
  FUZZY_TOKEN,
  memoizedLeaderBoardUsers,
  selectSelectionStrategy,
  selectSortingStrategy,
} from "@/redux/selectors";
import { AppState, SelectionStrategy } from "@/redux/types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSelection, setSorting } from "../redux/actions";
import { SortStrategy } from "../redux/types";
const {  width, height } = Dimensions.get("window");

const IMAGE_HEIGHT = height * 0.3;
const IMAGE_HEIGHT_BIG = Math.min(height * 0.3, width * 0.9);

const IMAGE_HEIGHT_SMALL = height * 0.13;


export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searched, setSearched] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [silenceAlert, setSilenceAlert] = useState(false);

  const itemsPerPage = 10;

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

  const { imageHeight, dynamicMargin } = useMemo(() => ({
    imageHeight: new Animated.Value(IMAGE_HEIGHT_BIG),
    dynamicMargin: new Animated.Value( (height / 2 - IMAGE_HEIGHT_BIG) / 2 ),
  }), [])

  const searchUser = (search: string) => {
    if(searched !== search){

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


      setPage(0);
    }
  };

  const clearSearch = () => {
    setSearched(null);
  }

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
  if(leaderBoardUsers.length > 0){
    Animated.parallel([
      Animated.timing(imageHeight, {
         // @ts-ignore
        duration: 300,
         // @ts-ignorer
        toValue: IMAGE_HEIGHT_SMALL,
        useNativeDriver: false, // Set useNativeDriver to false or true based on your preference
      }),
      Animated.timing(dynamicMargin, {
        // @ts-ignore
       duration: 300,
        // @ts-ignorer
       toValue: 0,
       useNativeDriver: false, // Set useNativeDriver to false or true based on your preference
     }),
    ]).start();
  }else{
    Animated.parallel([
      Animated.timing(imageHeight, {
         // @ts-ignore
        duration: 300,
        toValue:  IMAGE_HEIGHT,
        useNativeDriver: false, // Set useNativeDriver to false or true based on your preference
      }),
      Animated.timing(dynamicMargin, {
        // @ts-ignore
       duration: 300,
        // @ts-ignorer
       toValue: (height / 2 - IMAGE_HEIGHT_BIG) / 2,
       useNativeDriver: false, // Set useNativeDriver to false or true based on your preference
     }),
    ]).start();
  }

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

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, leaderBoardUsers.length);

  const fullPages = Math.floor(leaderBoardUsers.length / 10)
  const partialPages = leaderBoardUsers.length % 10;

  let numberOfItemsPerPageList: number[] = []

  for(let i = 0; i < fullPages; i++){
    numberOfItemsPerPageList.push(10);
  }

  if(partialPages > 0){
    numberOfItemsPerPageList.push(partialPages);
  }
  

  return (
  <Animated.View style={{flex: 1}}>
  <Animated.Image source={require("../assets/images/rank.png")} style={{ height: imageHeight , alignSelf: "center", aspectRatio : "1/1", marginBottom: dynamicMargin, marginTop: dynamicMargin}} />
 
      <View
        style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingBottom: 5}}
      >
        <Searchbar
          style={{ flex: 1, marginRight: 10 }}
          placeholder="Search user"
          onChangeText={setSearchQuery}
          onClearIconPress={clearSearch}
          value={searchQuery}
        />

        <Button  mode="contained" onPress={() => searchUser(searchQuery.trim())}>
          Search
        </Button>

       
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10
        }}
      >
        {searched !== null && leaderBoardUsers.length > 0 && getSortButton()}
        {searched !== null && leaderBoardUsers.length > 0 && selectionStrategy !== SelectionStrategy.FUZZY && getRankButton()}
      </View>
      {searched !== null && leaderBoardUsers.length > 0 && (
        <DataTable>
        <DataTable.Header>
          <DataTable.Title style={{flex: 0.3}}>Rank</DataTable.Title>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title numeric>Bananas</DataTable.Title>
        </DataTable.Header>
  
        {leaderBoardUsers.slice(from, to).map((item) => (
          <DataTable.Row style={{ backgroundColor: item.selected ? '#d0e3ff': undefined}} key={item.user.rank}>
            <DataTable.Cell style={{flex: 0.3}} >{item.user.rank}</DataTable.Cell>
            <DataTable.Cell >{item.user.name}</DataTable.Cell>
            <DataTable.Cell numeric>{item.user.bananas}</DataTable.Cell>
          </DataTable.Row>
        ))}
  
        {leaderBoardUsers.length > 10 && (  <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(leaderBoardUsers.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${leaderBoardUsers.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
        />)}
      
      </DataTable>
      )}

    
    </Animated.View>
    
  );
}
