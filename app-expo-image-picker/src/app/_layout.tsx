import "@/styles/global.css"

import { Slot } from "expo-router"

import { Loading } from "@/components/loading"

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto"


export default function Layout() {
  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  })

  if (!fontsLoaded) {
    return <Loading />
  }


  return <Slot />   
}

