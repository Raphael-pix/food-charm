import React from "react";
import {Stack } from "expo-router";

const RootLayout = () => {
  return (
      <Stack>
        <Stack.Screen
          name="CreateRecipe"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateVideo"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CustomizeRecipe"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyFridge"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
  );
};

export default RootLayout;
