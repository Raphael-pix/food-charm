import { View, Text, FlatList } from "react-native";
import React from "react";
import CreatorBox from "./CreatorBox";

const Creators = ({creators}) => {
  return (
    <View className="mt-4 space-y-6">
        <Text className="font-psemibold text-xl text-neutral-90">
          Popular Creators
        </Text>
      <FlatList
        data={creators}
        keyExtractor={(item,index) => index.toString()}
        renderItem={({ item }) => {
          return <CreatorBox creator={item} />;
        }}
        className="mt-2"
        horizontal
      />
    </View>
  );
};

export default Creators;
