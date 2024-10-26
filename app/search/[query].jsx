import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  EmptyState,
  SearchInput,
  Creators,
  VideoCard,
  RecipeBox,
  FilterBox,
  LoadingAnimation,
} from "../../components/index";
import { icons } from "../../constants";
import { creators, filters } from "../../lib/dummydata";
import useFetch from "../../lib/useFetch";
import {
  getCookingVideos,
  getRecipeByAi,
  searchRecipes,
} from "../../lib/spoonacular";
import { addRecipe, searchRecipe } from "../../lib/appwrite";

const SearchHeader = ({ query, activeCategory, setActiveCategory }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    Cuisine: [],
    Type: [],
  });
  const handlePress = (value) => {
    setActiveCategory(value);
  };

  return (
    <View keyboardDismissMode="on-drag" className="space-y-4">
      <View className="w-full items-start space-x-2 flex-row mb-4">
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            className="w-6 h-6"
            tintColor="#303030"
          />
        </TouchableOpacity>
        <View>
          <Text className="font-pmedium text-sm text-neutral-40">
            Search Results
          </Text>
          <Text className="text-2xl font-pextrabold text-neutral-90">
            {query}
          </Text>
        </View>
      </View>
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

const Search = () => {
  const { query } = useLocalSearchParams();
  const [activeCategory, setActiveCategory] = useState("recipes");
  const [loading, setLoading] = useState(false);
  const {
    data: recipes,
    loading: recipesLoading,
    refetch: refetchRecipes,
  } = useFetch(async () => {
    const [recipesFromSpoonacular, recipesFromDatabase] = await Promise.all([
      searchRecipes(query),
      searchRecipe(query),
    ]);
    return [...recipesFromSpoonacular, ...recipesFromDatabase];
  });
  const {
    data: videos,
    loading: videosLoading,
    refetch: refetchVideos,
  } = useFetch(() => getCookingVideos(query));

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetchRecipes();
    await refetchVideos();
    setRefreshing(false);
  };

  useEffect(() => {
    refetchRecipes();
    refetchVideos();
  }, [query]);

  const searchByAi = async (query) => {
    setLoading(true);
    try {
      const res = await getRecipeByAi(query);

      //set generated recipe to database
      if (res.length > 0) {
        res.forEach(async (recipe) => {
          const {
            id,
            title,
            image,
            spoonacularScore,
            healthScore,
            readyInMinutes,
            servings,
            ingredients,
            instructions,
            nutrition,
          } = recipe;
          try {
            await addRecipe(
              id,
              title,
              image,
              spoonacularScore,
              healthScore,
              readyInMinutes,
              servings,
              ingredients,
              instructions,
              nutrition
            );
            refetchRecipes();
          } catch (err) {
            throw new Error(err);
          }
        });
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to search using AI, Please try again");
    } finally {
      setLoading(false);
    }
  };

  if (videosLoading || recipesLoading || loading) {
    return (
      <LoadingAnimation
        title={"Searching for recipes"}
        loading={videosLoading || recipesLoading || loading}
      />
    );
  }

  return (
    <SafeAreaView className="px-3 mt-5 pb-6 bg-white h-full">
      <FlatList
        data={activeCategory === "videos" ? videos : recipes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          if (activeCategory === "videos") {
            return <VideoCard video={item} containerStyles="mb-5" />;
          } else {
            return (
              <RecipeBox
                recipe={item}
                containerStyles="h-[200px] mb-14"
                onPress={() => router.push(`/recipe/${item.id}`)}
              />
            );
          }
        }}
        ListHeaderComponent={() => {
          return (
            <SearchHeader
              query={query}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          );
        }}
        ListFooterComponent={() => {
          if (activeCategory === "recipes") {
            return (
              <View className="items-center w-full my-2 mt-2">
                <Text className="font-pmedium text-base text-neutral-90 mr-1 text-center">
                  Didn't find what you are looking for?
                </Text>
                <Pressable onPress={() => searchByAi(query)}>
                  <Text className="text-base text-primary font-psemibold text-center">
                    Search by AI
                  </Text>
                </Pressable>
              </View>
            );
          }
        }}
        ListEmptyComponent={() => {
          return <EmptyState title={"Sorry the recipe is not available"} />;
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

export default Search;
