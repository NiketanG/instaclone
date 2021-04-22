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

> Use the Database structure from [db_structure.sql](db_structure.sql) in Supabase.

Configure Cloudinary for Image Uploads.

> Enable Unsigned Uploads.

Set up Google Cloud Project and add Oauth Clients for Google Auth.

Set Environment Variables.

```
SUPABASE_KEY
SUPABASE_URL
CLOUDINARY_UPLOAD_PRESET
CLOUDINARY_CLOUD_NAME
GOOGLE_CLIENT_ID
```

Start metro bundler

```
yarn start
or
npm run start
```

Build Application.

> Make sure a physical device is connected & detected in `adb` OR emulator is installed & running.

```
yarn android
or
npm run android
```

# To Do

-   [x] Messaging
-   [ ] Better Caching
-   [ ] Filters for Posts
-   [ ] Stories
-   [ ] Better Navigation and State Persistence
-   [ ] Video Posts
-   [ ] Activity Tab
-   [ ] Animations
-   [ ] React Native Web support
-   [ ] Testing on iOS

### Note

This is not a 1:1 Replica of Instagram and will never be. The aim of this project was to try and test out [Supabase](https://supabase.io/) and Mobx-State-Tree with React Native.
