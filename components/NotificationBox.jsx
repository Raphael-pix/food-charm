import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "../constants";

const NotificationBox = ({ notification: { title, message } }) => {
  return (
    <View className="bg-neutral-10 w-full p-3 rounded-xl flex-row items-start justify-between space-x-1 mt-4">
      <View  className="w-7 h-7 rounded-lg p-2 items-center justify-center bg-green-10 mr-2">
        <Image
          source={icons.paper}
          resizeMode="contain"
          className="w-4 h-4"
          tintColor="#31B057"
        />
      </View>
      <View className="flex-1 items-start">
        <Text className="mb-1 text-sm font-psemibold text-neutral-90">{title}</Text>
        <Text className="text-xs font-pregular text-neutral-40">{message}</Text>
      </View>
      <View className="bg-primary w-2 h-2 rounded-full"></View>
    </View>
  );
};

export default NotificationBox;
