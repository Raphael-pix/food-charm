import { View, TextInput, Image, Alert } from "react-native";
import React, {useState} from "react";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({initialQuery,placeholder}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "")
  
  return (
    <View className="border border-neutral-20 rounded-xl w-full py-3 px-4 items-center justify-between flex-row">
      <Image
        source={icons.search}
        className="w-5 h-5"
        resizeMode="contain"
        tintColor="#D9D9D9"
      />
      <TextInput
        className="flex-1 text-neutral-90 font-pmedium text-base mx-4"
        placeholder={placeholder || "Search Recipes"}
        placeholderTextColor="#D9D9D9"
        value={query}
        onChangeText={(e)=>setQuery(e)}
        onSubmitEditing={()=>{
          if(!query){
            return Alert.alert('Missing Query', 'Please input something to serach across database')
          }
          if(pathname.startsWith('/search'))router.setParams({query})
            else router.push(`/search/${query}`)
          setQuery("")
        }}
      />
    </View>
  );
};

export default SearchInput;
