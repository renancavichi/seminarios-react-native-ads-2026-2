import pkg from '../../package.json';

/** Versões realmente instaladas neste projeto (lidas do package.json). */
export const versions = {
  paper: pkg.dependencies['react-native-paper'],
  rnWeb: pkg.dependencies['react-native-web'],
  safeArea: pkg.dependencies['react-native-safe-area-context'],
  react: pkg.dependencies.react,
};
