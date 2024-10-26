import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { icons } from "../constants";
import { router } from "expo-router";

const ProfileRecipeCard = ({recipe:{id,image,title,readyInMinutes,servings,healthScore},index, selectedFilterMenu,setSelectedFilterMenu}) => {
  return (
    <TouchableOpacity
      className="flex-row items-center space-x-2 mb-4 relative z-0"
      activeOpacity={0.8}
      onPress={() => router.push(`/recipe/${id}`)}
    >
      <View className="w-16 h-16 rounded-xl">
        <Image
          source={{ uri: image }}
          resizeMode="cover"
          className="w-full h-full rounded-xl"
        />
      </View>
      <View className="flex-1 flex-wrap">
        <View className="flex-row items-center justify-between ">
          <Text className="flex-1 text-neutral-90 text-lg font-psemibold mb-1">
            {title}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setSelectedFilterMenu(selectedFilterMenu === index ? null : index)
            }
          >
            <Image
              source={icons.horizontalMenu}
              tintColor="#303030"
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center w-full">
          <View className="flex-row items-center">
            <Image
              source={icons.clock}
              resizeMode="contain"
              className="w-4 h-4"
              tintColor="#A9A9A9"
            />
            <Text className="text-neutral-40 text-sm ml-2 font-pregular">
              {readyInMinutes} mins
            </Text>
          </View>
          <View className="flex-row items-center">
            <Image
              source={icons.group}
              resizeMode="contain"
              className="w-4 h-4"
              tintColor="#A9A9A9"
            />
            <Text className="text-neutral-40 text-sm ml-2 font-pregular">
              {servings} servings
            </Text>
          </View>
          <View className="flex-row items-center">
            <Image
              source={icons.fire}
              resizeMode="contain"
              className="w-4 h-4"
              tintColor="#A9A9A9"
            />
            <Text className="text-neutral-40 text-sm ml-2 font-pregular">
              {healthScore} cal
            </Text>
          </View>
        </View>
      </View>
      {selectedFilterMenu === index && (
        <View className=" p-2 px-4 rounded-lg bg-white border border-neutral-10 space-y-2 absolute bottom-12 right-4 z-20">
          <TouchableOpacity
            className="flex-row items-center"
            activeOpacity={0.7}
            onPress={() => console.log("post")}
          >
            <View className="bg-neutral-90 w-6 h-6 rounded-full items-center justify-center">
              <Image
                source={icons.plus}
                className="w-4 h-4"
                resizeMode="contain"
                tintColor="#FFFFFF"
              />
            </View>
            <Text className="text-base font-pmedium text-neutral-90 ml-2">
              post
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center"
            activeOpacity={0.7}
            onPress={() => console.log("modify")}
          >
            <View className="bg-neutral-90 w-6 h-6 rounded-full items-center justify-center">
              <Image
                source={icons.modify}
                className="w-4 h-4"
                resizeMode="contain"
                tintColor="#FFFFFF"
              />
            </View>
            <Text className="text-base font-pmedium text-neutral-90 ml-2">
              modify
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center"
            activeOpacity={0.7}
            onPress={() => console.log("delete")}
          >
            <View className="bg-primary w-6 h-6 rounded-full items-center justify-center">
              <Image
                source={icons.remove}
                className="w-4 h-4"
                resizeMode="contain"
                tintColor="#FFFFFF"
              />
            </View>
            <Text className="text-base font-pmedium text-primary ml-2">
              delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ProfileRecipeCard;
