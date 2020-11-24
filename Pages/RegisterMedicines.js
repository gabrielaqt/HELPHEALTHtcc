import React, { Fragment, Component, useState } from 'react';
import {
    Text,
    View,
    Button,
    Alert
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
import {getIP} from './utils'

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
var ws ="";
console.disableYellowBox = true;

export default class RegisterMedicines extends  Component {


    constructor(props) {
        super(props)
        this.state = {
            changeCheckedA: true,
            changeCheckedB: true,
            changeCheckedC: true,
            changeCheckedD: true,
            changeCheckedE: true,
            existeA: true,
            existeB: true,
            existeC: true,
            existeD: true,
            existeE: true

        }
        this.json = "";
        this.ip="";
     
       
    }

    componentWillUnmount()
    {
        
        if(ws != "")
        {
            ws.close();
        }
       
    }

    setWebSocket()
    {
        console.log("RHIDHIDHIHD", this.ip)
        ws = new WebSocket(`ws://${this.ip}:1337/qntRemedio`)
        ws.onopen = (teste) =>{
            console.log("CONECTADO");
            ws.send('remedio'); // send a message
            console.log(teste);
        }
        ws.onmessage = (evt) =>{
            console.log("RECEBI DO SOCKET === "+ evt.data);
            var object = JSON.parse(evt.data);
            if(object.totalA != -1){
            new Promise((resolve, reject) => db.transaction(
                tx => {
                    tx.executeSql(`update ${medicamentos} set  qntTotal=?
                       where compartimento = ?`,
                        [object.totalA, "A"],
                        (_, { insertId, rows }) => {
                          
                            // //CHAMA FUNCAO _________
                            // this.enviaDados();
                            // this.props.navigation.navigate('Home', {repoeA: totaal, reposA: true})
    
                        }), (sqlError) => {
                            console.log(sqlError);
                        }
                }, (txError) => {
                    console.log(txError);
                }));
                new Promise((resolve, reject) => db.transaction(
                    tx => {
                        tx.executeSql(`update ${medicamentos} set  qntTotal=?
                           where compartimento = ?`,
                            [object.totalB, "B"],
                            (_, { insertId, rows }) => {
                               
        
                            }), (sqlError) => {
                                console.log(sqlError);
                            }
                    }, (txError) => {
                        console.log(txError);
                    }));
                    new Promise((resolve, reject) => db.transaction(
                        tx => {
                            tx.executeSql(`update ${medicamentos} set  qntTotal=?
                               where compartimento = ?`,
                                [object.totalC, "C"],
                                (_, { insertId, rows }) => {
                                  
            
                                }), (sqlError) => {
                                    console.log(sqlError);
                                }
                        }, (txError) => {
                            console.log(txError);
                        }));
                        new Promise((resolve, reject) => db.transaction(
                            tx => {
                                tx.executeSql(`update ${medicamentos} set  qntTotal=?
                                   where compartimento = ?`,
                                    [object.totalD, "D"],
                                    (_, { insertId, rows }) => {
                                      
                
                                    }), (sqlError) => {
                                        console.log(sqlError);
                                    }
                            }, (txError) => {
                                console.log(txError);
                            }));
                            new Promise((resolve, reject) => db.transaction(
                                tx => {
                                    tx.executeSql(`update ${medicamentos} set  qntTotal=?
                                       where compartimento = ?`,
                                        [object.totalE, "E"],
                                        (_, { insertId, rows }) => {
                                          
                    
                                        }), (sqlError) => {
                                            console.log(sqlError);
                                        }
                                }, (txError) => {
                                    console.log(txError);
                                }));
                }
                  
    
        }
        ws.onerror = (e) => {
            console.log("ERRO")
            // an error occurred
            console.log(e.message);
          };
    }
    componentDidMount() {
        console.log("AQUI")
        console.log("AQUIIIIIIIIII",getIP())
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ipConfig`, [], (_, { rows }) => {
                console.log("****TABELA IPCONFIG******");
    
                resolve(rows)
               
               if(rows.length>0)
               {
                   //  ws = new WebSocket(`ws://${rows._array[0].ip}:1337/qntRemedio`)
                this.ip= rows._array[0].ip;
                console.log("AQUI ____")
                this.setWebSocket()
               }
              
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    
    
    //    console.log("TESTE===", props.route.params.checkedA)
        this.setaEstado();
//this.testee();
console.log("entriu na func")
new Promise((resolve, reject) => db.transaction(tx => {
    tx.executeSql(`select * from ${medicamentos}`, [], (_, { rows }) => {
      //  console.log("AU", rows)
        for(var i=0;i<rows.length;i++){
            if(rows._array[i].compartimento == "A"){
               consultaA = "A";
               console.log("EXISTE A");
               this.setState({ changeCheckedA: false })
               this.setState({existeA: false})
            }
            if(rows._array[i].compartimento == "B"){
               consultaB = "B";
                console.log("EXISTE B");
                
                this.setState({ changeCheckedB: false })
                this.setState({existeB: false})
            }
            if(rows._array[i].compartimento == "C"){
                consultaC = "C";
                console.log("EXISTE C");

                this.setState({ changeCheckedC: false })
                this.setState({existeC: false})
            }
            if(rows._array[i].compartimento == "D"){
             consultaD = "D";
                console.log("EXISTE D");
                this.setState({ changeCheckedD: false })
                this.setState({existeD: false})

            }
            if(rows._array[i].compartimento == "E"){
             consultaE = "E";
                console.log("EXISTE E");
                this.setState({ changeCheckedE: false })
                this.setState({existeE: false})
            }
        }
     

    }), (sqlError) => {
        console.log(sqlError);
    }
}, (txError) => {
    console.log(txError);
}))

      
       
    }

    static getDerivedStateFromProps(props, state){
        console.log("NOVO ==", props)
        console.log("STSTE=", state)
        ///SE A TRUE
       
        if(props.route.params.checkedA == true ){
           if(props.route.params.checkedB == true || state.existeB == false){
               if(props.route.params.checkedC == true || state.existeC == false) {
                   if(props.route.params.checkedD == true || state.existeD == false){
                       console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                       if(props.route.params.checkedE === true){
                        console.log("&&&&&&&&&&&&&&&&&&&&ddgdfgdf&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")

                        return{
                            changeCheckedA: false,
                            existeA: false,
                            changeCheckedB: false,
                            existeB: false,
                            changeCheckedC: false,
                            existeC: false,
                            changeCheckedD: false,
                            existeD: false,
                            changeCheckedE: false,
                            existeE: false,
                          
                           } 
                       }
                       else{
                        return{
                            changeCheckedA: false,
                            existeA: false,
                            changeCheckedB: false,
                            existeB: false,
                            changeCheckedC: false,
                            existeC: false,
                            changeCheckedD: false,
                            existeD: false,
                          
                           } 
                       }
                    
                   }
                   else{
                    return{
                        changeCheckedA: false,
                        existeA: false,
                        changeCheckedB: false,
                        existeB: false,
                        changeCheckedC: false,
                        existeC: false,
                      
                       } 
                   }
               
               }
               else{
                    return{
                        changeCheckedA: false,
                        existeA: false,
                        changeCheckedB: false,
                        existeB: false,
                       
                    
                    } 
               }
          
           }
           else{
            return{
                changeCheckedA: false,
                existeA: false,
              
               } 
           }
                
           
          
        }
        else{
            
          
            if(consultaA == "A" ){
                console.log("ENTROU AQUI ")
                props.route.params.checkedA = true;
                if(consultaB == "B" ){
                    console.log("ENTROU AQUI B")
                    props.route.params.checkedB = true;
                    if(consultaC == "C" ){
                        props.route.params.checkedC = true;
                        console.log("ENTROU AQUI C")
                        if(consultaD == "D" ){
                            props.route.params.checkedD = true;
                            console.log("ENTROU AQUI D")
                            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                            if(consultaE == "E" ){
                                props.route.params.checkedE = true;
                                console.log("ENTROU AQUI E")
                             console.log("&&&&&&&&&&&&&&&&&&&&ddgdfgdf&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
     
                             return{
                                 changeCheckedA: false,
                                 existeA: false,
                                 changeCheckedB: false,
                                 existeB: false,
                                 changeCheckedC: false,
                                 existeC: false,
                                 changeCheckedD: false,
                                 existeD: false,
                                 changeCheckedE: false,
                                 existeE: false,
                               
                                } 
                            }
                            else{
                             return{
                                 changeCheckedA: false,
                                 existeA: false,
                                 changeCheckedB: false,
                                 existeB: false,
                                 changeCheckedC: false,
                                 existeC: false,
                                 changeCheckedD: false,
                                 existeD: false,
                               
                                } 
                            }
                         
                        }
                        else{
                         return{
                             changeCheckedA: false,
                             existeA: false,
                             changeCheckedB: false,
                             existeB: false,
                             changeCheckedC: false,
                             existeC: false,
                           
                            } 
                        }
                    
                    }
                    else{
                         return{
                             changeCheckedA: false,
                             existeA: false,
                             changeCheckedB: false,
                             existeB: false,
                            
                         
                         } 
                    }
               
                }
                else{
                 return{
                     changeCheckedA: false,
                     existeA: false,
                   
                    } 
                }
                     
                
               
             }
             else{
                 return(null)
             }
        }
           
      
    }
    setaEstado = async () => {

            console.log("ENTRIY")
        this.setState({ changeCheckedA: this.state.existeA })
        this.setState({ changeCheckedB: this.state.existeB })
        this.setState({ changeCheckedC: this.state.existeC })
        this.setState({ changeCheckedD: this.state.existeD })
        this.setState({ changeCheckedE: this.state.existeE })
 

      


    }

    testee (){

      
    }
 
    navigateCompA = async () => {
        this.props.navigation.navigate('CompartimentoA')
    }
    navigateCompB = async () => {
        this.props.navigation.navigate('CompartimentoB')

    }
    navigateCompC = async () => {
        this.props.navigation.navigate('CompartimentoC')

    }
    navigateCompD = async () => {
        this.props.navigation.navigate('CompartimentoD')

    }
    navigateCompE = async () => {
        this.props.navigation.navigate('CompartimentoE')

    }

    navigationHome = async () => {
        Alert.alert(
            'Enviar dados',
            'Deseja enviar os dados ?',
            [
              {text: 'NÃO', onPress: () => this.enviaDados()},
              {text: 'SIM', onPress: () => this.naoEnviaDados()},
            ]
          );

    }
    
    navigationAgenda = async () => {



        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos}`, [], (_, { rows }) => {

                if (rows.length != 0) {

                    testew = false
                    this.props.navigation.navigate('PagInterm', {cadastroExiste: true, desabilitaBotao: testew})

                }

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
        this.props.navigation.navigate('PagInterm', {cadastroExiste: true, desabilitaBotao: true})

    }

    enviaDados = async () =>{
        console.warn('NO Pressed')
    }
    
    naoEnviaDados = async () =>{
        console.warn('YES Pressed')
        console.log('TA CHAMANDO')
        this.montaJSON();
        console.log(teste)
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos}`, [], (_, { rows }) => {

                if (rows.length != 0) {

                    testew = false
                    this.props.navigation.navigate('PagInterm', {cadastroExiste: true, desabilitaBotao: testew})

                }

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
        this.props.navigation.navigate('PagInterm', {cadastroExiste: true, desabilitaBotao: true})
    }
    consultaBD(compartimento) {

    }
    enviaDadosArduino(json){
         console.log("JSON ENVIAR", json)
       // axios.post(`http://192.168.4.1/`, json,
       console.log("*****************************************************",this.ip)

    axios.post(`http://${this.ip}:8080/teste`, json,
        {
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(function(response){
          //  this.const = response.data;
           console.log('Recebi de volta isso do Arduino')
           console.log(response.data)

          // console.log(response.config.data)

        })
        .catch(function(erro){
            console.log("MUDAR IP")
        })
    }
    montaJSON() {
        teste= ""
        teste = teste.concat("{")
        this.json = this.json.concat("{")
        var compartimentoA = "A"
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoA], (_, { rows }) => {

                if (rows.length != 0) {

                    teste = teste.concat('"tipo"');
                    teste = teste.concat(':');
                    teste = teste.concat('"payload"');
                    teste = teste.concat(',');
                    teste = teste.concat('"compartimentoA"');
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].compartimento)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('nomeA')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].nome)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('doseA')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].qntDose)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('totalA')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].qntTotal)
                    teste = teste.concat('"')

                    this.consultaHorarios();

                }
                else {
                    teste = teste.concat('"tipo"');
                    teste = teste.concat(':');
                    teste = teste.concat('"payload"');
                    teste = teste.concat(',');
                    teste = teste.concat('"compartimentoA"');
                    teste = teste.concat(':')
                    teste = teste.concat('"null"')
                    this.montarJsonB();
                }

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))

        

      
       

    }
montarJsonB(){
    var compartimentoB = "B"
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoB], (_, { rows }) => {
                if (rows.length != 0) {

                    teste = teste.concat(',');
                    teste = teste.concat('"compartimentoB"');
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].compartimento)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('nomeB')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].nome)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('doseB')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].qntDose)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('totalB')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].qntTotal)
                    teste = teste.concat('"')

                    this.consultaHorariosB();

                }
                else {
                    teste = teste.concat(',');
                    teste = teste.concat('"compartimentoB"');
                    teste = teste.concat(':')
                   
                    teste = teste.concat('"null"')
                    this.montarJsonC();
                }

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
}
montarJsonC(){
    var compartimentoC = "C"
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoC], (_, { rows }) => {
                if (rows.length != 0) {

                    teste = teste.concat(',');
                    teste = teste.concat('"compartimentoC"');
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].compartimento)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('nomeC')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].nome)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('doseC')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].qntDose)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('totalC')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].qntTotal)
                    teste = teste.concat('"')

                    this.consultaHorariosC();

                }
                else {
                    teste = teste.concat(',');
                    teste = teste.concat('"compartimentoC"');
                    teste = teste.concat(':')
                   
                    teste = teste.concat('"null"')
                    this.montarJsonD();
                    
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
}
montarJsonD(){
    var compartimentoD = "D"
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoD], (_, { rows }) => {
                if (rows.length != 0) {

                    teste = teste.concat(',');
                    teste = teste.concat('"compartimentoD"');
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].compartimento)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('nomeD')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].nome)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('doseD')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].qntDose)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('totalD')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].qntTotal)
                    teste = teste.concat('"')

                    this.consultaHorariosD();

                }
                else {
                    teste = teste.concat(',');
                    teste = teste.concat('"compartimentoD"');
                    teste = teste.concat(':')
                   
                    teste = teste.concat('"null"')
                    this.montarJsonE();
                    
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
}
montarJsonE(){
    var compartimentoE = "E"
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoE], (_, { rows }) => {
                if (rows.length != 0) {

                    teste = teste.concat(',');
                    teste = teste.concat('"compartimentoE"');
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].compartimento)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('nomeE')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].nome)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('doseE')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].qntDose)
                    teste = teste.concat('"')
                    teste = teste.concat(',')
                    teste = teste.concat('"')
                    teste = teste.concat('totalE')
                    teste = teste.concat('"')
                    teste = teste.concat(':')
                    teste = teste.concat('"')
                    teste = teste.concat(rows._array[0].qntTotal)
                    teste = teste.concat('"')

                    this.consultaHorariosE();

                }
                else {
                    teste = teste.concat(',');
                    teste = teste.concat('"compartimentoE"');
                    teste = teste.concat(':')
                   
                    teste = teste.concat('"null"')
                    teste = teste.concat('}')
                    console.log("FIM", teste)
                    this.enviaDadosArduino(teste);

                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
}
    consultaHorarios() {
        var compartimento = "A"
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${horarioMedicamentos} where compartimento = ? order by horario asc `, [compartimento], (_, { rows }) => {
console.log("Ahh",rows._array);
                if (rows.length != 0) {
                                            teste = teste.concat(',')

                    teste = teste.concat('"horariosA"');
                    teste = teste.concat(':')
                    teste = teste.concat('[')


                        
                 

                    
                    for (var i = 0; i < rows._array.length; i++) {


console.log("Peguei",rows._array[i].horario )


                       
                        teste = teste.concat('"');
                        teste = teste.concat(rows._array[i].horario)
                        teste = teste.concat('"')
                        if (i != rows._array.length - 1) {
                            teste = teste.concat(',')
                        }

                    }
                    teste = teste.concat(']')
                }
                this.montarJsonB();


            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    }
    consultaHorariosB() {
        var compartimento = "B"
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${horarioMedicamentos} where compartimento = ?  order by horario asc `, [compartimento], (_, { rows }) => {

                if (rows.length != 0) {
                    teste = teste.concat(',')
                    teste = teste.concat('"horariosB"');
                    teste = teste.concat(':')
                    teste = teste.concat('[')
                    for (var i = 0; i < rows._array.length; i++) {




                        teste = teste.concat('"');
                        teste = teste.concat(rows._array[i].horario)
                        teste = teste.concat('"')
                        if (i != rows._array.length - 1) {
                            teste = teste.concat(',')
                        }

                    }
                    teste = teste.concat(']')
                }
                this.montarJsonC();

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    }
    consultaHorariosC() {
        var compartimento = "C"
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${horarioMedicamentos} where compartimento = ?  order by horario asc `, [compartimento], (_, { rows }) => {

                if (rows.length != 0) {
                    teste = teste.concat(',')
                    teste = teste.concat('"horariosC"');
                    teste = teste.concat(':')
                    teste = teste.concat('[')
                    for (var i = 0; i < rows._array.length; i++) {

                        teste = teste.concat('"');
                        teste = teste.concat(rows._array[i].horario)
                        teste = teste.concat('"')
                        if (i != rows._array.length - 1) {
                            teste = teste.concat(',')
                        }

                    }
                    teste = teste.concat(']')
                }
                this.montarJsonD();

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    }
    consultaHorariosD() {
        var compartimento = "D"
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${horarioMedicamentos} where compartimento = ?  order by horario asc  `, [compartimento], (_, { rows }) => {

                if (rows.length != 0) {
                    teste = teste.concat(',')
                    teste = teste.concat('"horariosD"');
                    teste = teste.concat(':')
                    teste = teste.concat('[')
                    for (var i = 0; i < rows._array.length; i++) {




                        teste = teste.concat('"');
                        teste = teste.concat(rows._array[i].horario)
                        teste = teste.concat('"')
                        if (i != rows._array.length - 1) {
                            teste = teste.concat(',')
                        }

                    }
                    teste = teste.concat(']')
                }
                this.montarJsonE();
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    }
    consultaHorariosE() {
        var compartimento = "E"
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${horarioMedicamentos} where compartimento = ? order by horario asc  `, [compartimento], (_, { rows }) => {

                if (rows.length != 0) {
                    teste = teste.concat(',')
                    teste = teste.concat('"horariosE"');
                    teste = teste.concat(':')
                    teste = teste.concat('[')
                    for (var i = 0; i < rows._array.length; i++) {




                        teste = teste.concat('"');
                        teste = teste.concat(rows._array[i].horario)
                        teste = teste.concat('"')
                        if (i != rows._array.length - 1) {
                            teste = teste.concat(',')
                        }

                    }
                    teste = teste.concat(']')
                    teste = teste.concat('}')
                }
               // this.montarJsonE();
console.log("FIM", teste);

this.enviaDadosArduino(teste);




            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    }

    render() {
        ///VERIFICA SE JA EXISTE NO BANCO        
      
     console.log("AHAHHAHA",this.props)
     
        //FIM VERIFICAÇÂO BANCO        
        return (
            <Fragment >

                <View style={{ alignItems: 'center', marginRight: 25 }} >

                    <View style={{ width: 200, marginTop: 50 }}>

                        <Button
                            style={{ color: 'black' }}
                            color='#96c1fa'
                            theme='dark'
                            title="Compartimento A"
                            onPress={this.navigateCompA}
                        />
                        <View style={{ marginLeft: 205, marginTop: -40 }}>


                            {this.state.changeCheckedA ? (
                                <Image source={noChecked} style={{ height: 45, width: 45, position: 'relative' }} />


                            ) : (
                                    <Image source={Checked} style={{ height: 45, width: 45, position: 'relative' }} />

                                )}
                        </View>
                    </View>
                    <View style={{ width: 200, marginTop: 50 }}>

                        <Button
                        disabled={this.state.existeA} 
                            style={{ color: 'black' }}
                            color='#96c1fa'
                            theme='dark'
                            title="Compartimento B"
                            onPress={this.navigateCompB}
                        />
                        <View style={{ marginLeft: 205, marginTop: -40 }}>

                            {this.state.changeCheckedB ? (
                                <Image source={noChecked} style={{ height: 45, width: 45, position: 'relative' }} />


                            ) : (
                                    <Image source={Checked} style={{ height: 45, width: 45, position: 'relative' }} />

                                )}
                        </View>
                    </View>
                    <View style={{ width: 200, marginTop: 50 }}>

                        <Button
                         disabled={this.state.existeB} 
                            style={{ color: 'black' }}
                            color='#96c1fa'
                            theme='dark'
                            title="Compartimento C"
                            onPress={this.navigateCompC}
                        />
                        <View style={{ marginLeft: 205, marginTop: -40 }}>
                            {this.state.changeCheckedC ? (
                                <Image source={noChecked} style={{ height: 45, width: 45, position: 'relative' }} />


                            ) : (
                                    <Image source={Checked} style={{ height: 45, width: 45, position: 'relative' }} />

                                )}
                        </View>
                    </View><View style={{ width: 200, marginTop: 50 }}>

                        <Button
                         disabled={this.state.existeC} 
                            style={{ color: 'black' }}
                            color='#96c1fa'
                            theme='dark'
                            title="Compartimento D"
                            onPress={this.navigateCompD}
                        />
                        <View style={{ marginLeft: 205, marginTop: -40 }}>
                            {this.state.changeCheckedD ? (
                                <Image source={noChecked} style={{ height: 45, width: 45, position: 'relative' }} />


                            ) : (
                                    <Image source={Checked} style={{ height: 45, width: 45, position: 'relative' }} />

                                )}
                        </View>
                    </View>
                    <View style={{ width: 200, marginTop: 50 }}>

                        <Button
                         disabled={this.state.existeD} 
                            style={{ color: 'black' }}
                            color='#96c1fa'
                            theme='dark'
                            title="Compartimento E"
                            onPress={this.navigateCompE}
                        />
                        <View style={{ marginLeft: 205, marginTop: -40 }}>
                            {this.state.changeCheckedE ? (
                                <Image source={noChecked} style={{ height: 45, width: 45, position: 'relative' }} />


                            ) : (
                                    <Image source={Checked} style={{ height: 45, width: 45, position: 'relative' }} />

                                )}
                        </View>
                    </View>


                 

                </View>
                <View style={{ width: 300, height: 100, marginTop: 50, marginLeft: 60 }}>
                    <Button
                        style={{ color: 'black' }}
                        color='#65a3f7'
                        theme='dark'
                        title="ENVIAR DADOS"
                        onPress={this.navigationHome}
                    />
                </View>
                <View style={{ width: 300, height: 100,marginTop: -20, marginLeft: 60 }}>
                    <Button
                        style={{ color: 'black' }}
                        color='#65a3f7'
                        theme='dark'
                        title="< Voltar"
                        onPress={this.navigationAgenda}
                    />
                </View>
              

            </Fragment>


        )
    }
}
var saveChangeCheckedA;

let testew = true

/**
 
  var compartimentoA = "A"

        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoA], (_, { rows }) => {

                if(rows.length != 0){
                  this.setState({ changeCheckedA: false })
                  this.setState({existeA: false})

                }

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))

        var compartimentoB = "B"

        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoB], (_, { rows }) => {

                if(rows.length != 0){
                  this.setState({ changeCheckedB: false })
                  this.setState({existeB: false})
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))

        var compartimentoC = "C"

        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoC], (_, { rows }) => {

                if(rows.length != 0){
                  this.setState({ changeCheckedC: false })
                  this.setState({existeC: false})
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
        var compartimentoD = "D"

        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoD], (_, { rows }) => {

                if(rows.length != 0){
                  this.setState({ changeCheckedD: false })
                  this.setState({existeD: false})
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
        var compartimentoE = "E"

        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoE], (_, { rows }) => {

                if(rows.length != 0){
                  this.setState({ changeCheckedE: false })
                  this.setState({existeE: false})
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))

 */