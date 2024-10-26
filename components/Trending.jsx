import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import { router } from "expo-router"
import { icons } from "../constants";
import VideoCard from "./VideoCard";
import useFetch from "../lib/useFetch";
import { getCookingVideos } from "../lib/spoonacular.js";

const Trending = ({ isHorizontal, containerStyles }) => {
  const { data: videos } = useFetch(() => getCookingVideos("top"));

  return (
    <View className={`mt-4 space-y-6`}>
      <View className="flex-row items-center justify-between w-full">
        <Text className="font-psemibold text-xl text-neutral-90">
          Trending now
        </Text>
        <TouchableOpacity
          className="flex-row justify-center items-center"
          activeOpacity={0.7}
          onPress={()=>router.push("/Feed")}
        >
          <Text className="text-primary font-pmedium text-sm">See all</Text>
          <Image
            source={icons.rightArrow}
            resizeMode="contain"
            className="w-3 h-3 ml-2"
            tintColor="#E23E3E"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={videos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return <VideoCard video={item} containerStyles={containerStyles} />;
        }}
        className="mt-2"
        horizontal={isHorizontal}
      />
    </View>
  );
};

export default Trending;
