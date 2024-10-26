import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StatusBar,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {Redirect, router} from 'expo-router'
import { CustomButton} from "../components"
import { icons, images } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";


const App = () => {
  const {loading,isLoggedIn} = useGlobalContext();

  if(!loading && isLoggedIn) return <Redirect href='/Home'/>
  return (
    <>
      <SafeAreaView className="h-full bg-white">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <ImageBackground
            className="h-full"
            source={images.background}
            resizeMode="cover"
          >
            <View className="space-y-1 h-full items-center justify-end px-4 pb-20">
              <Text className="text-white text-6xl font-pbold text-center leading-loose py-2">
                Let's Cooking
              </Text>
              <Text className="text-white text-xl font-pregular ">
                Find best recipies for cooking
              </Text>
              <CustomButton title="Start Cooking" icon={icons.rightArrow}handlePress={()=>router.push("/Sign-in")} otherStyles="w-[80%] mt-4"/>
            </View>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
      <StatusBar backgroundColor="#111" barStyle="light-content" />
    </>
  );
};

export default App;
