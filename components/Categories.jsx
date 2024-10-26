import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { categories } from "../lib/dummydata";
import CategoryBox from "./CategoryBox";
import useFetch from "../lib/useFetch";
import { getRecipeByCategory } from "../lib/spoonacular.js";
import CategoryboxLoader from "./loaders/CategoryboxLoader";

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const handlePress = (category) => {
    setActiveCategory(category);
  };

  const { data, loading, refetch } = useFetch(
    () => getRecipeByCategory(activeCategory.title),
    activeCategory
  );
  useEffect(() => {
    refetch();
  }, [activeCategory]);

  return (
    <View className="mt-4 space-y-4">
      <View className="w-full">
        <Text className="font-psemibold text-xl text-neutral-90">
          Popular Category
        </Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <>
              <TouchableOpacity
                className={`${
                  activeCategory.id === item.id ? "bg-primary" : "bg-white"
                }  p-2 rounded-lg mr-2 `}
                activeOpacity={0.7}
                onPress={() => handlePress(item)}
              >
                <Text
                  className={`${
                    activeCategory.id === item.id
                      ? "text-white"
                      : "text-primary-30"
                  }  font-pmedium `}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            </>
          );
        }}
        horizontal
      />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (loading) {
            return <CategoryboxLoader />;
          } else return <CategoryBox recipe={item} />;
        }}
        ListEmptyComponent={() => {
          const dummy = [1,2,3,4];
          dummy.map(() => {
            return <CategoryboxLoader />;
          });
        }}
        className="mt-2"
        horizontal
      />
    </View>
  );
};

export default Categories;
