import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../constants";
import EmptyState from "./EmptyState";

const MyPantry = ({ selectedFilters, setSelectedFilters, setShowPantry }) => {
  const nonEmptyFilters = Object.keys(selectedFilters).filter(
    (key) => selectedFilters[key].length > 0
  );

  return (
    <SafeAreaView className="h-full bg-white p-4">
      <View className="flex-row w-full items-center mb-2">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowPantry(false)}
          className="mr-2"
        >
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            className="w-6 h-6"
            tintColor={"#303030"}
          />
        </TouchableOpacity>
        <Text className="text-2xl text-neutral-90 font-pbold ml-2">
          My Pantry
        </Text>
      </View>
      <FlatList
        data={nonEmptyFilters}
        keyExtractor={(title) => title}
        renderItem={({ item: title }) => (
          <View className="w-full rounded-xl bg-white mb-4">
            <Text className="text-lg text-neutral-90 font-pmedium mb-2 capitalize">
              {title}
            </Text>
            <FlatList
              data={selectedFilters[title]}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  className="bg-white p-2 px-4 border border-neutral-20 rounded-xl mx-1 mb-2 flex-row items-center justify-between"
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedFilters((prevState) => {
                      const updatedFilters = { ...prevState };
                      if (updatedFilters[title].includes(item)) {
                        // Remove the filter if it's already selected
                        updatedFilters[title] = updatedFilters[title].filter(
                          (f) => f !== item
                        );
                      }
                      return updatedFilters;
                    });
                  }}
                >
                  <Text className="text-neutral-90 text-sm font-pmedium mr-1">
                    {item}
                  </Text>
                  <Image
                    source={icons.remove}
                    resizeMode="contain"
                    className="w-4 h-4"
                    tintColor={"#606060"}
                  />
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => {
                return (
                  <EmptyState
                    title={"Your pantry is empty"}
                    subtitle={"Please add items to the pantry"}
                  />
                );
              }}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default MyPantry;
