import {
  View,
  Text,
  ImageBackground,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import {
  CustomButton,
  EmptyState,
  BookmarkComponent,
  LoadingAnimation,
} from "../../components/index";
import { router, useLocalSearchParams } from "expo-router";
import useFetch from "../../lib/useFetch";
import {
  getRecipeDetails,
} from "../../lib/spoonacular";
import { convertSpoonacularRating } from "../../lib/util";
import { getAiRecipeDetails } from "../../lib/appwrite";


const RecipeHeader = ({
  data: {
    title,
    healthScore,
    servings,
    readyInMinutes,
    spoonacularScore,
    extendedIngredients,
    ingredients,
    creator,
  },
  setisWidthFull,
  isWidthFull,
}) => {
  return (
    <View className="bg-white rounded-xl p-4 px-6 space-y-2">
      {!isWidthFull ? (
        <Pressable
          className="w-full items-center pb-2"
          onPress={() => setisWidthFull(true)}
        >
          <View className="w-16 h-1 bg-neutral-20 rounded-xl  " />
        </Pressable>
      ) : (
        <View className="flex-row w-full items-center justify-between py-1 pb-2">
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              className="w-6 h-6"
              tintColor="#303030"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-neutral-90 w-[28px] h-[28px] rounded-full items-center justify-center"
            activeOpacity={0.7}
            onPress={() => setisWidthFull(false)}
          >
            <Image
              source={icons.down}
              resizeMode="contain"
              className="w-4 h-4"
              tintColor="#FFF"
            />
          </TouchableOpacity>
        </View>
      )}
      <View className="flex-row justify-between items-start w-full space-x-2">
        <View className="space-y-1 gap-x-2 flex-1">
          <Text className="text-neutral-90 text-lg font-psemibold">
            {title}
          </Text>
          {creator && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(`/users/${creator.$id}`)}
              className="flex-row items-center"
            >
              <View className="w-6 h-6 rounded-full mr-2">
                <Image
                  source={{ uri: creator.avatar }}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="text-neutral-40 text-sm font-pregular">
                {creator.username}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View className="flex-row items-center  mt-1">
          <Image
            source={icons.star}
            resizeMode="contain"
            className="w-4 h-4"
            tintColor="#FFC94D"
          />
          <Text className="text-neutral-90 text-sm ml-2 font-pmedium">
            {convertSpoonacularRating(spoonacularScore)}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center w-full mt-2">
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
            {healthScore.toFixed(0)} cal
          </Text>
        </View>
      </View>
      <Text className="text-neutral-90 text-base font-psemibold">
        Ingredients
      </Text>
      <View className="mt-2 space-y-2">
        <FlatList
          data={extendedIngredients || JSON.parse(ingredients)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View className="flex-row items-center mb-1">
                <View className="bg-neutral-50 w-1 h-1 rounded-full mr-2" />
                <Text className="text-neutral-60 text-sm font-pregular">
                  {item.original}
                </Text>
              </View>
            );
          }}
        />
      </View>
      <Text className="text-neutral-90 text-base font-psemibold">
        Instructions
      </Text>
    </View>
  );
};

const Recipe = () => {
  const { id } = useLocalSearchParams();
  const [isWidthFull, setisWidthFull] = useState(false);
  const { data: recipe, loading } = useFetch(() => {
    if (id.startsWith("AI_")) {
      return getAiRecipeDetails(id);
    }
    return getRecipeDetails(id);
  });

  if (loading) {
    return (
      <SafeAreaView className="h-full bg-white items-center justify-center">
        <LoadingAnimation loading={loading}/>
      </SafeAreaView>
    );
  }
  if (!recipe) {
    return (
      <SafeAreaView className="h-full bg-white items-center">
        <EmptyState title={"Sorry the content is not avaible at the moment"} />
        <CustomButton
          title={"Browse Recipes"}
          handlePress={() => router.push("/Feed")}
          otherStyles={"mt-7"}
        />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="h-full bg-white">
      {!isWidthFull && (
        <View className="w-full h-[300px] z-0">
          <ImageBackground
            source={{
              uri:
                recipe.image ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png",
            }}
            resizeMode="cover"
            className="w-full h-full overflow-hidden relative justify-center items-center"
          >
            <View className="flex-row w-full items-center justify-between absolute top-1 px-3 py-1 z-10">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.back()}
              >
                <Image
                  source={icons.leftArrow}
                  resizeMode="contain"
                  className="w-6 h-6"
                  tintColor="#FFF"
                />
              </TouchableOpacity>
              <BookmarkComponent recipe={recipe} containerStyles={"w-8 h-8"} imageStyles={"w-5 h-5"}/>
            </View>
            <View className="w-full h-full absolute bg-neutral-90/20 z-0" />
          </ImageBackground>
        </View>
      )}
      <FlatList
        data={recipe.analyzedInstructions || JSON.parse(recipe.instructions)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View className="mb-4">
              {item.steps.map((step, index) => (
                <View key={index} className="flex-row items-start mb-2 px-6">
                  <View className="bg-green-100 w-2 h-2 rounded-full mt-2 mr-2" />
                  <Text className="text-neutral-60 text-sm font-pregular">
                    {step.step}
                  </Text>
                </View>
              ))}
            </View>
          );
        }}
        className={`${
          isWidthFull ? "" : "-top-9"
        } w-full h-full bg-white rounded-3xl space-y-2 relative`}
        ListHeaderComponent={
          <RecipeHeader
            data={recipe}
            setisWidthFull={setisWidthFull}
            isWidthFull={isWidthFull}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Recipe;
