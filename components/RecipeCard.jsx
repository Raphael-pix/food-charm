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
import { router } from "expo-router";
import BookmarkComponent from "./Bookmark";

const RecipeCard = ({
  recipe,
  containerStyles,
}) => {
  const {id, title, image, spoonacularScore,ingredients } = recipe
  return (
    <View className={`space-y-1 mb-4 ${containerStyles}`}>
      {/* add link to recipe page functionality */}
      <TouchableOpacity
        className="relative w-full h-full rounded-xl"
        activeOpacity={0.7}
        onPress = {()=>{
          router.push(`/recipe/${id}`) 
        }}
      >
        <ImageBackground
          source={{uri: image ||  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png"}}
          resizeMode="cover"
          className="w-full h-full rounded-xl overflow-hidden relative justify-center items-center"
        >
          <View className="flex-row w-full items-center justify-between absolute top-1 px-3 py-1 z-10">
            <View className="flex-row items-center h-8 rounded-xl px-2 bg-black/20">
              <Image
                source={icons.star}
                resizeMode="contain"
                className="w-4 h-4"
              />
              <Text className="text-white text-sm ml-2 font-pmedium">
                {convertSpoonacularRating(spoonacularScore)}
              </Text>
            </View>
            <BookmarkComponent recipe={recipe}/>
          </View>
          <View className="absolute bottom-3 left-3 z-10">
            <Text className="text-base font-pbold text-white">{title}</Text>
            <View className="space-x-1 mt-2 flex-row">
              <Text className="text-white font-pregular">
                {JSON.parse(ingredients).length} ingredients
              </Text>
            </View>
          </View>
          <View className="absolute w-full h-full bg-black/30 z-0"/>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default RecipeCard;
