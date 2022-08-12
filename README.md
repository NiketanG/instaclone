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

> Use the Database structure from [db_dump.sql](db_dump.sql) in Supabase.

Enable Google Auth in Supabase ,and set up Google Cloud Project and add Oauth Clients in Supabase App Dashboard.

Set Environment Variables.

```
SUPABASE_KEY
SUPABASE_URL
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

### Note

This is not a 1:1 Replica of Instagram and will never be. The aim of this project was to try and test out [Supabase](https://supabase.io/).
