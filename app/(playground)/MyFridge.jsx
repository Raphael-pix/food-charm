import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { icons } from "../../constants";
import {
  CustomButton,
  RecipeBox,
  MyPantry,
  EmptyState,
  LoadingAnimation,
} from "../../components/index";
import { cuisine, ingredients, diet, types } from "../../lib/dummydata";
import { getMyFridgeRecipes, myFridgeByAi } from "../../lib/spoonacular.js";
import { addRecipe } from "../../lib/appwrite.js";

const FilterBox = ({ selectedFilters, setSelectedFilters, filters }) => {
  const handleSelectFilter = (filter, filterType) => {
    setSelectedFilters((prevState) => {
      const updatedFilters = { ...prevState };

      // Toggle the filter (add/remove)
      if (updatedFilters[filterType].includes(filter)) {
        // Remove the filter if it's already selected
        updatedFilters[filterType] = updatedFilters[filterType].filter(
          (f) => f !== filter
        );
      } else {
        // Add the filter if it's not already selected
        updatedFilters[filterType].push(filter);
      }

      return updatedFilters;
    });
  };
  const isFilterSelected = (filter, filterType) => {
    return selectedFilters[filterType].includes(filter);
  };

  return (
    <View className="w-full rounded-xl bg-white mb-4">
      <FlatList
        data={filters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View className="mb-2">
              <View className="flex-row flex-wrap  gap-2">
                {item.data.map((filter, index) => (
                  <Pressable
                    key={index}
                    className={`${
                      isFilterSelected(filter.name, item.title)
                        ? "bg-primary"
                        : "bg-white"
                    } p-2 px-4 border border-neutral-20 rounded-xl`}
                    activeOpacity={0.9}
                    onPress={() => handleSelectFilter(filter.name, item.title)} // item.type is 'cate
                  >
                    <Text
                      className={`${
                        isFilterSelected(filter.name, item.title)
                          ? "text-white"
                          : "text-neutral-90"
                      } text-sm font-pmedium `}
                    >
                      {filter.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const MyFridgeHeader = ({ selectedFilters, setSelectedFilters }) => {
  return (
    <View>
      <FilterBox
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        filters={ingredients}
      />
    </View>
  );
};

const OtherSections = ({
  selectedFilters,
  setSelectedFilters,
  filter: { index, name, data },
}) => {
  const [expandedSections, setExpandedSections] = useState([]);
  const toggleSection = (id) => {
    setExpandedSections((prevState) =>
      prevState.includes(id)
        ? prevState.filter((index) => index !== id)
        : [...prevState, id]
    );
  };
  return (
    <View className="my-2">
      <View>
        <View className="flex-row items-center justify-between my-2">
          <Text className="text-lg text-neutral-90 font-pmedium mb-2">
            {name}
          </Text>
          <TouchableOpacity
            className="ml-2 px-2 justify-center items-center"
            activeOpacity={0.8}
            onPress={() => toggleSection(index)}
          >
            <Image
              source={expandedSections.includes(index) ? icons.down : icons.up}
              className="w-4 h-4"
              resizeMode="contain"
              tintColor="#303030"
            />
          </TouchableOpacity>
        </View>
        {expandedSections.includes(index) && (
          <FilterBox
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            filters={data}
          />
        )}
      </View>
    </View>
  );
};

const RecipesFound = ({ recipes }) => {
  return (
    <View className="my-4">
      <Text className="font-psemibold text-lg text-neutral-90 mb-2">
        Results
      </Text>
      <FlatList
        data={recipes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const { id, title, image, spoonacularScore } = item;
          const recipe = {
            id: id,
            title: title,
            image: image,
            spoonacularScore: spoonacularScore,
          };
          return (
            <RecipeBox
              recipe={recipe}
              containerStyles="w-[200px] h-[200px] mb-14"
              onPress={() => router.push(`/recipe/${id}`)}
            />
          );
        }}
        ListEmptyComponent={() => {
          return (
            <EmptyState
              title={"Unable to suggest a suitable recipe at the moment"}
              subtitle={"Please try agiain"}
            />
          );
        }}
        horizontal
      />
    </View>
  );
};

const MyFridge = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    cuisine: [],
    categories: [],
    ingredients: [],
    diet: [],
  });
  const [value, setValue] = useState("");
  const [showPantry, setShowPantry] = useState(false);
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(false);
  const filters = [
    {
      index: 0,
      name: "Categories",
      data: types,
    },
    {
      index: 1,
      name: "Cusine",
      data: cuisine,
    },
    {
      index: 2,
      name: "Diet",
      data: diet,
    },
  ];

  const submit = async () => {
    const { ingredients, cuisine, categories, diet } = selectedFilters;
    setLoading(true);
    try {
      const res = await getMyFridgeRecipes(
        ingredients,
        cuisine,
        categories,
        diet
      );
      const result = await myFridgeByAi(JSON.stringify(selectedFilters));
      let addedRecipes;
      if (result.length > 0) {
        result.forEach(async (recipe) => {
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
           const response = await addRecipe(
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
            //TODO: set recipes from db to our results
            console.log("recipe added successfully");
          } catch (err) {
            throw new Error(err);
          }
        });

        setRecipes(res.concat(result) || []);
      }
    } catch (err) {
      Alert.alert("Error", err);
    } finally {
      setLoading(false);
    }
  };

  if (showPantry) {
    return (
      <MyPantry
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        setShowPantry={setShowPantry}
      />
    );
  }

  if(loading){
    return (
      <View className="h-full bg-white items-center justify-center">
        <LoadingAnimation title={"Searching suitable recipes"} loading={loading}/>
      </View>
    );
  }

  return (
    <SafeAreaView className="h-full bg-white p-4">
      <View className="mb-4">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="mb-2"
        >
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            className="w-6 h-6"
            tintColor={"#303030"}
          />
        </TouchableOpacity>
        <View className="flex-row w-full items-center justify-between">
          <Text className="text-2xl text-neutral-90 font-pbold ml-2">
            What's in your fridge?
          </Text>
          <Pressable
            className="ml-2 p-2 justify-center items-center relative"
            onPress={() => setShowPantry(true)}
          >
            <Image
              source={icons.pantry}
              resizeMode="contain"
              className="w-6 h-6"
              tintColor="#303030"
            />
            {(selectedFilters["cuisine"].length > 0 ||
              selectedFilters["categories"].length > 0 ||
              selectedFilters["ingredients"].length > 0 ||
              selectedFilters["diet"].length > 0) && (
              <View className="w-2 h-2 rounded-full bg-primary absolute top-[6px] right-2" />
            )}
          </Pressable>
        </View>
      </View>
      <View>
        <Text className="text-lg text-neutral-90 font-pmedium mb-2 capitalize">
          Ingredients
        </Text>
        <View className="w-full h-12 p-2 mb-2 border border-neutral-20 rounded-xl flex-row justify-between items-center">
          <TextInput
            className="flex-1 text-neutral-90 font-pmedium text-base"
            placeholder="Add your ingredient"
            placeholderTextColor="#D9D9D9"
            value={value}
            onChangeText={(e) => setValue(e)}
            onSubmitEditing={() => {
              setSelectedFilters((prevState) => {
                const updatedFilters = { ...prevState };
                if (updatedFilters["ingredients"].includes(value.trim())) {
                  return updatedFilters;
                } else {
                  updatedFilters["ingredients"].push(value.trim());
                }
                setValue("");
                return updatedFilters;
              });
            }}
          />
        </View>
      </View>
      <FlatList
        data={filters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <OtherSections
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              filter={item}
            />
          );
        }}
        ListHeaderComponent={() => {
          return (
            <MyFridgeHeader
              value={value}
              setValue={setValue}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              setShowPantry={setShowPantry}
            />
          );
        }}
        ListFooterComponent={() => {
          return (
            <View>
              <CustomButton
                title={"Find recipes"}
                handlePress={submit}
                otherStyles={"my-2"}
              />
              {recipes && <RecipesFound recipes={recipes} />}
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default MyFridge;
