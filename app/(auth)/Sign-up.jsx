import { View, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import {FormInput,CustomButton} from "../../components"
import { icons } from "../../constants";
import { createUser} from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    bio:"",
    email: "",
    password: "",
  });
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "" || form.bio === "") {
      Alert.alert("Error", "Please fill in all the fields");
    }

    setIsSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username, form.bio);

      setUser(result);
      setIsLoggedIn(true);

      router.replace("/Home");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setIsSubmitting(false);
    }
    createUser();
  };
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="w-full justify-center min-h-[100vh] px-6 my-6">
          <Image
            source={icons.logo}
            resizeMode="contain"
            className="w-[200px] h-[70px] self-center"
            tintColor="#31B057"
          />
          <Text className="text-2xl text-neutral-90 mt-10 font-psemibold text-center">
            Sign up to Food Charm
          </Text>

          <FormInput
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />
          <FormInput
            title="Bio"
            value={form.bio}
            handleChangeText={(e) => setForm({ ...form, bio: e })}
            otherStyles="mt-10"
          />
          <FormInput
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormInput
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Sign-Up"
            handlePress={submit}
            otherStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-neutral-40 font-pregular">
              Already have an account?
            </Text>
            <Link href="/Sign-in" className="text-lg font-pbold text-primary">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
