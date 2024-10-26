import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

const CustomButton = ({ title, handlePress, icon, otherStyles, textStyles,disabled }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`flex-row  bg-primary items-center justify-center space-x-4 p-4 rounded-xl ${otherStyles}`}
      disabled={disabled}
    >
      <Text className={`text-white font-psemibold text-xl ${textStyles}`}>{title}</Text>
      {icon && <Image source={icon} resizeMode="contain" className="w-4 h-4" />}
    </TouchableOpacity>
  );
};

export default CustomButton;
