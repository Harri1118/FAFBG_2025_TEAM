module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    transformIgnorePatterns: [
        "/node_modules/(?!react-leaflet|@react-leaflet|leaflet|leaflet.markercluster|leaflet-routing-machine|@turf|bignumber\\.js|polyclip-ts)"
      ],
    moduleNameMapper: {
      "^features/(.*)$": "<rootDir>/src/features/$1",
      "^main/(.*)$": "<rootDir>/src/main/$1",
      "^shared/(.*)$": "<rootDir>/src/shared/$1",
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      // add other top-level folders under src/ as needed
    },
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
  };