import React from 'react';
import { Text} from 'react-native';
import { DatabaseConnection } from '../dataBase/dataBase'
const db = DatabaseConnection.getConnection()
const horarioMedicamentos = "horarioMedicamentos";
import PushNotification from 'react-native-push-notification';
console.disableYellowBox = true;

export default class Clock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      time: new Date().getHours() + ":" + new Date().getMinutes(),
      expoPushToken: '',
      notification: {},
      horarios: [],
    };
    

  }
  // localPushNotification = () => {
    
  // };
  mudaEstado(rows) 
  {
    var dados = [];
    for (var i = 0; i < rows.length; i++) 
    {
      dados.push(rows._array[i].horario);
    }
    this.setState({ horarios: dados })
  }
  componentDidMount()
  {
    console.log("teste")
    this.intervalID = setInterval(
      () => this.tick(),
      10000
    );
  }

  componentWillUnmount()
   {
    console.log("teste2")
    clearInterval(this.intervalID);
  }
  tick() 
  {
    this.minuto = new Date().getMinutes()
    if (this.minuto < 10) 
    {
      this.minuto = "0" + new Date().getMinutes()
    }
    var hora = new Date().getHours() + ":" + this.minuto


  }


  render() 
  {
    var minuto = new Date().getMinutes();
    if (minuto < 10) {
      minuto = "0" + minuto
    }
    var hora =  new Date().getHours()< 10? ("0"+ new Date().getHours()+ ":" + minuto) : (new Date().getHours()  + ":" + minuto)


    for (var i = 0; i < this.state.horarios.length; i++) 
    {
      if (hora === this.state.horarios[i])
       {
        guardaI = i;
        if (tocou == false) {
          console.log("MANDA NOTIFICAÇÃO")
          PushNotification.localNotification({
            title: 'HelpHealth',
            message: 'Está na hora dos remedios !',
          });
        }
        tocou = true;

      }
    };

    for (i = 0; i < this.state.horarios.length; i++)
     {
      if (guardaI === i && hora !== this.state.horarios[guardaI]) 
      {
        tocou = false;
      }


    };


    new Promise((resolve, reject) => db.transaction(tx => {
      tx.executeSql(`select distinct horario from ${horarioMedicamentos}`, [], (_, { rows }) => {
        // console.log("************");
        //   console.log(rows)

        resolve(rows)
        this.mudaEstado(rows);

        //  console.log(rows);
      }), (sqlError) => {
        console.log(sqlError);
      }
    }, (txError) => {
      console.log(txError);
    }))


    return (
      <Text></Text>
    );
  }

}
var guardaI = 0;
var tocou = false;

