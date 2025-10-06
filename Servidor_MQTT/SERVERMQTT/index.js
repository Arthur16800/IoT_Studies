const aedes = require ('aedes')();
const mqtt = require ('mqtt');
const {createServer} = require('net');
const mysql = require('mysql2');

// Conexão Mysql

const pool = mysql.createPool({
    host:'localhost',
    user:'alunods',
    password:'senai@604',
    database:'mqtt'
})

// Configuração do broker Mqtt
const server = createServer(aedes.handle);
const PORT = 1883;
server.listen(PORT, ()=>{
    console.log(`BROKER mqtt rodando na porta ${PORT}`)
});

aedes.on('publish', async (packet,client)=>{
    if(packet.topic === 'iot/esp32'){
        try{
            const payload = JSON.parse(packet.payload.toString());

            // exemplo de payload
            // {sensor:"temperatura", valor:"25.5"}
            const {sensor, valor} = payload;

            // insert no Mysql
            pool.query(`INSERT INTO sensores(sensor, valor) VALUES (?, ?)`, 
                [sensor, valor],
                (err, results)=>{
                    if(err) console.error("Erro ao inserir no mysql:", err);
                    else console.log("Dados inseridos", results);
            }
        )

        }catch(error){
            console.error("Erro ao processar mensagens: ", error);
        }
    }
})
