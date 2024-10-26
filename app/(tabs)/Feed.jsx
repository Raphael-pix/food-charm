import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  SearchInput,
  Creators,
  VideoCard,
  RecipeBox,
  FilterBox,
  VideoCardLoader,
  RecipeBoxLoader,
} from "../../components/index";
import {filters } from "../../lib/dummydata";
import useFetch from "../../lib/useFetch";
import { getCookingVideos, getRecipes } from "../../lib/spoonacular";
import { icons } from "../../constants";
import { addToRecentlyViewed, getAllCreators } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const FeedHeader = ({ activeCategory, setActiveCategory }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const handlePress = (value) => {
    setActiveCategory(value);
  };
  const [selectedFilters, setSelectedFilters] = useState({
    Cuisine: [],
    Type: [],
  });

  const {data:creators} = useFetch(getAllCreators)

  return (
    <View keyboardDismissMode="on-drag" className="space-y-4">
      <SearchInput />
      <View className="flex-row justify-between items-center gap-x-2 ">
        <TouchableOpacity
          className={`${
            activeCategory === "recipes" ? "bg-primary" : "bg-white"
          }  p-2 rounded-lg  flex-1`}
          activeOpacity={0.7}
          onPress={() => handlePress("recipes")}
        >
          <Text
            className={`${
              activeCategory === "recipes" ? "text-white" : "text-primary-30"
            }  font-pmedium text-center `}
          >
            Recipes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${
            activeCategory === "videos" ? "bg-primary" : "bg-white"
          }  p-2 rounded-lg mr-2 flex-1`}
          activeOpacity={0.7}
          onPress={() => handlePress("videos")}
        >
          <Text
            className={`${
              activeCategory === "videos" ? "text-white" : "text-primary-30"
            }  font-pmedium text-center`}
          >
            Videos
          </Text>
        </TouchableOpacity>
      </View>
      {activeCategory === "videos" ? (
        <>
          <Creators creators={creators || []} />
          <View className="w-full items-center justify-between px-2 my-4 flex-row">
            <Text className="font-psemibold text-xl text-neutral-90">
              Trending now
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Image
                source={icons.settings}
                className="w-4 h-4"
                resizeMode="contain"
                tintColor="#303030"
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className="w-full items-center justify-between px-2 my-4 flex-row">
          <Text className="font-psemibold text-xl text-neutral-90">
            Popular recipes
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsFilterVisible(!isFilterVisible)}
          >
            <Image
              source={icons.settings}
              className="w-4 h-4"
              resizeMode="contain"
              tintColor="#303030"
            />
          </TouchableOpacity>
        </View>
      )}
      {isFilterVisible && (
        <FilterBox
          setIsFilterVisible={setIsFilterVisible}
          filters={filters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          containerStyles={"bg-white border border-neutral-20"}
        />
      )}
    </View>
  );
};

const Feed = () => {
  const [activeCategory, setActiveCategory] = useState("recipes");
  const [refreshing, setRefreshing] = useState(false);
  const {user} = useGlobalContext();
  const {
    data: recipes,
    loading: RecipeLoading,
    refetch: refetchRecipes,
  } = useFetch(getRecipes);
  const {
    data: videos,
    loading: VideoLoading,
    refetch: refetchVideos,
  } = useFetch(() => getCookingVideos("popular"));
  
  const onRefresh = async () => {
    setRefreshing(true);
    await refetchRecipes();
    await refetchVideos();
    setRefreshing(false);
  };
  const setRecentlyViewed = async(recipe) => {
    try{
      await addToRecentlyViewed(recipe,user.$id);
      console.log("added successfully");
    }catch(err){
      console.log("Error adding recipe to recents",err);
    }
  }

  return (
    <SafeAreaView className="px-3 mt-5 pb-4 bg-white h-full">
      <FlatList
        data={activeCategory === "videos" ? videos : recipes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          if (activeCategory === "videos") {
            return VideoLoading ? (
              <VideoCardLoader />
            ) : (
              <VideoCard video={item} containerStyles="mb-5" />
            );
          } else {
            return RecipeLoading ? (
              <RecipeBoxLoader containerStyles={"h-[200px] mb-14"}/>
            ) : (
              <RecipeBox
                recipe={item}
                containerStyles="h-[200px] mb-14"
                onPress={() => {
                  router.push(`/recipe/${item.id}`)
                  setRecentlyViewed(item)
                }}
              />
            );
          }
        }}
        ListHeaderComponent={
          <FeedHeader
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        }
        ListEmptyComponent={()=>{
          const dummy = [1,2,3,4];
          dummy.map(()=>{
            return (
              activeCategory === "videos" ?
              <VideoCardLoader/>
              :
              <RecipeBoxLoader containerStyles={"h-[200px] mb-14"}/>
            );
          })
        }}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={
          activeCategory === "recipes"
            ? { flexDirection: "row", justifyContent: "space-between" }
            : null
        }
        key={activeCategory === "recipes" ? 2 : 1}
        numColumns={activeCategory === "recipes" ? 2 : 1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </SafeAreaView>
  );
};

export default Feed;
