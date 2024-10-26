const {
  generateRecipe,
  getRecipes,
  getRecipeByCategory,
  getRecipeDetails,
  getSimilarRecipes,
  getRecipesInBulk,
  getCookingVideos,
  searchRecipes,
  customizeRecipe,
  modifyRecipe,
  getMyFridgeRecipes,
  getmyFridgeRecipeByAi,
} = require("./spoonacular");

const FetchRecipes = async (req, res) => {
  try {
    const recipes = await getRecipes();
    return res.status(200).json(recipes);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch recipes. Please try again" });
  }
};

const FetchRecipeByAi = async (req, res) => {
  const { query } = req.body;

  try {
    const recipe = await generateRecipe(query);
    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({
      error:
        "Failed to generate recipe due to safety concerns or parsing issues",
    });
  }
};

const fetchRecipesByCategory = async (req, res) => {
  const { category } = req.body;

  try {
    const recipes = await getRecipeByCategory(category);
    return res.status(200).json(recipes);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch recipes. Please try again" });
  }
};

const fetchRecipeDetails = async (req, res) => {
  const { id } = req.body;

  try {
    const recipe = await getRecipeDetails(id);
    return res.status(200).json(recipe);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch recipe details.Please try again" });
  }
};

const fetchSimilarRecipes = async (req, res) => {
  const { id } = req.body;

  try {
    const recipes = await getSimilarRecipes(id);
    return res.status(200).json(recipes);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch similar recipes.Please try again" });
  }
};

const fetchRecipesInBulk = async (req, res) => {
  const { ids } = req.body;

  try {
    const recipes = await getRecipesInBulk(ids);
    return res.status(200).json(recipes);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch recipes.Please try again" });
  }
};

const fetchMyFridgeRecipes = async (req, res) => {
  const { ingredients, cuisine, type, diet } = req.body;

  try {
    const recipes = await getMyFridgeRecipes(ingredients, cuisine, type, diet);
    return res.status(200).json(recipes);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to generate recipes.Please try again" });
  }
};

const fetchCookingVideos = async (req, res) => {
  const { query } = req.body;

  try {
    const videos = await getCookingVideos(query);
    return res.status(200).json(videos);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch cooking videos.Please try again" });
  }
};

const searchRecipe = async (req, res) => {
  const { query } = req.body;

  try {
    const recipes = await searchRecipes(query);
    return res.status(200).json(recipes);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to search for recipes.Please try again" });
  }
};

const customizeRecipeByAi = async (req, res) => {
  const { currentRecipe, modifications } = req.body;

  try {
    const recipe = await customizeRecipe(currentRecipe, modifications);
    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({
      error:
        "Failed to generate recipe due to safety concerns or parsing issues",
    });
  }
};

const modifyRecipeByAi = async (req, res) => {
  const { myrecipe } = req.body;
  try {
    const recipe = await modifyRecipe(myrecipe);
    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({
      error:
        "Failed to generate recipe due to safety concerns or parsing issues",
    });
  }
};

const myFridgeByAi = async (req, res) => {
  const { modifications } = req.body;

  try {
    const recipe = await getmyFridgeRecipeByAi(modifications);
    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({
      error:
        "Failed to generate recipe due to safety concerns or parsing issues",
    });
  }
};

module.exports = {
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
};
