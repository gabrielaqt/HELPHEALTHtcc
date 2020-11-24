import React, { Fragment, Component } from 'react';
import {
    TextInput,
    Text,
    View,
    TouchableOpacity,
    Picker,
    StyleSheet,
    Button,
    ScrollView,
    Alert
} from "react-native";
import { Image, Divider } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import adicionarMed from '../api/sendMedicamentos'
import { createStackNavigator } from '@react-navigation/stack';
import axios from "axios"
import { DatabaseConnection } from '../dataBase/dataBase'
const db = DatabaseConnection.getConnection()
const medicamentos = "medicamentos";
const horarioMedicamentos = "horarioMedicamentos";

const Stack = createStackNavigator(


);
console.disableYellowBox = true;

export default class CompartimentoA extends Component {


    constructor(props) {
        super(props)
        this.state = {
            json: {},
            nameA: "",
            freqA: "",
            totalCompA: "",
            doseCompA: "",
            select1x: true,
            time1xA: "10:00",
            select2x: false,
            time2xA1: "10:00",
            time2xA2: "10:00",
            select3x: false,
            time3xA1: "10:00",
            time3xA2: "10:00",
            time3xA3: "10:00",
            select4x: false,
            time4xA1: "10:00",
            time4xA2: "10:00",
            time4xA3: "10:00",
            time4xA4: "10:00",
            dadosSalvos: false,


        }

    }
    componentDidMount() {
        var compartimentoA = "B"

        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [compartimentoA], (_, { rows }) => {

                if (rows.length != 0) {

                    savedNameA = rows._array[0].nome;
                    savedDoseCompA = rows._array[0].qntDose.toString();

                    savedTotalCompA = rows._array[0].qntTotal.toString();
                    console.log(rows._array[0].qntTotal)

                    new Promise((resolve, reject) => db.transaction(tx => {
                        tx.executeSql(`select * from ${horarioMedicamentos} where compartimento = ? `, [compartimentoA], (_, { rows }) => {

                            if(rows.length ==1){
                                console.log("TETSE ===", rows._array[0].horario);
                             
                                this.setState({freqA: "umaVezA"}) ;
                                this.setState({time1xA:rows._array[0].horario }) ;
                            }
                            if(rows.length ==2){
                                console.log("AQUI TEM 2 ", rows._array[0].horario,rows._array[1].horario );
                                this.setState({freqA: "duasVezesA"}) ;
                                this.setState({ select1x: false });
                                this.setState({select2x: true}) ;
                                this.setState({time2xA1: rows._array[0].horario }) ;
                                this.setState({time2xA2: rows._array[1].horario }) ;
            
                            }
                            if(rows.length ==3){
                                this.setState({freqA: "tresVezesA"}) ;
                                this.setState({ select1x: false });
                                this.setState({select3x: true}) ;
                                this.setState({time3xA1: rows._array[0].horario }) ;
                                this.setState({time3xA2: rows._array[1].horario }) ;
                                this.setState({time3xA3: rows._array[2].horario }) ;
                               
                            }
                            if(rows.length ==4){
                                this.setState({freqA: "quatroVezesA"}) ;
                                this.setState({ select1x: false });
                                this.setState({select4x: true}) ;
                                this.setState({time4xA1: rows._array[0].horario }) ;
                                this.setState({time4xA2: rows._array[1].horario }) ;
                                this.setState({time4xA3: rows._array[2].horario }) ;
                                this.setState({time4xA4: rows._array[3].horario }) ;        
                            }


                        }), (sqlError) => {
                            console.log(sqlError);
                        }
                    }, (txError) => {
                        console.log(txError);
                    }))
                    this.atualiza();
                }

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))



    }
    atualiza() {
        this.setState({ nameA: savedNameA })
        this.setState({ freqA: savedFreqA })
        this.setState({ totalCompA: savedTotalCompA })
        this.setState({ doseCompA: savedDoseCompA })

        this.onChangeA(savedFreqA)
    }

    salvarMedicamentos = async () => {

        //COMPARTIMENTO A
        savedNameA = await this.state.nameA;
        savedFreqA = await this.state.freqA;
        savedTotalCompA = await this.state.totalCompA;
        savedDoseCompA = await this.state.doseCompA;
        savedTime1xA = await this.state.time1xA;
        savedTime2xA1 = await this.state.time2xA1;
        savedTime2xA2 = this.state.time2xA2;
        savedTime3xA1 = this.state.time3xA1;
        savedTime3xA2 = this.state.time3xA2;
        savedTime3xA3 = this.state.time3xA3;
        savedTime4xA1 = this.state.time4xA1;
        savedTime4xA2 = this.state.time4xA2;
        savedTime4xA3 = this.state.time4xA3;
        savedTime4xA4 = this.state.time4xA4;




        if (this.state.select1x == true) {
            console.warn('sadasd')
            const json = {
                compartimento: "B",
                nome: savedNameA,
                qntTotal: savedTotalCompA,
                qntDose: savedDoseCompA,
                horarios: [{ horario: savedTime1xA }],

            }
            console.log(json);

            if (savedNameA != "" && savedTotalCompA != "" && savedDoseCompA != "") {


                await adicionarMed.adicionarMed(json);
                //  adicionarMed(json);
                // this.setState({dadosSalvos: true})
                // teste = this.dadosSalvos;
                //     adicionarMed(json);
                this.props.navigation.navigate('RegisterMedicines', { checkedB: true })

            }
            else {
                Alert.alert(
                    "Por favor",
                    "Preencha todos os campos !!",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
            }

        }
        if (savedFreqA == "duasVezesA") {
            console.warn('sadasd')
            const json = {
                compartimento: "B",
                nome: savedNameA,
                qntTotal: savedTotalCompA,
                qntDose: savedDoseCompA,
                horarios: [
                    { horario: savedTime2xA1 }, { horario: savedTime2xA2 }
                ],

            }
            console.log(json);
            if (savedNameA != "" && savedTotalCompA != "" && savedDoseCompA != "") {
                await adicionarMed.adicionarMed(json);
                this.props.navigation.navigate('RegisterMedicines', { checkedB: true })

            }
            else {
                Alert.alert(
                    "Por favor",
                    "Preencha todos os campos !!",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
            }

        }
        if (savedFreqA == "tresVezesA") {
            console.warn('sadasd')
            const json = {
                compartimento: "B",
                nome: savedNameA,
                qntTotal: savedTotalCompA,
                qntDose: savedDoseCompA,
                horarios: [
                    { horario: savedTime3xA1 }, { horario: savedTime3xA2 }, { horario: savedTime3xA3 }
                ],

            }
            console.log(json);
            if (savedNameA != "" && savedTotalCompA != "" && savedDoseCompA != "") {
                await adicionarMed.adicionarMed(json);
                this.props.navigation.navigate('RegisterMedicines', { checkedB: true })

            }
            else {
                Alert.alert(
                    "Por favor",
                    "Preencha todos os campos !!",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
            }


        }
        if (savedFreqA == "quatroVezesA") {

            const json = {
                compartimento: "B",
                nome: savedNameA,
                qntTotal: savedTotalCompA,
                qntDose: savedDoseCompA,
                horarios: [
                    { horario: savedTime4xA1 }, { horario: savedTime4xA2 }, { horario: savedTime4xA3 }, { horario: savedTime4xA4 }
                ],

            }
            console.log(json);
            if (savedNameA != "" && savedTotalCompA != "" && savedDoseCompA != "") {
                await adicionarMed.adicionarMed(json);
                this.props.navigation.navigate('RegisterMedicines', { checkedB: true })

            }
            else {
                Alert.alert(
                    "Por favor",
                    "Preencha todos os campos !!",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
            }

        }



        //    this.props.navigation.navigate('RegisterMedicines')


    }
    //cCOMPARTIMENTO A
    selectFreqA = e => {
        this.onChangeA(e)
        this.setState({ freqA: e })

    }

    onChangeA = (option) => {


        if (option == "umaVezA") {
            //  console.warn("dddd",savedTime1xA)
            this.setState({ select1x: true });
            this.setState({ select2x: false });
            this.setState({ select3x: false });
            this.setState({ select4x: false });
            this.setState({ time1xA: savedTime1xA })


        }
        if (option == "duasVezesA") {
            this.setState({ select1x: false });
            this.setState({ select2x: true });
            this.setState({ select3x: false });
            this.setState({ select4x: false });
            this.setState({ time2xA1: savedTime2xA1 })
            this.setState({ time2xA2: savedTime2xA2 })

        }
        if (option == "tresVezesA") {
            this.setState({ select1x: false });
            this.setState({ select2x: false });
            this.setState({ select3x: true });
            this.setState({ select4x: false });
            this.setState({ time3xA1: savedTime3xA1 })
            this.setState({ time3xA2: savedTime3xA2 })
            this.setState({ time3xA3: savedTime3xA3 })

        }

        if (option == "quatroVezesA") {
            //   console.warn("sdjksd")
            this.setState({ select1x: false });
            this.setState({ select2x: false });
            this.setState({ select3x: false });
            this.setState({ select4x: true });
            this.setState({ time4xA1: savedTime4xA1 })
            this.setState({ time4xA2: savedTime4xA2 })
            this.setState({ time4xA3: savedTime4xA3 })
            this.setState({ time4xA4: savedTime4xA4 })
        }
    }
    ///FIM COMPARTIMENTO A
    static getDerivedStateFromProps(props, state)
    {
      
        if(props.route.params.camera === true)
        {
            let text;
            const imageText = props.route.params.textDetect;

            for (let i = 0; i < imageText.length; i++)
            {
                if(i==0)
                {
                    text = "";
                }
                    text += imageText[i] + ' ';
            }
            props.route.params.camera = false;
            return{
                nameA: text
            }
        }
       
    }
    render() {
        
        return (
            <View style={{}}>
                <ScrollView>
                    <Fragment>
                        {
                            //COMPARTIMENTO A
                        }
                        <View style={{ marginTop: 30 }}>

                            <Text style={{color:'black', fontSize: 20, fontWeight: 'bold', marginLeft: 15, marginTop: 0 }}>Compartimento B:</Text>
                            <View style={{ backgroundColor: 'white', width: 390, marginLeft: 10, marginTop: 15, borderRadius: 10, borderColor: '#83B5F8', borderWidth: 0.5 }}>
                                <Text style={{ color:'black',fontWeight: 'bold', marginLeft: 15, width: 200, marginTop: 5 }}>Nome Remédio:</Text>

                                <TextInput
                                    placeholder="Nome do medicamento"
                                    style={{ fontSize: 15,borderRadius: 10, paddingHorizontal: 10, marginTop: 5, marginLeft: 15, width: 300, height: 40, borderColor: 'gray', backgroundColor: 'white', borderWidth: 1 }}
                                    onChangeText={text => this.setState({ nameA: text })}
                                    value={this.state.nameA}

                                />
                                <TouchableOpacity activeOpacity={0.5} style={estilo.opacity} onPress={() => this.props.navigation.navigate('camera', {compA: false, compB: true, compC: false, compD: false, compE: false})}>
                                    <Image style={estilo.photo} source={require("../Images/maquinaFotografica.png")} />
                                </TouchableOpacity>



                                <View>
                                    <Text style={{ color:'black',fontSize: 15,fontWeight: 'bold', marginLeft: 15, width: 200, marginTop: 10 }}>Total Comprimidos Caixa:</Text>
                                    <TextInput
                                        placeholder="0"
                                        style={{fontSize: 15, textAlign: 'center', position: 'absolute', borderRadius: 10, paddingHorizontal: 10, width: 50, height: 40, borderColor: 'gray', backgroundColor: 'white', borderWidth: 1, marginLeft: 15, marginTop: 33 }}
                                        onChangeText={text => this.setState({ totalCompA: text })}
                                        value={this.state.totalCompA}
                                        keyboardType={'numeric'}

                                    />
                                    <Text style={{ color:'black',fontSize:15,position: 'absolute', width: 190, marginTop: 42, marginLeft: 68 }}>Comprimido(s)</Text>
                                    <Text style={{ color:'black',fontSize: 15,fontWeight: 'bold', width: 190, marginLeft: 15, marginTop: 50 }}>Dose Diária:</Text>

                                    <TextInput
                                        placeholder="0"
                                        style={{fontSize: 15, textAlign: 'center', position: 'absolute', borderRadius: 10, paddingHorizontal: 10, width: 50, height: 40, borderColor: 'gray', backgroundColor: 'white', borderWidth: 1, marginLeft: 15, marginTop: 105 }}
                                        onChangeText={text => this.setState({ doseCompA: text })}
                                        value={this.state.doseCompA}
                                        keyboardType={'numeric'}
                                    />
                                    <Text style={{ color:'black',fontSize:15,position: 'absolute', width: 190, marginTop: 110, marginLeft: 68 }}>Comprimido(s)</Text>

                                </View>
                                <View>
                                    <Text style={{color:'black',fontSize: 15, marginTop: 45, position: 'absolute', fontWeight: 'bold', marginLeft: 15, width: 100 }}>Frequência:</Text>
                                    <View style={{
                                        position: 'absolute',
                                        marginTop: 70,
                                        alignItems: 'center',
                                        height: 40,
                                        width: 150,
                                        marginLeft: 15,
                                        backgroundColor: 'white',
                                        borderRadius: 10,
                                        borderWidth: 0.5,
                                        borderColor: 'gray',

                                    }}>
                                        <Picker
                                            selectedValue={this.state.freqA}
                                            style={{fontSize: 15, marginLeft: 15, height: 40, width: 150 }}
                                            onValueChange={this.selectFreqA}
                                        >
                                            <Picker.Item label="1x ao dia" value="umaVezA" />
                                            <Picker.Item label="2x ao dia" value="duasVezesA" />
                                            <Picker.Item label="3x ao dia" value="tresVezesA" />
                                            <Picker.Item label="4x ao dia" value="quatroVezesA" />
                                        </Picker>
                                    </View>
                                    {this.state.select1x ? (
                                        <Fragment>
                                            <Text style={{ color:'black',fontSize: 15,marginTop: 47, fontWeight: 'bold', marginLeft: 200, width: 100 }}>Horário(s):</Text>
                                            <DatePicker
                                                style={{fontSize: 15, width: 150, marginTop: 5, marginLeft: 205 }}
                                                date={this.state.time1xA}
                                                mode="time"
                                                format="HH:mm"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                minuteInterval={10}
                                                onDateChange={(time) => { this.setState({ time1xA: time }); }}
                                            />
                                            <View style={{ marginTop: 14 }}></View>
                                        </Fragment>

                                    ) : (
                                            this.state.select2x ? (
                                                <Fragment >
                                                    <Text style={{color:'black', fontSize:15,marginTop: 47, fontWeight: 'bold', marginLeft: 200, width: 100 }}>Horário(s):</Text>
                                                    <DatePicker
                                                        style={{ width: 150, marginTop: 5, marginLeft: 205 }}
                                                        date={this.state.time2xA1}
                                                        mode="time"
                                                        format="HH:mm"
                                                        confirmBtnText="Confirm"
                                                        cancelBtnText="Cancel"
                                                        minuteInterval={10}
                                                        onDateChange={(time) => { this.setState({ time2xA1: time }); }}
                                                    />
                                                    <DatePicker
                                                        style={{ width: 150, marginTop: 5, marginLeft: 205 }}
                                                        date={this.state.time2xA2}
                                                        mode="time"
                                                        format="HH:mm"
                                                        confirmBtnText="Confirm"
                                                        cancelBtnText="Cancel"
                                                        minuteInterval={10}
                                                        onDateChange={(time) => { this.setState({ time2xA2: time }); }}
                                                    />
                                                    <View style={{ marginTop: 14 }}></View>
                                                </Fragment>
                                            ) : (
                                                    this.state.select3x ? (
                                                        <Fragment>
                                                            <Text style={{color:'black',fontSize:15, marginTop: 47, fontWeight: 'bold', marginLeft: 200, width: 100 }}>Horário(s):</Text>
                                                            <DatePicker
                                                                style={{ width: 150, marginTop: 5, marginLeft: 205 }}
                                                                date={this.state.time3xA1}
                                                                mode="time"
                                                                format="HH:mm"
                                                                confirmBtnText="Confirm"
                                                                cancelBtnText="Cancel"
                                                                minuteInterval={10}
                                                                onDateChange={(time) => { this.setState({ time3xA1: time }); }}
                                                            />
                                                            <DatePicker
                                                                style={{ width: 150, marginTop: 5, marginLeft: 205 }}
                                                                date={this.state.time3xA2}
                                                                mode="time"
                                                                format="HH:mm"
                                                                confirmBtnText="Confirm"
                                                                cancelBtnText="Cancel"
                                                                minuteInterval={10}
                                                                onDateChange={(time) => { this.setState({ time3xA2: time }); }}
                                                            />
                                                            <DatePicker
                                                                style={{ width: 150, marginTop: 5, marginLeft: 205 }}
                                                                date={this.state.time3xA3}
                                                                mode="time"
                                                                format="HH:mm"
                                                                confirmBtnText="Confirm"
                                                                cancelBtnText="Cancel"
                                                                minuteInterval={10}
                                                                onDateChange={(time) => { this.setState({ time3xA3: time }); }}
                                                            />
                                                            <View style={{ marginTop: 14 }}></View>
                                                        </Fragment>
                                                    ) : (
                                                            this.state.select4x ? (
                                                                <Fragment>
                                                                    <Text style={{color:'black',fontSize:15, marginTop: 47, fontWeight: 'bold', marginLeft: 200, width: 100 }}>Horário(s):</Text>
                                                                    <DatePicker
                                                                        style={{ width: 150, marginTop: 5, marginLeft: 205 }}
                                                                        date={this.state.time4xA1}
                                                                        mode="time"
                                                                        format="HH:mm"
                                                                        confirmBtnText="Confirm"
                                                                        cancelBtnText="Cancel"
                                                                        minuteInterval={10}
                                                                        onDateChange={(time) => { this.setState({ time4xA1: time }); }}
                                                                    />
                                                                    <DatePicker
                                                                        style={{ width: 150, marginTop: 5, marginLeft: 205 }}
                                                                        date={this.state.time4xA2}
                                                                        mode="time"
                                                                        format="HH:mm"
                                                                        confirmBtnText="Confirm"
                                                                        cancelBtnText="Cancel"
                                                                        minuteInterval={10}
                                                                        onDateChange={(time) => { this.setState({ time4xA2: time }); }}
                                                                    />
                                                                    <DatePicker
                                                                        style={{ width: 150, marginTop: 5, marginLeft: 205 }}
                                                                        date={this.state.time4xA3}
                                                                        mode="time"
                                                                        format="HH:mm"
                                                                        confirmBtnText="Confirm"
                                                                        cancelBtnText="Cancel"
                                                                        minuteInterval={10}
                                                                        onDateChange={(time) => { this.setState({ time4xA3: time }); }}
                                                                    />
                                                                    <DatePicker
                                                                        style={{ width: 150, marginTop: 5, marginLeft: 205 }}
                                                                        date={this.state.time4xA4}
                                                                        mode="time"
                                                                        format="HH:mm"
                                                                        confirmBtnText="Confirm"
                                                                        cancelBtnText="Cancel"
                                                                        minuteInterval={10}
                                                                        onDateChange={(time) => { this.setState({ time4xA4: time }); }}
                                                                    />
                                                                    <View style={{ marginTop: 14 }}></View>
                                                                </Fragment>
                                                            ) : (
                                                                    <View style={{ marginTop: 130 }}></View>
                                                                )
                                                        )
                                                )
                                        )}
                                </View>
                            </View>
                        </View>

                    </Fragment>
                </ScrollView>
                <View style={{ marginTop: 600, position: 'absolute', marginLeft: 110, width: 200 }}>

                    <Button
                        style={{ color: 'black', position: "fixed", }}
                        color='#96c1fa'
                        theme='dark'
                        title="Salvar"
                        onPress={this.salvarMedicamentos} />
                </View>
            </View>

        )
    }
}
//COMPARTIMENTO A
let savedNameA = ""
let savedFreqA = "umaVezA"
let savedTotalCompA = ""
let savedTime1xA = "10:00"
let savedTime2xA1 = "10:00"
let savedTime2xA2 = "10:00"
let savedTime3xA1 = "10:00"
let savedTime3xA2 = "10:00"
let savedTime3xA3 = "10:00"
let savedTime4xA1 = "10:00"
let savedTime4xA2 = "10:00"
let savedTime4xA3 = "10:00"
let savedTime4xA4 = "10:00"
let savedDoseCompA = ""


const styles = StyleSheet.create({

    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    }
});

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
        marginTop: -40,
        marginLeft: 325
    },
    photo: {


        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: 'gray',
        height: 40,
        width: 50,
        borderRadius: 10,
        margin: 0,

    },

})

