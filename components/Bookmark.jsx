import { TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { getSavedRecipes, saveRecipe } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";
import useFetch from "../lib/useFetch";
import { icons } from "../constants";

const BookmarkComponent = ({ recipe, containerStyles, imageStyles }) => {
  const { user } = useGlobalContext();
  const { data: savedRecipes, refetch } = useFetch(() =>
    getSavedRecipes(user.$id)
  );
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (savedRecipes) {
      const recipeIds = savedRecipes.map((recipe) => recipe.title);
      setIsSaved(recipeIds.includes(recipe.title));
    }
  }, [savedRecipes, recipe.title]);
  
  const handleSaveRecipe = async () => {
    await saveRecipe(recipe, user.$id);
    refetch();
    if (savedRecipes) {
      const recipeIds = savedRecipes.map((recipe) => recipe.$id);
      setIsSaved(recipeIds.includes(recipe.$id));
    }
  };

  return (
    <TouchableOpacity
      className={`bg-white w-6 h-6 rounded-full items-center justify-center ${containerStyles}`}
      activeOpacity={0.7}
      onPress={handleSaveRecipe}
    >
      <Image
        source={icons.bookmark}
        resizeMode="contain"
        className={`w-4 h-4 ${imageStyles}`}
        tintColor={isSaved ? "#E23E3E" : "#000"}
      />
    </TouchableOpacity>
  );
};

export default BookmarkComponent;
