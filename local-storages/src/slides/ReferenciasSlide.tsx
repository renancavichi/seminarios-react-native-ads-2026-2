import { SlideWrapper, SlideTitle, FeatureCard } from '../components/shared';

export function ReferenciasSlide() {
    return (
        <SlideWrapper>
            <SlideTitle
                title="Referências"
            />
            <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400" />
                        Referências
                    </h3>
                    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-5">
                        <div className="space-y-6 text-lg w-full text-center">
                            <p>https://docs.expo.dev/versions/latest/sdk/sqlite/</p>
                            <p>https://github.com/margelo/react-native-mmkv</p>
                            <p>https://github.com/margelo/nitro</p>
                            <p>https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here</p>
                            <p>https://docs.expo.dev/versions/latest/sdk/securestore/</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400" />
                        AI
                    </h3>
                    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-5">
                        <div className="space-y-6 text-lg w-full text-center">
                            <p>Qwen Coder - Estrutura da apresentação (slides)</p>
                            <p>Gemini - Conteúdo da apresentação</p>
                            <p>Claude - Código</p>
                        </div>
                    </div>
                </div>
            </div>

        </SlideWrapper>
    );
}
