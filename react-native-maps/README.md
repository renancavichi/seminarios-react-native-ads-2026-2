# React Native Maps

An interactive Expo demo of [`react-native-maps`](https://github.com/react-native-maps/react-native-maps), built with React Native and TypeScript.

## Features

- Interactive map centered on São Paulo
- Four map overlays: markers, circles, polylines, and polygons
- Tap the map to add or reposition the selected overlay
- Standard, satellite, and hybrid map styles (terrain is also available on Android)
- Clear the selected overlay or restore the demo
- Ready to run in Expo Go with a tunnel

## Get started

Install [Expo Go](https://expo.dev/go) on your Android or iOS phone, then from this project folder run:

```bash
npm install
npm run tunnel
```

Scan the QR code shown in the terminal with Expo Go. Keep the development server running while you use the app.

You can also start on the local network with `npm start`.

## Try the map tools

1. Choose **Marcador**, **Círculo**, **Polilinha**, or **Polígono** below the map.
2. Tap the map to add a marker, set the circle center, or add a point to the selected path/area.
3. Use **Limpar** to remove the selected overlay, or the reset button to restore the sample map.
4. Choose a map style to switch the base layer.

The app uses the native map provider available on the device. Expo Go does not need a Maps API key for local development. A Google Maps API key and a rebuilt app are needed for a standalone Android app that uses Google Maps.

## Tech stack

- Expo SDK 58
- React Native 0.88
- TypeScript
- `react-native-maps`

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start Expo on the local network |
| `npm run tunnel` | Start Expo with a tunnel for device testing |
| `npm run android` | Open the Android target |
| `npm run ios` | Open the iOS target |
| `npm run web` | Open the web target |

## License

MIT
