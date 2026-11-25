import * as ImagePicker from "expo-image-picker"
import { useState } from "react"
import { Alert, ScrollView, StatusBar, View } from "react-native"

import { Credential } from "@/components/credential"
import { Header } from "@/components/header"
import { colors } from "@/styles/colors"

export default function Home() {
  // Estado que armazena o endereço (URI) da foto selecionada pelo usuário
  const [image, setImage] = useState("")

  // Exibe um alerta para o usuário escolher entre abrir a Galeria ou a Câmera
  function handleSelectImage() {
    Alert.alert("Foto do crachá", "Escolha de onde deseja adicionar sua foto.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Galeria",
        onPress: () => {
          void handleSelectFromLibrary()
        },
      },
      {
        text: "Tirar foto",
        onPress: () => {
          void handleTakePhoto()
        },
      },
    ])
  }

  // Abre a galeria do celular permitindo cortar a imagem no formato quadrado (1:1)
  async function handleSelectFromLibrary() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error("Erro ao selecionar foto da galeria:", error)
      Alert.alert("Foto", "Não foi possível abrir a galeria.")
    }
  }

  // Solicita permissão de uso da câmera e tira uma foto no formato quadrado (1:1)
  async function handleTakePhoto() {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync()

      if (!permission.granted) {
        Alert.alert("Permissão necessária", "Autorize o acesso à câmera para tirar sua foto.")
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error("Erro ao tirar foto:", error)
      Alert.alert("Foto", "Não foi possível acessar a câmera.")
    }
  }

  return (
    <View style={{ backgroundColor: colors.green[500] }} className="flex-1 bg-green-500">
      <StatusBar barStyle="light-content" />
      <Header title="Meu crachá" />

      {/* -mt-28 faz o cordão subir até o topo da tela, passando por trás do Header */}
      <ScrollView
        style={{ zIndex: 1 }}
        className="-mt-28"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Credential image={image} onChangeAvatar={handleSelectImage} />
      </ScrollView>
    </View>
  )
}
