import React, { Component , useState } from 'react';
import {
    TextInput,
    Text,
    View,
    Picker,
    FlatList
}from "react-native"
export default class exibeHome extends Component
{
    constructor(props){
        super(props)
        
    }

 
    static consultaNome(){



 
    
    }

    render(){
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [props.compartimento], (_, { rows }) => {

                if(rows.length != 0){
                    console.log("EXISTE", rows);
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
        return(
            <Text>okay</Text>
           
        )
    }


}
