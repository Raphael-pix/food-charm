import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { CustomButton, EmptyState,RecipeCard, VideoCard } from "../../components";
import useFetch from "../../lib/useFetch";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getSavedRecipes, getSavedVideos } from "../../lib/appwrite";


const BookmarkHeader = ({ activeCategory, setActiveCategory }) => {
  const handlePress = (value) => {
    setActiveCategory(value);
  };

  return (
    <View className="space-y-2 ">
      <View className="w-full mb-4">
        <Text className="font-psemibold text-2xl text-neutral-90">
          Saved {activeCategory === "video" ? "Videos" : "Recipes"}
        </Text>
      </View>
      <View className="flex-row justify-between items-center gap-x-2 mb-4">
        <TouchableOpacity
          className={`${
            activeCategory === "recipe" ? "bg-primary" : "bg-white"
          }  p-2 rounded-lg mr-2 flex-1`}
          activeOpacity={0.7}
          onPress={() => handlePress("recipe")}
        >
          <Text
            className={`${
              activeCategory === "recipe" ? "text-white" : "text-primary-30"
            }  font-pmedium text-center`}
          >
            recipe
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${
            activeCategory === "video" ? "bg-primary" : "bg-white"
          }  p-2 rounded-lg  flex-1`}
          activeOpacity={0.7}
          onPress={() => handlePress("video")}
        >
          <Text
            className={`${
              activeCategory === "video" ? "text-white" : "text-primary-30"
            }  font-pmedium text-center `}
          >
            video
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Bookmark = () => {
  const { user } = useGlobalContext();
  const [activeCategory, setActiveCategory] = useState("recipe");
  const [refreshing,setRefreshing] = useState(false)
  const { data: recipes, loading: recipesLoading,refetch: refetchRecipes } = useFetch(() =>
    getSavedRecipes(user.$id)
  );
  const { data: videos, loading: videosLoading, refetch: refetchVideos } = useFetch(() =>
    getSavedVideos(user.$id)
  );
  const onRefresh = async () => {
    setRefreshing(true);
    await refetchRecipes();
    await refetchVideos();
    setRefreshing(false);
  };

  if (recipesLoading || videosLoading) {
    return (
      <View className="h-full bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#E23E3E"/>
      </View>
    );
  }

  return (
    <SafeAreaView className="px-5 mt-4 bg-white h-full">
      <FlatList
        data={activeCategory === "recipe" ? recipes : videos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          {
            if (activeCategory === "video") {
              return (
                <VideoCard video={item} profile={true} containerStyles="mb-5" />
              );
            } else {
              return (
                <RecipeCard recipe={item} containerStyles="h-[180px] mb-5" />
              );
            }
          }
        }}
        ListHeaderComponent={
          <BookmarkHeader
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        }
        ListEmptyComponent={() => {
          return (
            <View className=" w-full bg-white items-center justify-center py-6">
              <EmptyState
                title={`No ${
                  activeCategory === "video" ? "videos" : "recipes"
                } Found`}
                subtitle={`Browse for ${
                  activeCategory === "video" ? "videos" : "recipes"
                } that you might like`}
              />
              <CustomButton
                title={"Browse"}
                handlePress={() => router.push("/Feed")}
                otherStyles={"mt-7 w-[80%]"}
              />
            </View>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="mb-4"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Bookmark;
