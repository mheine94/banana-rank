import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { DefaultTheme, PaperProvider } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db",
    accent: "#f1c40f",
    background: "#181937",
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <Stack>
          <Stack.Screen options={{ headerShown: false }} name="index" />
        </Stack>
      </Provider>
    </PaperProvider>
  );
}
