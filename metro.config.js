const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('glb', 'gltf', 'hdr');
console.log('assetExts: ', config.resolver.assetExts);

module.exports = config;