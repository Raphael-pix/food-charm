import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Pressable,
  } from "react-native";
  import React from "react";
import { router } from "expo-router";
  
  const Recents = ({ recipe: {id, image, title },containerStyles}) => {
    return (
      <TouchableOpacity className="space-y-1 mr-5 w-[150px]" activeOpacity={0.7} onPress={()=>router.push(`/recipe/${id}`)}>
        <View className={`relative w-full rounded-xl ${containerStyles}`}>
          <Image
            source={{uri: image}}
            resizeMode="cover"
            className="w-full h-full rounded-xl"
          />
        </View>
  
        {/* add link to profile functionality */}
        <Pressable className="w-full py-1 items-center flex-row">
          <Text className="text-sm text-neutral-40" numberOfLines={1}>{title}</Text>
        </Pressable>
      </TouchableOpacity>
    );
  };
  
  export default Recents;
  