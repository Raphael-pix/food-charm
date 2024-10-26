import { View, Image} from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { icons } from "../../constants";

const TabBarIcon = ({ icon, color }) => {
  return (
    <View className="justify-center items-center">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-7 h-7"
      />
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard:true,
        tabBarActiveTintColor: "#E23E3E",
        tabBarInactiveTintColor: "#C1C1C1",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 84,
          shadowColor: "#6c6c6c",
          shadowOffset: {
            width: 10,
            height: 10,
          },
          shadowOpacity: 0.3,
          elevation: 15,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => {
            return <TabBarIcon icon={icons.home} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="Feed"
        options={{
          title: "Feed",
          headerShown: false,
          tabBarIcon: ({ color }) => {
            return <TabBarIcon icon={icons.search} color={color} />;
          },
        }}
      />

      <Tabs.Screen
        name="General"
        options={{
          title: "General",
          headerShown: false,
          tabBarIcon: () => {
            return (
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#E23E3E",
                  borderRadius: 35,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TabBarIcon icon={icons.plus} color="#FFFFFF" />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="Bookmark"
        options={{
          title: "Bookmark",
          headerShown: false,
          tabBarIcon: ({ color }) => {
            return <TabBarIcon icon={icons.bookmark} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => {
            return <TabBarIcon icon={icons.profile} color={color} />;
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
