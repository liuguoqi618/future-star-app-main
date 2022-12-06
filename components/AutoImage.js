import React, { useEffect, useState } from 'react'
import { Image, useWindowDimensions } from 'react-native'

export default function AutoImage({ imageUrl }) {
  const { width } = useWindowDimensions()

  const displayWidth = width - 24
  const [displayHeight, setDisplayHeight] = useState(width - 24)

  useEffect(() => {
    if (imageUrl) {
      Image.getSize(imageUrl, (w, h) => {
        setDisplayHeight((width - 24) / w * h)
      })
    }
  }, [width, imageUrl])

  return (
    <Image
      source={{ uri: imageUrl }}
      style={{ width: displayWidth, height: displayHeight }}
      resizeMode="contain"
    />
  )
}
