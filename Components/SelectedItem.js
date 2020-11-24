import React, { Component , useState } from 'react';
import {
    TextInput,
    Text,
    View,
    Picker,
    FlatList
}from "react-native"
export default class SelectItem extends Component
{

 
    render(){
        const [selectedValue, setSelectedValue] = useState("java");
        return(
            <View >
      <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
    </View>
        )
    }


}
