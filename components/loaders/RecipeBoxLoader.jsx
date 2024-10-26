import { View } from "react-native";
import React from "react";

const RecipeBoxLoader = ({containerStyles}) => {
  return (
    <View className={`space-y-1 flex-1  mr-3 max-w-[150px] ${containerStyles}`}>
      <View className="relative w-full h-full rounded-xl bg-neutral-20"/>
      <View className="w-full h-6 rounded-xl bg-neutral-10" />
    </View>
  );
};

export default RecipeBoxLoader;
