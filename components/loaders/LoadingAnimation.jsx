import React, { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import AnimatedLoader from "react-native-animated-loader";
import images from "../../constants/images";

export default function LoadingAnimation({ title, loading }) {
  return (
    <AnimatedLoader
      source={images.LoadingAnimated}
      visible={loading}
      overlayColor="rgba(255,255,255,0.75)"
      animationStyle={styles.lottie}
      speed={1}
    >
      <Text className={`text-neutral-90 font-psemibold text-lg mt-4`}>
        {title}
      </Text>
    </AnimatedLoader>
  );
}
const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
});
