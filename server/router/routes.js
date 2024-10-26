const express = require("express");
const {
  FetchRecipes,
  FetchRecipeByAi,
  fetchRecipesByCategory,
  fetchRecipeDetails,
  fetchSimilarRecipes,
  fetchRecipesInBulk,
  fetchMyFridgeRecipes,
  fetchCookingVideos,
  searchRecipe,
  customizeRecipeByAi,
  modifyRecipeByAi,
  myFridgeByAi,
} = require("../controllers/spoonacular_controller");

const router = express.Router();

router.get("/recipes/random", FetchRecipes);
router.post("/ai/recipes", FetchRecipeByAi);
router.post("/category/recipes", fetchRecipesByCategory);
router.post("/recipe/details", fetchRecipeDetails);
router.post("/recipe/similar", fetchSimilarRecipes);
router.post("/recipes/bulk", fetchRecipesInBulk);
router.post("/myFrige/recipes", fetchMyFridgeRecipes);
router.post("/cookingVideos", fetchCookingVideos);
router.post("/search", searchRecipe);
router.post("/recipe/customize", customizeRecipeByAi);
router.post("/myrecipe", modifyRecipeByAi);
router.post("/myFridge/Ai",myFridgeByAi);

module.exports = router;
