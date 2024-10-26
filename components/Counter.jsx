import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import { icons } from "../constants";
import { Dropdown } from "react-native-element-dropdown";
import { measurement } from "../lib/dummydata";

const IngredientForm = ({
  itemName,
  quantity,
  measurementValue,
  handleChangeText,
  handleChangeQuantity,
  handleChangeMeasurement,
  handleRemoveIngredient,
  handleAddIngredient,
  otherStyles,
  ...props
}) => {
  return (
    <View className={`${otherStyles} space-y-2`}>
      <View className="space-x-2 flex-row items-center justify-between">
        <View className=" border border-neutral-20 flex-1 h-12 px-4 focus:border-primary rounded-2xl">
          <TextInput
            className="flex-1 text-neutral font-psemibold text-sm"
            value={itemName}
            placeholder="Item name"
            placeholderTextColor="#D9D9D9"
            onChangeText={handleChangeText}
          />
        </View>
        <View className="space-x-2 border border-neutral-20 flex-1 h-12 px-4 focus:border-primary rounded-2xl flex-row items-center justify-between">
          <TextInput
            className=" flex-1 bg-white text-neutral font-psemibold text-sm"
            value={quantity}
            placeholder="quantity"
            placeholderTextColor="#D9D9D9"
            onChangeText={handleChangeQuantity}
            {...props}
          />
          <Dropdown
            className="w-14 h-6 rounded-sm border-0 text-neutral-90 focus:border-neutral-20 p-1"
            search={false}
            selectedTextStyle="text-xs text-neutral-90"
            placeholder={measurementValue}
            labelField="value"
            valueField="value"
            placeholderStyle="text-xs text-neutral-90"
            data={measurement}
            value={measurementValue}
            maxHeight={100}
            onChange={handleChangeMeasurement}
            showsVerticalScrollIndicator={false}
            closeModalWhenSelectedItem={true}
          />
        </View>
        <TouchableOpacity
          className="w-8 h-8 border border-neutral-90 rounded-xl items-center justify-center"
          activeOpacity={0.7}
          onPress={handleRemoveIngredient}
        >
          <Image
            source={icons.minus}
            className="w-4 h-4"
            resizeMode="contain"
            tintColor="#303030"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IngredientForm;
