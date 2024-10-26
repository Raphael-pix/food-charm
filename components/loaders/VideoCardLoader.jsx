import { View, Text } from "react-native";
import React from "react";

const VideoCardLoader = () => {
  return (
    <View className="space-y-1 w-full mb-2">
      <View className="relative w-full h-40 rounded-xl bg-neutral-20 mb-1"/>
      <View className="w-full h-4 rounded-xl bg-neutral-10" />
    </View>
  );
};

export default VideoCardLoader;
