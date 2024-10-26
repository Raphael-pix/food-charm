import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ImageBackground,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import images from "../../constants/images";

const Index = () => {
  const menu = [
    {
      id: 1,
      title: "Create Recipe",
      route: "/CreateRecipe",
      background: images.cooking_recipes,
    },
    {
      id: 2,
      title: "Create Video",
      route: "/CreateVideo",
      background: images.cooking_videos,
    },
    {
      id: 3,
      title: "Customize Recipe",
      route: "/CustomizeRecipe",
      background: images.customize_recipes,
    },
    {
      id: 4,
      title: "What's in your fridge ",
      route: "/MyFridge",
      background: images.myFridge,
    },
  ];

  return (
    <SafeAreaView className="h-full bg-white px-3 mt-5">
      <FlatList
        data={menu}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              className="rounded-xl w-full h-[150px] pb-2 relative"
              activeOpacity={0.8}
              onPress={() => router.push(item.route)} 
            >
              <ImageBackground
                source={item.background}
                resizeMode="cover"
                className="w-full h-full rounded-xl overflow-hidden relative justify-center items-center"
              >
                <Text className="text-white font-pbold text-xl z-10">
                  {item.title}
                </Text>
                <View className="w-full h-full bg-neutral-90/20 absolute z-0" />
              </ImageBackground>
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={() => {
          return (
            <View className="w-full space-y-1 mb-4">
              <Text className="font-psemibold text-2xl text-neutral-90">
                My Playground
              </Text>
              <Text className="text-neutral-40 font-pmedium text-sm">
                Create and customize your own recipes
              </Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        className="mb-6"
      />
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </SafeAreaView>
  );
};

export default Index;
