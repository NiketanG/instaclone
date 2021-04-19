# Instaclone

Instagram clone built with [Supabase](https://supabase.io/) & React Native.

## Installation

Install dependencies -

```
yarn
or
npm install
```

Setup Supabase Project and configure [`supabaseClient.ts`](src/app/utils/supabaseClient.ts)
Set up Google Cloud Project and add Oauth Clients for Google Auth. Add the same in Supabase Auth Settings for Google Auth Provider

Start metro bundler

```
yarn start
or
npm run start
```

Build Android Application.

> Make sure a physical device is connected & detected in `adb` OR emulator is installed & running.

```
yarn android
or
npm run android
```

# To Do

-   [ ] Messaging
-   [ ] Caching
-   [ ] Filters for Posts
-   [ ] Stories
-   [ ] Better Navigation and State Persistence
-   [ ] Video Posts
-   [ ] Activity Tab
-   [ ] Animations

### Note

This is not a 1:1 Replica of Instagram. The aim of this project was to try and test out [Supabase](https://supabase.io/).
