import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  EmptyState,
  CustomButton,
  VideoCard,
  InfoBox,
  ProfileRecipeCard,
} from "../../components";
import { icons } from "../../constants";
import useFetch from "../../lib/useFetch";
import { getUserVideos, getUserRecipes, signout } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const ProfileHeader = ({
  activeCategory,
  setActiveCategory,
  videoCount,
  recipeCount,
}) => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handlePress = (value) => {
    setActiveCategory(value);
  };
  const logout = async () => {
    await signout();
    router.replace("/index");
    setUser(null);
    setIsLoggedIn(false);
  };
  console.log(user.followers)

  return (
    <View className="space-y-2 ">
      <View className="space-y-2 mb-3 pb-4 border-b border-neutral-20">
        <View className="flex-row items-center justify-between w-full mb-4 relative">
          <Text className="font-psemibold text-2xl text-neutral-90">
            My Profile
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsMenuVisible(!isMenuVisible)}
          >
            <Image
              source={icons.horizontalMenu}
              resizeMode="contain"
              className="w-8 h-8 ml-2"
              tintColor="#303030"
            />
          </TouchableOpacity>
          {isMenuVisible && (
            <View className=" p-2 px-4 rounded-lg bg-white border border-neutral-10 space-y-2 absolute top-6 right-2 z-20">
              <TouchableOpacity
                className="flex-row items-center"
                activeOpacity={0.7}
                onPress={logout}
              >
                <Image
                  source={icons.logout}
                  className="w-4 h-4"
                  resizeMode="contain"
                />
                <Text className="text-base font-pmedium text-primary ml-2">
                  log out
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center"
                activeOpacity={0.7}
                onPress={() => router.push("/Bookmark")}
              >
                <Image
                  source={icons.bookmark}
                  className="w-4 h-4"
                  resizeMode="contain"
                  tintColor="#303030"
                />
                <Text className="text-base font-pmedium text-neutral-90 ml-2">
                  saved
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="flex-row items-center justify-between my-2">
          <View className="relative w-28 h-28 rounded-full">
            <Image
              source={{ uri: user?.avatar }}
              resizeMode="cover"
              className="w-full h-full rounded-full"
            />
          </View>
          <Pressable
            className="border border-primary rounded-xl p-2"
            onPress={() => router.push("/Update")}
          >
            <Text className="font-pmedium text-sm text-primary ">
              Edit Profile
            </Text>
          </Pressable>
        </View>
        <Text className="text-xl font-pbold text-neutral-90 ">
          {user?.username}
        </Text>
        <Text className="text-base font-pregular text-neutral-40 my-2">
          {user?.bio}
        </Text>
        <View className="flex-row items-center justify-between">
          <InfoBox title="Recipe" subtitle={recipeCount} />
          <InfoBox title="Videos" subtitle={videoCount} />
          <InfoBox title="Followers" subtitle={user.followers || 0} />
          <InfoBox title="Following" subtitle={user.following || 0} />
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
  const [activeCategory, setActiveCategory] = useState("recipe");
  const [selectedFilterMenu, setSelectedFilterMenu] = useState(null);
  const { data: posts, loading: videosLoading } = useFetch(() =>
    getUserVideos(user.$id)
  );
  const { data: recipes, loading: recipesLoading } = useFetch(() =>
    getUserRecipes(user.$id)
  );

  if (videosLoading || recipesLoading) {
    return (
      <View className="h-full bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#E23E3E"/>
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
              <ProfileRecipeCard
                recipe={item}
                index={index}
                selectedFilterMenu={selectedFilterMenu}
                setSelectedFilterMenu={setSelectedFilterMenu}
              />
            );
          }
        }}
        ListHeaderComponent={
          <ProfileHeader
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            videoCount={posts.length || 0}
            recipeCount={recipes.length || 0}
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
                title={"Create"}
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
