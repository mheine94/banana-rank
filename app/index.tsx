import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Button, SearchBar } from '@rneui/themed';
import { Alert } from "react-native";
import { store } from "../redux/store";
import { selectFilteredUsers } from "@/redux/selectors";
import { LeaderBoardEntry, User, UserState } from "@/redux/types";
import { useSelector, Provider } from "react-redux";

export default function Index() {

   // temp until i added redux
   const [searchQuery, setSearchQuery] = useState("");
   const [searched, setSearched] = useState("");

   const filteredUsers = useSelector((state: UserState) => selectFilteredUsers(state, searched));

   let updateSearch = (search: any) => {
     // do the searching
     setSearchQuery(search)
   };

   let renderIt = (entry : LeaderBoardEntry) =>{
    return (<View>
      <Text>Name: {entry.user.name} Rank: {entry.rank} Bananas: {entry.user.bananas} {entry.selected ? "highlight": ""}</Text>
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
          onChangeText={updateSearch}
          value={searchQuery}
          />
          <Button title="Search" onPress={()=> setSearched(searchQuery)}></Button>
        <Text>Last search was: "{searched}"</Text>
        <FlatList data={filteredUsers} renderItem={({item, index}) => renderIt(item) }></FlatList>
      </View>
  );
}
