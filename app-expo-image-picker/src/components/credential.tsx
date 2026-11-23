import { Feather } from "@expo/vector-icons"
import { Image, Text, TouchableOpacity, View } from "react-native"

type Props = {
    image?: string // endereço da foto (opcional)
    onChangeAvatar?: () => void // função executada ao clicar na foto
}

export function Credential({ onChangeAvatar, image }: Props) {
    return (
        <View className="w-full self-stretch items-center">

            {/* 1. CORDÃO DO CRACHÁ */}
            <View className="items-center z-20">
                {/* Fita verde do cordão */}
                <View className="w-20 h-56 bg-emerald-700 border-x-2 border-emerald-900 items-center justify-around py-4 overflow-hidden">
                    <Text className="text-zinc-50 font-bold text-[7px] text-center">
                        IFSP{"\n"}INSTITUTO FEDERAL
                    </Text>

                    <Text className="text-zinc-50 font-bold text-[7px] text-center">
                        IFSP{"\n"}INSTITUTO FEDERAL{"\n"}São Paulo
                    </Text>

                    <Text className="text-zinc-50 font-bold text-[7px] text-center">
                        IFSP{"\n"}INSTITUTO FEDERAL{"\n"}São Paulo
                    </Text>
                </View>

                {/* Buraquinho escuro onde o cordão entra no crachá */}
                <View className="w-24 h-2.5 bg-zinc-900 rounded-full -mt-1 -z-10" />
            </View>

            {/* 2. MOLDURA TRANSPARENTE DO PORTA-CRACHÁ */}
            <View className="self-stretch mx-7 p-1.5 rounded-3xl bg-white/20 border-2 border-white/40 -mt-6">

                {/* 3. CARTÃO BRANCO DO CRACHÁ */}
                <View className="bg-zinc-50 self-stretch items-center rounded-2xl overflow-hidden relative pt-3">

                    {/* DESENHOS DAS BORDAS (quadrados girados em 45 graus com rotate-45) */}
                    {/* Canto superior esquerdo */}
                    <View className="w-14 h-14 bg-emerald-700 rounded-md rotate-45 absolute -top-6 -left-3" />
                    <View className="w-10 h-10 bg-emerald-700 rounded-md rotate-45 absolute top-5 -left-5" />
                    <View className="w-4 h-4 bg-emerald-700 rounded-sm rotate-45 absolute top-12 left-2" />
                    <View className="w-4 h-4 bg-emerald-700 rounded-sm rotate-45 absolute top-16 -left-2" />
                    <View className="w-3.5 h-3.5 bg-red-600 rounded-sm rotate-45 absolute top-14 left-9" />

                    {/* Canto superior direito */}
                    <View className="w-12 h-12 bg-red-600 rounded-md rotate-45 absolute -top-6 right-11" />
                    <View className="w-12 h-12 bg-emerald-700 rounded-md rotate-45 absolute top-1 right-2" />
                    <View className="w-10 h-10 bg-emerald-700 rounded-md rotate-45 absolute -top-5 -right-4" />
                    <View className="w-4 h-4 bg-emerald-700 rounded-sm rotate-45 absolute top-7 right-14" />
                    <View className="w-5 h-5 bg-emerald-700 rounded-sm rotate-45 absolute top-12 -right-2" />
                    <View className="w-5 h-5 bg-emerald-700 rounded-sm rotate-45 absolute top-14 right-4" />

                    {/* Detalhes da lateral esquerda */}
                    <View className="w-20 h-0.5 bg-red-600 rotate-45 absolute top-32 -left-6" />
                    <View className="w-9 h-9 border-2 border-red-600 rounded-md rotate-45 absolute top-56 left-2" />
                    <View className="w-20 h-0.5 bg-red-600 -rotate-45 absolute top-60 -left-5" />
                    <View className="w-3.5 h-3.5 bg-emerald-700 rounded-sm rotate-45 absolute top-52 left-9" />

                    {/* Detalhes da lateral direita */}
                    <View className="w-3.5 h-3.5 bg-red-600 rounded-sm rotate-45 absolute top-36 right-3" />
                    <View className="w-9 h-9 border-2 border-emerald-700 rounded-md rotate-45 absolute top-40 right-3" />
                    <View className="w-20 h-0.5 bg-emerald-700 -rotate-45 absolute top-44 -right-5" />
                    <View className="w-20 h-0.5 bg-emerald-700 rotate-45 absolute bottom-14 -right-5" />

                    {/* 4. LOGO DO IFSP NO TOPO */}
                    <View className="items-center pt-3 pb-2 z-10">
                        {/* Símbolo do IF montado por fileiras (flex-row): 1 bolinha vermelha e 9 quadradinhos verdes */}
                        <View className="gap-1 mb-1">
                            <View className="flex-row gap-1">
                                <View className="w-2 h-2 rounded-full bg-red-600" />
                                <View className="w-2 h-2 rounded-sm bg-emerald-700" />
                                <View className="w-2 h-2 rounded-sm bg-emerald-700" />
                            </View>
                            <View className="flex-row gap-1">
                                <View className="w-2 h-2 rounded-sm bg-emerald-700" />
                                <View className="w-2 h-2 rounded-sm bg-emerald-700" />
                            </View>
                            <View className="flex-row gap-1">
                                <View className="w-2 h-2 rounded-sm bg-emerald-700" />
                                <View className="w-2 h-2 rounded-sm bg-emerald-700" />
                                <View className="w-2 h-2 rounded-sm bg-emerald-700" />
                            </View>
                            <View className="flex-row gap-1">
                                <View className="w-2 h-2 rounded-sm bg-emerald-700" />
                                <View className="w-2 h-2 rounded-sm bg-emerald-700" />
                            </View>
                        </View>

                        <Text className="text-zinc-900 font-bold text-[10px] leading-3">INSTITUTO</Text>
                        <Text className="text-zinc-900 font-bold text-[10px] leading-3">FEDERAL</Text>
                        <Text className="text-zinc-800 font-regular text-[9px] leading-3 mt-0.5">São Paulo</Text>

                        {/* Linha verde separadora */}
                        <View className="w-16 h-[1px] bg-emerald-700 my-1" />

                        <Text className="text-zinc-800 font-regular text-[8.5px] leading-3">Câmpus</Text>
                        <Text className="text-zinc-800 font-regular text-[8.5px] leading-3">Caraguatatuba</Text>
                    </View>

                    {/* 5. FOTO EM CÍRCULO (se tiver foto mostra Image, senão mostra o ícone da câmera) */}
                    {image ? (
                        <TouchableOpacity activeOpacity={0.9} onPress={onChangeAvatar}>
                            <Image
                                source={{ uri: image }}
                                className="w-36 h-36 rounded-full border-2 border-emerald-700"
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            className="w-36 h-36 rounded-full bg-emerald-50 border-2 border-emerald-700/40 items-center justify-center"
                            onPress={onChangeAvatar}
                        >
                            <Feather name="camera" color="#008B38" size={32} />
                        </TouchableOpacity>
                    )}

                    {/* 6. NOME, MATRICULA E E-MAIL */}
                    <Text className="font-bold text-xl text-zinc-900 mt-2.5">
                        Maíra Kobayashi
                    </Text>

                    <Text className="font-bold text-sm text-zinc-800 mt-0.5">
                        CG3034623
                    </Text>

                    <Text className="font-regular text-xs text-zinc-600 mb-2.5">
                        maira.k@aluno.ifsp.edu.br
                    </Text>

                    {/* 7. QR CODE E BOTÃO AMPLIAR */}
                    <Image
                        source={require("@/assets/ticket/qrcode.png")}
                        tintColor="#18181B"
                        className="w-24 h-24"
                    />

                    <TouchableOpacity activeOpacity={0.7} className="mt-2.5 mb-6">
                        <Text className="font-bold text-emerald-700 text-xs">
                            Ampliar QRCode
                        </Text>
                    </TouchableOpacity>

                    {/* 8. BARRA VERDE NO RODAPÉ DO CRACHÁ */}
                    <View className="w-full py-1.5 bg-emerald-700 items-center justify-center">
                        <Text className="text-zinc-50 font-bold text-[10px] uppercase">
                            IFSP
                        </Text>
                    </View>

                </View>
            </View>
        </View>
    )
}
