module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Reanimated plugin must be last
    plugins: ['react-native-reanimated/plugin']
  };
};
