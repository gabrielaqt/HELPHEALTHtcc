import axios from "axios"
import { DatabaseConnection } from '../dataBase/dataBase'
const db = DatabaseConnection.getConnection()
const medicamentos = "medicamentos";
const horarioMedicamentos = "horarioMedicamentos";
const teste = 0;
var tamanho = 0;
var idMed;
var i;
console.disableYellowBox = true;

export default class sendMedicamentos {


    constructor() {
        this.tamanho;
        this.idMedic;
    }

    static insereHorariosMed(json, id) {
        var horarioMed;
        for (i = 0; i < json.horarios.length; i++) {

            horarioMed = json.horarios[i].horario;
            this.inseteNaTabelaHorario(json, horarioMed, id);

        }
        this.exibeTabelas();

    }
    static exibeTabelas() {
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos}`, [], (_, { rows }) => {
                console.log("****TABELA MEDICAMENTOS******");

                resolve(rows)
                console.log(rows);

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${horarioMedicamentos}`, [], (_, { rows }) => {
                console.log("******TABELA HORARIOS******");

                resolve(rows)

                console.log(rows);
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    }
    static inseteNaTabelaHorario(json, hora, id) {
       // console.log(hora, id);

        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`insert into ${horarioMedicamentos} (horario,idMedicamento, compartimento) values (?,?,?) `,
                [hora, id, json.compartimento], (_, { insertId, rows }) => {
            
                }), (sqlError) => {
                    console.log(sqlError);
                }
        }, (txError) => {
            console.log(txError);
        }))
    }
    static insereMedicamentos(json) {

        new Promise((resolve, reject) => db.transaction(
            tx => {
                tx.executeSql(`insert into ${medicamentos} (compartimento, nome, qntTotal, qntDose) 
                    values (?,?,?,?)`,
                    [json.compartimento, json.nome, json.qntTotal, json.qntDose],
                    (_, { insertId, rows }) => {
                        resolve(insertId)
                        idMed = insertId;
                        this.insereHorariosMed(json, idMed);

                    }), (sqlError) => {
                        console.log(sqlError);
                    }
            }, (txError) => {
                console.log(txError);
            }));


    }

    static insertHorariosMed(json, idMedic) {
        var horarioTab;

        for (var i = 0; i < json.horarios.length; i++) {
            horarioTab = json.horarios[i].horario;
          //  console.log("****", horarioTab);
            this.inseteNaTabelaHorario(json, horarioTab, idMedic);


        }
        this.exibeTabelas();

    }
    static deleteHorariosMedicamentos(json, idMedicam) {

        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`delete from ${horarioMedicamentos} where idMedicamento = ?`, [idMedicam], (_, { rows }) => {

                resolve(rows)


                this.insertHorariosMed(json, idMedicam);
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))



    }
    static updateTabelMedicamentos(json, idMedic) {
        new Promise((resolve, reject) => db.transaction(
            tx => {
                tx.executeSql(`update ${medicamentos} set  nome=?, qntTotal=?, qntDose=? 
                   where compartimento = ?`,
                    [json.nome, json.qntTotal, json.qntDose, json.compartimento],
                    (_, { insertId, rows }) => {
                       
                        this.deleteHorariosMedicamentos(json, idMedic)


                    }), (sqlError) => {
                        console.log(sqlError);
                    }
            }, (txError) => {
                console.log(txError);
            }));
    }


    static comparaSeExiste(json, idMedic) {
        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${medicamentos} where compartimento = ? `, [json.compartimento], (_, { rows }) => {

                if (rows.length == 0) {
                  //  console.log("NÂO TEM");
                    this.insereMedicamentos(json);

                }
                else {
               //     console.log("TEM");
                    this.updateTabelMedicamentos(json, idMedic);
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    }


    static adicionarMed(json) {

      //  console.log(json);

        new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select idMedicamento from ${medicamentos} where compartimento = ? `, [json.compartimento], (_, { rows }) => {
                resolve(rows)
                this.tamanho = rows.length;
                if (this.tamanho > 0) {
                    const array = rows._array
                    this.comparaSeExiste(json, array[0].idMedicamento);
                }
                else {
                    this.insereMedicamentos(json);
                }

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    


    }
}