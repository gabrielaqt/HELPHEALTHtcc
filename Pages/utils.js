import { DatabaseConnection } from '../dataBase/dataBase'
const db = DatabaseConnection.getConnection()
    


export function setIP(ip)
{
    new Promise((resolve, reject) => db.transaction(tx => {
        tx.executeSql(`select * from ipConfig`, [], (_, { rows }) => {
            resolve(rows)
           verificaExiste(rows, ip);

    }), (sqlError) => {
        console.log(sqlError);
    }
    }, (txError) => {
    console.log(txError);
    }))

}
const chamaFunc = async(rows)=>{
    const array = rows._array;
    console.log("#################################rows", rows)
    return "sdfsdfsdf"
}

export const getIP = async () => {

    
    new Promise((resolve, reject) => db.transaction(tx => {
        tx.executeSql(`select * from ipConfig`, [], (_, { rows }) => {
            console.log("****TABELA IPCONFIG******");

            resolve(rows)
           
            console.log(rows);
           

            
           const IP =  chamaFunc(rows);
            return IP;
        }), (sqlError) => {
            console.log(sqlError);
        }
    }, (txError) => {
        console.log(txError);
    }))
    

}
function verificaExiste(rows, ip)
{
    console.log("ssdjfhjsdkfhksdhf",rows);
    if (rows.length > 0) {
         console.log("CAIU AQUI")
         atualizaIP(ip);
    }
    else {
        insereIP(ip);

    }
}

function insereIP(ipRegister)
{
    console.log("AQUIIIII")
    new Promise((resolve, reject) => db.transaction(
        tx => {
            tx.executeSql(`insert into ipConfig (ip) values (?)`,[ipRegister],
                (_, {insertId,  rows }) => {
                    resolve(insertId)
                    console.log("ele inseriu");
                }), (sqlError) => {
                    console.log(sqlError);
                }
        }, (txError) => {
            console.log(txError);
        }));

}
function atualizaIP(ip)
{
    new Promise((resolve, reject) => db.transaction(
        tx => {
            tx.executeSql(`update ipConfig set ip=? 
               where idIP = ?`,
                [ip, 1],
                (_, { insertId, rows }) => {
                   
                console.log("ATTT", rows);


                }), (sqlError) => {
                    console.log(sqlError);
                }
        }, (txError) => {
            console.log(txError);
        }));
//where idIP = 0
}