import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import React from "react";
import { icons } from "../constants";
import { convertSpoonacularRating } from "../lib/util";
import BookmarkComponent from "./Bookmark";

const RecipeBox = ({ recipe,containerStyles,onPress}) => {
  const {title, image ,spoonacularScore} = recipe
  return (
    <View className={`space-y-1 flex-1  mr-3 max-w-[150px] ${containerStyles}`}>
      <TouchableOpacity
        className="relative w-full h-full rounded-xl"
        activeOpacity={0.7}
        onPress = {onPress}
      >
        <ImageBackground
          source={{uri:image || "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png"}}
          resizeMode="cover"
          className="w-full h-full rounded-xl overflow-hidden relative justify-center items-center"
        >
          <View className="flex-row w-full items-center justify-between absolute top-1 px-3 py-1">
            <View className="flex-row items-center h-8 rounded-xl px-2 bg-black/20">
              <Image
                source={icons.star}
                resizeMode="contain"
                className="w-3 h-3"
              />
              <Text className="text-white text-xs ml-2 font-pmedium">
                {convertSpoonacularRating(spoonacularScore)}
              </Text>
            </View>
            <BookmarkComponent recipe={recipe}/>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <View className="space-y-1">
        <View className="flex-row justify-between items-center">
          <Text
            numberOfLines={2}
            className="text-sm font-psemibold text-neutral-90 flex-1"
          >
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RecipeBox;
