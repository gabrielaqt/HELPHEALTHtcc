//import 'react-native-gesture-handler';
import React, { Fragment, Component } from 'react';

import {
  Text,
  Button
} from 'react-native';
import coracao from './Images/coracao.png'
import LylaInteractive from './Pages/LylaInteractive';
import RegisterMedicines from './Pages/RegisterMedicines'
import Home from './Pages/Home';
import PagInterm from './Pages/PagIntermediaria'
import Historico from './Pages/Historico';
import Reposicao from './Pages/Reposicao'

import CompartimentoA from './Pages/CompartimentoA';
import CompartimentoB from './Pages/CompartimentoB';
import CompartimentoC from './Pages/CompartimentoC';
import CompartimentoD from './Pages/CompartimentoD';
import CompartimentoE from './Pages/CompartimentoE';
import RepoeA from './Pages/repoeCompA';
import RepoeB from './Pages/RepoeCompB';
import RepoeC from './Pages/RepoeCompC';
import RepoeD from './Pages/RepoeCompD';
import RepoeE from './Pages/RepoeCompE';

import camera from './camera'

import testeGraf from './Pages/testeGraf'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DatabaseInit from './dataBase/dataBaseInit';
const db = DatabaseConnection.getConnection()
import { DatabaseConnection } from './dataBase/dataBase'

const Stack = createStackNavigator();


export default class App extends Component {


  constructor(props) {
    super(props);
    new DatabaseInit
    console.log("initialize database");
  }
  


render(){
  return (
 
    <NavigationContainer>
      <Stack.Navigator >
        
            
          
          <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="PagInterm"
          component={PagInterm}
          initialParams={{ cadastroExiste : false,desabilitaBotao: false, textDetect: []}}
          options={{ headerTintColor: 'royalblue',
          headerLeft:null,
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center', fontStyle:'italic'}}>HelpHealth</Text> </React.Fragment>) }}
        />
{
   /////text camera
}
          <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="camera"
          initialParams={{ submitSelect : "", compA: false, compB: false, compC: false, compD: false, compE: false}}
          component={camera}
          options={{headerShown: false
           }}
        />
      
  { /*   <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="Login"
          component={Login}
          options={{ headerTintColor: 'royalblue',
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Assistente Lyla</Text> </React.Fragment>) }}
        />
        */}     
  
  {
   /*   <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="LylaInteractive"
          component={LylaInteractive}
          options={{ headerTintColor: 'royalblue',
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Assistente Lyla</Text> </React.Fragment>) }}
        />
                */
}

        <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="RegisterMedicines"
          component={RegisterMedicines}
          initialParams={{ checkedA : false , checkedB: false,  checkedC: false,  checkedD: false,  checkedE: false}}
          options={{ headerTintColor: 'royalblue',
          headerLeft:null,
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Cadastro Remédios</Text> </React.Fragment>) }}
        />

         <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="Reposicao"
          component={Reposicao}
          initialParams = {{historico: false}}
          options={{ headerTintColor: 'royalblue',
          headerLeft:null,
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Reposição Remédios</Text> </React.Fragment>) }}
        />

         <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="Home"
          component={Home}
          initialParams = {{historico: false}}
          options={{ headerTintColor: 'royalblue',
          headerLeft:null,
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Agenda</Text> </React.Fragment>) }}
        />
         <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="Historico"
          component={Historico}
          options={{ headerTintColor: 'royalblue',
          headerLeft:null,
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Histórico</Text> </React.Fragment>) }}
        />
         <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="CompartimentoA"
          component={CompartimentoA}
          initialParams={{ checkedA : false , checkedB: false,  textDetect: [], camera: false}}
          options={{ headerTintColor: 'royalblue',
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Cadastro de Remédio</Text> </React.Fragment>) }}
        />
          <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="CompartimentoB"
          component={CompartimentoB}
          initialParams={{ textDetect: [], camera: false}}
          options={{ headerTintColor: 'royalblue',
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Cadastro de Remédio</Text> </React.Fragment>) }}
        />
         <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="CompartimentoC"
          component={CompartimentoC}
          initialParams={{ textDetect: [], camera: false}}
          options={{ headerTintColor: 'royalblue',
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Cadastro de Remédio</Text> </React.Fragment>) }}
        />
        <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="CompartimentoD"
          component={CompartimentoD}
          initialParams={{ textDetect: [], camera: false}}
          options={{ headerTintColor: 'royalblue',
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Cadastro de Remédio</Text> </React.Fragment>) }}
        />
         <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="CompartimentoE"
          component={CompartimentoE}
          initialParams={{ textDetect: [], camera: false}}
          options={{ headerTintColor: 'royalblue',
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Cadastro de Remédio</Text> </React.Fragment>) }}
        />
          <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="RepoeA"
          initialParams = {{reporA: "", reposA: false}}
          component={RepoeA}
          options={{ headerTintColor: 'royalblue',
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Reposição</Text> </React.Fragment>) }}
        />
         <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="RepoeB"
          initialParams = {{reporB: "", reposB: false}}
          component={RepoeB}
          options={{ headerTintColor: 'royalblue',
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Reposição</Text> </React.Fragment>) }}
        />
           <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="RepoeC"
          initialParams = {{reporC: "", reposC: false}}
          component={RepoeC}
          options={{ headerTintColor: 'royalblue',
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Reposição</Text> </React.Fragment>) }}
        />
        <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="RepoeD"
          initialParams = {{reporD: "", reposD: false}}
          component={RepoeD}
          options={{ headerTintColor: 'royalblue',
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Reposição</Text> </React.Fragment>) }}
        />
         <Stack.Screen
          style={{ justifyContent: 'center' }}
          name="RepoeE"
          initialParams = {{reporE: "", reposE: false}}
          component={RepoeE}
          options={{ headerTintColor: 'royalblue',
          headerStyle: {
             backgroundColor: '#96c1fa'
          },headerTitle: (<React.Fragment ><Text style={{fontSize:22,textAlign:'center',color:'black',alignItems: 'center', alignContent: 'center'}}>Reposição</Text> </React.Fragment>) }}
        />

      </Stack.Navigator>

    </NavigationContainer>
  
  );
        }
}
