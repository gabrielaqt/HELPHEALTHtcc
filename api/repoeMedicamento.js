import axios from "axios"
import { DatabaseConnection } from '../dataBase/dataBase'
const db = DatabaseConnection.getConnection()
const medicamentos = "medicamentos";
const horarioMedicamentos = "horarioMedicamentos";

console.disableYellowBox = true;

export default class sendMedicamentos {
    constructor() 
    {
        this.tamanho;
        this.idMedic;
    }

    static updateTabelMedicamentos(json, idMedic, qntTotalAnt) {
        console.log("REPOR")
        console.log(qntTotalAnt)
        
        console.log(parseInt(json.qntTotal) + parseInt(qntTotalAnt))
        new Promise((resolve, reject) => db.transaction(
            tx => {
                tx.executeSql(`update ${medicamentos} set  qntTotal=?
                   where compartimento = ?`,
                    [parseInt(json.qntTotal) + parseInt(qntTotalAnt), json.compartimento],
                    (_, { insertId, rows }) => {
                       
                    console.log(this.qntTotalInt)

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

                if (rows.length != 0) {
               

                    //SALVA A QNT q tinha pra somar e dar UPDATE
                 
                    const array = rows._array
               //MANDAR NESSA FUNCAO A QNT  Q TINHA PRA SOMAR E ATT *******************************
                    this.updateTabelMedicamentos(json, idMedic, array[0].qntTotal);
                }
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    }
    static adicionarMed(json)
     {

        //  console.log(json);
  
          new Promise((resolve, reject) => db.transaction(tx => {
              tx.executeSql(`select idMedicamento from ${medicamentos} where compartimento = ? `, [json.compartimento], (_, { rows }) => {
                  resolve(rows)
                  this.tamanho = rows.length;
                  if (this.tamanho > 0) {
                      const array = rows._array
                      this.comparaSeExiste(json, array[0].idMedicamento);
                  }
               
              }), (sqlError) => {
                  console.log(sqlError);
              }
          }, (txError) => {
              console.log(txError);
          }))
      
  
  
      }
}