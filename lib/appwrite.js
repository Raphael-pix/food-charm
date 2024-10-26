import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";
import { modifyRecipeByAi } from "./spoonacular";
import { appwriteConfig } from "./config";


const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videosCollectionId,
  recipesCollectionId,
  storageId,
} = appwriteConfig;

const client = new Client();

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (email, password, username, bio) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
      bio
    );
    if (!newAccount) throw new Error();

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        bio: bio,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const updateCurrentUser = async (id, email, username, avatar, bio) => {
  try {
    const avatarUrl = await uploadFile(avatar, "image");

    const updatedUser = await databases.updateDocument(
      databaseId,
      userCollectionId,
      id,
      {
        email: email,
        username: username,
        bio: bio,
        avatar: avatarUrl,
      }
    );

    return updatedUser;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getUserDetails = async (userId) => {
  try {
    const user = await databases.listDocuments(databaseId, userCollectionId, [
      Query.equal("$id", userId),
    ]);
    return user.documents;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getPopularRecipes = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      recipesCollectionId,
      [Query.greaterThanEqual("spoonacularScore", 60)]
    );
    return posts.documents;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const searchVideos = async (query) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videosCollectionId,
      [Query.search("title", query)]
    );
    return posts.documents;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
export const searchRecipe = async (query) => {
  try {
    const recipe = await databases.listDocuments(
      databaseId,
      recipesCollectionId,
      [Query.search("title", query)]
    );
    return recipe.documents;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getUserVideos = async (userId) => {
  try {
    const videos = await databases.listDocuments(
      databaseId,
      videosCollectionId,
      [Query.equal("creator", userId)]
    );
    return videos.documents;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getUserRecipes = async (userId) => {
  try {
    const recipes = await databases.listDocuments(
      databaseId,
      recipesCollectionId,
      [Query.equal("creator", userId)]
    );
    return recipes.documents;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getAllCreators = async () => {
  try {
    const creators = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.orderDesc("$createdAt")]
    );
    return creators.documents;
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};

export const signout = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (err) {
    throw new Error(err);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("invalid file type");
    }
    if (!fileUrl) {
      throw new Error();
    }

    return fileUrl;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (err) {
    throw new Error(err);
  }
};

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        caption: form.caption,
        duration:form.video.duration,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteVideo = async (videoId) => {
  try {
    const result = await databases.deleteDocument(
      databaseId,
      videosCollectionId,
      videoId
    );
    console.log("video deleted sucessfully");
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

export const saveVideo = async (videoId, userId) => {
  try {
    const user = await databases.getDocument(
      databaseId,
      userCollectionId,
      userId
    );
    const currentSaves = user.savedVideos || [];

    if (!currentSaves.includes(videoId)) {
      await databases.updateDocument(databaseId, userCollectionId, userId, {
        savedVideos: [...currentSaves, videoId],
      });
      console.log("Recipe saved successfully.");
    } else {
      const filteredSaves = await currentSaves.filter(item => item !== videoId);
      await databases.updateDocument(databaseId, userCollectionId, userId, {
        savedVideos: filteredSaves,
      });
      console.log("Recipe removed sucessfully.");
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const getSavedVideos = async (userId) => {
  try {
    const user = await databases.getDocument(
      databaseId,
      userCollectionId,
      userId
    );
    const currentSaves = user.savedVideos || [];
    return currentSaves;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const getAllRecipes = async () => {
  try {
    const recipes = await databases.listDocuments(
      databaseId,
      recipesCollectionId,
      [Query.orderDesc("$createdAt")]
    );
    return recipes.documents;
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};

export const saveRecipe = async (recipe, userId) => {
  try {
    // Check if recipe already exists in the database
    const recipeCheck = await databases.listDocuments(
      databaseId,
      recipesCollectionId,
      [Query.equal("title", recipe.title)]
    );

    // If recipe exists, just add it to the user's saved recipes
    if (recipeCheck.documents.length > 0) {
      const recipeId = recipeCheck.documents[0].$id
      const user = await databases.getDocument(
        databaseId,
        userCollectionId,
        userId
      );
      const currentSaves = user.savedRecipes || [];
      const recipeIds = currentSaves.map(recipe => recipe.$id);

      // Update the user's saved recipes, ensuring no duplicates
      if (!recipeIds.includes(recipeId)) {
        await databases.updateDocument(databaseId, userCollectionId, userId, {
          savedRecipes: [...currentSaves, recipeId],
        });
        console.log("Recipe saved successfully.");
      } else {
        const filteredSaves = currentSaves.filter(item => item.$id !== recipeId)
        await databases.updateDocument(databaseId, userCollectionId, userId, {
          savedRecipes: filteredSaves,
        });
        console.log("Recipe removed successfully.");
      }
    } else {
      const modidfiedRecipe = await modifyRecipeByAi(JSON.stringify(recipe));

      const {
        healthScore,
        id,
        image,
        ingredients,
        nutrition,
        readyInMinutes,
        servings,
        spoonacularScore,
        instructions,
        title,
      } = modidfiedRecipe[0];

      // Add the recipe to the recipes collection
      const addedRecipe = await addRecipe(
        id,
        title,
        image.uri,
        spoonacularScore,
        healthScore,
        readyInMinutes,
        servings,
        ingredients,
        instructions,
        nutrition
      );

      // Add the newly added recipe to the user's saved recipes
      const user = await databases.getDocument(
        databaseId,
        userCollectionId,
        userId
      );
      const currentSaves = user.savedRecipes || [];
      await databases.updateDocument(databaseId, userCollectionId, userId, {
        savedRecipes: [...currentSaves, addedRecipe.$id],
      });
      console.log("New recipe added and saved successfully.");
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const getSavedRecipes = async (userId) => {
  try {
    const user = await databases.getDocument(
      databaseId,
      userCollectionId,
      userId
    );
    const currentSaves = user.savedRecipes || [];
    return currentSaves;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const addRecipe = async (
  id,
  title,
  image,
  rating,
  healthScore,
  readyInMinutes,
  servings,
  ingredients,
  instructions,
  nutrition
) => {
  try {
    const recipe = await databases.listDocuments(
      databaseId,
      recipesCollectionId,
      [Query.equal("title", title)]
    );
    if (recipe.documents.length > 0) {
      console.log("recipe already exists in database");
      return recipe.documents;
    }

    const newRecipe = await databases.createDocument(
      databaseId,
      recipesCollectionId,
      ID.unique(),
      {
        id: id,
        title: title,
        image: image,
        spoonacularScore: rating,
        healthScore: healthScore,
        readyInMinutes: readyInMinutes,
        servings: servings,
        ingredients: JSON.stringify(ingredients),
        instructions: JSON.stringify(instructions),
        nutrition: JSON.stringify(nutrition),
      }
    );
    console.log("recipe added successfully");
    return newRecipe;
  } catch (err) {
    throw new Error(err);
  }
};

export const addPersonalRecipe = async (
  id,
  title,
  image,
  rating,
  healthScore,
  readyInMinutes,
  servings,
  ingredients,
  instructions,
  nutrition,
  creator
) => {
  try {
    const imageUrl = await uploadFile(image, "image");

    const newRecipe = await databases.createDocument(
      databaseId,
      recipesCollectionId,
      ID.unique(),
      {
        id: id,
        title: title,
        image: imageUrl,
        spoonacularScore: rating,
        healthScore: healthScore,
        readyInMinutes: readyInMinutes,
        servings: servings,
        ingredients: JSON.stringify(ingredients),
        instructions: JSON.stringify(instructions),
        nutrition: JSON.stringify(nutrition),
        creator: creator,
      }
    );
    console.log("recipe added successfully");
    return newRecipe;
  } catch (err) {
    throw new Error(err);
  }
};

export const addToRecentlyViewed = async (recipe, userId) => {
  try {
    const user = await databases.getDocument(databaseId, userCollectionId, userId);
    const currentRecentlyViewed = user.recentlyViewed || [];
    const ids = currentRecentlyViewed.map(item => item.$id)
    
    const recipeCheck = await databases.listDocuments(
      databaseId,
      recipesCollectionId,
      [Query.equal("title", recipe.title)]
    );
    if(recipeCheck.documents.length <= 0) {
      console.log("recipe not found in our database")
      return;
    }
    const savedRecipe = recipeCheck.documents[0];
    // Add the new recipe ID and limit to last 10 viewed recipes
    const updatedRecentlyViewed = [savedRecipe.$id, ...ids.filter(id => id !== savedRecipe.$id)].slice(0, 10);

    await databases.updateDocument(databaseId, userCollectionId, userId, {
      recentlyViewed: updatedRecentlyViewed,
    });

    console.log("Recipe added to recently viewed.");
  } catch (error) {
    console.error("Error adding to recently viewed:", error);
  }
};

export const getRecentlyViewed = async (userId) =>{
  try{
    const user = await databases.getDocument(databaseId, userCollectionId, userId);
    const currentRecentlyViewed = user.recentlyViewed || [];
    return currentRecentlyViewed;
  }catch(err){
    throw new Error(err)
  }
}

export const getAiRecipeDetails = async (recipeId) => {
  try {
    const recipe = await databases.listDocuments(
      databaseId,
      recipesCollectionId,
      [Query.equal("id", recipeId)]
    );
    return recipe.documents[0];
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const followUser = async (userId, memberId) => {
  try {
    const user = await databases.getDocument(databaseId, userCollectionId, userId);
    const member = await databases.getDocument(databaseId, userCollectionId, memberId);
    const userFollowing = user.following || [];
    const memberFollowers = member.followers || [];
    
    const updateduserFollowing = [...userFollowing, memberId];
    const updatedmemberFollowers = [...memberFollowers, userId];

    await databases.updateDocument(databaseId, userCollectionId, userId, {
      following: updateduserFollowing,
    });
    await databases.updateDocument(databaseId, userCollectionId, memberId, {
      followers: updatedmemberFollowers,
    });

    console.log("Following successfull");
  } catch (error) {
    console.error("Error Following user:", error);
  }
};