import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useEffect } from "react";
import { icons } from "../constants";
import Recents from "./Recents";
import useFetch from "../lib/useFetch";
import { getRecentlyViewed } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider"

const Recipes = ({containerStyles}) => {
  const { user } = useGlobalContext();
  const {data:recipes,refetch} = useFetch(()=>getRecentlyViewed(user.$id))
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 5000); // Refetch every 5 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [refetch]);
  
  if(recipes && recipes.length <= 0){
    return null
  }


  return (
    <View className="mt-4 space-y-6">
      <View className="flex-row items-center justify-between w-full">
        <Text className="font-psemibold text-xl text-neutral-90">
          Recent Recipes
        </Text>
      </View>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <Recents recipe={item} containerStyles={containerStyles}/>;
        }}
        className="mt-2"
        horizontal
      />
    </View>
  );
};

export default Recipes;
