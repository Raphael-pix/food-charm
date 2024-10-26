import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { router } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import {FormInput, CustomButton} from "../../components"
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { createVideo } from "../../lib/appwrite";

const CreateVideo = () => {
  const { user } = useGlobalContext();

  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    caption: "",
  });

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (!form.caption || !form.title || !form.thumbnail || !form.video) {
      Alert.alert("Error","Please fill in all the fields");
    }
    try{ 
      await createVideo({
        ...form, userId:user.$id
      });
      
      Alert.alert('Success', 'Post added successfully');
      router.push('/Profile');
    }catch(err){
      Alert.alert('Error',err.message)
    }finally{
      setForm({
         title: "",
         video: null,
         thumbnail: null,
         caption: "",
      })
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="px-4 my-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center">
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              className="w-6 h-6"
              tintColor={"#303030"}
            />
          </TouchableOpacity>
          <Text className="text-2xl text-neutral-90 font-pbold ml-2">
            Create Video
          </Text>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-sm text-neutral-80 font-psemibold">Title</Text>
          <FormInput
            title="Give your video a catchy title..."
            value={form.title}
            handleChangeText={(e) => setForm({ ...form, title: e })}
            otherStyles="mt-2"
          />
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-sm text-neutral-80 font-psemibold">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-xl"
                resizeMode={ResizeMode.COVER}
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

        <View className="mt-7 space-y-2">
          <Text className="text-sm text-neutral-80 font-psemibold">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                ResizeMode="cover"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center bg-white border border-neutral-20 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-neutral-60 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-sm text-neutral-80 font-psemibold">
            Caption
          </Text>
          <FormInput
            title="Write your thoughts..."
            value={form.caption}
            handleChangeText={(e) => setForm({ ...form, caption: e })}
            otherStyles="mt-2"
          />
        </View>
        <CustomButton title="Post" handlePress={submit} otherStyles="mt-7" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateVideo;
