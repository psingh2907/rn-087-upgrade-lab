/**
 * Entry for the "large app" measurement only (see scripts/generate-large-app.js).
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { screens } from './src/generated';
import { name as appName } from './app.json';

globalThis.__screens = screens;
AppRegistry.registerComponent(appName, () => App);
