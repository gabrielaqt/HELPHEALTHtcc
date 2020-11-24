import React, { Component, useState } from "react";
import { Picker, StyleSheet, ScrollView, TouchableOpacity, View, Button, TextInput, Text, } from "react-native";
import { Image, Divider } from 'react-native-elements';
import { DatabaseConnection } from '../dataBase/dataBase'
const db = DatabaseConnection.getConnection()
const medicamentos = "medicamentos";
const horarioMedicamentos = "horarioMedicamentos";
import axios from "axios"
var compartimentoA = "A"
var compartimentoB = "B"
var compartimentoC = "C"
var compartimentoD = "D"
var compartimentoE = "E"
var ws="";
var nome;
export default class Reposicao extends Component {

    
    constructor(props) {
        
        super(props)
        this.state = {
            mes: "",
            remedio: "",
            nomeA: "",
            h1A: "",
            h2A: "",
            h3A: "",
            h4A: "",
            nomeB: "",
            h1B: "",
            h2B: "",
            h3B: "",
            h4B: "",
            nomeC: "",
            h1C: "",
            h2C: "",
            h3C: "",
            h4C: "",
            nomeD: "",
            h1D: "",
            h2D: "",
            h3D: "",
            h4D: "",
            nomeE: "",
            h1E: "",
            h2E: "",
            h3E: "",
            h4E: "",
            qntA:"",
            qntB:"",
            qntC:"",
            qntD:"",
            qntE:"",
            existeA: false,
            existeB: false,
            existeC: false,
            existeD: false,
            existeE: false,
            historico: false
        }
        this.ip="";

    }
 

    static getDerivedStateFromProps(props, state){
        
    console.log(props)
           if(props.route.params.reposA == true)
           {
               console.log(props)
               return({qntA: props.route.params.repoeA})
               
           }
           if(props.route.params.reposB == true)
           {
               console.log(props)
               return({qntB: props.route.params.repoeB})
               
           }
           if(props.route.params.reposC == true)
           {
               console.log(props)
               return({qntC: props.route.params.repoeC})
               
           }
           if(props.route.params.reposD == true)
           {
               console.log(props)
               return({qntD: props.route.params.repoeD})
               
           }
           if(props.route.params.reposE == true)
           {
               console.log(props)
               return({qntE: props.route.params.repoeE})
               
           }
          
       }

   
       setWebSocket()
       {
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
                           console.log("ATT BANCO");
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
                               console.log("ATT BANCO");
                              
        
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
                                   console.log("ATT BANCO");
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
                                    [object.totalD, "D"],
                                    (_, { insertId, rows }) => {
                                       console.log("ATT BANCO");
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
                                        [object.totalE, "E"],
                                        (_, { insertId, rows }) => {
                                           console.log("ATT BANCO");
                                            // //CHAMA FUNCAO _________
                                            // this.enviaDados();
                                            // this.props.navigation.navigate('Home', {repoeA: totaal, reposA: true})
                    
                                        }), (sqlError) => {
                                            console.log(sqlError);
                                        }
                                }, (txError) => {
                                    console.log(txError);
                                }));
                }
                    this.AttQnt()

        }
        ws.onerror = (e) => {
            console.log("ERRO")
            // an error occurred
            console.log(e.message);
          };


       }
    
    componentDidMount() 
    {
        console.log("ATT TELA &&&&&&&&")
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ipConfig`, [], (_, { rows }) => {
                console.log("****TABELA IPCONFIG******");
    
                resolve(rows)
               if(rows.length>0)
               {
                   //  ws = new WebSocket(`ws://${rows._array[0].ip}:1337/qntRemedio`)
                this.ip= rows._array[0].ip;
                this.setWebSocket()
               }
               
              
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
      
        /////TESTE:
      

//COMPARTIMENTO A        
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoA], (_, { rows }) => {

                if (rows.length != 0) {
                    // console.log("EXISTE", rows);
                    nome = rows._array;
                    console.log("jhgdfjhgsdf" );
                    console.log(nome)
                    this.setState({ nomeA: nome[0].nome });
                    this.setState({ qntA: nome[0].qntTotal });
                    this.setState({ existeA: true});
                    // console.log(this.state.nomeA)
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${horarioMedicamentos} where compartimento = ?  order by horario asc `, [compartimentoA], (_, { rows }) => {

                if (rows.length != 0) {
                    for (var i = 0; i < rows.length; i++) {

                        nome = rows._array;
                        if (i == 0) {
                            this.setState({ h1A: nome[i].horario });

                        }
                        if (i == 1) {
                            this.setState({ h2A: "/" + " " + nome[i].horario });
                        }
                        if (i == 2) {
                            this.setState({ h3A: "/" + " " + nome[i].horario });
                        }
                        if (i == 3) {
                            this.setState({ h4A: "/" + " " + nome[i].horario });
                        }
                    }

                    // console.log(this.state.nomeA)
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
//COMPARTIMENTO B        
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoB], (_, { rows }) => {

                if (rows.length != 0) {
                    // console.log("EXISTE", rows);
                    nome = rows._array;
                    this.setState({ nomeB: nome[0].nome });
                    this.setState({ qntB: nome[0].qntTotal });
                    this.setState({ existeB: true});
                    // console.log(this.state.nomeA)
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${horarioMedicamentos} where compartimento = ?  order by horario asc `, [compartimentoB], (_, { rows }) => {

                if (rows.length != 0) {
                    for (var i = 0; i < rows.length; i++) {

                        nome = rows._array;
                        if (i == 0) {
                            this.setState({ h1B: nome[i].horario });

                        }
                        if (i == 1) {
                            this.setState({ h2B: "/" + " " + nome[i].horario });
                        }
                        if (i == 2) {
                            this.setState({ h3B: "/" + " " + nome[i].horario });
                        }
                        if (i == 3) {
                            this.setState({ h4B: "/" + " " + nome[i].horario });
                        }
                    }
                    // console.log("EXISTE", rows);

                    //  console.log(nome);
                    // console.log(this.state.nomeA)
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
//COMPARTIMETO C
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoC], (_, { rows }) => {

                if (rows.length != 0) {
                    // console.log("EXISTE", rows);
                    nome = rows._array;
                    this.setState({ nomeC: nome[0].nome });
                    this.setState({ qntC: nome[0].qntTotal });
                    this.setState({ existeC: true});
                    // console.log(this.state.nomeA)
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${horarioMedicamentos} where compartimento = ?  order by horario asc `, [compartimentoC], (_, { rows }) => {

                if (rows.length != 0) {
                    for (var i = 0; i < rows.length; i++) {

                        nome = rows._array;
                        if (i == 0) {
                            this.setState({ h1C: nome[i].horario });

                        }
                        if (i == 1) {
                            this.setState({ h2C: "/" + " " + nome[i].horario });
                        }
                        if (i == 2) {
                            this.setState({ h3C: "/" + " " + nome[i].horario });
                        }
                        if (i == 3) {
                            this.setState({ h4C: "/" + " " + nome[i].horario });
                        }
                    }
                    // console.log("EXISTE", rows);

                    //  console.log(nome);
                    // console.log(this.state.nomeA)
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
//COMPARTIMENTO D
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoD], (_, { rows }) => {

                if (rows.length != 0) {
                    // console.log("EXISTE", rows);
                    nome = rows._array;
                    this.setState({ nomeD: nome[0].nome });
                    this.setState({ qntD: nome[0].qntTotal });
                    this.setState({ existeD: true});
                    // console.log(this.state.nomeA)
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${horarioMedicamentos} where compartimento = ?  order by horario asc `, [compartimentoD], (_, { rows }) => {

                if (rows.length != 0) {
                    for (var i = 0; i < rows.length; i++) {

                        nome = rows._array;
                        if (i == 0) {
                            this.setState({ h1D: nome[i].horario });

                        }
                        if (i == 1) {
                            this.setState({ h2D: "/" + " " + nome[i].horario });
                        }
                        if (i == 2) {
                            this.setState({ h3D: "/" + " " + nome[i].horario });
                        }
                        if (i == 3) {
                            this.setState({ h4D: "/" + " " + nome[i].horario });
                        }
                    }
                    // console.log("EXISTE", rows);

                    //  console.log(nome);
                    // console.log(this.state.nomeA)
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
//COMPARTIMENTO E
new Promise((resolve, reject) => db.transaction(tx => {
    tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoE], (_, { rows }) => {

        if (rows.length != 0) {
            // console.log("EXISTE", rows);
            nome = rows._array;
            this.setState({ nomeE: nome[0].nome });
            this.setState({ qntE: nome[0].qntTotal });
            this.setState({ existeE: true});
            // console.log(this.state.nomeA)
        }
    }), (sqlError) => {
        console.log(sqlError);
    }
}, (txError) => {
    console.log(txError);
}))
    new Promise((resolve, reject) => db.transaction(tx => {
        tx.executeSql(`select * from ${horarioMedicamentos} where compartimento = ? `, [compartimentoE], (_, { rows }) => {

            if (rows.length != 0) {
                for (var i = 0; i < rows.length; i++) {

                    nome = rows._array;
                    if (i == 0) {
                        this.setState({ h1E: nome[i].horario });

                    }
                    if (i == 1) {
                        this.setState({ h2E: "/" + " " + nome[i].horario });
                    }
                    if (i == 2) {
                        this.setState({ h3E: "/" + " " + nome[i].horario });
                    }
                    if (i == 3) {
                        this.setState({ h4E: "/" + " " + nome[i].horario });
                    }
                }
                // console.log("EXISTE", rows);

                //  console.log(nome);
                // console.log(this.state.nomeA)
            }
        }), (sqlError) => {
            console.log(sqlError);
        }
    }, (txError) => {
        console.log(txError);
    }))        

    }
    mesSelected = e => {
        //   this.onChangeA(e)
        this.setState({ mes: e })

    }
    remedioSelected = e => {
        //  this.onChangeA(e)
        this.setState({ remedio: e })

    }

    navigationHistorico = async () => {
        this.props.navigation.navigate('PagInterm')
          
        if(ws != "")
        {
            ws.close();
        }
    }
    navigationCadastro= async () => {
        this.props.navigation.navigate('PagInterm')
         
        if(ws != "")
        {
            ws.close();
        }
    }
    testePegaBD() {



        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoA], (_, { rows }) => {

                if (rows.length != 0) {
                    console.log("sdjhfjsdhfj JÀ TEM");
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))


    }

    render() {

        //COMPARTIMENTO A   

        //sdlflsdkjf
        
        
        // axios.post(`http://192.168.0.106:8080/teste`, {"tipo":"qntRemedio"},
        // {
        //     headers:{
        //         'Content-Type': 'application/json'
        //     }
        // })
        // .then(function(response){
        //   //  this.const = response.data;
        //    console.log('Recebi de volta isso do Arduino')
        //    console.log(response.data)

        //   // console.log(response.config.data)

        // })
        // .catch(function(erro){
        //     console.log("MUDAR IP")
        // })

        return (
            
               
            
            <View >

                <View style={{ marginLeft: 7, borderRadius: 10, borderColor: '#83B5F8', borderWidth: 0.5, marginTop: 20, backgroundColor: 'white', height: 590, width: 400 }}>
                    <ScrollView>


                    <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 15, marginTop: 20,textDecorationLine:'underline', color:'black' }}>Compartimento A:</Text>

                        {
                            this.state.existeA?(
                            <View>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10 , color:'black'}}><Text style={{ fontWeight: 'bold', color:'black'}}>Remédio:</Text> {this.state.nomeA}</Text>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}><Text style={{ fontWeight: 'bold', color:'black'}}>Quantidade Disponível:</Text> {this.state.qntA}</Text>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10 , color:'black'}}><Text style={{ fontWeight: 'bold', color:'black'}}>Horários:</Text> {this.state.h1A} {this.state.h2A} {this.state.h3A} {this.state.h4A}</Text>
                                <View style={{ width: 65, height: 10, marginLeft: 320 ,marginTop:-30, position:'absolute'}}>
                                <Button
                                    style={{ color: 'black' }}
                                    color='#accdfb'
                                    theme='dark'
                                    title="REPOR"
                                    onPress={() => this.props.navigation.navigate('RepoeA')}
                                />
                                </View>
                            </View>):(
                            <View>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10 , color:'black'}}>Não Cadastrado</Text>
                            </View>)
                        }

                        <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 15, marginTop: 20 , textDecorationLine:'underline', color:'black'}}>Compartimento B:</Text>

                        {   this.state.existeB ?(
                            <View>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}><Text style={{ fontWeight: 'bold', color:'black'}}>Remédio:</Text> {this.state.nomeB}</Text>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}><Text style={{ fontWeight: 'bold', color:'black'}}>Quantidade Disponível:</Text> {this.state.qntB}</Text>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}><Text style={{ fontWeight: 'bold', color:'black'}}>Horários:</Text> {this.state.h1B} {this.state.h2B} {this.state.h3B} {this.state.h4B}</Text>
                                <View style={{ width: 65, height: 10, marginLeft: 320 ,marginTop:-30, position:'absolute'}}>
                                    <Button
                                        style={{ color: 'black' }}
                                        color='#accdfb'
                                        theme='dark'
                                        title="REPOR"
                                    onPress={ ()=> this.props.navigation.navigate('RepoeB')}

                                    />
                                </View>
                            </View>):(
                            <View>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}>Não Cadastrado</Text>
                            </View>)
                        }   

                        <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 15, marginTop: 20,textDecorationLine:'underline', color:'black' }}>Compartimento C:</Text>

                        { this.state.existeC ?(
                            <View> 
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black'}}><Text style={{ fontWeight: 'bold', color:'black'}}>Remédio:</Text> {this.state.nomeC}</Text>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}><Text style={{ fontWeight: 'bold', color:'black'}}>Quantidade Disponível:</Text> {this.state.qntC}</Text>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}><Text style={{ fontWeight: 'bold', color:'black'}}>Horários:</Text> {this.state.h1C} {this.state.h2C} {this.state.h3C} {this.state.h4C}</Text>
                                <View style={{ width: 65, height: 10, marginLeft: 320 ,marginTop:-30, position:'absolute'}}>
                                    <Button
                                        style={{ color: 'black' }}
                                        color='#accdfb'
                                        theme='dark'
                                        title="REPOR"
                                        onPress={ ()=> this.props.navigation.navigate('RepoeC')}
                                        />
                                </View>
                            </View>):(
                            <View>
                               <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}>Não Cadastrado</Text>

                            </View>)
                        }

                        <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 15, marginTop: 20,textDecorationLine:'underline', color:'black' }}>Compartimento D:</Text>
                        {
                            this.state.existeD ?(
                            <View>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}><Text style={{ fontWeight: 'bold', color:'black'}}>Remédio:</Text> {this.state.nomeD}</Text>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}><Text style={{ fontWeight: 'bold', color:'black'}}>Quantidade Disponível:</Text> {this.state.qntD}</Text>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}><Text style={{ fontWeight: 'bold', color:'black'}}>Horários:</Text> {this.state.h1D} {this.state.h2D} {this.state.h3D} {this.state.h4D}</Text>
                                <View style={{ width: 65, height: 10, marginLeft: 320 ,marginTop:-30, position:'absolute'}}>
                                    <Button
                                        style={{ color: 'black' }}
                                        color='#accdfb'
                                        theme='dark'
                                        title="REPOR"
                                        onPress={ ()=> this.props.navigation.navigate('RepoeD')}
                                    />
                                </View>
                            </View> ):(
                            <View>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}>Não Cadastrado</Text>

                            </View>)
                        }   

                        <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: 15, marginTop: 20,textDecorationLine:'underline', color:'black' }}>Compartimento E:</Text>

                        {  this.state.existeE ?(
                            <View>

                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10 , color:'black'}}><Text style={{ fontWeight: 'bold', color:'black'}}>Remédio:</Text> {this.state.nomeE}</Text>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10 , color:'black'}}><Text style={{ fontWeight: 'bold', color:'black'}}>Quantidade Disponível:</Text> {this.state.qntE}</Text>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}><Text style={{ fontWeight: 'bold', color:'black'}}>Horários:</Text> {this.state.h1E} {this.state.h2E} {this.state.h3E} {this.state.h4E}</Text>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10 , color:'black'}}></Text>

                                <View style={{ width: 65, height: 10, marginLeft: 320 ,marginTop:-30, position:'absolute'}}>
                                    <Button
                                        style={{ color: 'black' }}
                                        color='#accdfb'
                                        theme='dark'
                                        title="REPOR"
                                        onPress={ ()=> this.props.navigation.navigate('RepoeE')}
                                    />
                                </View>
                            </View>):(<View>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10, color:'black' }}>Não Cadastrado</Text>
                                <Text style={{ fontSize: 16, marginLeft: 25, marginTop: 10 }}></Text>


                            </View>)
                        }

                    </ScrollView>
                </View>


                <View style={{ width: 150, marginTop: 15, marginLeft: 132 }}>
                    <Button
                        color='#96c1fa'
                        title="< Voltar"
                        onPress={() => this.navigationCadastro()}
                    />
                </View>
                
            </View>
        );
    }
    AttQnt(){
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} `, [], (_, { rows }) => {

                if (rows.length != 0) {
                    nome = rows._array;

                  
                    if(rows.length==1)
                    {
                        this.setState({ qntA: nome[0].qntTotal });
                    }
                    if(rows.length==2)
                    {
                        this.setState({ qntA: nome[0].qntTotal });
                        this.setState({ qntB: nome[1].qntTotal });
                        
                    }
                    if(rows.length==3)
                    {
                        this.setState({ qntA: nome[0].qntTotal });
                        this.setState({ qntB: nome[1].qntTotal });
                        this.setState({ qntC: nome[2].qntTotal });
                    }
                    if(rows.length==4)
                    {
                        this.setState({ qntA: nome[0].qntTotal });
                        this.setState({ qntB: nome[1].qntTotal });
                        this.setState({ qntC: nome[2].qntTotal });
                        this.setState({ qntD: nome[3].qntTotal });
                        
                    }
                    if(rows.length==5)
                    {
                        this.setState({ qntA: nome[0].qntTotal });
                        this.setState({ qntB: nome[1].qntTotal });
                        this.setState({ qntC: nome[2].qntTotal });
                        this.setState({ qntD: nome[3].qntTotal });
                        this.setState({ qntE: nome[4].qntTotal });
                        
                    }


                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    }

    

}
let savedComp = "compA";
let savedMes = "mes1";
const estilo = StyleSheet.create({

    opacity: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#fff',
        height: 40,
        width: 51,
        borderRadius: 5,
        margin: 5,
        marginTop: 30,
        marginLeft: 15
    },
    photo: {


        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: 'gray',
        height: 55,
        width: 178,
        margin: 0,

    },

})























