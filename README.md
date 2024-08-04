# Currency Conversion App

A React Native application for converting between different currencies. The app provides real-time exchange rates and supports converting amounts between selected currencies.

## Features

- Select currencies from dropdown menus.
- Convert amounts between selected currencies.
- Handle user input and update the UI accordingly.
- Manage currency exchange rates and keep the UI responsive.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version >= 12.x.x)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development)
- [Android Studio](https://developer.android.com/studio) (for Android development)

### Installing

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AneeqaKhan/CurrrencyConversion.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd CurrrencyConversion
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Install additional pods for iOS:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

### Running the App

- **For iOS:**
   ```bash
   npx react-native run-ios
   ```

- **For Android:**
   ```bash
   npx react-native run-android
   ```

### Usage

1. Start the application: The app will open with the default currencies (GBP to USD).
2. Select currencies: Use the dropdowns to choose 'from' and 'to' currencies.
3. Enter amounts: Input amounts in either field to automatically see the converted value.
4. View conversion: The conversion rate and result will be displayed in the respective fields.

### Troubleshooting

- If the keyboard does not hide: Ensure you have `automaticallyAdjustKeyboardInsets` set correctly in `ScrollView` and use `keyboardShouldPersistTaps="handled"`.
- Issues with fetching exchange rates: Check your API key and ensure the API endpoint is accessible.

### Contributing

Contributions are welcome! Please follow these steps if you want to contribute:

1. Fork the repository.
2. Create a new branch for your changes:
```bash
git checkout -b feature/your-feature
```
3. Make your changes and commit them:
```bash
git add .
git commit -m 'Add your message'
```
4. Push your changes:
```bash
git push origin feature/your-feature
```
5. Create a pull request to merge your changes into the main branch.

### License
This project is licensed under the MIT License.

