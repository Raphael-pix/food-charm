import {
    View,
    Text,
    TouchableOpacity,
    Image,
  } from "react-native";
  import React from "react";
  import { router } from "expo-router";
  
  const CreatorBox = ({ creator: {$id,username, avatar } }) => {
    return (
      <TouchableOpacity className="space-y-1 justify-center items-center mr-2" activeOpacity={0.7} onPress={()=>router.push(`/users/${$id}`)}>
        <View className="relative w-20 h-20 rounded-full">
          <Image
            source={{uri:avatar}}
            resizeMode="cover"
            className="w-full h-full rounded-full"
          />
        </View>
  
        <Text className="text-sm text-neutral font-pmedium text-center mt-1 w-[80%]" numberOfLines={1}>{username}</Text>
      </TouchableOpacity>
    );
  };
  
  export default CreatorBox;
  