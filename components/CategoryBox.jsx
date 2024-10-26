import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { icons } from "../constants";
import { router } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";
import { addToRecentlyViewed } from "../lib/appwrite";
import BookmarkComponent from "./Bookmark";

const CategoryBox = ({
  recipe,
}) => {
  const {id, image, title, cookingMinutes, readyInMinutes} = recipe
  const {user} = useGlobalContext();
  const setRecentlyViewed = async() => {
    try{
      await addToRecentlyViewed(recipe,user.$id);
    }catch(err){
      console.log("Error adding recipe to recents",err);
    }
  }
  return (
    <TouchableOpacity
      className="mr-2 relative items-center justify-end h-[200px]"
      activeOpacity={0.7}
      onPress={() => {
        router.push(`/recipe/${id}`)
        setRecentlyViewed();
      }}
    >
      <View className="w-24 h-24 rounded-full p-2 bg-neutral-10 z-10 absolute top-0 shadow-lg shadow-neutral-70/40">
        <Image
          source={{ uri: image }}
          resizeMode="cover"
          className="w-full h-full rounded-full"
        />
      </View>
      <View className="space-y-1 bg-neutral-10 h-[155px] w-[150px] px-4 relative rounded-lg items-center justify-center ">
        {/* add link to recipe functionality */}
        <Pressable className="w-full">
          <Text
            className="text-sm text-neutral-90 font-psemibold text-center"
            numberOfLines={2}
          >
            {title}
          </Text>
        </Pressable>

        <View className="flex-row items-center justify-between absolute bottom-2 w-full">
          <View className="space-y-1">
            <Text className="font-pregular text-xs text-neutral-30">Time</Text>
            <Text className="font-psemibold text-xs text-center text-neutral">
              {cookingMinutes || readyInMinutes} mins
            </Text>
          </View>
          <BookmarkComponent recipe={recipe}/>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryBox;
