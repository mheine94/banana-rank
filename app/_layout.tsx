import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Provider store={store}>
        <Stack>
          <Stack.Screen name="index" />
        </Stack>
      </Provider>
    </PaperProvider>
  );
}
