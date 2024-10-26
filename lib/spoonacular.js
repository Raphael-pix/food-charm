import axios from "axios"
const BASE_URL = "http://192.168.100.231:5000/api"

export const getRecipes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/random`);
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
export const getRecipeByCategory = async (category) => {
  try {
    const response = await axios.post(`${BASE_URL}/category/recipes`,{
      category:category
    });
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getRecipeDetails = async (id) => {
  try {
    const response = await axios.post(`${BASE_URL}/recipe/details`,{
      id: id
    });
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getSimilarRecipes = async (id) => {
  try {
    const response = await axios.post(`${BASE_URL}/recipe/similar`,{
      id:id
    });
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getRecipesInBulk = async (ids) => {
  try {
    const response = await axios.post(`${BASE_URL}/recipes/bulk`,{
      ids:ids
    });
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getMyFridgeRecipes = async (ingredients, cuisine, type, diet) => {
  try {
    const response = await axios.post(`${BASE_URL}/myFrige/recipes`,{
      ingredients:ingredients,
      cuisine:cuisine, 
      type:type, 
      diet:diet
    });
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getCookingVideos = async (query) => {
  try {
    const response = await axios.post(`${BASE_URL}/cookingVideos`,{
      query:query
    });
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const searchRecipes = async (query) => {
  try {
    const response = await axios.post(`${BASE_URL}/search`,{
      query:query
    });
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getRecipeByAi = async (query) => {
  try {
    const response = await axios.post(`${BASE_URL}/ai/recipes`,{
      query:query
    });
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const customizeRecipeByAi = async (recipe,modifications) => {
  try {
    const response = await axios.post(`${BASE_URL}/recipe/customize`,{
      currentRecipe:recipe,
      modifications:modifications
    });
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
export const modifyRecipeByAi = async (recipe) => {
  try {
    const response = await axios.post(`${BASE_URL}/myrecipe`,{
      myrecipe: recipe,
    });
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const myFridgeByAi = async (modifications) => {
  try {
    const response = await axios.post(`${BASE_URL}/myFridge/Ai`,{
      modifications: modifications,
    });
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};