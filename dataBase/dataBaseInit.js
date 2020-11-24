import { DatabaseConnection } from './dataBase'

var db = null
export default class DatabaseInit {

    constructor() {
        db = DatabaseConnection.getConnection()
        db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
            console.log('Foreign keys turned on')
        );
        this.InitDb()
    }
    InitDb() {
        var sql = [
        //    `DROP TABLE IF EXISTS medicamentos;`,
        //    `DROP TABLE IF EXISTS horarioMedicamentos;`,
         //  `DROP TABLE IF EXISTS atrasoMedicamentos;`,
        //    `DROP TABLE IF EXISTS ipConfig;`,


            `create table if not exists medicamentos (
                idMedicamento integer primary key autoincrement,
                nome text,
                compartimento text,
                qntTotal int,
                qntDose int
         
            );`,
            `create table if not exists horarioMedicamentos (
                idHorario integer primary key autoincrement,
                horario text,
                data date,
                compartimento text,
                idMedicamento int
            );`,
            `create table if not exists atrasoMedicamentos (
                idAtraso integer primary key autoincrement,
                horario text,
                data date,
                compartimento text
            );`,
            `create table if not exists ipConfig (
                idIP integer primary key autoincrement,
                ip text
         
            );`
        ];

        db.transaction(
            tx => {
                for (var i = 0; i < sql.length; i++) {
                    console.log("execute sql : " + sql[i]);
                    tx.executeSql(sql[i]);
                }
            }, (error) => {
                console.log("error call back : " + JSON.stringify(error));
                console.log(error);
            }, () => {
                console.log("transaction complete call back ");
            }
        );
    }

}