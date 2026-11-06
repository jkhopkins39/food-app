# Savor

Savor is a proof-of-concept food app: swipe through restaurants the way you would on a dating app, and let a taste profile decide what shows up. The working title is Savor. The project folder is `food-app`. Rename either one whenever the real name is chosen.

The interface follows the warm cream, brown, and orange comps: Home, Discover, Likes, Profile, a map, a restaurant page, and the match card.

## Run it in the iOS simulator

```bash
cd food-app
npm run ios
```

That opens Expo in the iOS Simulator. The first launch can take a minute while the simulator boots.

The sample deck is set in **Acworth, Georgia**, which is what Discover shows before you allow location. On the map, use the map button and choose **Midtown Atlanta** to land on Peachtree Street.

### Walkthrough

1. Home greets `beeflover12`. Near You is the closest places. Recommended is ranked by taste, inside the distance you set.
2. Search `sweet spicy`. Results can match the wording of reviews, not only the restaurant name.
3. Discover opens on Sushi Bros. Swipe right to like, left to pass, or tap Swipe for the full page.
4. A like opens the match card. Add it to a collection, or invite a group through the share sheet.
5. Profile is JuicyPeachh. Preferences shows the taste mix as bars. Food alerts is the distance and notification settings.
6. Tap **Preview a food alert**. Savor moves you 300 feet from your closest match and shows `FOOD ALERT`. Allow notifications if you also want the system banner.

Reset demo is in Food alerts if the deck gets thin.

## How taste matching works

Each restaurant is turned into a vector across 16 dimensions (spicy, sweet, Japanese, healthy, and so on). The vector is built from the words in its description and reviews, plus a small cuisine prior. That is a stand-in for a real embedding model so the demo runs with no key.

Your profile starts from the tags you pick. A like pulls your vector toward that restaurant. A pass pushes it away. A 4- or 5-star review you write does both: the words join that restaurant’s text, and the like updates your profile. Recommendations are cosine similarity, then filtered by the max distance.

Food alerts fire while the app is open when a place is inside your radius (500 feet by default) and the match is at least your bar (95% by default). The preview button is the reliable way to see one in the simulator.

## API keys

You can run the whole demo with none. Add keys only when you want live data.

### 1. Google Places API (New) — restaurants, photos, ratings, addresses

This is the key that replaces the sample deck with live places.

- In Google Cloud, enable **Places API (New)**. Place photos are part of that API.
- Create an API key restricted to iOS apps, bundle id `com.portfolio.savor`, and restricted to Places API (New).
- Put it in `.env` (see `.env.example`):

```bash
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_key
```

Restart Expo after changing it. Live places show up beside the sample restaurants. Photos load from Google. **Google review text is not copied into the taste model.** Google’s terms limit storing and reprocessing that text, so the demo only uses place types for a live match, and uses reviews people write in the app for the real taste signal. A production version should embed text you have a license for.

Places API requires a billing account. Google currently includes a monthly credit. Cache place details for at most 30 days, and keep the Google attribution that the restaurant page shows.

### 2. Maps SDK for iOS — only if you want Google map tiles

The map uses Apple Maps, which needs no key in the iOS simulator. Switch to Google tiles only if you specifically want them:

- Enable **Maps SDK for iOS**.
- Create an iOS-restricted key.
- Add the `react-native-maps` config plugin with `iosGoogleMapsApiKey`, set `provider={PROVIDER_GOOGLE}`, and rebuild with `npx expo run:ios`. `app.json` cannot read environment variables, so a key placed there as the text `process.env.SOMETHING` will not work. Use `app.config.js` if you go this route.

### 3. Geocoding API — not required

Device location uses Apple’s reverse geocoder through `expo-location`. Add Google Geocoding only if you later want Google-formatted addresses.

### 4. An embedding key — for real review language, on a server

The on-device word list should be replaced with a model once review text is yours to process:

- OpenAI `text-embedding-3-small`, or
- Gemini embeddings (`gemini-embedding-001`) on Vertex.

Call it from a server. Do not ship that key inside the app with an `EXPO_PUBLIC_` prefix. Swap the body of `embedText` in `lib/taste.ts` and keep cosine similarity the same.

### Apple

Local notifications in the simulator do not need a paid account. Shipping remote push, or alerts while the app is closed, needs an Apple Developer account, a development build (`npx expo run:ios`), and a clear reason if you ever ask for Always location. This demo deliberately stays on While Using.

## Privacy choices in the demo

- Location and notifications are explained before the system prompt, and neither is requested at launch.
- Taste data stays in on-device storage. Delete taste data and Reset demo are in Food alerts.
- The friend line on a match is labeled as sample data. Contacts are not read.
- The app is not directed at children under 13.
- There is a short privacy screen. A shipped app still needs a real policy and counsel, especially before embedding anyone else’s reviews.

## Scripts

```bash
npx tsc --noEmit
npm run ios
```
