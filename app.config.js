require("dotenv").config();

const appJson = require("./app.json");

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      newsApiKey: process.env.NEWS_API_KEY ?? "",
      gnewsApiKey: process.env.GNEWS_API_KEY ?? "",
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
    },
  },
};
