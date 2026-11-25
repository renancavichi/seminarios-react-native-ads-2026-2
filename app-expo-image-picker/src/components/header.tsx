import { Text, View } from "react-native"

type Props = {
    title: string
}

export function Header({ title }: Props) {
    return (
        // zIndex: 50 garante que o cabeçalho fique na frente do cordão do crachá
        // pointerEvents="none" permite que os toques na tela passem normalmente para o conteúdo abaixo
        <View
            pointerEvents="none"
            style={{ zIndex: 50, elevation: 50 }}
            className="w-full h-28 flex-row items-end bg-black/30 px-8 pb-4 border-b border-white/10"
        >
            <Text className="flex-1 text-white font-medium text-lg text-center">
                {title}
            </Text>    
        </View>
    )
}
