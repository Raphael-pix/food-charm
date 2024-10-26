import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { InfoBox, VideoCard, EmptyState, CustomButton } from "../../components";
import { icons } from "../../constants";
import useFetch from "../../lib/useFetch";
import {
  getUserDetails,
  getUserVideos,
  getUserRecipes,
  followUser,
} from "../../lib/appwrite";

import { useGlobalContext } from "../../context/GlobalProvider";

const ProfileHeader = ({
  user,
  member,
  activeCategory,
  setActiveCategory,
  videoCount,
  repiceCount,
}) => {
  const handlePress = (value) => {
    setActiveCategory(value);
  };
  return (
    <View className="space-y-2 ">
      <View className="space-y-2 mb-3 pb-4 border-b border-neutral-20">
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            className="w-7 h-7"
            tintColor={"#303030"}
          />
        </TouchableOpacity>
        <View className="flex-row items-center justify-between my-2">
          <View className="relative w-28 h-28 rounded-full">
            <Image
              source={{ uri: member.avatar }}
              resizeMode="cover"
              className="w-full h-full rounded-full"
            />
          </View>
          <Pressable
            className="border border-primary rounded-xl p-2"
            onPress={() => followUser(user.$id,member.$id)}
          >
            <Text className="font-pmedium text-sm text-primary ">Follow</Text>
          </Pressable>
        </View>
        <Text className="text-xl font-pbold text-neutral-90 ">
          {member?.username}
        </Text>
        <Text className="text-base font-pregular text-neutral-40 my-2">
          {member?.bio}
        </Text>
        <View className="flex-row items-center justify-between">
          <InfoBox title="Recipe" subtitle={repiceCount} />
          <InfoBox title="Videos" subtitle={videoCount} />
          <InfoBox title="Followers" subtitle={member?.followers} />
          <InfoBox title="Following" subtitle={member?.following} />
        </View>
      </View>
      <View className="flex-row justify-between items-center gap-x-2 mb-6">
        <TouchableOpacity
          className={`${
            activeCategory === "recipe" ? "bg-primary" : "bg-white"
          }  p-2 rounded-lg  flex-1`}
          activeOpacity={0.7}
          onPress={() => handlePress("recipe")}
        >
          <Text
            className={`${
              activeCategory === "recipe" ? "text-white" : "text-primary-30"
            }  font-pmedium text-center `}
          >
            Recipe
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${
            activeCategory === "video" ? "bg-primary" : "bg-white"
          }  p-2 rounded-lg mr-2 flex-1`}
          activeOpacity={0.7}
          onPress={() => handlePress("video")}
        >
          <Text
            className={`${
              activeCategory === "video" ? "text-white" : "text-primary-30"
            }  font-pmedium text-center`}
          >
            Video
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Profile = () => {
  const { user } = useGlobalContext();
  const { userId } = useLocalSearchParams();
  const { data: member } = useFetch(() => getUserDetails(userId));
  const { data: posts, loading: videosLoading } = useFetch(() => getUserVideos(userId));
  const { data: recipes,loading:recipesLoading } = useFetch(() => getUserRecipes(userId));
  const [activeCategory, setActiveCategory] = useState("recipe");

  if (userId === user.$id) return <Redirect href="/Profile" />;

  if (videosLoading || recipesLoading) {
    return (
      <View className="h-full bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#E23E3E" />
      </View>
    );
  }

  return (
    <SafeAreaView className="px-5 mt-4 bg-white h-full">
      <FlatList
        data={activeCategory === "recipe" ? recipes : posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          if (activeCategory === "video") {
            return (
              <VideoCard
                video={item}
                hideProfile={true}
                containerStyles="mb-5"
              />
            );
          } else {
            return (
              <TouchableOpacity
                className="flex-row items-center space-x-2 mb-4 relative z-0"
                activeOpacity={0.8}
                onPress={() => router.push(`/recipe/${item.id}`)}
              >
                <View className="w-16 h-16 rounded-xl">
                  <Image
                    source={{ uri: item.image }}
                    resizeMode="cover"
                    className="w-full h-full rounded-xl"
                  />
                </View>
                <View className="flex-1 flex-wrap">
                  <View className="flex-row items-center justify-between ">
                    <Text className="flex-1 text-neutral-90 text-lg font-psemibold mb-1">
                      {item.title}
                    </Text>
                    <TouchableOpacity>
                      <Image
                        source={icons.bookmark}
                        tintColor="#303030"
                        resizeMode="contain"
                        className="w-4 h-4"
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
                        {item.readyInMinutes} mins
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
                        {item.servings} servings
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
                        {item.healthScore.toFixed(0)} cal
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }
        }}
        ListHeaderComponent={
          <ProfileHeader
            user={user}
            member={member[0]}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            repiceCount={recipes.length || 0}
            videoCount={posts.length || 0}
          />
        }
        className="mb-4"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return (
            <View className=" w-full bg-white items-center justify-center mb-6">
              <EmptyState
                title={`No ${
                  activeCategory === "video" ? "videos" : "recipes"
                } Found`}
                subtitle={`Create your  ${
                  activeCategory === "video" ? "video" : "recipe"
                } first today`}
              />
              <CustomButton
                title={"create"}
                handlePress={() => router.push("/General")}
                otherStyles={"mt-7 w-[80%]"}
              />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Profile;
