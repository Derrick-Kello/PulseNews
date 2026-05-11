import { Redirect, type Href } from "expo-router";

export default function IndexWeb() {
  return <Redirect href={"/(tabs)" as Href} />;
}
