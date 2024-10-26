const axios = require("axios");
require("dotenv").config();
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const getRecipes = async () => {
  try {
    const response = await axios.get(
      `${process.env.SPOONACULAR_BASE_URL}/recipes/random?number=20&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );
    const result = response.data.recipes;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
const getRecipeByCategory = async (category) => {
  try {
    const response = await axios.get(
      `${process.env.SPOONACULAR_BASE_URL}/recipes/complexSearch?type=${category}&addRecipeInformation=true&number=12&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );
    const result = response.data.results;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const getRecipeDetails = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.SPOONACULAR_BASE_URL}/recipes/${id}/information?includeNutrition=false&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const getSimilarRecipes = async (id) => {
  try {
    const response = await axios.get(
      `${process.env.SPOONACULAR_BASE_URL}/recipes/${id}/similar?number=5&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const getRecipesInBulk = async (ids) => {
  try {
    const response = await axios.get(
      `${
        process.env.SPOONACULAR_BASE_URL
      }/recipes/informationBulk?ids=${ids.join(",")}&apiKey=${
        process.env.SPOONACULAR_API_KEY
      }`
    );
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const getMyFridgeRecipes = async (ingredients, cuisine, type, diet) => {
  try {
    const response = await axios.get(
      `${
        process.env.SPOONACULAR_BASE_URL
      }/recipes/complexSearch?query=&includeIngredients=${ingredients.join(
        ","
      )}&cuisine=${cuisine.join(",")}&type=${type.join(",")}&diet=${diet.join(
        ","
      )}&addRecipeInformation=true&number=12&apiKey=${
        process.env.SPOONACULAR_API_KEY
      }`
    );
    const result = response.data.results;
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const getCookingVideos = async (query) => {
  try {
    const response = await axios.get(
      `${process.env.SPOONACULAR_BASE_URL}/food/videos/search?query=${query}&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );
    const result = response.data;
    return result.videos;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const searchRecipes = async (query) => {
  try {
    const response = await axios.get(
      `${process.env.SPOONACULAR_BASE_URL}/recipes/complexSearch?query=${query}&addRecipeInformation=true&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );
    const result = response.data;
    return result.results;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

//GEMINI

const generateRecipe = async (dishName) => {
  try {
    // Initialize the Generative AI instance with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const schema = {
      description: "List of recipes",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: {
            type: SchemaType.STRING,
            description: "Title of the recipe",
            nullable: false,
          },
          id: {
            type: SchemaType.STRING,
            description:
              " unique Id of the recipe starting with 'AI_' and then some values from uuidv4()",
            nullable: false,
          },
          image: {
            type: SchemaType.STRING,
            description:
              "image of the recipe, set value to: https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png",
            nullable: false,
          },
          spoonacularScore: {
            type: SchemaType.NUMBER,
            description:
              "a rating of the recipe(float data type) between 1 to 100",
            nullable: false,
          },
          healthScore: {
            type: SchemaType.NUMBER,
            description:
              "a description of how healthy the recipe is, between 1 to 100",
            nullable: false,
          },
          readyInMinutes: {
            type: SchemaType.INTEGER,
            description: "Time to prepare the recipe",
            nullable: false,
          },
          servings: {
            type: SchemaType.INTEGER,
            description: "Number of servings",
            nullable: false,
          },
          ingredients: {
            type: SchemaType.ARRAY,
            description: "List of ingredients",
            items: {
              type: SchemaType.OBJECT,
              properties: {
                id: { type: SchemaType.INTEGER },
                original: {
                  type: SchemaType.STRING,
                  description:
                    "name of the ingredient together with the measurement erg 1tbsp of vinegar",
                },
                name: { type: SchemaType.STRING },
                amount: { type: SchemaType.NUMBER },
                unit: { type: SchemaType.STRING },
              },
              required: ["id", "original", "name", "amount", "unit"],
            },
          },
          instructions: {
            type: SchemaType.ARRAY,
            description: "Step-by-step cooking instructions",
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: {
                  type: SchemaType.STRING,
                  description: "general title of the steps",
                },
                steps: {
                  type: SchemaType.ARRAY,
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      number: { type: SchemaType.INTEGER },
                      step: { type: SchemaType.STRING },
                    },
                  },
                },
              },
              required: ["steps", "name"],
            },
          },
          nutrition: {
            type: SchemaType.OBJECT,
            properties: {
              calories: { type: SchemaType.NUMBER },
              fat: { type: SchemaType.NUMBER },
              carbohydrates: { type: SchemaType.NUMBER },
              protein: { type: SchemaType.NUMBER },
            },
            required: ["calories", "fat", "carbohydrates", "protein"],
          },
        },
        required: [
          "id",
          "title",
          "readyInMinutes",
          "servings",
          "ingredients",
          "instructions",
          "nutrition",
        ],
      },
    };

    // Set up the model with generation configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const prompt = `Please provide a recipe for ${dishName}. Include details like title, time, servings, ingredients (with id, original, name, amount, and unit), step-by-step instructions, and nutritional info (calories, fat, carbohydrates, protein).`;

    const result = await model.generateContent(prompt);

    const recipeData = result.response.text();

    return JSON.parse(recipeData);
  } catch (error) {
    console.error("Error generating recipe:", error.message);
    throw error;
  }
};

const customizeRecipe = async (recipe, modifications) => {
  try {
    // Initialize the Generative AI instance with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Define the schema for the recipe response
    const schema = {
      description: "List of recipes",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: {
            type: SchemaType.STRING,
            description: "Title of the recipe",
            nullable: false,
          },
          id: {
            type: SchemaType.STRING,
            description:
              " unique Id of the recipe starting with 'AI_' and then some values from uuidv4()",
            nullable: false,
          },
          image: {
            type: SchemaType.STRING,
            description:
              "image of the recipe, set value to: https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png",
            nullable: false,
          },
          spoonacularScore: {
            type: SchemaType.NUMBER,
            description:
              "a rating of the recipe(float data type) between 1 to 100",
            nullable: false,
          },
          healthScore: {
            type: SchemaType.NUMBER,
            description:
              "a description of how healthy the recipe is, between 1 to 100",
            nullable: false,
          },
          readyInMinutes: {
            type: SchemaType.INTEGER,
            description: "Time to prepare the recipe",
            nullable: false,
          },
          servings: {
            type: SchemaType.INTEGER,
            description: "Number of servings",
            nullable: false,
          },
          ingredients: {
            type: SchemaType.ARRAY,
            description: "List of ingredients",
            items: {
              type: SchemaType.OBJECT,
              properties: {
                id: { type: SchemaType.INTEGER },
                original: {
                  type: SchemaType.STRING,
                  description:
                    "name of the ingredient together with the measurement erg 1tbsp of vinegar",
                },
                name: { type: SchemaType.STRING },
                amount: { type: SchemaType.NUMBER },
                unit: { type: SchemaType.STRING },
              },
              required: ["id", "original", "name", "amount", "unit"],
            },
          },
          instructions: {
            type: SchemaType.ARRAY,
            description: "Step-by-step cooking instructions",
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: {
                  type: SchemaType.STRING,
                  description: "general title of the steps",
                },
                steps: {
                  type: SchemaType.ARRAY,
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      number: { type: SchemaType.INTEGER },
                      step: { type: SchemaType.STRING },
                    },
                  },
                },
              },
              required: ["steps", "name"],
            },
          },
          nutrition: {
            type: SchemaType.OBJECT,
            properties: {
              calories: { type: SchemaType.NUMBER },
              fat: { type: SchemaType.NUMBER },
              carbohydrates: { type: SchemaType.NUMBER },
              protein: { type: SchemaType.NUMBER },
            },
            required: ["calories", "fat", "carbohydrates", "protein"],
          },
        },
        required: [
          "id",
          "title",
          "readyInMinutes",
          "servings",
          "ingredients",
          "instructions",
          "nutrition",
        ],
      },
    };

    // Set up the model with generation configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const prompt = `Please modify the following recipe: ${recipe} using the given instructions: ${modifications}  `;

    const result = await model.generateContent(prompt);

    const recipeData = result.response.text();

    return JSON.parse(recipeData);
  } catch (error) {
    console.error("Error generating recipe:", error.message);
    throw error;
  }
};

const modifyRecipe = async (recipe) => {
  try {
    // Initialize the Generative AI instance with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Define the schema for the recipe response
    const schema = {
      description: "recipe created by the user",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: {
            type: SchemaType.STRING,
            description: "Title of the recipe",
            nullable: false,
          },
          id: {
            type: SchemaType.STRING,
            description:
              " unique Id of the recipe starting with 'AI_' and then some values from uuidv4()",
            nullable: false,
          },
          image: {
            type: SchemaType.OBJECT,
            properties: {
              fileName: { type: SchemaType.STRING },
              fileSize: { type: SchemaType.INTEGER },
              height: { type: SchemaType.INTEGER },
              mimeType: { type: SchemaType.STRING },
              type: { type: SchemaType.STRING },
              uri: { type: SchemaType.STRING },
              width: { type: SchemaType.INTEGER },
            },
            required: [
              "fileName",
              "fileSize",
              "height",
              "mimeType",
              "type",
              "uri",
              "width",
            ],
            nullable: false,
          },
          spoonacularScore: {
            type: SchemaType.NUMBER,
            description:
              "a rating of the recipe(float data type) between 1 to 100",
            nullable: false,
          },
          healthScore: {
            type: SchemaType.INTEGER,
            description:
              "a description of how healthy the recipe is, between 1 to 100",
            nullable: false,
          },
          readyInMinutes: {
            type: SchemaType.INTEGER,
            description: "Time to prepare the recipe",
            nullable: false,
          },
          servings: {
            type: SchemaType.INTEGER,
            description: "Number of servings",
            nullable: false,
          },
          ingredients: {
            type: SchemaType.ARRAY,
            description: "List of ingredients",
            items: {
              type: SchemaType.OBJECT,
              properties: {
                id: { type: SchemaType.INTEGER },
                original: {
                  type: SchemaType.STRING,
                  description:
                    "name of the ingredient together with the measurement erg 1tbsp of vinegar",
                },
                name: { type: SchemaType.STRING },
                amount: { type: SchemaType.NUMBER },
                unit: { type: SchemaType.STRING },
              },
              required: ["id", "original", "name", "amount", "unit"],
            },
          },
          instructions: {
            type: SchemaType.ARRAY,
            description: "Step-by-step cooking instructions",
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: {
                  type: SchemaType.STRING,
                  description: "general title of the steps",
                },
                steps: {
                  type: SchemaType.ARRAY,
                  description: "the actual cooking instruction",
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      number: {
                        type: SchemaType.INTEGER,
                        nullable: false,
                      },
                      step: {
                        type: SchemaType.STRING,
                        nullable: false,
                      },
                    },
                  },
                },
              },
              required: ["name", "steps"],
            },
          },
          nutrition: {
            type: SchemaType.OBJECT,
            properties: {
              calories: { type: SchemaType.NUMBER },
              fat: { type: SchemaType.NUMBER },
              carbohydrates: { type: SchemaType.NUMBER },
              protein: { type: SchemaType.NUMBER },
            },
            required: ["calories", "fat", "carbohydrates", "protein"],
          },
        },
        required: [
          "id",
          "title",
          "readyInMinutes",
          "servings",
          "ingredients",
          "instructions",
          "nutrition",
        ],
      },
    };

    // Set up the model with generation configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const prompt = `Use the following recipe: ${JSON.stringify(
      recipe
    )}.Do not modify or change the provided ingredients or instructions. Follow this schema strictly: ${JSON.stringify(
      schema
    )}.Return the recipe exactly as provided, but format it according to the schema.`;

    const result = await model.generateContent(prompt);

    const recipeData = result.response.text();
    return JSON.parse(recipeData);
  } catch (error) {
    console.error("Error generating recipe:", error.message);
    throw error;
  }
};

const getmyFridgeRecipeByAi = async (modifications) => {
  try {
    // Initialize the Generative AI instance with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Define the schema for the recipe response
    const schema = {
      description: "List of recipes",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: {
            type: SchemaType.STRING,
            description: "Title of the recipe",
            nullable: false,
          },
          id: {
            type: SchemaType.STRING,
            description:
              " unique Id of the recipe starting with 'AI_' and then some values from uuidv4()",
            nullable: false,
          },
          image: {
            type: SchemaType.STRING,
            description:
              "image of the recipe, set value to: https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png",
            nullable: false,
          },
          spoonacularScore: {
            type: SchemaType.NUMBER,
            description:
              "a rating of the recipe(float data type) between 1 to 100",
            nullable: false,
          },
          healthScore: {
            type: SchemaType.NUMBER,
            description:
              "a description of how healthy the recipe is, between 1 to 100",
            nullable: false,
          },
          readyInMinutes: {
            type: SchemaType.INTEGER,
            description: "Time to prepare the recipe",
            nullable: false,
          },
          servings: {
            type: SchemaType.INTEGER,
            description: "Number of servings",
            nullable: false,
          },
          ingredients: {
            type: SchemaType.ARRAY,
            description: "List of ingredients",
            items: {
              type: SchemaType.OBJECT,
              properties: {
                id: { type: SchemaType.INTEGER },
                original: {
                  type: SchemaType.STRING,
                  description:
                    "name of the ingredient together with the measurement erg 1tbsp of vinegar",
                },
                name: { type: SchemaType.STRING },
                amount: { type: SchemaType.NUMBER },
                unit: { type: SchemaType.STRING },
              },
              required: ["id", "original", "name", "amount", "unit"],
            },
          },
          instructions: {
            type: SchemaType.ARRAY,
            description: "Step-by-step cooking instructions",
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: {
                  type: SchemaType.STRING,
                  description: "general title of the steps",
                },
                steps: {
                  type: SchemaType.ARRAY,
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      number: { type: SchemaType.INTEGER },
                      step: { type: SchemaType.STRING },
                    },
                  },
                },
              },
              required: ["steps", "name"],
            },
          },
          nutrition: {
            type: SchemaType.OBJECT,
            properties: {
              calories: { type: SchemaType.NUMBER },
              fat: { type: SchemaType.NUMBER },
              carbohydrates: { type: SchemaType.NUMBER },
              protein: { type: SchemaType.NUMBER },
            },
            required: ["calories", "fat", "carbohydrates", "protein"],
          },
        },
        required: [
          "id",
          "title",
          "readyInMinutes",
          "servings",
          "ingredients",
          "instructions",
          "nutrition",
        ],
      },
    };

    // Set up the model with generation configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const prompt = `Using the data provided from the : ${JSON.stringify(
      modifications
    )}, recommend for me suitable recipes.`;

    const result = await model.generateContent(prompt);

    const recipeData = result.response.text();

    return JSON.parse(recipeData);
  } catch (error) {
    console.error("Error generating recipe:", error.message);
    throw error;
  }
};

module.exports = {
  getRecipes,
  getRecipeByCategory,
  getRecipeDetails,
  getSimilarRecipes,
  getRecipesInBulk,
  getMyFridgeRecipes,
  getCookingVideos,
  searchRecipes,
  generateRecipe,
  customizeRecipe,
  modifyRecipe,
  getmyFridgeRecipeByAi,
};
