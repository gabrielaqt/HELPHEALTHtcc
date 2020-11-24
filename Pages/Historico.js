import React, { Component, Fragment } from "react";
import { Picker, StyleSheet, ScrollView, TouchableOpacity, View, Button, TextInput, Text } from "react-native";
import { DatabaseConnection } from '../dataBase/dataBase'
import { LineChart, YAxis,XAxis, Grid } from 'react-native-svg-charts'

import * as Network from 'expo-network';




const db = DatabaseConnection.getConnection()
const medicamentos = "medicamentos";
const horarioMedicamentos = "horarioMedicamentos";
const atrasoMedicamentos = "atrasoMedicamentos";
var ws="";
import axios from "axios"
console.disableYellowBox = true;

export default class Historico extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mes: "jan",
            remedio: "",
            remedioA: "",
            remedioB: "",
            remedioC: "",
            remedioD: "",
            remedioE: "",
            existeA: false,
            existeB: false,
            existeC: false,
            existeD: false,
            existeE: false,
            data: [],
            dias: [],
            dataB: [],
            diasB:[],
            existeDados: false,
            existeNaoIngerido: false,
            atrasos: []

        }
        this.ip=""
        /*  this.ws.onopen = function() {
              console.log("Connecteeeeeeeeeeeeeeeeeeeeeeeed");
          };
          this.ws.onmessage = function(evt) {
              console.log("DADO VINDO ===", evt.data);
          };
          */
        /* axios.post(`http://192.168.0.106:8080/`)
         .then(function(response){
           //  this.const = response.data;
           console.log(response.data)
            console.log('Recebi de volta isso do Arduino')
            console.log(response.config.data)
 
         })
         .catch(function(erro){
             console.log("MUDAR IP")
         })*/
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
        ws = new WebSocket(`ws://${this.ip}:1337/historico`)
        ws.onopen = (teste) =>{
            console.log("CONECTADO");
            ws.send('historico'); // send a message
            console.log(teste);
        }
        ws.onmessage = (evt) =>{
            console.log("RECEBI DO SOCKET HISTORICO=== "+ evt.data);
            this.setState({json: evt.data})
            
          //  console.log('AAHH RECEBI ISSO DAQUI')
          //  console.log(response.data)
          if(evt.data.length > 136){
              console.log("*****************************************ENTROU AQUI")
            this.insereBanco();
          }
           

        }
        ws.onerror = (e) => {
            console.log("ERRO")
            // an error occurred
            console.log(e.message);
          };

    }
    componentDidMount() 
    {
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
       
        this.setaEstado();
       



    }
    setaEstado = async () => {
        var nomeRemedio;
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} `, [], (_, { rows }) => {
                nomeRemedio = rows._array;
                for (var i = 0; i < rows.length; i++) {
                    if (nomeRemedio[i].compartimento == "A") {
                        this.setState({ remedioA: nomeRemedio[i].nome })
                        this.setState({ existeA: true })
                    }
                    if (nomeRemedio[i].compartimento == "B") {
                        this.setState({ remedioB: nomeRemedio[i].nome })
                        this.setState({ existeB: true })
                    }
                    if (nomeRemedio[i].compartimento == "C") {
                        this.setState({ remedioC: nomeRemedio[i].nome })
                        this.setState({ existeC: true })
                    }
                    if (nomeRemedio[i].compartimento == "D") {
                        this.setState({ remedioD: nomeRemedio[i].nome })
                        this.setState({ existeD: true })
                    }
                    if (nomeRemedio[i].compartimento == "E") {
                        this.setState({ remedioE: nomeRemedio[i].nome })
                        this.setState({ existeE: true })
                    }
                }

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))

    }
    




    mesSelected = e => {
        this.setState({ mes: e })
        this.changeData(e);
    }
    changeData= async(mes)=>{
        if(mes == "jan"){
            console.log("SELCIONADO === ", this.state.remedio)

            this.state.data= [];
            this.state.dias=[];


            // this.state.data.push(0);
            // this.state.data.push(3);
            // this.state.data.push(2);
            // this.state.data.push(9);
            // this.state.dias.push(10);
            // this.state.dias.push(11);
            // this.state.dias.push(22);
            // this.state.dias.push(25);
            this.setState({existeDados: false})
           // console.log(this.state.data)
        }
        if(mes == "fev"){
            console.log("SELCIONADO === ", this.state.remedio)
            this.state.data= [];
            this.state.dias=[];
            new Promise((resolve, reject) => db.transaction(tx => {
                tx.executeSql(`select * from ${atrasoMedicamentos} where data between date('2020-02-01') and date('2020-02-30') and compartimento==?`, [this.state.remedio], (_, { rows }) => {
                        this.consultaMes(rows)
                        if(rows.length != 0){
                            this.setState({existeDados: true})

                        }
                        else{
                            this.setState({existeDados: false})
                        }
                       
                }), (sqlError) => {
                    console.log(sqlError);
                }
            }, (txError) => {
                console.log(txError);
            }))
        }
        if(mes == "mai"){
            console.log("SELCIONADO === ", this.state.remedio)
                        this.state.data= [];
                        this.state.dias=[];
                        new Promise((resolve, reject) => db.transaction(tx => {
                            tx.executeSql(`select * from ${atrasoMedicamentos} where data between date('2020-05-01') and date('2020-05-30') and compartimento==?`, [this.state.remedio], (_, { rows }) => {
                                    this.consultaMes(rows)
                                    if(rows.length != 0){
                                        console.log(rows)
                                        this.setState({existeDados: true})
            
                                    }
                                    else{
                                       
                                            this.setState({existeDados: false})
                
                                        
                                    }
                              
                
                            }), (sqlError) => {
                                console.log(sqlError);
                            }
                        }, (txError) => {
                            console.log(txError);
                        }))
                             
        }
        if(mes == "jun"){
            console.log("SELCIONADO === ", this.state.remedio)
                        this.state.data= [];
                        this.state.dias=[];
                        new Promise((resolve, reject) => db.transaction(tx => {
                            tx.executeSql(`select * from ${atrasoMedicamentos} where data between date('2020-06-01') and date('2020-06-30') and compartimento==?`, [this.state.remedio], (_, { rows }) => {
                                    this.consultaMes(rows)
                                    if(rows.length != 0){
                                        this.setState({existeDados: true})
            
                                    }
                                    else{
                                            this.setState({existeDados: false})
                
                                        
                                    }
                                
                
                            }), (sqlError) => {
                                console.log(sqlError);
                            }
                        }, (txError) => {
                            console.log(txError);
                        }))
                             
        }
        if(mes == "jul"){
            console.log("SELCIONADO === ", this.state.remedio)
                        this.state.data= [];
                        this.state.dias=[];
                        new Promise((resolve, reject) => db.transaction(tx => {
                            tx.executeSql(`select * from ${atrasoMedicamentos} where data between date('2020-07-01') and date('2020-07-30') and compartimento==?`, [this.state.remedio], (_, { rows }) => {
                                    this.consultaMes(rows)
                                    if(rows.length != 0){
                                        this.setState({existeDados: true})
            
                                    }
                                    else{
                                            this.setState({existeDados: false})
                
                                        
                                    }
                                
                
                            }), (sqlError) => {
                                console.log(sqlError);
                            }
                        }, (txError) => {
                            console.log(txError);
                        }))
                             
        }
        if(mes == "ago"){
            console.log("SELCIONADO === ", this.state.remedio)
                        this.state.data= [];
                        this.state.dias=[];
                        new Promise((resolve, reject) => db.transaction(tx => {
                            tx.executeSql(`select * from ${atrasoMedicamentos} where data between date('2020-08-01') and date('2020-08-30') and compartimento==?`, [this.state.remedio], (_, { rows }) => {
                                    this.consultaMes(rows)
                                    if(rows.length != 0){
                                        this.setState({existeDados: true})
            
                                    }
                                    else{
                                            this.setState({existeDados: false})
                
                                        
                                    }
                                
                
                            }), (sqlError) => {
                                console.log(sqlError);
                            }
                        }, (txError) => {
                            console.log(txError);
                        }))

        }

        if(mes == "set"){
            console.log("SELCIONADO === ", this.state.remedio)
                        this.state.data= [];
                        this.state.dias=[];
                        new Promise((resolve, reject) => db.transaction(tx => {
                            tx.executeSql(`select * from ${atrasoMedicamentos} where data between date('2020-09-01') and date('2020-09-30') and compartimento==?`, [this.state.remedio], (_, { rows }) => {
                                    this.consultaMes(rows)
                                    if(rows.length != 0){
                                        this.setState({existeDados: true})
            
                                    }
                                    else{
                                            this.setState({existeDados: false})
                
                                        
                                    }
                                
                
                            }), (sqlError) => {
                                console.log(sqlError);
                            }
                        }, (txError) => {
                            console.log(txError);
                        }))

        }
        if(mes == "out"){
            console.log("SELCIONADO === ", this.state.remedio)
                        this.state.data= [];
                        this.state.dias=[];
                        new Promise((resolve, reject) => db.transaction(tx => {
                            tx.executeSql(`select * from ${atrasoMedicamentos} where data between date('2020-10-01') and date('2020-10-30') and compartimento==?`, [this.state.remedio], (_, { rows }) => {
                                    this.consultaMes(rows)
                                    if(rows.length != 0){
                                        this.setState({existeDados: true})
            
                                    }
                                    else{
                                            this.setState({existeDados: false})
                
                                        
                                    }
                                
                
                            }), (sqlError) => {
                                console.log(sqlError);
                            }
                        }, (txError) => {
                            console.log(txError);
                        }))

        }
        if(mes == "nov"){
            console.log("SELCIONADO === ", this.state.remedio)
                        this.state.data= [];
                        this.state.dias=[];
                        new Promise((resolve, reject) => db.transaction(tx => {
                            tx.executeSql(`select * from ${atrasoMedicamentos} where data between date('2020-11-01') and date('2020-11-30') and compartimento==?`, [this.state.remedio], (_, { rows }) => {
                                    this.consultaMes(rows)
                                    if(rows.length != 0){
                                        this.setState({existeDados: true})
            
                                    }
                                    else{
                                            this.setState({existeDados: false})
                
                                        
                                    }
                                
                
                            }), (sqlError) => {
                                console.log(sqlError);
                            }
                        }, (txError) => {
                            console.log(txError);
                        }))

        }
        if(mes == "dez"){
            console.log("SELCIONADO === ", this.state.remedio)
                        this.state.data= [];
                        this.state.dias=[];
                        new Promise((resolve, reject) => db.transaction(tx => {
                            tx.executeSql(`select * from ${atrasoMedicamentos} where data between date('2020-12-01') and date('2020-12-30') and compartimento==?`, [this.state.remedio], (_, { rows }) => {
                                    this.consultaMes(rows)
                                    if(rows.length != 0){
                                        this.setState({existeDados: true})
            
                                    }
                                    else{
                                            this.setState({existeDados: false})
                
                                        
                                    }
                                
                
                            }), (sqlError) => {
                                console.log(sqlError);
                            }
                        }, (txError) => {
                            console.log(txError);
                        }))

        }




    }

    consultaMes(rows){
        var  dados = [];
        var aux;
        var dias = [];
        var atrasos = [];
        var aux2 = "";

        for(var i=0;i<rows.length;i++)
        {
            if(rows._array[i].horario != 24)
            {
                
                dados.push(Number(rows._array[i].horario));
                aux = rows._array[i].data.split('-', 3);
                dias.push(Number(aux[2]));
            }
            else
            {
                aux = rows._array[i].data.split('-', 3);
                aux2 = aux2.concat(aux[2]);
                aux2 = aux2.concat("/");
                aux2 = aux2.concat(aux[1]);
                atrasos.push(aux2);
         
              //  atrasos.concat(Number(aux[1]));
            }
            aux2 = "";
            // console.log(rows._array[i].horario,this.state.data )
         }
         if(atrasos.length > 0)
         {
             this.setState({existeNaoIngerido: true})
         }
         this.setState({data: dados})   
         this.setState({dias: dias})
         this.setState({atrasos: atrasos})

         console.log("ATRASO == ", this.state.atrasos);
    }
    remedioSelected = e => {
        this.setState({ remedio: e })
        this.state.data= [];
        this.state.dias=[];
        this.changeData(this.state.mes)
    }


    getIPS  = async () => {
      
            let ipAddress = await Network.getIpAddressAsync()
            console.log("IP PEGUeI",ipAddress)

           



    }
    getJson() {
       this.getIPS();
       

    //    console.log("JHhjh", teste)
          
        // axios.post(`http://192.168.4.1:8080/teste`, {"tipo": "send"},
        axios.post(`http://${this.ip}:8080/teste`, { "tipo": "send" },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) =>{
                //  this.const = response.data;
                console.log('AAHH RECEBI ISSO DAQUI')
                this.setState({json: response.data})
              //  console.log('AAHH RECEBI ISSO DAQUI')
              //  console.log(response.data)
             //   this.insereBanco();
            })
            .catch(function (erro) {
                console.log("MUDAR IP")
            })
   /*      new Promise((resolve, reject) => db.transaction(tx => {
                tx.executeSql(`insert into ${atrasoMedicamentos} (horario,data,compartimento) values (?,?,?) `, ["0.15","2020-06-07","B"], (_, { rows }) => {


                }), (sqlError) => {
                    console.log(sqlError);
                }
            }, (txError) => {
                console.log(txError);
            }))
     */   
            new Promise((resolve, reject) => db.transaction(tx => {
                tx.executeSql(`select * from ${atrasoMedicamentos}`, [], (_, { rows }) => {
                        console.log("SELECT TABELA TODA",rows);

                }), (sqlError) => {
                    console.log(sqlError);
                }
            }, (txError) => {
                console.log(txError);
            }))

            this.changeData(this.state.mes)

    }


    inseteNaTabelaAtraso(horario, data, compartimento) {
        console.log("ENTROU NA FUNCAO")
         console.log(horario, data, compartimento);
 
         new Promise((resolve, reject) => db.transaction(tx => {
             tx.executeSql(`insert into ${atrasoMedicamentos} (horario,data, compartimento) values (?,?,?) `,
                 [horario, data, compartimento], (_, { insertId, rows }) => {
             
                    this.changeData(this.state.mes)
                 }), (sqlError) => {
                     console.log(sqlError);
                 }
         }, (txError) => {
             console.log(txError);
         }))
     }


     salvaa = async(json)=>{
         var objeto = JSON.parse(json)
         console.log("jsdhjsdkf", objeto.horariosA.length)

    console.log("TAMANHOA == ", objeto.horariosA.length)
        console.log("TAMANHOB == ",objeto.horariosB.length)
        console.log("TAMANHOC == ", objeto.horariosC.length)
     //COLOCAR NA TABELA AS INFORMAÇões
      for(var i =0;i<objeto.horariosA.length;i++){
        console.log("Entrou no FOR = ",objeto.horariosA[i],objeto.datasA[i] );

     //   console.log("A",this.state.json.horariosA[i]);
        this.inseteNaTabelaAtraso(objeto.horariosA[i], objeto.datasA[i], "A")
      }
      for(var i =0;i<objeto.horariosB.length;i++){
        console.log("Entrou no FOR = ",objeto.horariosB[i],objeto.datasB[i] );

     //   console.log("A",this.state.json.horariosA[i]);
        this.inseteNaTabelaAtraso(objeto.horariosB[i], objeto.datasB[i], "B")
      }
      console.log("C",objeto.horariosC[i]);

      for(var i =0;i<objeto.horariosC.length;i++){
        console.log("Entrou no FOR = ",objeto.horariosC[i],objeto.datasC[i] );

        console.log("C",objeto.horariosC[i]);
        this.inseteNaTabelaAtraso(objeto.horariosC[i], objeto.datasC[i], "C")
      }
      console.log("D",objeto.horariosD[i]);

      for(var i =0;i<objeto.horariosD.length;i++){
        console.log("Entrou no FOR = ",objeto.horariosD[i],objeto.datasD[i] );

        console.log("D",objeto.horariosD[i]);
        this.inseteNaTabelaAtraso(objeto.horariosD[i], objeto.datasD[i], "D")
      }
      for(var i =0;i<objeto.horariosE.length;i++){
        console.log("Entrou no FOR = ",objeto.horariosE[i],objeto.datasE[i] );

     //   console.log("A",this.state.json.horariosA[i]);
        this.inseteNaTabelaAtraso(objeto.horariosE[i], objeto.datasE[i], "E")
      }
        }

    insereBanco(){
        console.log("Vindo do Arduino == ",this.state.json)
        console.log("Vindo do Arduino == ",this.state.json)
        this.salvaa(this.state.json);
    
    }

    navigationAgenda= async () => {
        this.props.navigation.navigate('PagInterm',  {historico: true})
     //   ws.close();
    }
    navigationCadastro= async () => {
            //    new Promise((resolve, reject) => db.transaction(tx => {
            //     tx.executeSql(`insert into ${atrasoMedicamentos} (horario,data,compartimento) values (?,?,?) `, ["24","2020-09-02","D"], (_, { rows }) => {


            //     }), (sqlError) => {
            //         console.log(sqlError);
            //     }
            // }, (txError) => {
            //     console.log(txError);
            // }))
                 new Promise((resolve, reject) => db.transaction(tx => {
                tx.executeSql(`select * from  atrasoMedicamentos`, [], (_, { rows }) => {


                    console.log("Ahhhhh", rows)
                }), (sqlError) => {
                    console.log(sqlError);
                }
            }, (txError) => {
                console.log(txError);
            }))
        
        this.props.navigation.navigate('PagInterm',  {historico: true})
     //   ws.close();
    }
    
    render() {

/*  ///VER OQ EH MELHOR ..... SE RENDERIZAR AQUI OU NÃO
        if(this.stat == "jan"){
            this.state.data= [];

            this.state.data.push(0);
            this.state.data.push(3);
            this.state.data.push(2);
        }
        else{
            this.state.data= [];
            this.state.data.push(4);
            this.state.data.push(7);
            this.state.data.push(0);

        }

        */
        const contentInset = { top: 20, bottom: 20 }
        const verticalContentInset = { top: 10, bottom: 10 };

      //  this.changeData(this.state.mes);
        return (
            <View >
                <Text style={{ color:'black',fontSize: 16, fontWeight: 'bold', width: 100, marginLeft: 15, marginTop: 5 }}>Remédio:</Text>

                <View style={{

                    marginTop: 10,
                    alignItems: 'center',
                    height: 40,
                    width: 150,
                    marginLeft: 15,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: '#83B5F8'
                }}>

                    <Picker
                        selectedValue={this.state.remedio}
                        style={{ marginLeft: 15, height: 40, width: 150 }}
                        onValueChange={this.remedioSelected}
                    >

                        {
                            this.state.existeA ? (<Picker.Item label={this.state.remedioA} value="A" />) :( false)

                        }
                        {
                            this.state.existeB ? (<Picker.Item label={this.state.remedioB} value="B" />) : (false)
                        }

                        {
                            this.state.existeC ? <Picker.Item label={this.state.remedioC} value="C" /> : false


                        }
                        {
                            this.state.existeD ? <Picker.Item label={this.state.remedioD} value="D" /> : false
                        }
                        {
                            this.state.existeE ? <Picker.Item label={this.state.remedioE} value="E" /> : false
                        }









                    </Picker>
                </View>
                {
            //    console.log("TESTE",this.state.data)
                }{
           //         console.log("DIAS =", this.state.dias)

                }

                <View>
                    <Text style={{ color:'black',width: 100, fontSize: 16, fontWeight: 'bold', marginLeft: 215, marginTop: -75 }}>Mês:</Text>

                    <View style={{
                        marginTop: 10,
                        alignItems: 'center',
                        height: 40,
                        width: 150,
                        marginLeft: 215,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        borderWidth: 0.5,
                        borderColor: '#83B5F8'
                    }}>
                        <Picker
                            selectedValue={this.state.mes}
                            style={{ marginLeft: 15, height: 40, width: 150 }}
                            onValueChange={this.mesSelected}
                        >
                            
                            <Picker.Item label="Janeiro" value="jan" />
                            <Picker.Item label="Fevereiro" value="fev" />
                            <Picker.Item label="Março" value="mar" />
                            <Picker.Item label="Abril" value="abr" />
                            <Picker.Item label="Maio" value="mai" />
                            <Picker.Item label="Junho" value="jun" />
                            <Picker.Item label="Julho" value="jul" />
                            <Picker.Item label="Agosto" value="ago" />
                            <Picker.Item label="Setembro" value="set" />
                            <Picker.Item label="Outubro" value="out" />
                            <Picker.Item label="Novembro" value="nov" />
                            <Picker.Item label="Dezembro" value="dez" />
                        </Picker>
                    </View>
                </View>
                <View style={{ marginLeft: 7, borderRadius: 10, borderColor: '#83B5F8', borderWidth: 0.5, marginTop: 10, backgroundColor: 'white', height: 550, width: 400 }}>
                    <ScrollView>
                    <Text style={{color:'black',marginTop:15,fontSize:17, marginLeft:5, fontWeight:'bold'}}>Atrasos:</Text>
                    {this.state.data.length>0?(
                           <Fragment>
                             <View style={{ marginTop: 10}}>
                             <Text style={{color: 'grey',opacity: 0.5, marginLeft:2}}>Atraso</Text>
                             </View>
                             <View style={{ height: 300, width: 380, marginLeft: 5, flexDirection: 'row' }}>
     
                                 <YAxis
                                     data={this.state.data}
                                     contentInset={contentInset}
                                     svg={{
                                         fill: 'grey',
                                         fontSize: 12,
                                     }}
                                     numberOfTicks={20}
                                     formatLabel={(value) => `${value}`}
                                 />
                                 
                                 <LineChart
                                     style={{ flex: 1, marginLeft: 16 }}
                                     data={this.state.data}
                                     svg={{ stroke: 'rgb(68, 148, 252)' }}
                                     contentInset={contentInset}
                                 >
                                     <Grid />
                                 </LineChart>
                             </View>
                             <XAxis
                                 style={{ marginHorizontal: 15,height: 50 }}
                                 data={this.state.dias}
                                 formatLabel={(value, index) =>this.state.dias[index]}
                                 contentInset={{ left: 30, right: 10 }}
                                 svg={{ fontSize: 12, fill: 'grey' }}
                             />
                             <Text style={{marginTop: -40, marginLeft:180,color: 'grey',opacity: 0.5 }}>Dias</Text>
                            
                             </Fragment>
                       ):(
                           <Text style={{marginLeft:30,marginTop:20, color: 'grey',opacity: 0.5, fontSize:20, alignContent:'center'}}>Nenhum atraso Registrado</Text>
                       )}
                      
                     
                      {this.state.atrasos.length>0?(
                       <Fragment>
                        <Text style={{color:'black',marginTop:12,fontSize:17, marginLeft:5, fontWeight:'bold'}}>Não ingeridos:</Text>
                        <Text style={{color:'black',marginLeft:20, marginTop:5, fontSize:15}}><Text style={{fontWeight:'bold'}}>Total:</Text> {this.state.atrasos.length} Veze(s)</Text>
                        <Text style={{color:'black',fontSize:15, marginLeft:20, fontWeight:'bold'}}>Dia(s):</Text>
                        {
                             this.state.atrasos.map((number) =>
                             
                             <Text style={{color:'black',fontSize:15, marginLeft:30}}>{number}</Text>
                      
                           )
                        }
                            
                        

                       </Fragment>
                    ):(
                        <Text></Text>
                    )
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























