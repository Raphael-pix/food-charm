import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {SearchInput,Trending,Recipes,Categories } from "../../components/index"
import { icons } from "../../constants";
import { router } from "expo-router";

const Home = () => {
  return (
    <SafeAreaView className="px-3 pb-4 mt-5  bg-white h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View className="flex-row justify-between items-top space-x-2">
            <Text className="text-3xl font-semibold text-neutral-90 mb-4 w-3/4">
              Find best recipies for cooking
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              className="mt-2 pr-2"
              onPress={()=>router.push("Notification")}
            >
              <Image
                source={icons.notifications}
                resizeMode="contain"
                className="w-6 h-6"
                tintColor="#303030"
              />
            </TouchableOpacity>
          </View>
          <SearchInput />
        </View>
        <Categories/>
        <Recipes containerStyles="h-32"/>
        <Trending isHorizontal={true} containerStyles='w-[250px] mr-5'/>
      </ScrollView>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </SafeAreaView>
  );
};

export default Home;
