import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { Button, SearchBar } from '@rneui/themed';
import { Alert } from "react-native";

export default function Index() {

   // temp until i added redux
   const [searchQuery, setSearchQuery] = useState("");
   const [searched, setSearched] = useState("");


   let updateSearch = (search: any) => {
     // do the searching
     setSearchQuery(search)
   };

   let renderIt = (item : string) =>{
    return (<View>
      <Text>{item}</Text>
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
      <FlatList data={["user1", "user2", "user3", "user3"]} renderItem={({item, index}) => renderIt(item) }></FlatList>
    </View>
  );
}
