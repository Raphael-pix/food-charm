import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { EmptyState, NotificationBox } from "../components";
import { notifications } from "../lib/dummydata";
import { icons } from "../constants";

const NotifcationHeader = ({ activeCategory, setActiveCategory }) => {
  const handlePress = (value) => {
    setActiveCategory(value);
  };
  return (
    <View className="space-y-2 ">
      <View className="flex-row items-center  w-full mb-4">
        <TouchableOpacity activeOpacity={0.7} onPress={()=>router.back()}>
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            className="w-6 h-6"
            tintColor="#303030"
          />
        </TouchableOpacity>
        <Text className="font-psemibold text-2xl text-neutral-90 ml-2">
          Notifications
        </Text>
      </View>
      <View className="flex-row justify-between items-center gap-x-2 mb-4">
        <TouchableOpacity
          className={`${
            activeCategory === "unread" ? "bg-primary" : "bg-white"
          }  p-2 rounded-lg  flex-1`}
          activeOpacity={0.7}
          onPress={() => handlePress("unread")}
        >
          <Text
            className={`${
              activeCategory === "unread" ? "text-white" : "text-primary-30"
            }  font-pmedium text-center `}
          >
            unread
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${
            activeCategory === "all" ? "bg-primary" : "bg-white"
          }  p-2 rounded-lg mr-2 flex-1`}
          activeOpacity={0.7}
          onPress={() => handlePress("all")}
        >
          <Text
            className={`${
              activeCategory === "all" ? "text-white" : "text-primary-30"
            }  font-pmedium text-center`}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${
            activeCategory === "read" ? "bg-primary" : "bg-white"
          }  p-2 rounded-lg  flex-1`}
          activeOpacity={0.7}
          onPress={() => handlePress("read")}
        >
          <Text
            className={`${
              activeCategory === "read" ? "text-white" : "text-primary-30"
            }  font-pmedium text-center `}
          >
            read
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Notification = () => {
  const [activeCategory, setActiveCategory] = useState("unread");
  return (
    <SafeAreaView className="px-5 mt-4 bg-white h-full">
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <NotificationBox notification={item} />;
        }}
        ListHeaderComponent={
          <NotifcationHeader
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        }
        ListFooterComponent={() => {
          return (
            <>
              <Text className="text-sm text-neutral-40 text-center  mt-3">
                You're all set!
              </Text>
            </>
          );
        }}
        ListEmptyComponent={() => {
          return <EmptyState title={"No notifications at the moment"} />;
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Notification;
