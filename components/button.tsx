import React from "react";
import { Text, TouchableOpacity } from "react-native";


const Button = ({name}: {name: string}, handlePress: () => void) => {


 
  return (
    <TouchableOpacity style={{ backgroundColor: "red", padding: 10, borderRadius: 10}} onPress={handlePress}>
      <Text style={{ color: "white" }}>{name || "Button"}</Text>
    </TouchableOpacity>
  );
};

export default Button;