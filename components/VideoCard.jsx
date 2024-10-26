import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { icons } from "../constants";
import { convertSeconds, convertVideosRating } from "../lib/util";

const VideoCard = ({
  video: { youTubeId, shortTitle, thumbnail, length, rating, video,title,duration },
  creator,
  containerStyles,
  hideProfile,
}) => {
  const [play, setPlay] = useState(false);
  return (
    <View className={`space-y-1 ${containerStyles}`}>
      {play ? (
        <Video
          source={{ uri: `https://www.youtube.com/watch?v${youTubeId}` || video}}
          className="w-full h-60 rounded-xl mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative w-full h-40 rounded-xl"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: thumbnail || "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png"}}
            resizeMode="cover"
            className="w-full h-full rounded-xl overflow-hidden relative justify-center items-center"
          >
            <View className="flex-row w-full items-center justify-between absolute top-1 px-3 py-1">
              <View className="flex-row items-center h-8 rounded-xl px-2 bg-black/20">
                <Image
                  source={icons.star}
                  resizeMode="contain"
                  className="w-4 h-4"
                />
                <Text className="text-white text-sm ml-2 font-pmedium">
                  {convertVideosRating(rating || 0.0)}
                </Text>
              </View>
              <TouchableOpacity
                className="bg-white w-[26px] h-[26px] rounded-full items-center justify-center"
                activeOpacity={0.7}
              >
                <Image
                  source={icons.bookmark}
                  resizeMode="contain"
                  className="w-4 h-4"
                  tintColor="#000"
                />
              </TouchableOpacity>
            </View>
            <View className="w-12 h-12 rounded-full bg-black/20 justify-center items-center absolute">
              <Image
                source={icons.play}
                resizeMode="cover"
                className="w-6 h-6"
                tintColor="#FFF"
              />
            </View>
            <View className="rounded-lg px-2 py-1 bg-black/20 absolute bottom-1 right-1">
              <Text className="text-white text-xs font-pregular">
                {convertSeconds(length || duration)}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      )}
      <View className="space-y-1">
        <View className="flex-row justify-between items-center">
          <Text
            numberOfLines={2}
            className="text-sm font-pbold text-neutral-90 flex-1"
          >
            {shortTitle || title}
          </Text>
          {/* add functionality */}
          <TouchableOpacity className="ml-8" activeOpacity={0.4}>
            <Image
              source={icons.horizontalMenu}
              resizeMode="contain"
              className="w-7 h-7"
              tintColor="#000"
            />
          </TouchableOpacity>
        </View>
        {/* add link to profile functionality */}
        {!creator ||
          (!hideProfile && (
            <Pressable className="w-full py-1 items-center flex-row">
              <Image
                source={creator.avatar}
                resizeMode="cover"
                className="w-8 h-8 rounded-full"
              />
              <Text className="text-sm text-neutral-40 ml-3">
                By {creator.name}
              </Text>
            </Pressable>
          ))}
      </View>
    </View>
  );
};

export default VideoCard;
