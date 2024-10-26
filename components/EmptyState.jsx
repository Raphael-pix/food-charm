import { View, Text, Image } from "react-native";
import React from "react";
import {router} from 'expo-router'
import { images } from "../constants";
import CustomButton from './CustomButton'

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className=" justify-center items-center px-4 flex-1">
      <Image
        source={images.empty}
        className="w-[150px] h-[120px]"
        resizeMode="contain"
      />
       <Text className="text-xl text-center  font-psemibold text-neutral-60">{title}</Text>
      <Text className="font-pmedium text-sm mt-2 text-neutral-40">{subtitle}</Text>
    </View>
  );
};

export default EmptyState;
