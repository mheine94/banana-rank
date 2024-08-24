import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Button, SearchBar } from '@rneui/themed';
import { Alert } from "react-native";
import { store } from "../redux/store";
import { selectLeaderBoardUsers } from "@/redux/selectors";
import { LeaderBoardEntry, SortStrategy, User, UserState } from "@/redux/types";
import { useSelector, Provider } from "react-redux";

export default function Index() {
   const [searchQuery, setSearchQuery] = useState("");
   const [searched, setSearched] = useState< string| undefined>();


   // redux for the sorting?... could dispatch an action to set the strategy in the store
   // sorting would then happen in the store logic and not here
   // would feel better to me right
   const [sorting, setSorting] = useState<SortStrategy>(SortStrategy.BY_RANK)

   const leaderBoardUsers = useSelector((state: UserState) => selectLeaderBoardUsers(state, searched));

   if(sorting === SortStrategy.BY_NAME){
      let compareAlphabetically = (stringA : string, stringB: string) =>{
        if(stringA < stringB){
          return -1;
        }
        if(stringB < stringA){
          return 1;
        }
        return 0;
      }
      leaderBoardUsers.sort((entryA, entryB) => compareAlphabetically(entryA.user.name, entryB.user.name));
   }


  let searchUser = (search: any) => {
    setSearched(search)
 };

  let sort = (strategy : SortStrategy) => {
    setSorting(strategy);
  };

  if(leaderBoardUsers.length === 0 && searched !== undefined){
    Alert.alert("No results", "This user name does not exist! Please specify an existing user name!")
  }

   let renderIt = (entry : LeaderBoardEntry) =>{
    return (<View>
      <Text>Name: {entry.user.name} Rank: {entry.user.rank} Bananas: {entry.user.bananas} {entry.selected ? "<---": ""}</Text>
    </View>)
   }
 
  return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SearchBar 
          placeholder="search user" 
          onChangeText={setSearchQuery} 
          value={searchQuery}
          />
          <Button title="Search" onPress={()=> searchUser(searchQuery.trim())}></Button>

          {sorting === SortStrategy.BY_RANK ? 
            (<Button title="Sort by name" onPress={()=> sort(SortStrategy.BY_NAME)}></Button>)
            :
            (<Button title="Sort by rank" onPress={()=> sort(SortStrategy.BY_RANK)}></Button>)
          }
          
        {leaderBoardUsers.length > 0 && 
          (<FlatList data={leaderBoardUsers} renderItem={({item, index}) => renderIt(item) }></FlatList>)
         }
       
      </View>
  );
}
