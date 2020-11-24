import React, { Fragment, useState, Component } from 'react';
import {
    TextInput,
    Text,
    View,
    TouchableOpacity,
    Picker,
    StyleSheet,
    Button,
    ScrollView
} from "react-native";
import { Image, Divider } from 'react-native-elements';
import lyla1 from '../Images/Lyla1.png'
import lyla2 from '../Images/Lyla2.png'
import axios from "axios";




export default class LylaInteractive extends Component {

    constructor(props) {
        super(props)
        this.state={
            lyla1: true,
        }
    }

   
      
    laylaMedicementos = async () => {
        this.setState({lyla1:false})
    }
    cadastroMedicamentos = async () => {
       
        
        this.props.navigation.navigate('RegisterMedicines')
        
    }

    render() {
        return (

            <View>
                 {this.state.lyla1 ? (
                     <View>
                <View style={{ marginTop: 100 }}>
                    <Image source={lyla1} style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }} />

                </View>
                <View style={{ marginLeft:150,marginTop: 100, width:120, height:190  }}>
                    <Button
                        style={{ color: 'black',}}
                        color='#96c1fa'
                        theme='dark'
                        title="Próximo >"
                        onPress={this.laylaMedicementos} />
                </View></View>):(<View>
                     <View style={{ marginTop: 100 }}>
                     <Image source={lyla2} style={{ height: 400, width: 400, alignItems: 'center', justifyContent: 'center' }} />
 
                 </View>
                 <View style={{ marginLeft:150,marginTop: 100, width:120, height:190  }}>
                     <Button
                         style={{ color: 'black',}}
                         color='#96c1fa'
                         theme='dark'
                         title="Cadastrar >"
                         onPress={this.cadastroMedicamentos} />
                 </View></View>

                )}
            </View>
        )
    }


}
