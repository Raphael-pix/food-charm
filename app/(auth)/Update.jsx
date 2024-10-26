import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {CustomButton,FormInput  } from "../../components"
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getCurrentUser, updateCurrentUser } from "../../lib/appwrite";

const Update = () => {
  const { user,setUser } = useGlobalContext();
  const [form, setForm] = useState({
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    username: user.username,
  });

  const openPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, avatar: result.assets[0] });
    }
  };
  const submit = async() => {
    try {
        await updateCurrentUser(user.$id ,form.email, form.username, form.avatar, form.bio);
        
        const result = await getCurrentUser();
        setUser(result);

        router.replace("/Profile");
      } catch (err) {
        Alert.alert("Error", err.message);
      } 
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="px-4 my-6">
        <View className="space-y-4 w-full">
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
              <Image
                source={icons.leftArrow}
                resizeMode="contain"
                className="w-7 h-7"
                tintColor={"#303030"}
              />
            </TouchableOpacity>
          <Text className="text-2xl text-neutral-90 font-pbold">
            Edit Profile
          </Text>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-neutral-60 font-pmedium">
            Profile Picture
          </Text>
          <TouchableOpacity
            onPress={() => openPicker()}
            activeOpacity={0.7}
            className="w-full h-64 bg-white border border-neutral-20 rounded-2xl justify-center items-center"
          >
            {form.avatar.uri ? (
              <Image
                source={{ uri: form.avatar.uri || form.avatar.uri }}
                className="w-full h-64 rounded-xl"
                resizeMode="cover"
              />
            ) : (
              <Image
                source={{ uri: form.avatar }}
                className="w-full h-64 rounded-xl"
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-neutral-60 font-pmedium">
            Username
          </Text>
          <FormInput
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-2"
          />
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-neutral-60 font-pmedium">Email</Text>
          <FormInput
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-2"
          />
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-neutral-60 font-pmedium">Bio</Text>
          <FormInput
            title="Bio"
            value={form.bio}
            handleChangeText={(e) => setForm({ ...form, bio: e })}
            otherStyles="mt-2"
          />
        </View>
        <CustomButton
          title="Edit profile"
          handlePress={submit}
          otherStyles="mt-7"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Update;
