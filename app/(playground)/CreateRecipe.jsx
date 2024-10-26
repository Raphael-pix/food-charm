import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  CustomButton,
  FormInput,
  IngredientForm,
} from "../../components/index.js";
import { icons } from "../../constants";
import { modifyRecipeByAi } from "../../lib/spoonacular.js";
import { addPersonalRecipe } from "../../lib/appwrite.js";
import { useGlobalContext } from "../../context/GlobalProvider.js";

const CreateRecipe = () => {
  const { user } = useGlobalContext();
  const [form, setForm] = useState({
    title: "",
    image: null,
    serveCount: "",
    cookingTime: "",
    ingredients: [
      {
        item_name: "",
        quantity: 0,
        measurement: "gr",
      },
    ],
    instructions: [
      {
        step: "",
      },
    ],
  });
  const [result, setResult] = useState(null);

  const openPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0] });
    }
  };

  const addIngredient = () => {
    setForm({
      ...form,
      ingredients: [
        ...form.ingredients,
        { item_name: "", quantity: "", measurement: "gr" },
      ],
    });
  };

  // Handle removing an ingredient form by index
  const removeIngredient = (index) => {
    if (form.ingredients.length <= 1) return;
    const newIngredients = form.ingredients.filter((_, i) => i !== index);
    setForm({
      ...form,
      ingredients: newIngredients,
    });
  };

  // Handle updating an ingredient
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = form.ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setForm({
      ...form,
      ingredients: newIngredients,
    });
  };

  const addInstructions = () => {
    setForm({
      ...form,
      instructions: [...form.instructions, { step: "" }],
    });
  };
  const handleInstructionChange = (index, field, value) => {
    const newInstructions = form.instructions.map((instruction, i) =>
      i === index ? { ...instruction, [field]: value } : instruction
    );
    setForm({
      ...form,
      instructions: newInstructions,
    });
  };
  const removeInstructions = (index) => {
    if (form.instructions.length <= 1) return;
    const newInstructions = form.instructions.filter((_, i) => i !== index);
    setForm({
      ...form,
      instructions: newInstructions,
    });
  };

  const submit = async () => {
    if (form.title === "" || form.image === null)
      return Alert.alert(
        "Error",
        "Missing attributes, Please fill all the necessery information"
      );
    const res = await modifyRecipeByAi(JSON.stringify(form));
    if (res) {
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
      } = res[0];
      const result = await addPersonalRecipe(
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
        user.$id
      );
      setResult(result);
    }
  };

  if (result) {
    return (
      <SafeAreaView className="bg-white h-full">
        <ScrollView className="px-4 my-6">
          <View className="flex-row items-center w-full">
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
              <Image
                source={icons.leftArrow}
                resizeMode="contain"
                className="w-6 h-6"
                tintColor={"#303030"}
              />
            </TouchableOpacity>
            <Text className="text-2xl text-neutral-90 font-pbold ml-2">
              Create Recipe
            </Text>
          </View>
          <View className="items-center justify-center mt-20">
            <Image
              source={icons.checked}
              resizeMode="contain"
              tintColor="#31B057"
              className="w-16 h-16"
            />
            <Text className="font-psemibold text-lg text-neutral-90 mt-2">
              Recipe added successfully
            </Text>
            <CustomButton title={"Return to profile"} otherStyles={"mt-5"} handlePress={()=>router.push("/Profile")}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="px-4 my-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center w-full">
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              className="w-6 h-6"
              tintColor={"#303030"}
            />
          </TouchableOpacity>
          <Text className="text-2xl text-neutral-90 font-pbold ml-2">
            Create Recipe
          </Text>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-neutral-90 font-psemibold">
            Upload Image
          </Text>
          <TouchableOpacity onPress={() => openPicker()}>
            {form.image ? (
              <Image
                source={{ uri: form.image.uri }}
                className="w-full h-64 rounded-xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-48 px-4 bg-white border border-neutral-20 rounded-2xl justify-center items-center">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-10 h-10"
                  tintColor="#303030"
                />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormInput
          title="Recipe name"
          value={form.title}
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-4"
        />

        <View className="bg-neutral-10 w-full rounded-xl h-16 flex-row items-center justify-between px-4 space-x-2 mt-5">
          <View className="bg-white items-center justify-center rounded-lg w-10 h-10">
            <Image
              source={icons.group}
              resizeMode="contain"
              tintColor="#E23E3E"
              className="w-6 h-6"
            />
          </View>
          <Text className="text-base font-pmedium text-neutral-90 flex-1 px-2">
            serves
          </Text>
          <View className="flex-row items-end">
            <TextInput
              className="bg-transparent text-base font-pregular text-neutral-40"
              keyboardType="numeric"
              placeholder="00"
              placeholderTextColor="text-base font-pregular text-neutral-40"
              onChangeText={(e) => {
                setForm({ ...form, serveCount: e });
              }}
              value={form.serveCount.toString()}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              setForm({
                ...form,
                serveCount: parseInt(
                  parseInt(form.serveCount === "" ? "0" : form.serveCount) + 1
                ).toString(),
              })
            }
          >
            <Image
              source={icons.rightArrow}
              resizeMode="contain"
              tintColor="#303030"
              className="w-8 h-8"
            />
          </TouchableOpacity>
        </View>

        <View className="bg-neutral-10 w-full rounded-xl h-16 flex-row items-center justify-between px-4 space-x-2 mt-5">
          <View className="bg-white items-center justify-center rounded-lg w-10 h-10">
            <Image
              source={icons.clock}
              resizeMode="contain"
              tintColor="#E23E3E"
              className="w-6 h-6"
            />
          </View>
          <Text className="text-base font-pmedium text-neutral-90 flex-1 px-2">
            cooking time
          </Text>
          <View className="flex-row items-center">
            <TextInput
              className="bg-transparent text-base font-pregular text-neutral-40"
              keyboardType="numeric"
              placeholder="00"
              placeholderTextColor="text-base font-pregular text-neutral-40"
              onChangeText={(e) => setForm({ ...form, cookingTime: e })}
              value={form.cookingTime.toString()}
            />
            <Text className="text-base font-pregular text-neutral-40 ml-1">
              mins
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              setForm({
                ...form,
                cookingTime: parseInt(
                  parseInt(form.cookingTime === "" ? "0" : form.cookingTime) + 1
                ).toString(),
              })
            }
          >
            <Image
              source={icons.rightArrow}
              resizeMode="contain"
              tintColor="#303030"
              className="w-8 h-8"
            />
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-xl text-neutral-90 font-psemibold">
            Ingredients
          </Text>
          {form.ingredients.map((ingredient, index) => {
            return (
              <IngredientForm
                key={index}
                itemName={ingredient.item_name}
                quantity={ingredient.quantity}
                measurementValue={ingredient.measurement}
                handleChangeText={(value) =>
                  handleIngredientChange(index, "item_name", value)
                }
                handleChangeQuantity={(value) =>
                  handleIngredientChange(index, "quantity", value)
                }
                handleChangeMeasurement={(item) =>
                  handleIngredientChange(index, "measurement", item.value)
                }
                handleRemoveIngredient={() => removeIngredient(index)}
                handleAddIngredient={addIngredient}
                otherStyles="mt-4"
                keyboardType="numeric"
              />
            );
          })}
          <TouchableOpacity
            className="flex-row items-center pt-3"
            activeOpacity={0.7}
            onPress={addIngredient}
          >
            <Image
              source={icons.plus}
              className="w-6 h-6"
              resizeMode="contain"
              tintColor="#A9A9A9"
            />
            <Text className="ml-2 font-psemibold text-base text-neutral-40">
              Add new ingredient
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-xl text-neutral-90 font-psemibold">
            Instructions
          </Text>
          {form.instructions.map((instruction, index) => {
            return (
              <View
                key={index}
                className="space-x-2 flex-row items-center justify-between"
              >
                <TextInput
                  className="flex-1 p-3 px-4 bg-white border border-neutral-20 rounded-2xl justify-center items-center font-psemibold text-neutral text-sm"
                  value={instruction.step}
                  multiline={true}
                  placeholder="Instruction"
                  placeholderTextColor="#D9D9D9"
                  onChangeText={(value) =>
                    handleInstructionChange(index, "step", value)
                  }
                />
                <TouchableOpacity
                  className="w-8 h-8 border border-neutral-90 rounded-xl items-center justify-center"
                  activeOpacity={0.7}
                  onPress={() => removeInstructions(index)}
                >
                  <Image
                    source={icons.minus}
                    className="w-4 h-4"
                    resizeMode="contain"
                    tintColor="#303030"
                  />
                </TouchableOpacity>
              </View>
            );
          })}
          <TouchableOpacity
            className="flex-row items-center pt-3"
            activeOpacity={0.7}
            onPress={addInstructions}
          >
            <Image
              source={icons.plus}
              className="w-6 h-6"
              resizeMode="contain"
              tintColor="#A9A9A9"
            />
            <Text className="ml-2 font-psemibold text-base text-neutral-40">
              Add new instruction
            </Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          title="save recipes"
          handlePress={submit}
          otherStyles="mt-7"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRecipe;
