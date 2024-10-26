import { View, Text } from 'react-native'
import React from 'react'

const CategoryboxLoader = () => {
  return (
    <View className="mr-2 relative items-center justify-end h-[200px]  rounded-xl">
      <View className="w-24 h-24 rounded-full p-2 bg-neutral-10 z-10 absolute top-0 shadow-lg shadow-neutral-70/40" />
      <View className="space-y-1 bg-neutral-20 h-[155px] w-[150px] px-4 relative rounded-lg items-center justify-center ">
        <View className="w-full h-10 rounded-xl bg-neutral-10"/>
        <View className="flex-row items-center justify-between absolute bottom-2 w-full">
            <View className="w-12 h-6 rounded-xl bg-neutral-10"/>
            <View className="w-12 h-6 rounded-xl bg-neutral-10"/>
        </View>
      </View>
    </View>
  )
}

export default CategoryboxLoader