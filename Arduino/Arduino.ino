#if defined(ESP8266)
#include <ESP8266WiFi.h>  //ESP8266 Core WiFi Library        
#else
#include <WiFi.h>      //ESP32 Core WiFi Library    
#endif

#if defined(ESP8266)
#include <ESP8266WebServer.h> //Local WebServer used to serve the configuration portal
#else
#include <WebServer.h> //Local WebServer used to serve the configuration portal ( https://github.com/zhouhan0126/WebServer-esp32 )
#endif

#include <DNSServer.h> //Local DNS Server used for redirecting all requests to the configuration portal ( https://github.com/zhouhan0126/DNSServer---esp32 )
#include <WiFiManager.h>   // WiFi Configuration Magic ( https://github.com/zhouhan0126/WIFIMANAGER-ESP32 ) >> https://github.com/tzapu/WiFiManager (ORIGINAL)
#include "Wire.h"
#include <LiquidCrystal_I2C.h> //Biblioteca do visor LCD i2C
#define DS1307_ADDRESS 0x68 // Modulo RTC no endereco 0x68
#include <Arduino.h>
#include <HTTPClient.h>
#include "ArduinoJson.h"
#include <WebSocketsServer.h>

uint8_t numeroSocket;
WebSocketsServer webSocket = WebSocketsServer(1337);


int configWIFI=0;

//-----------------------------NUMERO SOCKET
uint8_t numSocketHistorico=33;
uint8_t numSocketRemedio=34;



// Set web server port number to 8080
int buttonState;             // the current reading from the input pin
int lastButtonState = LOW;   // the previous reading from the input pin
unsigned long lastDebounceTime = 0;  // the last time the output pin was toggled
unsigned long debounceDelay = 50;    // the debounce time; increase if the output flickers
String verificaGet = "";
WiFiServer server(8080);
WiFiClient client;
// Variable to store the HTTP request
String header;
LiquidCrystal_I2C lcd(0x27, 20, 4); // Modulo I2C display no endereco 0x27
StaticJsonDocument<256> doc;
int freq = 1500;
int channel = 0;
int resolution = 8;
int contBuzzer = 0;
int contAuxBuzzer = 0;
//Declaração Variáveis......
String payload = "";
String payloadSalvo = "";
byte zero = 0x00;
int respostaOK = 0;
String diaFormatoBD = "";

//-----------------------LEDS
int ledOpenB = 26;
int ledOpen = 27;
int ledOpenC = 14;
int ledOpenD = 12;
int ledOpenE = 13;

int LED = 2;
//-----------------------LEDS VERMELHOS
int ledReporA = 15;
int ledReporB = 2;
int ledReporC = 0;
int ledReporD = 4;
int ledReporE = 16;
//-----------------------REEDS
int switchReedA = 34;
int switchReedB = 35;
int switchReedC = 32;
int switchReedD = 33;
int switchReedE = 25;


///----------------------BOOLEANOS
bool abriuA = false;
bool abriuB = false;
bool abriuC = false;
bool abriuD = false;
bool abriuE = false;

//--------------- STRUCT COMPARTIMENTOS
struct compartimento
{
  String comp;
  String horarios[4];
  String dose;
  String nomeRemedio;
  int tomou[4];
  int qntHorarios;
  int total;
};

typedef struct compartimento Compartimento;
Compartimento compartimentos[5];


///----------------MONTANDO JASON HORARIOS ATRASO
String dia = "";
String jsonFinal = "{";
String jsonHorariosA = "";
String jsonDiaA = "";
String jsonHorariosB = "";
String jsonDiaB = "";
String jsonHorariosC = "";
String jsonDiaC = "";
String jsonHorariosD = "";
String jsonDiaD = "";
String jsonHorariosE = "";
String jsonDiaE = "";



//----------------MONTANDO JSON dose
String jsonFinalQntRemedio = "{";
int jsonQntA=-1;
int jsonQntB=-1;
int jsonQntC=-1;
int jsonQntD=-1;
int jsonQntE=-1;

//-----------------MONTAR JSON TOTAL  REMEDIOS
String totalRemedios = "{";


///---------------- MONTA VETOR PARA BUZZER
bool vetorTomarComp[5] = {false, false, false, false, false};
bool vetorTomouComp[5] = {false, false, false, false, false};
int contParaTomar = 0;
int contTomou = 0;



////--------------------BOTÕES
const int PIN_AP = 19;
const int PIN_RESET = 18;
///
int buttonStateReset;             // the current reading from the input pin
int lastButtonStateReset = LOW;   // the previous reading from the input pin

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastDebounceTimeReset = 0;  // the last time the output pin was toggled
unsigned long debounceDelayReset = 50;    // the debounce time; increase if the output flickers
int contReset =0;
int contIP =0;
///
int buttonStateIP;             // the current reading from the input pin
int lastButtonStateIP = LOW;   // the previous reading from the input pin
unsigned long lastDebounceTimeIP = 0;  // the last time the output pin was toggled
unsigned long debounceDelayIP = 50;    // the debounce time; increase if the output flickers

//Horas concatenadas para enviar de volta ****
String horarioSend = "TESTEEEE";

int cont = 0;
void setup() {

  // Initialize the output variables as outputs
  lcd.init();
  // turn on LCD backlight
  lcd.backlight();
  lcd.clear();
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
  pinMode(ledOpen, OUTPUT);
  pinMode(ledOpenB, OUTPUT);
  pinMode(ledOpenC, OUTPUT);
  pinMode(ledOpenD, OUTPUT);
  pinMode(ledOpenE, OUTPUT);
  pinMode(ledReporA, OUTPUT);
  pinMode(ledReporB, OUTPUT);
  pinMode(ledReporC, OUTPUT);
  pinMode(ledReporD, OUTPUT);
  pinMode(ledReporE, OUTPUT);
         
  pinMode(switchReedA, INPUT);
  pinMode(switchReedB, INPUT);
  pinMode(switchReedC, INPUT);
  pinMode(switchReedD, INPUT);
  pinMode(switchReedE, INPUT);


  ledcSetup(channel, freq, resolution);
  ledcAttachPin(17, channel);

  pinMode(PIN_AP, INPUT);
  pinMode(PIN_RESET, INPUT);
  //declaração do objeto wifiManager
  WiFiManager wifiManager;
//IPAddress _ip = IPAddress(192, 168, 0, 254);
//  IPAddress _gw = IPAddress(192, 168, 0, 1);
//  IPAddress _sn = IPAddress(255, 255, 0, 0);
//  //end-block2
// 
//  wifiManager.setSTAStaticIPConfig(_ip, _gw, _sn);

  //utilizando esse comando, as configurações são apagadas da memória
  //caso tiver salvo alguma rede para conectar automaticamente, ela é apagada.
//    wifiManager.resetSettings();
//wifiManager.setAPStaticIPConfig (IPAddress ( 192 , 168 , 0 , 104 ), IPAddress ( 10 , 0 , 1 , 1 ), IPAddress ( 255 , 255 , 255 , 0 ));

  //callback para quando entra em modo de configuração AP
  wifiManager.setAPCallback(configModeCallback);
  //callback para quando se conecta em uma rede, ou seja, quando passa a trabalhar em modo estação
  wifiManager.setSaveConfigCallback(saveConfigCallback);

  //cria uma rede de nome ESP_AP com senha 12345678
  wifiManager.autoConnect("HELPHEALTH", "12345678");
  server.begin();
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);

 Serial.println( "IP :");
  Serial.println( WiFi.localIP());
 Serial.println( "CONECTADO A:");
  Serial.println( wifiManager.getSSID());
   Serial.print("ESP Board MAC Address:  ");
  Serial.println(WiFi.macAddress());
}

void loop()
{      

//----------------------------Config Wifi -----------------------------------------------------
   int readingReset = digitalRead(PIN_RESET);
 
 
    if (readingReset != lastButtonStateReset) {
      lastDebounceTimeReset = millis();
    }
 
    if ((millis() - lastDebounceTimeReset) > debounceDelayReset) {
     
 
      if (readingReset != buttonStateReset) {
        buttonStateReset = readingReset;
 
        if (buttonStateReset == HIGH) {
        contReset++;
        }
      }
    }
 
 
      if(contReset == 1)
      {
        contReset = 2;
      }
 
    lastButtonStateReset = readingReset;
   
    if ( contReset == 2 )
    {
       lcd.setCursor(2, 2);
       lcd.print(" Config. Wifi !");
       lcd.setCursor(4, 3);
       lcd.print("192.168.4.1");
 
     
      WiFiManager wifiManager;
      if (!wifiManager.startConfigPortal("HELPHEALTH", "12345678") )
      {
        Serial.println("Falha ao conectar");
        delay(2000);
        ESP.restart();
      }
      contReset =0;
      Serial.println("AQUI DEOIIS DE Q");
        clearDOSE();

        
// Serial.println( "CONECTADO A:");
//  Serial.println( wifiManager.getSSID());
    }
////---FIM Config Wifi

  String concatHor = "";
  String concatMin = "";
  Wire.beginTransmission(DS1307_ADDRESS);
  Wire.write(zero);
  Wire.endTransmission();
  Wire.requestFrom(DS1307_ADDRESS, 7);
  int segundos = ConverteparaDecimal(Wire.read());
  int minutos = ConverteparaDecimal(Wire.read());
  int horas = ConverteparaDecimal(Wire.read() & 0b111111);
  int diadasemana = ConverteparaDecimal(Wire.read());
  int diadomes = ConverteparaDecimal(Wire.read());
  int mes = ConverteparaDecimal(Wire.read());
  int ano = ConverteparaDecimal(Wire.read());
  dia = "";
  diaFormatoBD = "";



  // Mostra os dados no display
  lcd.setCursor(0, 0);
  lcd.print(" ");
  // Acrescenta o 0 (zero) se a hora for menor do que 10
  if (horas < 10) {
    lcd.print("0");
    concatHor = "0";
  }
  concatHor.concat(String(horas));
  lcd.print(horas);
  lcd.print(":");
  // Acrescenta o 0 (zero) se minutos for menor do que 10
  if (minutos < 10) {
    lcd.print("0");
    concatMin = "0";
  }
  concatMin.concat(String(minutos));
  lcd.print(minutos);
  lcd.print(":");
  // Acrescenta o 0 (zero) se minutos for menor do que 10
  if (segundos < 10)
    lcd.print("0");
  lcd.print(segundos);

  lcd.setCursor(11, 0);
  // Acrescenta o 0 (zero) se dia do mes for menor do que 10
  if (diadomes < 10)
  { lcd.print("0");
    dia.concat("0");


  }
  dia.concat(diadomes);
  dia.concat("/");
  lcd.print(diadomes);
  lcd.print("/");
  // Acrescenta o 0 (zero) se mes for menor do que 10
  if (mes < 10)
  { lcd.print("0");
    dia.concat("0");

  }
  dia.concat(mes);
  dia.concat("/");
  dia.concat(ano);

  lcd.print(mes);
  lcd.print("/");
  lcd.print(ano);

  ///--------------------------FORMATO DATA BD-------------------------------------------


  diaFormatoBD.concat("20");
  diaFormatoBD.concat(ano);
  diaFormatoBD.concat("-");
  if (mes < 10) {
    diaFormatoBD.concat("0");

  }
  diaFormatoBD.concat(mes);
  diaFormatoBD.concat("-");
  if (diadomes < 10) {
    diaFormatoBD.concat("0");

  }
  diaFormatoBD.concat(diadomes);


  WiFiClient client = server.available();   // Listen for incoming clients
 // Serial.println(client);

  if (client) {                             // If a new client connects,
    int i = 0;
    int inicio = 0;
    Serial.println("New Client.");          // print a message out in the serial port
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected()) {            // loop while the client's connected
      if (client.available() > 0) {           // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        if (c == 'G') {
          verificaGet.concat(c);

        }
        else {
          verificaGet.concat(c);
        }
        if (verificaGet == "GET") {
          Serial.print("ABRIU depois q fechou APP");
          verificaGet = "";
          break;

        }
        Serial.print(c);


        if (c == '}') {
          Serial.println("Chegou no final do JSON");
          currentLine = currentLine + '}';
          Serial.print("Esse eh o dado final ->>>>");
          Serial.println(currentLine);
          payload = currentLine;


          ///COMPARA TIPO "payload" ou "send"
          const size_t capacity = JSON_OBJECT_SIZE(1000) + JSON_ARRAY_SIZE(800) + 200;
          DynamicJsonDocument doc(capacity);

          // Parse JSON object
          DeserializationError error = deserializeJson(doc, payload);
          if (error) {
            Serial.print(F("deserializeJson() failed: "));
            Serial.println(error.c_str());
            return;
          }
          String pegaTipo = doc["tipo"].as<char*>();
          if (pegaTipo == "payload") {
            constroiStruct(payload, concatHor, concatMin);
            getResultCompA(payload, concatHor, concatMin, diaFormatoBD);
            respostaOK = 1;
            payloadSalvo = payload;
          }

          client.println("HTTP/1.1 200 OK");
          client.println("Content-type:application/json");
          client.println();
          if (pegaTipo == "send") {
            jsonFinal.concat('"');
            jsonFinal.concat("horariosA");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonHorariosA);
            jsonFinal.concat("]");
            jsonFinal.concat(",");
            jsonFinal.concat('"');
            jsonFinal.concat("datasA");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonDiaA);
            jsonFinal.concat("]");
            ///B
            jsonFinal.concat(',');
            jsonFinal.concat('"');
            jsonFinal.concat("horariosB");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonHorariosB);
            jsonFinal.concat("]");
            jsonFinal.concat(",");
            jsonFinal.concat('"');
            jsonFinal.concat("datasB");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonDiaB);
            jsonFinal.concat("]");
             ///C
            jsonFinal.concat(',');
            jsonFinal.concat('"');
            jsonFinal.concat("horariosC");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonHorariosC);
            jsonFinal.concat("]");
            jsonFinal.concat(",");
            jsonFinal.concat('"');
            jsonFinal.concat("datasC");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonDiaC);
            jsonFinal.concat("]");
            ///D
            jsonFinal.concat(',');
            jsonFinal.concat('"');
            jsonFinal.concat("horariosD");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonHorariosD);
            jsonFinal.concat("]");
            jsonFinal.concat(",");
            jsonFinal.concat('"');
            jsonFinal.concat("datasD");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonDiaD);
            jsonFinal.concat("]");
             ///E
            jsonFinal.concat(',');
            jsonFinal.concat('"');
            jsonFinal.concat("horariosE");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonHorariosE);
            jsonFinal.concat("]");
            jsonFinal.concat(",");
            jsonFinal.concat('"');
            jsonFinal.concat("datasE");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonDiaE);
            jsonFinal.concat("]");
           

            jsonFinal.concat("}");

            Serial.print(jsonFinal);
            client.println(jsonFinal);
            jsonFinal = "{";
            jsonHorariosA = "";
            jsonDiaA = "";
            jsonHorariosB = "";
            jsonDiaB = "";
            jsonHorariosC = "";
            jsonDiaC = "";
            jsonHorariosD = "";
            jsonDiaD = "";
            jsonHorariosE = "";
            jsonDiaE = "";
          }
          if (pegaTipo == "replace") {
            Serial.println("CHAMAR FUCNAO PAR ATT JSON");
            repoeRemedio(payload);
          }
          else {
          //  client.println("Sem Send");
          }

          break;

        }
        if (c == '{' || inicio == 1) {
          inicio = 1;
          currentLine = currentLine + c;
        }

      }
     
    }
    // Clear the header variable
    //   client.println("testeeeeeeeee");
    // Close the connection
  //  client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
    verificaGet = "";
  }
  if (respostaOK == 1) {
    getResultCompA(payloadSalvo, concatHor, concatMin, diaFormatoBD);
  }
  else
  {
    //COLOCAR O IP ******************************************************************************************
      int readingIP = digitalRead(PIN_AP);
 
 
    if (readingIP != lastButtonStateIP) {
      lastDebounceTimeIP = millis();
    }
 
    if ((millis() - lastDebounceTimeIP) > debounceDelayIP) {
     
 
      if (readingIP != buttonStateIP) {
        buttonStateIP = readingIP;
 
        if (buttonStateIP == HIGH) {
          Serial.print("kdjsfhkjsdfhjkfs");
        contIP++;
        }
      }
    }
 
 
      if(contIP == 1)
      {
        contIP = 2;
      }
 
    lastButtonStateIP = readingIP;
   
    if ( contIP == 2 )
    {
       lcd.setCursor(2, 1);
       lcd.print("IP: ");
       lcd.setCursor(4, 2);
       lcd.print(WiFi.localIP());
 
     
    
      contIP =3;
      Serial.println("AQUI DEOIIS DE Q");
      

    }
     if(contIP == 4)
      {
        contIP = 0;
        clearDOSE();
      }
    
  }
 webSocket.loop();
  //webSocket.sendTXT(numeroSocket, "teste ddg");
}
//////--------------------------------REPOE QNT REMEDIOO------------------------------------------------
void repoeRemedio(String payload)
{
  const size_t capacity = JSON_OBJECT_SIZE(1000) + JSON_ARRAY_SIZE(800) + 200;
  DynamicJsonDocument doc(capacity);

  // Parse JSON object
  DeserializationError error = deserializeJson(doc, payload);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }

   if ( strcmp(doc["compartimento"].as<char*>() , "A") == 0)
   {
      compartimentos[0].total = doc["qntTotal"];
      Serial.print("COMP A TOTAL == ");
      Serial.print(compartimentos[0].total);
   }
    if ( strcmp(doc["compartimento"].as<char*>() , "B") == 0)
   {
      compartimentos[1].total = doc["qntTotal"];
      Serial.print("COMP A TOTAL == ");
      Serial.print(compartimentos[1].total);
   }
    if ( strcmp(doc["compartimento"].as<char*>() , "C") == 0)
   {
      compartimentos[2].total = doc["qntTotal"];
      Serial.print("COMP A TOTAL == ");
      Serial.print(compartimentos[2].total);
   }
    if ( strcmp(doc["compartimento"].as<char*>() , "D") == 0)
   {
      compartimentos[3].total = doc["qntTotal"];
      Serial.print("COMP A TOTAL == ");
      Serial.print(compartimentos[3].total);
   }
    if ( strcmp(doc["compartimento"].as<char*>() , "E") == 0)
   {
      compartimentos[4].total = doc["qntTotal"];
      Serial.print("COMP A TOTAL == ");
      Serial.print(compartimentos[4].total);
   }


   jsonQntA = compartimentos[0].total;
     jsonQntB = compartimentos[1].total;
     jsonQntC = compartimentos[2].total;
     jsonQntD = compartimentos[3].total;
     jsonQntE = compartimentos[4].total;
 
}
/////-------------------------------- CONSTROI STRUCT ---------------------------------------------------
void constroiStruct(String payload, String hora, String minuto) {
//  client.println("jhjhjhjhjhjh");
  const size_t capacity = JSON_OBJECT_SIZE(1000) + JSON_ARRAY_SIZE(800) + 200;
  DynamicJsonDocument doc(capacity);

  // Parse JSON object
  DeserializationError error = deserializeJson(doc, payload);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }
  String horas = hora;
  horas.concat(":");
  String minutos = minuto;
  horas.concat(minutos);


 //CONSTROI A
  if ( strcmp(doc["compartimentoA"].as<char*>() , "null") != 0) {
    compartimentos[0].comp = doc["compartimentoA"].as<char*>();
    compartimentos[0].dose = doc["doseA"].as<char*>();
    compartimentos[0].nomeRemedio = doc["nomeA"].as<char*>();
    compartimentos[0].total = doc["totalA"];
    for (int i = 0; i < doc["horariosA"].size(); i++) {
      compartimentos[0].horarios[i] = doc["horariosA"][i].as<char*>();
      //compatro horaAtual > hora vindo (se true == 1) senão 0
      if (horas > doc["horariosA"][i].as<char*>()) {
        compartimentos[0].tomou[i] = 1;
      }
      else {
        compartimentos[0].tomou[i] = 0;

      }
    }
    compartimentos[0].qntHorarios = doc["horariosA"].size();
  }
  else {
    compartimentos[0].comp = doc["compartimentoA"].as<char*>();
  }
  Serial.println("COMP A:");
  Serial.println(compartimentos[0].total);
  Serial.println(compartimentos[0].qntHorarios);
  Serial.println(compartimentos[0].comp);
  Serial.println(compartimentos[0].nomeRemedio);
  Serial.println(compartimentos[0].dose);
  for (int i = 0; i < doc["horariosA"].size(); i++) {
    Serial.println(compartimentos[0].horarios[i]);
    Serial.println(compartimentos[0].tomou[i]);
  }

  //CONSTROI B
  if ( strcmp(doc["compartimentoB"].as<char*>() , "null") != 0) {
    Serial.print("CAIU AQUI NO IF");

    compartimentos[1].comp = doc["compartimentoB"].as<char*>();
    compartimentos[1].dose = doc["doseB"].as<char*>();
    compartimentos[1].nomeRemedio = doc["nomeB"].as<char*>();
    compartimentos[1].total = doc["totalB"];
    for (int i = 0; i < doc["horariosB"].size(); i++) {
      compartimentos[1].horarios[i] = doc["horariosB"][i].as<char*>();
      if (horas > doc["horariosB"][i].as<char*>()) {
        compartimentos[1].tomou[i] = 1;
      }
      else {
        compartimentos[1].tomou[i] = 0;

      }
    }
    compartimentos[1].qntHorarios = doc["horariosB"].size();
  }
  else {
    Serial.print("CAIU AQUI NO ELSE");

    compartimentos[1].comp = doc["compartimentoB"].as<char*>();

  }
  Serial.println("COMAP B:");
  Serial.println(compartimentos[1].total);
  Serial.println(compartimentos[1].comp);

  //CONSTROI C
  if ( strcmp(doc["compartimentoC"].as<char*>() , "null") != 0) {
    compartimentos[2].comp = doc["compartimentoC"].as<char*>();
    compartimentos[2].dose = doc["doseC"].as<char*>();
    compartimentos[2].nomeRemedio = doc["nomeC"].as<char*>();
    compartimentos[2].total = doc["totalC"];
    for (int i = 0; i < doc["horariosC"].size(); i++) {
      compartimentos[2].horarios[i] = doc["horariosC"][i].as<char*>();
      //compatro horaAtual > hora vindo (se true == 1) senão 0
      if (horas > doc["horariosC"][i].as<char*>()) {
        compartimentos[2].tomou[i] = 1;
      }
      else {
        compartimentos[2].tomou[i] = 0;

      }
    }
    compartimentos[2].qntHorarios = doc["horariosC"].size();
  }
  else {
    compartimentos[2].comp = doc["compartimentoC"].as<char*>();
  }
  Serial.println("COMP C:");
  Serial.println(compartimentos[2].total);
  Serial.println(compartimentos[2].qntHorarios);
  Serial.println(compartimentos[2].comp);
  Serial.println(compartimentos[2].nomeRemedio);
  Serial.println(compartimentos[2].dose);
  //CONSTROI D
  if ( strcmp(doc["compartimentoD"].as<char*>() , "null") != 0) {
    compartimentos[3].comp = doc["compartimentoD"].as<char*>();
    compartimentos[3].dose = doc["doseD"].as<char*>();
    compartimentos[3].nomeRemedio = doc["nomeD"].as<char*>();
    compartimentos[3].total = doc["totalD"];
    for (int i = 0; i < doc["horariosD"].size(); i++) {
      compartimentos[3].horarios[i] = doc["horariosD"][i].as<char*>();
      //compatro horaAtual > hora vindo (se true == 1) senão 0
      if (horas > doc["horariosD"][i].as<char*>()) {
        compartimentos[3].tomou[i] = 1;
      }
      else {
        compartimentos[3].tomou[i] = 0;

      }
    }
    compartimentos[3].qntHorarios = doc["horariosD"].size();
  }
  else {
    compartimentos[3].comp = doc["compartimentoD"].as<char*>();
  }
  Serial.println("COMP D:");
  Serial.print(compartimentos[3].total);
  Serial.print(compartimentos[3].qntHorarios);
  Serial.println(compartimentos[3].comp);
  Serial.println(compartimentos[3].nomeRemedio);
  Serial.println(compartimentos[3].dose);
  //CONSTROI E
  if ( strcmp(doc["compartimentoE"].as<char*>() , "null") != 0) {
    compartimentos[4].comp = doc["compartimentoE"].as<char*>();
    compartimentos[4].dose = doc["doseE"].as<char*>();
    compartimentos[4].nomeRemedio = doc["nomeE"].as<char*>();
    compartimentos[4].total = doc["totalE"];
    for (int i = 0; i < doc["horariosE"].size(); i++) {
      compartimentos[4].horarios[i] = doc["horariosE"][i].as<char*>();
      //compatro horaAtual > hora vindo (se true == 1) senão 0
      if (horas > doc["horariosE"][i].as<char*>()) {
        compartimentos[4].tomou[i] = 1;
      }
      else {
        compartimentos[4].tomou[i] = 0;

      }
    }
    compartimentos[4].qntHorarios = doc["horariosE"].size();
  }
  else {
    compartimentos[4].comp = doc["compartimentoE"].as<char*>();
  }
  Serial.println("COMP E:");
  Serial.print(compartimentos[4].total);
  Serial.print(compartimentos[4].qntHorarios);
  Serial.println(compartimentos[4].comp);
  Serial.println(compartimentos[4].nomeRemedio);
  Serial.println(compartimentos[4].dose);

jsonQntA = compartimentos[0].total;
     jsonQntB = compartimentos[1].total;
     jsonQntC = compartimentos[2].total;
     jsonQntD = compartimentos[3].total;
     jsonQntE = compartimentos[4].total;

///ZERA TUDO PARA BUZZER....

 contParaTomar = 0;
 contTomou = 0;
 for(int i=0;i<5;i++)
 {
  vetorTomarComp[i]=false;
  vetorTomouComp[i]=false;
 }


 
}
//-----------------------------------FUNÇÃO COMPARA HORARIOS-----------------------------
void getResultCompA(String msg, String hora, String minuto, String dia) {
  // Serial.print("DENTRO FUNCAO");
  //  Serial.print(msg);
  const size_t capacity = JSON_OBJECT_SIZE(1000) + JSON_ARRAY_SIZE(800) + 200;
  DynamicJsonDocument doc(capacity);

  // Parse JSON object
  DeserializationError error = deserializeJson(doc, msg);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }

  String horas = hora;
  horas.concat(":");
  String minutos = minuto;
  horas.concat(minutos);

  int contAux = 0;
  int compParaTomar[5] = {};
  int controle = -1;
  for (int i = 0; i < 5; i++) {
    if (compartimentos[i].comp != "null") {
      for (int j = 0; j < compartimentos[i].qntHorarios; j++) {
        if (horas >= compartimentos[i].horarios[j]) {


          if (compartimentos[i].tomou[j] == 0) {
            if (controle == 0) {
              compartimentos[i].tomou[j - 1] = 1; //se não tomou anterior seta
              Serial.print("NAO TOMOU");
              constroiJsonNaoTomou(i, diaFormatoBD);
              // montaJsonHorariosAtraso(numSocketHistorico);
            }
            else {
              compParaTomar[contAux] = i; //coloca qual comp deve tomar
              contAux++;
              controle++;
            }
          }
        }
      }
    }
    controle = -1;
  }
  //   Serial.print("A==");
  //     for(int j=0;j<compartimentos[0].qntHorarios;j++){
  //       Serial.print("Horario==");
  //               Serial.println(compartimentos[0].horarios[j]);
  //                Serial.print("Tomou==");
  //               Serial.println(compartimentos[0].tomou[j]);
  //
  //     }
  //     Serial.print("B==");
  //     for(int j=0;j<compartimentos[1].qntHorarios;j++){
  //       Serial.print("Horario==");
  //               Serial.println(compartimentos[1].horarios[j]);
  //                Serial.print("Tomou==");
  //               Serial.println(compartimentos[1].tomou[j]);
  //
  //     }

  //---------------------- COMP. FECHADOS ----------------------------------------

  int contExibe = 0;
  for (int k = 0; k < contAux; k++) {
    //Serial.println(compParaTomar[k]);
///COMP A
    if (compParaTomar[k] == 0) {
      vetorTomarComp[0] = true;
       vetorTomouComp[0]=true;
      abriuA = false;
      for (int i = 0; i <= 50000; i++) {
        if (i == 500) {
          digitalWrite(ledOpenB, HIGH);
        }
      }

      for (int i = 0; i <= 50000; i++) {
        if (i == 50000) {
          digitalWrite(ledOpenB, LOW);
        }
      }


      lcd.setCursor(2, 1);
      lcd.print("A: ");
      lcd.setCursor(4, 2);
      lcd.print(doc["doseA"].as<char*>());
      lcd.print(" Unidade(s)");
      //          for(int i=0;i<1000000;i++){
      //              if(i==1){
      //                   ledcWriteTone(channel, freq);
      //              }
      //              if(i ==9999){
      //                   ledcWriteTone(channel, 1000);
      //              }
      //              if(i==999999){
      //                   ledcWriteTone(channel, 500);
      //              }
      //          }

      contExibe++;
    }
 //////COMPART B
    if (compParaTomar[k] == 1) {
       vetorTomarComp[1] = true;
        vetorTomouComp[1]=true;
      abriuB = false;
      for (int i = 0; i <= 50000; i++) {
        if (i == 500) {
          digitalWrite(ledOpen, HIGH);
        }
      }

      if (contExibe == 0 && abriuA == false) {
        for (int i = 0; i <= 50000; i++) {
          if (i == 50000) {
            digitalWrite(ledOpen, LOW);
          }
        }
      lcd.setCursor(2, 1);
      lcd.print("B: ");
      lcd.setCursor(4, 2);
      lcd.print(doc["doseB"].as<char*>());
      lcd.print(" Unidade(s)");
        //          for(int i=0;i<1000000;i++){
        //              if(i==1){
        //                   ledcWriteTone(channel, freq);
        //              }
        //              if(i ==9999){
        //                   ledcWriteTone(channel, 1000);
        //              }
        //              if(i==999999){
        //                   ledcWriteTone(channel, 500);
        //              }
        //          }

      }

      contExibe++;
    }
///COMP C
    if (compParaTomar[k] == 2) {
       vetorTomarComp[2] = true;
        vetorTomouComp[2]=true;
      abriuC = false;
      for (int i = 0; i <= 50000; i++) {
        if (i == 500) {
          digitalWrite(ledOpenC, HIGH);
        }
      }

      if (contExibe == 0 && abriuA == false && abriuB == false) {
        for (int i = 0; i <= 50000; i++) {
          if (i == 50000) {
            digitalWrite(ledOpenC, LOW);
          }
        }
      lcd.setCursor(2, 1);
      lcd.print("C: ");
      lcd.setCursor(4, 2);
      lcd.print(doc["doseC"].as<char*>());
      lcd.print(" Unidade(s)");
        //          for(int i=0;i<1000000;i++){
        //              if(i==1){
        //                   ledcWriteTone(channel, freq);
        //              }
        //              if(i ==9999){
        //                   ledcWriteTone(channel, 1000);
        //              }
        //              if(i==999999){
        //                   ledcWriteTone(channel, 500);
        //              }
        //          }

      }

      contExibe++;
    }

///COMP D
    if (compParaTomar[k] == 3) {
       vetorTomarComp[3] = true;
        vetorTomouComp[3]=true;
      abriuD = false;
      for (int i = 0; i <= 50000; i++) {
        if (i == 500) {
          digitalWrite(ledOpenD, HIGH);
        }
      }

      if (contExibe == 0 && abriuA == false && abriuB == false && abriuC == false) {
        for (int i = 0; i <= 50000; i++) {
          if (i == 50000) {
            digitalWrite(ledOpenD, LOW);
          }
        }
      lcd.setCursor(2, 1);
      lcd.print("D: ");
      lcd.setCursor(4, 2);
      lcd.print(doc["doseD"].as<char*>());
      lcd.print(" Unidade(s)");
        //          for(int i=0;i<1000000;i++){
        //              if(i==1){
        //                   ledcWriteTone(channel, freq);
        //              }
        //              if(i ==9999){
        //                   ledcWriteTone(channel, 1000);
        //              }
        //              if(i==999999){
        //                   ledcWriteTone(channel, 500);
        //              }
        //          }

      }

      contExibe++;
    }
///COMP E
    if (compParaTomar[k] == 4) {
       vetorTomarComp[4] = true;
       vetorTomouComp[4]=true;
      abriuE = false;
      for (int i = 0; i <= 50000; i++) {
        if (i == 500) {
          digitalWrite(ledOpenE, HIGH);
        }
      }

      if (contExibe == 0 && abriuA == false && abriuB == false && abriuC == false && abriuD == false) {
        for (int i = 0; i <= 50000; i++) {
          if (i == 50000) {
            digitalWrite(ledOpenE, LOW);
          }
        }
      lcd.setCursor(2, 1);
      lcd.print("E: ");
      lcd.setCursor(4, 2);
      lcd.print(doc["doseE"].as<char*>());
      lcd.print(" Unidade(s)");
        //          for(int i=0;i<1000000;i++){
        //              if(i==1){
        //                   ledcWriteTone(channel, freq);
        //              }
        //              if(i ==9999){
        //                   ledcWriteTone(channel, 1000);
        //              }
        //              if(i==999999){
        //                   ledcWriteTone(channel, 500);
        //              }
        //          }

      }

      contExibe++;
    }




  }
  //// CONTANDO QUANTOS COMPARTIMENTOS TEM PARA TOMAR::::
      contParaTomar  = 0;
        for(int i =0; i< 5; i++)
        {
          if( vetorTomarComp[i] == true)
          {
            contParaTomar++;
          }
        }

 

  if (abriuA == true && digitalRead(switchReedA) == HIGH) {
    abriuA = false;
    digitalWrite(ledOpenB, LOW);
     montaJsonHorariosAtraso(numSocketHistorico);
    clearDOSE();
  }
  if (abriuB == true && digitalRead(switchReedB) == HIGH) {
    abriuB = false;
    digitalWrite(ledOpen, LOW);
       montaJsonHorariosAtraso(numSocketHistorico);
    clearDOSE();
  }
  if (abriuC == true && digitalRead(switchReedC) == HIGH) {
    abriuC = false;
    digitalWrite(ledOpenC, LOW);
       montaJsonHorariosAtraso(numSocketHistorico);
    clearDOSE();
  }
  if (abriuD == true && digitalRead(switchReedD) == HIGH) {
    abriuD = false;
    digitalWrite(ledOpenD, LOW);
     montaJsonHorariosAtraso(numSocketHistorico);
    clearDOSE();
  }
  if (abriuE == true && digitalRead(switchReedE) == HIGH) {
    abriuE = false;
    digitalWrite(ledOpenE, LOW);
     montaJsonHorariosAtraso(numSocketHistorico);
    clearDOSE();
  }

//---------------------------ENVIA DADOS WEB SOCKET-----------------------------------------------

     
  //compA == compartimentos[0]
  //compB == comp
  //qual LOW

  //---------------------- COMP. FORAM ABERTOS TOMOU REMEDIOS----------------------------------------
  unsigned int minutoAgora = 0;
  unsigned int horaAgora = 0;
  minutoAgora = minuto.toInt();
  horaAgora = hora.toInt();
///COMP A
  if ( digitalRead(switchReedA) == LOW)
  {
    if (abriuA == true) {
      for (int i = 0; i <= 50000; i++) {
        if (i == 500) {
          digitalWrite(ledOpenB, HIGH);
        }
      }

      for (int i = 0; i <= 50000; i++) {
        if (i == 50000) {
          digitalWrite(ledOpenB, LOW);
        }
      }
    }
    Serial.println("LOW A");
    for (int i = 0; i < compartimentos[0].qntHorarios; i++) {
      if (compartimentos[0].tomou[i] == 0 && compartimentos[0].horarios[i] <= horas) {
        vetorTomouComp[0] = false;
        abriuA = true;
        Serial.print("ENTROU AQUI ####");
        ////SUBTRAI QNT TOMADA
        compartimentos[0].total = compartimentos[0].total - compartimentos[0].dose.toInt();
        montaJsonQntRemedios(numSocketRemedio);
       // compartimentos[0].

        //  digitalWrite(ledOpenB, LOW);
        ledcWriteTone(channel, 0);


        int minutoRegistrado = 0;
        int horaRegistrado = 0;
        int subtracaoMin = 0;
        int subtracaoHor = 0;

        String auxMin = "";
        String auxHora = "";
        auxHora = compartimentos[0].horarios[i][0];
        auxHora.concat(compartimentos[0].horarios[i][1]);
        auxMin = compartimentos[0].horarios[i][3];
     
        auxMin.concat(compartimentos[0].horarios[i][4]);
        minutoRegistrado = auxMin.toInt();
        horaRegistrado = auxHora.toInt();  ///----------------------------------------------ARRUMAR

     
       
        //MANDA JSON se horário for > 15 min



        Serial.print("MINUTO == ");
        Serial.print(minutoAgora);
        Serial.print("/");
        Serial.println(minutoRegistrado);
        Serial.print("Horario == ");
        Serial.print(horaAgora);
        Serial.print("/");
        Serial.println(horaRegistrado);

     
//=============================================================================================================================================================

         int contMinMenor = 0;
        // if(minutoAgora - minutoRegistrado > 0){
        subtracaoMin = minutoAgora - minutoRegistrado;
        subtracaoHor = horaAgora - horaRegistrado;


        if (jsonHorariosA.length() != 0)
        {
         

         
          if (subtracaoMin < 0) {
            contMinMenor++;
            subtracaoMin = subtracaoMin + 60;
            if (subtracaoHor > 0) {
            subtracaoHor = subtracaoHor - 1;
            }
          }
          if (subtracaoHor < 0) {
            subtracaoHor = subtracaoHor + 24;
            if(contMinMenor == 1){
               subtracaoHor = subtracaoHor - 1;
            }
          }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          if(subtracaoMin >= 15 || subtracaoHor > 0){
             jsonHorariosA.concat(",");
            jsonHorariosA.concat('"');
 
            //NÂO MUDA MONTA JSON ----SE MAIOR QUE 15 min;;;;;;;
            jsonHorariosA.concat(subtracaoHor);
            jsonHorariosA.concat(".");
            if (subtracaoMin < 10) {
              jsonHorariosA.concat("0");
            }
            jsonHorariosA.concat(subtracaoMin);
 
 
            jsonHorariosA.concat('"');
            jsonDiaA.concat(",");
            jsonDiaA.concat('"');
            jsonDiaA.concat(dia);
            jsonDiaA.concat('"');
          }
         

        }
        else {

       
         
          if (subtracaoMin < 0) {
            contMinMenor++;
            subtracaoMin = subtracaoMin + 60;
            if (subtracaoHor > 0) {
            subtracaoHor = subtracaoHor - 1;
            }
          }
          if (subtracaoHor < 0) {
            subtracaoHor = subtracaoHor + 24;
            if(contMinMenor == 1){
               subtracaoHor = subtracaoHor - 1;
            }
          }


           if(subtracaoMin >= 15 || subtracaoHor > 0){
              jsonHorariosA.concat('"');
            //NÂO MUDA MONTA JSON
          jsonHorariosA.concat(subtracaoHor);
          jsonHorariosA.concat(".");
          if (subtracaoMin < 10) {
            jsonHorariosA.concat("0");
          }
          jsonHorariosA.concat(subtracaoMin);
          jsonHorariosA.concat('"');
          jsonDiaA.concat('"');
          jsonDiaA.concat(dia);
          jsonDiaA.concat('"');

           }
       

   
        }
        //  }


        compartimentos[0].tomou[i] = 1;
        break;
      }
    }
  }
////COMP B
  if ( digitalRead(switchReedB) == LOW)
  {

    if (abriuB == true && abriuA == false) {
      for (int i = 0; i <= 50000; i++) {
        if (i == 500) {
          digitalWrite(ledOpen, HIGH);
        }
      }

      for (int i = 0; i <= 50000; i++) {
        if (i == 50000) {
          digitalWrite(ledOpen, LOW);
        }
      }
    }

    Serial.println("LOW B");
    for (int i = 0; i < compartimentos[1].qntHorarios; i++) {
      if (compartimentos[1].tomou[i] == 0 && compartimentos[1].horarios[i] <= horas) {
         vetorTomouComp[1] = false;
        abriuB = true;
        Serial.print("Entrou aqui");
         ////SUBTRAI QNT TOMADA
        compartimentos[1].total = compartimentos[1].total - compartimentos[1].dose.toInt();
        montaJsonQntRemedios(numSocketRemedio);
        ledcWriteTone(channel, 0);
        //MANDA JSON
        int minutoRegistrado = 0;
        int horaRegistrado = 0;
        int subtracaoMin = 0;
        int subtracaoHor = 0;

        String auxMin = "";
        String auxHora = "";
        auxHora = compartimentos[1].horarios[i][0];
        auxHora.concat(compartimentos[1].horarios[i][1]);
        auxMin = compartimentos[1].horarios[i][3];
        Serial.print("hdhdh");
        Serial.print(auxMin);
        auxMin.concat(compartimentos[1].horarios[i][4]);
        Serial.print(auxMin);
        minutoRegistrado = auxMin.toInt();
        horaRegistrado = auxHora.toInt();

        Serial.print(horaRegistrado);
        Serial.print(":");
        Serial.println(minutoRegistrado);
        Serial.print(horaAgora);
        Serial.print(":");
        Serial.println(minutoAgora);
       
        //MANDA JSON se horário for > 15 min
        int contMinMenor = 0;
        subtracaoMin = minutoAgora - minutoRegistrado;
        subtracaoHor = horaAgora - horaRegistrado;


        if (jsonHorariosB.length() != 0)
        {
         

         
          if (subtracaoMin < 0) {
            contMinMenor++;
            subtracaoMin = subtracaoMin + 60;
            if (subtracaoHor > 0) {
            subtracaoHor = subtracaoHor - 1;
            }
          }
          if (subtracaoHor < 0) {
            subtracaoHor = subtracaoHor + 24;
            if(contMinMenor == 1){
               subtracaoHor = subtracaoHor - 1;
            }
          }

          if(subtracaoMin >= 15 || subtracaoHor > 0){
             jsonHorariosB.concat(",");
            jsonHorariosB.concat('"');
 
            //NÂO MUDA MONTA JSON ----SE MAIOR QUE 15 min;;;;;;;
            jsonHorariosB.concat(subtracaoHor);
            jsonHorariosB.concat(".");
            if (subtracaoMin < 10) {
              jsonHorariosB.concat("0");
            }
            jsonHorariosB.concat(subtracaoMin);
 
 
            jsonHorariosB.concat('"');
            jsonDiaB.concat(",");
            jsonDiaB.concat('"');
            jsonDiaB.concat(dia);
            jsonDiaB.concat('"');
          }
         

        }
        else {

       
         
          if (subtracaoMin < 0) {
            contMinMenor++;
            subtracaoMin = subtracaoMin + 60;
            if (subtracaoHor > 0) {
            subtracaoHor = subtracaoHor - 1;
            }
          }
          if (subtracaoHor < 0) {
            subtracaoHor = subtracaoHor + 24;
            if(contMinMenor == 1){
               subtracaoHor = subtracaoHor - 1;
            }
          }


           if(subtracaoMin >= 15 || subtracaoHor > 0){
              jsonHorariosB.concat('"');
            //NÂO MUDA MONTA JSON
          jsonHorariosB.concat(subtracaoHor);
          jsonHorariosB.concat(".");
          if (subtracaoMin < 10) {
            jsonHorariosB.concat("0");
          }
          jsonHorariosB.concat(subtracaoMin);
          jsonHorariosB.concat('"');
          jsonDiaB.concat('"');
          jsonDiaB.concat(dia);
          jsonDiaB.concat('"');

           }
       

   
        }
        //  }



       
        compartimentos[1].tomou[i] = 1;
        break;
      }
    }
  }

///COMP C
  if ( digitalRead(switchReedC) == LOW)
  {
    if (abriuC == true && abriuA == false && abriuB == false) {
      for (int i = 0; i <= 50000; i++) {
        if (i == 500) {
          digitalWrite(ledOpenC, HIGH);
        }
      }

      for (int i = 0; i <= 50000; i++) {
        if (i == 50000) {
          digitalWrite(ledOpenC, LOW);
        }
      }
    }

    Serial.println("LOW C");
    for (int i = 0; i < compartimentos[2].qntHorarios; i++) {
      if (compartimentos[2].tomou[i] == 0 && compartimentos[2].horarios[i] <= horas) {
         vetorTomouComp[2] = false;
        abriuC = true;
        Serial.print("Entrou aqui");
        compartimentos[2].total = compartimentos[2].total - compartimentos[2].dose.toInt();
        montaJsonQntRemedios(numSocketRemedio);
       
        ledcWriteTone(channel, 0);
        //MANDA JSON
        int minutoRegistrado = 0;
        int horaRegistrado = 0;
        int subtracaoMin = 0;
        int subtracaoHor = 0;

        String auxMin = "";
        String auxHora = "";
        auxHora = compartimentos[2].horarios[i][0];
        auxHora.concat(compartimentos[2].horarios[i][1]);
        auxMin = compartimentos[2].horarios[i][3];
        Serial.print("hdhdh");
        Serial.print(auxMin);
        auxMin.concat(compartimentos[2].horarios[i][4]);
        Serial.print(auxMin);
        minutoRegistrado = auxMin.toInt();
        horaRegistrado = auxHora.toInt();

        Serial.print(horaRegistrado);
        Serial.print(":");
        Serial.println(minutoRegistrado);
        Serial.print(horaAgora);
        Serial.print(":");
        Serial.println(minutoAgora);
       
        //MANDA JSON se horário for > 15 min

         int contMinMenor = 0;
        // if(minutoAgora - minutoRegistrado > 0){
        subtracaoMin = minutoAgora - minutoRegistrado;
        subtracaoHor = horaAgora - horaRegistrado;


        if (jsonHorariosC.length() != 0)
        {
         

         
          if (subtracaoMin < 0) {
            contMinMenor++;
            subtracaoMin = subtracaoMin + 60;
            if (subtracaoHor > 0) {
            subtracaoHor = subtracaoHor - 1;
            }
          }
          if (subtracaoHor < 0) {
            subtracaoHor = subtracaoHor + 24;
            if(contMinMenor == 1){
               subtracaoHor = subtracaoHor - 1;
            }
          }

          if(subtracaoMin >= 15 || subtracaoHor > 0){
             jsonHorariosC.concat(",");
            jsonHorariosC.concat('"');
 
            //NÂO MUDA MONTA JSON ----SE MAIOR QUE 15 min;;;;;;;
            jsonHorariosC.concat(subtracaoHor);
            jsonHorariosC.concat(".");
            if (subtracaoMin < 10) {
              jsonHorariosC.concat("0");
            }
            jsonHorariosC.concat(subtracaoMin);
 
 
            jsonHorariosC.concat('"');
            jsonDiaC.concat(",");
            jsonDiaC.concat('"');
            jsonDiaC.concat(dia);
            jsonDiaC.concat('"');
          }
         

        }
        else {

       
         
          if (subtracaoMin < 0) {
            contMinMenor++;
            subtracaoMin = subtracaoMin + 60;
            if (subtracaoHor > 0) {
            subtracaoHor = subtracaoHor - 1;
            }
          }
          if (subtracaoHor < 0) {
            subtracaoHor = subtracaoHor + 24;
            if(contMinMenor == 1){
               subtracaoHor = subtracaoHor - 1;
            }
          }


           if(subtracaoMin >= 15 || subtracaoHor > 0){
              jsonHorariosC.concat('"');
            //NÂO MUDA MONTA JSON
          jsonHorariosC.concat(subtracaoHor);
          jsonHorariosC.concat(".");
          if (subtracaoMin < 10) {
            jsonHorariosC.concat("0");
          }
          jsonHorariosC.concat(subtracaoMin);
          jsonHorariosC.concat('"');
          jsonDiaC.concat('"');
          jsonDiaC.concat(dia);
          jsonDiaC.concat('"');

           }
       

   
        }
        //  }

       
        compartimentos[2].tomou[i] = 1;
        break;
      }
    }
  }
///COMP D
  if ( digitalRead(switchReedD) == LOW)
  {
    if (abriuD == true && abriuA == false && abriuB == false && abriuC == false) {
      for (int i = 0; i <= 50000; i++) {
        if (i == 500) {
          digitalWrite(ledOpenD, HIGH);
        }
      }

      for (int i = 0; i <= 50000; i++) {
        if (i == 50000) {
          digitalWrite(ledOpenD, LOW);
        }
      }
    }

    Serial.println("LOW D");
    for (int i = 0; i < compartimentos[3].qntHorarios; i++) {
      if (compartimentos[3].tomou[i] == 0 && compartimentos[3].horarios[i] <= horas) {
         vetorTomouComp[3] = false;
        abriuD = true;
        Serial.print("Entrou aqui");
        compartimentos[3].total = compartimentos[3].total - compartimentos[3].dose.toInt();
        montaJsonQntRemedios(numSocketRemedio);
        ledcWriteTone(channel, 0);
        //MANDA JSON

        int minutoRegistrado = 0;
        int horaRegistrado = 0;
        int subtracaoMin = 0;
        int subtracaoHor = 0;

        String auxMin = "";
        String auxHora = "";
        auxHora = compartimentos[3].horarios[i][0];
        auxHora.concat(compartimentos[3].horarios[i][1]);
        auxMin = compartimentos[3].horarios[i][3];
        Serial.print("hdhdh");
        Serial.print(auxMin);
        auxMin.concat(compartimentos[3].horarios[i][4]);
        Serial.print(auxMin);
        minutoRegistrado = auxMin.toInt();
        horaRegistrado = auxHora.toInt();

        Serial.print(horaRegistrado);
        Serial.print(":");
        Serial.println(minutoRegistrado);
        Serial.print(horaAgora);
        Serial.print(":");
        Serial.println(minutoAgora);
       
        //MANDA JSON se horário for > 15 min

         int contMinMenor = 0;
        // if(minutoAgora - minutoRegistrado > 0){
        subtracaoMin = minutoAgora - minutoRegistrado;
        subtracaoHor = horaAgora - horaRegistrado;


        if (jsonHorariosD.length() != 0)
        {
         

         
          if (subtracaoMin < 0) {
            contMinMenor++;
            subtracaoMin = subtracaoMin + 60;
            if (subtracaoHor > 0) {
            subtracaoHor = subtracaoHor - 1;
            }
          }
          if (subtracaoHor < 0) {
            subtracaoHor = subtracaoHor + 24;
            if(contMinMenor == 1){
               subtracaoHor = subtracaoHor - 1;
            }
          }

          if(subtracaoMin >= 15 || subtracaoHor > 0){
             jsonHorariosD.concat(",");
            jsonHorariosD.concat('"');
 
            //NÂO MUDA MONTA JSON ----SE MAIOR QUE 15 min;;;;;;;
            jsonHorariosD.concat(subtracaoHor);
            jsonHorariosD.concat(".");
            if (subtracaoMin < 10) {
              jsonHorariosD.concat("0");
            }
            jsonHorariosD.concat(subtracaoMin);
 
 
            jsonHorariosD.concat('"');
            jsonDiaD.concat(",");
            jsonDiaD.concat('"');
            jsonDiaD.concat(dia);
            jsonDiaD.concat('"');
          }
         

        }
        else {

       
         
          if (subtracaoMin < 0) {
            contMinMenor++;
            subtracaoMin = subtracaoMin + 60;
            if (subtracaoHor > 0) {
            subtracaoHor = subtracaoHor - 1;
            }
          }
          if (subtracaoHor < 0) {
            subtracaoHor = subtracaoHor + 24;
            if(contMinMenor == 1){
               subtracaoHor = subtracaoHor - 1;
            }
          }


           if(subtracaoMin >= 15 || subtracaoHor > 0){
              jsonHorariosD.concat('"');
            //NÂO MUDA MONTA JSON
          jsonHorariosD.concat(subtracaoHor);
          jsonHorariosD.concat(".");
          if (subtracaoMin < 10) {
            jsonHorariosD.concat("0");
          }
          jsonHorariosD.concat(subtracaoMin);
          jsonHorariosD.concat('"');
          jsonDiaD.concat('"');
          jsonDiaD.concat(dia);
          jsonDiaD.concat('"');

           }
       

   
        }
        //  }
        compartimentos[3].tomou[i] = 1;
        break;
      }
    }
  }
///COMP E
  if ( digitalRead(switchReedE) == LOW)
  {
    if (abriuE == true && abriuA == false && abriuB == false && abriuC == false && abriuD == false) {
      for (int i = 0; i <= 50000; i++) {
        if (i == 500) {
          digitalWrite(ledOpenE, HIGH);
        }
      }

      for (int i = 0; i <= 50000; i++) {
        if (i == 50000) {
          digitalWrite(ledOpenE, LOW);
        }
      }
    }

    Serial.println("LOW E");
    for (int i = 0; i < compartimentos[4].qntHorarios; i++) {
      if (compartimentos[4].tomou[i] == 0 && compartimentos[4].horarios[i] <= horas) {
         vetorTomouComp[4] = false;
        abriuE = true;
        Serial.print("Entrou aqui");
         compartimentos[4].total = compartimentos[4].total - compartimentos[4].dose.toInt();
        montaJsonQntRemedios(numSocketRemedio);
        ledcWriteTone(channel, 0);
        //MANDA JSON

        int minutoRegistrado = 0;
        int horaRegistrado = 0;
        int subtracaoMin = 0;
        int subtracaoHor = 0;

        String auxMin = "";
        String auxHora = "";
        auxHora = compartimentos[4].horarios[i][0];
        auxHora.concat(compartimentos[4].horarios[i][1]);
        auxMin = compartimentos[4].horarios[i][3];
        Serial.print("hdhdh");
        Serial.print(auxMin);
        auxMin.concat(compartimentos[4].horarios[i][4]);
        Serial.print(auxMin);
        minutoRegistrado = auxMin.toInt();
        horaRegistrado = auxHora.toInt();

        Serial.print(horaRegistrado);
        Serial.print(":");
        Serial.println(minutoRegistrado);
        Serial.print(horaAgora);
        Serial.print(":");
        Serial.println(minutoAgora);
       
        //MANDA JSON se horário for > 15 min
         int contMinMenor = 0;
        // if(minutoAgora - minutoRegistrado > 0){
        subtracaoMin = minutoAgora - minutoRegistrado;
        subtracaoHor = horaAgora - horaRegistrado;


        if (jsonHorariosE.length() != 0)
        {
         

         
          if (subtracaoMin < 0) {
            contMinMenor++;
            subtracaoMin = subtracaoMin + 60;
            if (subtracaoHor > 0) {
            subtracaoHor = subtracaoHor - 1;
            }
          }
          if (subtracaoHor < 0) {
            subtracaoHor = subtracaoHor + 24;
            if(contMinMenor == 1){
               subtracaoHor = subtracaoHor - 1;
            }
          }

          if(subtracaoMin >= 15 || subtracaoHor > 0){
             jsonHorariosE.concat(",");
            jsonHorariosE.concat('"');
 
            //NÂO MUDA MONTA JSON ----SE MAIOR QUE 15 min;;;;;;;
            jsonHorariosE.concat(subtracaoHor);
            jsonHorariosE.concat(".");
            if (subtracaoMin < 10) {
              jsonHorariosE.concat("0");
            }
            jsonHorariosE.concat(subtracaoMin);
 
 
            jsonHorariosE.concat('"');
            jsonDiaE.concat(",");
            jsonDiaE.concat('"');
            jsonDiaE.concat(dia);
            jsonDiaE.concat('"');
          }
         

        }
        else {

       
         
          if (subtracaoMin < 0) {
            contMinMenor++;
            subtracaoMin = subtracaoMin + 60;
            if (subtracaoHor > 0) {
            subtracaoHor = subtracaoHor - 1;
            }
          }
          if (subtracaoHor < 0) {
            subtracaoHor = subtracaoHor + 24;
            if(contMinMenor == 1){
               subtracaoHor = subtracaoHor - 1;
            }
          }


           if(subtracaoMin >= 15 || subtracaoHor > 0){
              jsonHorariosE.concat('"');
            //NÂO MUDA MONTA JSON
          jsonHorariosE.concat(subtracaoHor);
          jsonHorariosE.concat(".");
          if (subtracaoMin < 10) {
            jsonHorariosE.concat("0");
          }
          jsonHorariosE.concat(subtracaoMin);
          jsonHorariosE.concat('"');
          jsonDiaE.concat('"');
          jsonDiaE.concat(dia);
          jsonDiaE.concat('"');

           }
       

   
        }
        //  }
       
        compartimentos[4].tomou[i] = 1;
        break;
      }
    }
  }

////-------------------- CONTO QNTOS TRUE TEM Q JÁ TOMOU
contTomou =0;
  for(int i=0;i<5;i++){
     if( vetorTomouComp[i] == true)
     {
      contTomou++;
     }
  }

  if(contParaTomar != 0 && contParaTomar == contTomou)
  {
//    LIGA BUZZER  ==========================================================================================================================
              for(int i=0;i<1000000;i++){
                      if(i==1){
                           ledcWriteTone(channel, freq);
                      }
                      if(i ==9999){
                           ledcWriteTone(channel, 1000);
                      }
                      if(i==999999){
                           ledcWriteTone(channel, 500);
                      }
                  }

  }
  if(contParaTomar != contTomou)
  {

    //DESLIGA BUZZER
     ledcWriteTone(channel, 0);
  }
  if(contTomou == 0)
  {
   // Serial.print("ZEROU NO CONTTOMOU");
    for(int i=0;i<5;i++)
    {
      vetorTomarComp[i]=false;
    }
  }

 
  //-------------------------------------------BOTÃO--------------------------------
  // read the state of the switch into a local variable:
  int reading = digitalRead(PIN_AP);

  // check to see if you just pressed the button
  // (i.e. the input went from LOW to HIGH), and you've waited long enough
  // since the last press to ignore any noise:

  // If the switch changed, due to noise or pressing:
  if (reading != lastButtonState) {
    // reset the debouncing timer
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    // whatever the reading is at, it's been there for longer than the debounce
    // delay, so take it as the actual current state:

    // if the button state has changed:
    if (reading != buttonState) {
      buttonState = reading;

      // only toggle the LED if the new button state is HIGH
      if (buttonState == HIGH) {
        clearDOSE();
        Serial.println("CAIU AQUI");
        cont++;
        Serial.println(cont);
      }
    }
  }

  if (cont == 1) {
    clearDOSE();
    lcd.setCursor(1, 1);
    lcd.print("A: ");
///PARAR O BUZZER ******************************************************************APAGAR DEPOIS
//contTomou = 0;
////contParaTomar=0;
// ledcWriteTone(channel, 0);
// for(int i=0;i<5;i++){
//      vetorTomouComp[i] = false;    
//  }

//////

    lcd.setCursor(2, 2);
    if (compartimentos[0].comp != "null") {
      lcd.print(doc["nomeA"].as<char*>());

    }
    if (compartimentos[0].comp == "null") {
      lcd.print("Nao cadastrado !");
    }
    Serial.println("AQUI");
    cont = 2;
  }
  if (cont == 3) {
    clearDOSE();
    clearDOSE();
    Serial.println("AQUI2");
    lcd.setCursor(1, 1);
    lcd.print("B: ");

    lcd.setCursor(2, 2);
    if (compartimentos[1].comp != "null") {
      Serial.print(doc["nomeB"].as<char*>());

      lcd.print(compartimentos[1].nomeRemedio);

    }
    if (compartimentos[1].comp == "null") {
      lcd.print("Nao cadastrado !");
    }
    cont = 4;

  }
  if (cont == 5) {
    clearDOSE();

    Serial.println("AQUI3");
    lcd.setCursor(1, 1);
    lcd.print("C: ");
    lcd.setCursor(2, 2);
    if (compartimentos[2].comp != "null"  ) {
      Serial.print(doc["nomeB"].as<char*>());

      lcd.print(compartimentos[2].nomeRemedio);

    }
    if (compartimentos[2].comp == "null"  ) {
      lcd.print("Nao cadastrado !");
    }
    cont = 6;

  }
  if (cont == 7) {
    clearDOSE();

    Serial.println("AQUI4");
    lcd.setCursor(1, 1);
    lcd.print("D: ");

    lcd.setCursor(2, 2);
    if (compartimentos[3].comp != "null") {
      Serial.print(doc["nomeD"].as<char*>());

      lcd.print(compartimentos[3].nomeRemedio);

    }
    if (compartimentos[3].comp == "null") {
      lcd.print("Nao cadastrado !");
    }
    cont = 8;
  }
  if (cont == 9) {
    clearDOSE();

    Serial.println("AQUI5");
    lcd.setCursor(1, 1);
    lcd.print("E: ");

    lcd.setCursor(2, 2);
    if (compartimentos[4].comp != "null") {
      Serial.print(doc["nomeE"].as<char*>());

      lcd.print(compartimentos[4].nomeRemedio);

    }
    if (compartimentos[4].comp == "null") {
      lcd.print("Nao cadastrado !");
    }
    cont = 10;

  }
  if (cont == 11) {
    clearDOSE();

    Serial.println("LIMPA TUDO");
    cont = 0;
  }
  lastButtonState = reading;

///--------------------------------------ACENDE PARA REPOSIÇÃO REMEDIO-----------------------------


String totalCompA = String(compartimentos[0].total);
String doseCompA = String(compartimentos[0].dose);
String qntHorCompA = String(compartimentos[0].qntHorarios);
String totalCompB = String(compartimentos[1].total);
String doseCompB = String(compartimentos[1].dose);
String qntHorCompB = String(compartimentos[1].qntHorarios);
String totalCompC = String(compartimentos[2].total);
String doseCompC = String(compartimentos[2].dose);
String qntHorCompC = String(compartimentos[2].qntHorarios);
String totalCompD = String(compartimentos[3].total);
String doseCompD = String(compartimentos[3].dose);
String qntHorCompD = String(compartimentos[3].qntHorarios);
String totalCompE = String(compartimentos[4].total);
String doseCompE = String(compartimentos[4].dose);
String qntHorCompE = String(compartimentos[4].qntHorarios);
 

    if ( strcmp(doc["compartimentoA"].as<char*>() , "null") != 0)
    {
        if(totalCompA.toInt() <= (doseCompA.toInt()*2*qntHorCompA.toInt())){
                    digitalWrite(ledReporA, HIGH);
       
        }
        else{
           digitalWrite(ledReporA, LOW);
        }
    }
    if ( strcmp(doc["compartimentoB"].as<char*>() , "null") != 0)
    {
         if(totalCompB.toInt() <= (doseCompB.toInt()*2*qntHorCompB.toInt())){
                    digitalWrite(ledReporB, HIGH);
       
        }
        else{
           digitalWrite(ledReporB, LOW);
        }
    }
    if ( strcmp(doc["compartimentoC"].as<char*>() , "null") != 0)
    {
         if(totalCompC.toInt() <= (doseCompC.toInt()*2*qntHorCompC.toInt())){
                    digitalWrite(ledReporC, HIGH);
       
        }
        else{
           digitalWrite(ledReporC, LOW);
        }
    }
    if ( strcmp(doc["compartimentoD"].as<char*>() , "null") != 0)
    {    
         if(totalCompD.toInt() <= (doseCompD.toInt()*2*qntHorCompD.toInt())){
                    digitalWrite(ledReporD, HIGH);
       
        }
        else{
           digitalWrite(ledReporD, LOW);
        }
    }
    if ( strcmp(doc["compartimentoE"].as<char*>() , "null") != 0)
    {    
         if(totalCompE.toInt() <= (doseCompE.toInt()*2*qntHorCompE.toInt())){
                    digitalWrite(ledReporE, HIGH);
       
        }
        else{
           digitalWrite(ledReporE, LOW);
        }
    }


/////-------------------------------------PEGA AS QNT PARA ENVIAR --------------------------------
// jsonQntA = compartimentos[0].total;
// jsonQntB = compartimentos[1].total;
// jsonQntC = compartimentos[2].total;
// jsonQntD = compartimentos[3].total;
// jsonQntE = compartimentos[4].total;



 
  //-------------------ZERA "TOMOU" QUANDO VIRA DIA-----------------------------------------
  if (horas == "00:00") {
    for (int i = 0; i < 5; i++) {
      if (compartimentos[i].comp != "null") {
        for (int j = 0; j < compartimentos[i].qntHorarios; j++) {
          compartimentos[i].tomou[j] = 0;
        }
      }
    }
  }
}

void clearDOSE() {
  lcd.setCursor(1, 1);
  lcd.print(" ");
  lcd.setCursor(2, 1);
  lcd.print(" ");
  lcd.setCursor(3, 1);
  lcd.print(" ");
  lcd.setCursor(4, 1);
  lcd.print(" ");
  lcd.setCursor(5, 1);
  lcd.print(" ");
  lcd.setCursor(6, 1);
  lcd.print(" ");
  lcd.setCursor(7, 1);
  lcd.print(" ");
  lcd.setCursor(8, 1);
  lcd.print(" ");
  lcd.setCursor(9, 1);
  lcd.print(" ");
  lcd.setCursor(10, 1);
  lcd.print(" ");
  lcd.setCursor(11, 1);
  lcd.print(" ");
  lcd.setCursor(12, 1);
  lcd.print(" ");
  lcd.setCursor(13, 1);
  lcd.print(" ");
  lcd.setCursor(14, 1);
  lcd.print(" ");
  lcd.setCursor(15, 1);
  lcd.print(" ");
  lcd.setCursor(16, 1);
  lcd.print(" ");
  lcd.setCursor(17, 1);
  lcd.print(" ");
  lcd.setCursor(2, 2);
  lcd.print(" ");
  lcd.setCursor(3, 2);
  lcd.print(" ");
  lcd.setCursor(4, 2);
  lcd.print(" ");
  lcd.setCursor(5, 2);
  lcd.print(" ");
  lcd.setCursor(6, 2);
  lcd.print(" ");
  lcd.setCursor(7, 2);
  lcd.print(" ");
  lcd.setCursor(8, 2);
  lcd.print(" ");
  lcd.setCursor(9, 2);
  lcd.print(" ");
  lcd.setCursor(10, 2);
  lcd.print(" ");
  lcd.setCursor(11, 2);
  lcd.print(" ");
  lcd.setCursor(12, 2);
  lcd.print(" ");
  lcd.setCursor(13, 2);
  lcd.print(" ");
  lcd.setCursor(14, 2);
  lcd.print(" ");
  lcd.setCursor(15, 2);
  lcd.print(" ");
  lcd.setCursor(16, 2);
  lcd.print(" ");
  lcd.setCursor(17, 2);
  lcd.print(" ");
  lcd.setCursor(18, 2);
  lcd.print(" ");
  lcd.setCursor(19, 2);
  lcd.print(" ");
    lcd.setCursor(2, 3);
  lcd.print(" ");
  lcd.setCursor(3, 3);
  lcd.print(" ");
  lcd.setCursor(4, 3);
  lcd.print(" ");
  lcd.setCursor(5, 3);
  lcd.print(" ");
  lcd.setCursor(6, 3);
  lcd.print(" ");
  lcd.setCursor(7, 3);
  lcd.print(" ");
  lcd.setCursor(8, 3);
  lcd.print(" ");
  lcd.setCursor(9, 3);
  lcd.print(" ");
  lcd.setCursor(10, 3);
  lcd.print(" ");
  lcd.setCursor(11, 3);
  lcd.print(" ");
  lcd.setCursor(12, 3);
  lcd.print(" ");
  lcd.setCursor(13, 3);
  lcd.print(" ");
  lcd.setCursor(14, 3);
  lcd.print(" ");
  lcd.setCursor(15, 3);
  lcd.print(" ");
  lcd.setCursor(16, 3);
  lcd.print(" ");
  lcd.setCursor(17, 3);
  lcd.print(" ");
  lcd.setCursor(18, 3);
  lcd.print(" ");
  lcd.setCursor(19, 3);
  lcd.print(" ");
}
//------------------------------------FUNCAO MONTA JSON para DOSE alterada.......
void montaJsonQntRemedios(uint8_t num){
  Serial.println("NUMERO" );
  Serial.println(num);
  if(num!=34){

    Serial.print("PAYLOAD=");
    Serial.println(payload);
    ///VAI TER Q VERIFICAR MELHOR ESSA CONDIÇÃO
    if(payload != ""){
      jsonQntA = compartimentos[0].total;
     jsonQntB = compartimentos[1].total;
     jsonQntC = compartimentos[2].total;
     jsonQntD = compartimentos[3].total;
     jsonQntE = compartimentos[4].total;
    }
   

      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat("totalA");
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat(":");
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat(jsonQntA);
      jsonFinalQntRemedio.concat('"');
        jsonFinalQntRemedio.concat(",");
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat("totalB");
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat(":");
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat(jsonQntB);
      jsonFinalQntRemedio.concat('"');
        jsonFinalQntRemedio.concat(",");
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat("totalC");
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat(":");
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat(jsonQntC);
      jsonFinalQntRemedio.concat('"');
        jsonFinalQntRemedio.concat(",");
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat("totalD");
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat(":");
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat(jsonQntD);
      jsonFinalQntRemedio.concat('"');
        jsonFinalQntRemedio.concat(",");
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat("totalE");
      jsonFinalQntRemedio.concat('"');      
      jsonFinalQntRemedio.concat(":");
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat(jsonQntE);
      jsonFinalQntRemedio.concat('"');
      jsonFinalQntRemedio.concat("}");

    Serial.println(jsonFinalQntRemedio);
     webSocket.sendTXT(num,jsonFinalQntRemedio );
     jsonFinalQntRemedio = "{";
         
  }
}




//----------------------------------FUNCAO MONTA JSON para ENVIAR ARDUINO horarios Atraso
void montaJsonHorariosAtraso(uint8_t num){
 if(num != 33){
    jsonFinal.concat('"');
            jsonFinal.concat("horariosA");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonHorariosA);
            jsonFinal.concat("]");
            jsonFinal.concat(",");
            jsonFinal.concat('"');
            jsonFinal.concat("datasA");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonDiaA);
            jsonFinal.concat("]");
            ///B
            jsonFinal.concat(',');
            jsonFinal.concat('"');
            jsonFinal.concat("horariosB");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonHorariosB);
            jsonFinal.concat("]");
            jsonFinal.concat(",");
            jsonFinal.concat('"');
            jsonFinal.concat("datasB");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonDiaB);
            jsonFinal.concat("]");
             ///C
            jsonFinal.concat(',');
            jsonFinal.concat('"');
            jsonFinal.concat("horariosC");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonHorariosC);
            jsonFinal.concat("]");
            jsonFinal.concat(",");
            jsonFinal.concat('"');
            jsonFinal.concat("datasC");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonDiaC);
            jsonFinal.concat("]");
            ///D
            jsonFinal.concat(',');
            jsonFinal.concat('"');
            jsonFinal.concat("horariosD");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonHorariosD);
            jsonFinal.concat("]");
            jsonFinal.concat(",");
            jsonFinal.concat('"');
            jsonFinal.concat("datasD");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonDiaD);
            jsonFinal.concat("]");
             ///E
            jsonFinal.concat(',');
            jsonFinal.concat('"');
            jsonFinal.concat("horariosE");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonHorariosE);
            jsonFinal.concat("]");
            jsonFinal.concat(",");
            jsonFinal.concat('"');
            jsonFinal.concat("datasE");
            jsonFinal.concat('"');
            jsonFinal.concat(':');

            jsonFinal.concat("[");
            jsonFinal.concat(jsonDiaE);
            jsonFinal.concat("]");
           

            jsonFinal.concat("}");

            Serial.print(jsonFinal);
           
               webSocket.sendTXT(num,jsonFinal );
                jsonFinal = "{";
            jsonHorariosA = "";
            jsonDiaA = "";
            jsonHorariosB = "";
            jsonDiaB = "";
            jsonHorariosC = "";
            jsonDiaC = "";
            jsonHorariosD = "";
            jsonDiaD = "";
            jsonHorariosE = "";
            jsonDiaE = "";
            }
           
           

 
}


//FUNÇÃO QUE CONFIGURA RTC

void SelecionaDataeHora() //Seta a data e a hora do DS1307
{
  byte segundos = 00; // Valores de 0 a 59
  byte minutos = 52; //Valores de 0 a 59
  byte horas = 15; //Valores de 0 a 23
  //byte diadasemana = 4; //Valores de 0 a 6 - 0=Domingo, 1 = Segunda, etc.
  byte diadomes = 19; //Valores de 1 a 31
  byte mes = 3; //Valores de 1 a 12
  byte ano = 20; //Valores de 0 a 99
  Wire.beginTransmission(DS1307_ADDRESS);
  Wire.write(zero); //Stop no CI para que o mesmo possa receber os dados

  //As linhas abaixo escrevem no CI os valores de
  //data e hora que foram colocados nas variaveis acima
  Wire.write(ConverteParaBCD(segundos));
  Wire.write(ConverteParaBCD(minutos));
  Wire.write(ConverteParaBCD(horas));
  //Wire.write(ConverteParaBCD(diadasemana));
  Wire.write(ConverteParaBCD(diadomes));
  Wire.write(ConverteParaBCD(mes));
  Wire.write(ConverteParaBCD(ano));
  Wire.write(zero);
  Wire.endTransmission();
}

byte ConverteParaBCD(byte val)
{
  //Converte o número de decimal para BCD
  return ( (val / 10 * 16) + (val % 10) );
}

byte ConverteparaDecimal(byte val)
{
  //Converte de BCD para decimal
  return ( (val / 16 * 10) + (val % 16) );
}
//callback que indica que o ESP entrou no modo AP
void configModeCallback (WiFiManager *myWiFiManager) {
  //  Serial.println("Entered config mode");
  Serial.println("Entrou no modo de configuração");
  Serial.println(WiFi.softAPIP()); //imprime o IP do AP
  Serial.println(myWiFiManager->getConfigPortalSSID()); //imprime o SSID criado da rede
      lcd.setCursor(2, 1);
       lcd.print(" Config. Wifi !");
       lcd.setCursor(4, 2);
       lcd.print("192.168.4.1");

}


//callback que indica que salvamos uma nova rede para se conectar (modo estação)
void saveConfigCallback () {
  Serial.println("Configuração salva");
   clearDOSE();
  
}




void onWebSocketEvent(uint8_t num,
                      WStype_t type,
                      uint8_t * payload,
                      size_t length) {

  // Figure out the type of WebSocket event
  switch(type) {

    // Client has disconnected
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;

    // New client has connected
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connection from ", num);
        Serial.println(ip.toString());
         //webSocket.sendTXT(num, "cliente conectado envio arduino");
           String rota = String((char *) &payload[0]);
       
        if(rota =="/qntRemedio"){


          Serial.println("rota de qnt remedio");
          numSocketHistorico = 33;
          numSocketRemedio = num;
          montaJsonQntRemedios(numSocketRemedio);
        }
        if(rota == "/historico"){
          numSocketHistorico = num;
          numSocketRemedio = 34;
          montaJsonHorariosAtraso(num);
           
            //client.println(jsonFinal);
            jsonFinal = "{";
            jsonHorariosA = "";
            jsonDiaA = "";
            jsonHorariosB = "";
            jsonDiaB = "";
            jsonHorariosC = "";
            jsonDiaC = "";
            jsonHorariosD = "";
            jsonDiaD = "";
            jsonHorariosE = "";
            jsonDiaE = "";
         
          Serial.println("rota de historico");
        }
      }
      break;

    // Echo text message back to client
    case WStype_TEXT:
      Serial.printf("[%u] Text: %s\n", num, payload);
 //     webSocket.sendTXT(num, "teste envio arduino");
      numeroSocket = num;
      break;

    // For everything else: do nothing
    case WStype_BIN:
    case WStype_ERROR:
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
    default:
      break;
  }
}

void constroiJsonNaoTomou(int i, String dataFormatoDoBD)
{
    if(i == 0)
    {
        if (jsonHorariosA.length() != 0)
        {
            jsonHorariosA.concat(",");
            jsonHorariosA.concat('"');
            jsonHorariosA.concat("24");
            jsonHorariosA.concat('"');
            jsonDiaA.concat(",");
            jsonDiaA.concat('"');
            jsonDiaA.concat(dataFormatoDoBD);
            jsonDiaA.concat('"');
        }
         
        else
        {
           jsonHorariosA.concat('"');
           jsonHorariosA.concat("24");
           jsonHorariosA.concat('"');
           jsonDiaA.concat('"');
           jsonDiaA.concat(dataFormatoDoBD);
           jsonDiaA.concat('"');
        }

    }
    if(i == 1)
    {
        if (jsonHorariosB.length() != 0)
        {
            jsonHorariosB.concat(",");
            jsonHorariosB.concat('"');
            jsonHorariosB.concat("24");
            jsonHorariosB.concat('"');
            jsonDiaB.concat(",");
            jsonDiaB.concat('"');
            jsonDiaB.concat(dataFormatoDoBD);
            jsonDiaB.concat('"');
        }
         
        else
        {
           jsonHorariosB.concat('"');
           jsonHorariosB.concat("24");
           jsonHorariosB.concat('"');
           jsonDiaB.concat('"');
           jsonDiaB.concat(dataFormatoDoBD);
           jsonDiaB.concat('"');
        }

    }
    if(i == 2)
    {
        if (jsonHorariosC.length() != 0)
        {
            jsonHorariosC.concat(",");
            jsonHorariosC.concat('"');
            jsonHorariosC.concat("24");
            jsonHorariosC.concat('"');
            jsonDiaC.concat(",");
            jsonDiaC.concat('"');
            jsonDiaC.concat(dataFormatoDoBD);
            jsonDiaC.concat('"');
        }
         
        else
        {
           jsonHorariosC.concat('"');
           jsonHorariosC.concat("24");
           jsonHorariosC.concat('"');
           jsonDiaC.concat('"');
           jsonDiaC.concat(dataFormatoDoBD);
           jsonDiaC.concat('"');
        }

    }
    if(i == 3)
    {
        if (jsonHorariosD.length() != 0)
        {
            jsonHorariosD.concat(",");
            jsonHorariosD.concat('"');
            jsonHorariosD.concat("24");
            jsonHorariosD.concat('"');
            jsonDiaD.concat(",");
            jsonDiaD.concat('"');
            jsonDiaD.concat(dataFormatoDoBD);
            jsonDiaD.concat('"');
        }
         
        else
        {
           jsonHorariosD.concat('"');
           jsonHorariosD.concat("24");
           jsonHorariosD.concat('"');
           jsonDiaD.concat('"');
           jsonDiaD.concat(dataFormatoDoBD);
           jsonDiaD.concat('"');
        }

    }
    if(i == 4)
    {
        if (jsonHorariosE.length() != 0)
        {
            jsonHorariosE.concat(",");
            jsonHorariosE.concat('"');
            jsonHorariosE.concat("24");
            jsonHorariosE.concat('"');
            jsonDiaE.concat(",");
            jsonDiaE.concat('"');
            jsonDiaE.concat(dataFormatoDoBD);
            jsonDiaE.concat('"');
        }
         
        else
        {
           jsonHorariosE.concat('"');
           jsonHorariosE.concat("24");
           jsonHorariosE.concat('"');
           jsonDiaE.concat('"');
           jsonDiaE.concat(dataFormatoDoBD);
           jsonDiaE.concat('"');
        }

    }
 
         

         
         
           
         

     
       

   
       
 
   montaJsonHorariosAtraso(numSocketHistorico);
}
