import { NativeRouter } from "react-router-native";
import Main from "./src/components/Main";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <NavigationContainer>
      <NativeRouter>
        <Main />
      </NativeRouter>
    </NavigationContainer>
  );
}
