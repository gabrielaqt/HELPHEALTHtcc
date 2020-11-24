import React, { Fragment, Component, useState } from 'react';
import {
    Text,
    View,
    Button,
    Alert,
    ScrollView
} from "react-native";
import { Image, Divider } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import adicionarMed from '../api/sendMedicamentos'
import { createStackNavigator } from '@react-navigation/stack';
import axios from "axios";
import noChecked from '../Images/NoChecked.png'
import Checked from '../Images/Checked.png'
import { DatabaseConnection } from '../dataBase/dataBase'
const db = DatabaseConnection.getConnection()
const medicamentos = "medicamentos";
const horarioMedicamentos = "horarioMedicamentos";
import Clock from '../Components/Clock'
import { NavigationContainer } from '@react-navigation/native';
import agenda from '../Images/agenda.png'
import historico from '../Images/Histórico.png'
import reposicao from '../Images/reposição.png'
import cadastro from '../Images/cadastro.png'
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import wifi from '../Images/wifi.png'
import {setIP, getIP} from "./utils"
import Dialog from "react-native-dialog";


console.disableYellowBox = true;


const entrouNoCompA = false;
const entrouNoCompB = false;
const Stack = createStackNavigator(


);
var teste = "{"
var consultaA = "";
var consultaB = "";
var consultaC="";
var consultaD="";
var consultaE="";
export default class PagIntermediaria extends  Component {
    constructor(props){
        super(props)
        console.log("ssfsdfds",props)
        this.state={
            desabilitaBotao: true,
            result:"",
            dialogVisible: false,
            ip:''
        }
      //  desabilitaBotao = props
    }

    showDialog = () => {
        this.setState({ dialogVisible: true });
        
      };
      handleCancel = () => {
        this.setState({nome: ""})
      this.setState({ dialogVisible: false });
      new Promise((resolve, reject) => db.transaction(tx => {
        tx.executeSql(`select * from ipConfig`, [], (_, { rows }) => {
            console.log("****TABELA IPCONFIG******");

            resolve(rows)
           
         //   console.log("GET IPPPPPPPPPPPPPPPPPPPPPPPP====",rows._array[0].ip);
           

            
        }), (sqlError) => {
            console.log(sqlError);
        }
    }, (txError) => {
        console.log(txError);
    }))
    };
    handleSave = () => {
        console.log("IPPPPPPP",this.state.ip)
        if(this.state.ip  != "")
        {
            this.setState({ dialogVisible: false });
        }
        setIP(this.state.ip);
       
    } 
  
    componentDidMount(props){
        this.props.navigation.setOptions({
            headerRight: () => (
<TouchableOpacity onPress={()=>this.showDialog()}>
<View>
<Image source={wifi} style={{ marginRight:13,marginTop: 0,height:30, width:30, position: 'relative' }} />
   </View>
                                   
                                </TouchableOpacity>
               
              )
          });
        console.log("AQUiiiiiiiiiiiiiiiiiI", props)
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos}`, [], (_, { rows }) => {

                if (rows.length != 0) {

                    this.setState({desabilitaBotao: false});
                }

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    }
    componentWillUnmount(){
       // ws.close();
    }


    static getDerivedStateFromProps(props, state){
        console.log("AQUI EH ==", props)
   
        console.log("sjdhjasdhjkashd========", props.route.params.textDetect)
        console.log("AQUI EH=", state)
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos}`, [], (_, { rows }) => {

                if (rows.length != 0) {

                    return{
                        desabilitaBotao: false
                    } 
                }

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
        if(props.route.params.cadastroExiste == true &&  props.route.params.desabilitaBotao == false){

            return{
                desabilitaBotao: false
            } 
        
        }
       


    }
cadastro(){
    this.props.navigation.navigate('RegisterMedicines')
    

   
}

    render() {
        ///VERIFICA SE JA EXISTE NO BANCO        
        // const imageText = this.props.route.params.textDetect;
        // console.log("image text = ", imageText);
    
        // this.state.result = "";
        // for (let i = 0; i < imageText.length; i++) {
        //   this.state.result += imageText[i] + ' ';
        // }
    
        //FIM VERIFICAÇÂO BANCO        
        return (
            <ScrollView>
            <Fragment >
            <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title style={{color:"black"}}>Insira o IP</Dialog.Title>
                    <Dialog.Title style={{color:"black", fontSize:12}}>Aperte o botão azul da caixa de comprimidos</Dialog.Title>
                    <Dialog.Title style={{color:"black", fontSize:12}}>e insira o IP exibido !</Dialog.Title>
                    <Dialog.Input 
                        onChangeText={ip => this.setState({ip: ip})}
                        value={this.state.ip}
                        placeholder="Ex.: 192.168.0.1"
                        style={{borderColor: 'gray',borderWidth: 1 }}
                        keyboardType={'numeric'}
                        >
                        </Dialog.Input>
                
                
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                    <Dialog.Button label="Salvar" onPress={this.handleSave} />
                </Dialog.Container>

                  

                <View style={{ width: 200, height: 150, marginTop: 120, marginLeft: 130 }}>
                <Button
                        style={{ color: 'black' }}
                        color='#65a3f7'
                        theme='dark'
                        title="Cadastro"
                        onPress={() => this.cadastro()}
                    />
                      <View style={{width:50, marginLeft:-55, marginTop: -40 }}>
                        <Image source={cadastro} style={{ marginTop: 0,height: 45, width: 45, position: 'relative' }} />

                    </View>
                   
                </View>
                <View style={{ width: 200, height: 150,marginTop: -20, marginLeft: 130 }}>
{
    console.log("sdhjkasdhjkasdhajkdsh", this.props.route.params.textDetect)
}
                <Button
                    disabled={this.state.desabilitaBotao }
                        style={{ color: 'black' }}
                        color='#65a3f7'
                        theme='dark'
                        title="Agenda"
                        onPress={() => this.props.navigation.navigate('Home')}
                    />
                    <View style={{ width:50,marginLeft:-55, marginTop: -40 }}>
                      <TouchableOpacity  onPress={() => this.props.navigation.navigate('Home')}>
                        <Image source={agenda} style={{ marginTop: 0,height: 45, width: 45, position: 'relative' }} />
                        </TouchableOpacity>

                    </View>
                   
                </View>
                <View style={{ width: 200, height: 150,marginTop: -20, marginLeft: 130 }}>
                    <Button
                        disabled={this.state.desabilitaBotao}
                        style={{ color: 'black' }}
                        color='#65a3f7'
                        theme='dark'
                        title="Reposição"
                        onPress={() =>   this.props.navigation.navigate('Reposicao')}
                    />
                     <View style={{width:50, marginLeft:-55, marginTop: -40 }}>
                        <Image source={reposicao} style={{ marginTop: 0,height: 45, width: 45, position: 'relative' }} />

                    </View>
                </View>
                <View style={{ width: 200, height: 150,marginTop: -20, marginLeft: 130 }}>
                <Button
                        disabled={this.state.desabilitaBotao}
                        style={{ color: 'black' }}
                        color='#65a3f7'
                        theme='dark'
                        title="Histórico"
                        onPress={() =>  this.props.navigation.navigate('Historico')}
                    />
                     <View style={{ width:50,marginLeft:-55, marginTop: -40 }}>
                        <Image source={historico} style={{ marginTop: 0,height: 45, width: 45, position: 'relative' }} />

                    </View>
                </View>
                <Clock/>
                {/* <View style={{ flex: 1, alignItems: 'center',justifyContent: 'center', marginTop:-115 }}>
        <Text>Home Screen</Text>
        <TextInput
          style={{ borderColor: 'gray', borderWidth: 1, width: 250 }}
          value={this.state.result}
          multiline={true} />

        <Button
          title="open camera"
          onPress={() => this.props.navigation.navigate('camera')}
        />
        </View> */}
            </Fragment>
           
            </ScrollView>
        )
    }
}


//let desabilitaBotao = true;


