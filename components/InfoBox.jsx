import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({title,subtitle}) => {
  return (
    <View className = 'mr-2 space-y-1'>
      <Text className='text-sm text-neutral-40 text-center font-pregular'>{title}</Text>
      <Text className="text-lg text-neutral-90 text-center font-psemibold">{subtitle}</Text>
    </View>
  )
}

export default InfoBox