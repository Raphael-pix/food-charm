import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import {
  RecipeBox,
  EmptyState,
  CustomButton,
  LoadingAnimation,
} from "../../components/index";
import useFetch from "../../lib/useFetch";
import {
  customizeRecipeByAi,
  getRecipeDetails,
  searchRecipes,
} from "../../lib/spoonacular";
import { icons } from "../../constants";
import { router } from "expo-router";

const SearchRecipe = ({
  query,
  setQuery,
  setRecipes,
  recipes,
  selectedRecipe,
  setSelectedRecipe,
  handleNext,
}) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await searchRecipes(query);
      setRecipes(res);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="h-full bg-white items-center justify-center">
        <LoadingAnimation
          title={"Searching suitable recipes"}
          loading={loading}
        />
      </View>
    );
  }

  return (
    <View className="h-full">
      <View className="border border-neutral-20 rounded-xl w-full py-3 px-4 items-center justify-between flex-row mb-4">
        <Image
          source={icons.search}
          className="w-5 h-5"
          resizeMode="contain"
          tintColor="#D9D9D9"
        />
        <TextInput
          className="flex-1 text-neutral-90 font-pmedium text-base mx-4"
          placeholder={"Search Recipes"}
          placeholderTextColor="#D9D9D9"
          value={query}
          onChangeText={(e) => setQuery(e)}
          onSubmitEditing={handleSubmit}
        />
      </View>
      <FlatList
        data={recipes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <RecipeBox
              recipe={item}
              containerStyles={`h-[200px] mb-14 ${
                selectedRecipe === item.id
                  ? "border-2 border-green-100 rounded-xl"
                  : ""
              }`}
              onPress={() => setSelectedRecipe(item.id)}
            />
          );
        }}
        ListEmptyComponent={() => {
          return (
            <EmptyState
              title={"No recipes found"}
              subtitle={"Please search for a recipe"}
            />
          );
        }}
        ListHeaderComponent={() => {
          if (recipes.length > 0)
            return (
              <Text className="text-neutral-80 font-psemibold text-lg mb-2">
                Results
              </Text>
            );
        }}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        key={2}
        numColumns={2}
      />
      <View className="w-full items-end">
        <CustomButton
          title={"Next"}
          otherStyles={"p-2 px-4"}
          handlePress={handleNext}
          disabled={!selectedRecipe}
        />
      </View>
    </View>
  );
};

const ModifyRecipe = ({
  selectedRecipe,
  customText,
  setCustomText,
  modifiedRecipe,
  setModifiedRecipe,
  handleNext,
  handleBack,
}) => {
  const [modifying, setModifying] = useState(false);
  const { data: recipe, loading } = useFetch(() =>
    getRecipeDetails(selectedRecipe)
  );

  if (loading) {
    return (
      <View className="h-full bg-white items-center justify-center">
        <LoadingAnimation
          title={"Obtaining recipe, Please wait"}
          loading={loading}
        />
      </View>
    );
  }

  const handleSubmit = async () => {
    setModifying(true);
    try {
      const res = await customizeRecipeByAi(JSON.stringify(recipe), customText);
      setModifiedRecipe(res[0]);
    } catch (err) {
      Alert.alert("error", err);
    } finally {
      setModifying(false);
    }
  };

  if (modifying) {
    return (
      <View className="h-full bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#E23E3E" />
        <Text className="text-base text-neutral-90 font-pmedium mt-2">
          modifying, Please wait
        </Text>
      </View>
    );
  }
  if (!modifiedRecipe) handleNext;
  return (
    <View className="h-full">
      <FlatList
        data={recipe.analyzedInstructions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View className="mb-4">
              {item.steps.map((step, index) => {
                return (
                  <View key={index} className="flex-row items-start mb-2 ">
                    <View className="bg-green-100 w-2 h-2 rounded-full mt-2 mr-2" />
                    <Text className="text-neutral-60 text-sm font-pregular">
                      {step.step}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        }}
        ListHeaderComponent={() => {
          const {
            image,
            title,
            readyInMinutes,
            servings,
            healthScore,
            extendedIngredients,
          } = recipe;
          return (
            <View className="mb-2">
              <View className="flex-row items-center space-x-2 mb-2">
                <View className="w-16 h-16 rounded-xl">
                  <Image
                    source={{ uri: image }}
                    resizeMode="cover"
                    className="w-full h-full rounded-xl"
                  />
                </View>
                <View className="flex-1 flex-wrap">
                  <Text className="w-full text-neutral-90 text-lg font-psemibold mb-1">
                    {title}
                  </Text>
                  <View className="flex-row justify-between items-center w-full">
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
                </View>
              </View>
              <Text className="text-neutral-90 text-base font-psemibold">
                Ingredients
              </Text>
              <View className="mt-2 space-y-2">
                <FlatList
                  data={extendedIngredients}
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
        }}
        showsVerticalScrollIndicator={false}
      />
      <View className="my-2">
        <Text className="text-neutral-90 text-base font-psemibold mb-2">
          How do you want to customize your recipe?
        </Text>
        <View className="border border-neutral-20 rounded-xl w-full p-2 items-center justify-between flex-row mb-4">
          <TextInput
            className="flex-1 text-neutral-90 font-pmedium text-base mx-4"
            placeholder={
              "Give a brief description of how you want to change the recipe"
            }
            placeholderTextColor="#D9D9D9"
            // multiline={true}
            value={customText}
            onChangeText={(e) => setCustomText(e)}
            onSubmitEditing={handleSubmit}
          />
        </View>
      </View>
      <View className="flex-row w-full items-center justify-between">
        <CustomButton
          title={"Back"}
          otherStyles={"p-2 px-4 bg-white"}
          textStyles={"text-primary font-pregular text-sm"}
          handlePress={handleBack}
        />
        <CustomButton
          title={"Next"}
          otherStyles={"p-2 px-4"}
          handlePress={handleNext}
          disabled={!modifiedRecipe}
        />
      </View>
    </View>
  );
};

const CustomizedRecipe = ({ handleBack, modifiedRecipe }) => {
  return (
    <View className="h-full">
      <FlatList
        data={modifiedRecipe.instructions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View className="mb-4">
              {item.steps.map((step, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <View className="bg-green-100 w-2 h-2 rounded-full mt-2 mr-2" />
                  <Text className="text-neutral-60 text-sm font-pregular">
                    {step.step}
                  </Text>
                </View>
              ))}
            </View>
          );
        }}
        ListHeaderComponent={() => {
          const {
            image,
            title,
            readyInMinutes,
            servings,
            healthScore,
            ingredients,
          } = modifiedRecipe;
          return (
            <View>
              <View className="flex-row items-center space-x-2 mb-2">
                <View className="w-16 h-16 rounded-xl">
                  <Image
                    source={{ uri: image }}
                    resizeMode="cover"
                    className="w-full h-full rounded-xl"
                  />
                </View>
                <View className="flex-1 flex-wrap">
                  <Text className="w-full text-neutral-90 font-psemibold mb-2">
                    {title}
                  </Text>
                  <View className="flex-row justify-between items-center w-full">
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
                </View>
              </View>
              <Text className="text-neutral-90 text-base font-psemibold">
                Ingredients
              </Text>
              <View className="mt-2 space-y-2">
                <FlatList
                  data={ingredients}
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
        }}
        showsVerticalScrollIndicator={false}
        className="h-full"
      />
      <View className="flex-row w-full items-center justify-between">
        <CustomButton
          title={"Back"}
          otherStyles={"p-2 px-4 bg-white"}
          textStyles={"text-primary font-pregular text-sm"}
          handlePress={handleBack}
        />
      </View>
    </View>
  );
};

const CustomizeRecipe = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modifiedRecipe, setModifiedRecipe] = useState(null);
  const [customText, setCustomText] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  const goToPreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <SafeAreaView className="h-full bg-white p-4">
      <View>
        <View className="flex-row items-center mb-1">
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              className="w-6 h-6"
              tintColor={"#303030"}
            />
          </TouchableOpacity>
          <Text className="text-2xl text-neutral-90 font-psemibold mr-2">
            Customize Your Recipe
          </Text>
        </View>
        <Text className="text-neutral-40 font-pmedium text-sm">
          Change your recipe to fit you!
        </Text>
      </View>
      <ProgressSteps
        activeLabelColor="#E23E3E"
        activeStepIconBorderColor="#E23E3E"
        completedStepIconColor="#E23E3E"
        completedProgressBarColor="#E23E3E"
        activeStep={currentStep}
      >
        <ProgressStep
          label="Find recipe"
          removeBtnRow={true}
          scrollable={false}
        >
          <SearchRecipe
            query={query}
            setQuery={setQuery}
            setRecipes={setRecipes}
            recipes={recipes}
            selectedRecipe={selectedRecipe}
            setSelectedRecipe={setSelectedRecipe}
            handleNext={goToNextStep}
          />
        </ProgressStep>
        <ProgressStep
          label="modify recipe"
          scrollable={false}
          removeBtnRow={true}
        >
          <ModifyRecipe
            selectedRecipe={selectedRecipe}
            customText={customText}
            setCustomText={setCustomText}
            modifiedRecipe={modifiedRecipe}
            setModifiedRecipe={setModifiedRecipe}
            handleBack={goToPreviousStep}
            handleNext={goToNextStep}
          />
        </ProgressStep>
        <ProgressStep label="results" scrollable={false} removeBtnRow={true}>
          <CustomizedRecipe
            modifiedRecipe={modifiedRecipe}
            handleBack={goToPreviousStep}
          />
        </ProgressStep>
      </ProgressSteps>
    </SafeAreaView>
  );
};

export default CustomizeRecipe;
