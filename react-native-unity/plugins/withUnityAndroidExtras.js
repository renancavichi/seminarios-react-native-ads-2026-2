// Config plugin local: complementa o plugin do @azesmway/react-native-unity.
// - Copia as propriedades "unity.*" geradas pela exportação da Unity para android/gradle.properties
//   (o build.gradle da unityLibrary lê unity.androidNdkPath, unity.androidSdkPath etc.)
// - Gera android/local.properties com sdk.dir (a unityLibrary lê esse arquivo diretamente)
// - Compila só arm64-v8a (mesma ABI exportada pela Unity)
const fs = require('fs');
const path = require('path');
const { withGradleProperties, withDangerousMod } = require('@expo/config-plugins');

const UNITY_PROPS = path.join('unity', 'builds', 'android', 'gradle.properties');

function readUnityProps(projectRoot) {
  const file = path.join(projectRoot, UNITY_PROPS);
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter((l) => /^unity\.[\w.]+=/.test(l))
    .map((l) => {
      const i = l.indexOf('=');
      return { key: l.slice(0, i), value: l.slice(i + 1) };
    });
}

const withUnityAndroidExtras = (config) => {
  config = withGradleProperties(config, (cfg) => {
    const set = (key, value) => {
      cfg.modResults = cfg.modResults.filter((p) => !(p.type === 'property' && p.key === key));
      cfg.modResults.push({ type: 'property', key, value });
    };
    for (const { key, value } of readUnityProps(cfg.modRequest.projectRoot)) set(key, value);
    set('reactNativeArchitectures', 'arm64-v8a');
    // A unityLibrary da Unity 6 declara minSdk 26 (o padrao do Expo e 24)
    set('android.minSdkVersion', '26');
    // A biblioteca acha as classes da Unity por reflexao (Class.forName) e a Unity chama
    // ReactNativeUnityViewManager.sendMessageToMobileApp pelo nome: o R8 nao pode renomear/remover.
    set('android.enableMinifyInReleaseBuilds', 'false');
    return cfg;
  });

  config = withDangerousMod(config, [
    'android',
    async (cfg) => {
      const sdk =
        process.env.ANDROID_HOME ||
        process.env.ANDROID_SDK_ROOT ||
        path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk');
      const file = path.join(cfg.modRequest.platformProjectRoot, 'local.properties');
      fs.writeFileSync(file, `sdk.dir=${sdk.replace(/\\/g, '/')}\n`);
      return cfg;
    },
  ]);

  return config;
};

module.exports = withUnityAndroidExtras;
