import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";

const FilterBox = ({
  selectedFilters,
  setSelectedFilters,
  setIsFilterVisible,
  handleApplyFilters,
  filters,
  containerStyles,
  textStyles,
  title,
}) => {
  const handleSelectFilter = (filter, filterType) => {
    setSelectedFilters((prevState) => {
      const updatedFilters = { ...prevState };

      // Toggle the filter (add/remove)
      if (updatedFilters[filterType].includes(filter)) {
        // Remove the filter if it's already selected
        updatedFilters[filterType] = updatedFilters[filterType].filter(
          (f) => f !== filter
        );
      } else {
        // Add the filter if it's not already selected
        updatedFilters[filterType].push(filter);
      }

      return updatedFilters;
    });
  };
  const isFilterSelected = (filter, filterType) => {
    return selectedFilters[filterType].includes(filter);
  };

  return (
    <View className={`w-full p-4 rounded-xl mb-4 ${containerStyles}`}>
      <Text className="text-neutral-90 font-psemibold text-2xl mb-2">
        Filters
      </Text>
      <FlatList
        data={filters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View className="mb-2">
              <Text className="text-primary font-pmedium text-base mb-3">
                {item.title}
              </Text>
              <View className="flex-row flex-wrap  gap-2">
                {item.data.map((filter, index) => (
                  <Pressable
                    key={index}
                    className={`${
                      isFilterSelected(filter.name, item.title)
                        ? "bg-primary"
                        : "bg-white"
                    } p-2 px-4 border border-neutral-20 rounded-xl`}
                    activeOpacity={0.9}
                    onPress={() => handleSelectFilter(filter.name, item.title)} // item.type is 'categories' or 'type'
                  >
                    <Text
                      className={`${
                        isFilterSelected(filter.name, item.title)
                          ? "text-white"
                          : "text-neutral-90"
                      } text-sm font-pmedium `}
                    >
                      {filter.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          );
        }}
      />
      <View className="flex-row justify-between items-center">
        <CustomButton
          title={"Apply"}
          otherStyles={"flex-1 mr-2 bg-green-100 py-2"}
          handlePress={handleApplyFilters}
        />
        <CustomButton
          title={"Close"}
          handlePress={() => setIsFilterVisible(false)}
          otherStyles={"bg-white "}
          textStyles={"font-pmedium text-sm text-primary"}
        />
      </View>
    </View>
  );
};

export default FilterBox;
