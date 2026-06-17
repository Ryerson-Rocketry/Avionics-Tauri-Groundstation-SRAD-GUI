#include <stdio.h>
#include "pico/rand.h"  //https://www.reddit.com/r/raspberrypipico/comments/14abyyj/how_to_use_pico_rand_function_in_c_sdk/
#include "PluggableUSBHID.h"
#include "USBKeyboard.h"
#include "LiquidCrystal_I2C.h"
#include "Wire.h"

//initialize the liquid crystal library
//the first parameter is  the I2C address
//the second parameter is how many rows are on your screen
//the  third parameter is how many columns are on your screen
LiquidCrystal_I2C lcd(0x27, 16, 2);

//#define I2C_SDA 16
//#define I2C_SCL 17
//#define SDA 16
//#define SCL 17

//#define PICO_DEFAULT_UART 0
//#define PICO_DEFAULT_UART_TX_PIN 0
//#define PICO_DEFAULT_UART_RX_PIN 1

USBKeyboard Keyboard;

uint32_t lastPacketNumber = 0;

uint32_t packetMissedThreshold = 9;
uint32_t packetMissedCount = 0;

bool firstPacket = true;

#pragma pack(push, 1)
struct TelemetryPacket
{
    char callsign[8] = {'C', 'U', 'M', 'M', 'E', 'R', '1', '\0'}; 
    uint16_t packetNum = lastPacketNumber;
    uint16_t battery_mV = (uint16_t)get_rand_32();
    int16_t ax_mg = (uint16_t)get_rand_32();
    int16_t ay_mg = (uint16_t)get_rand_32();
    int16_t az_mg = (uint16_t)get_rand_32();
    int16_t gx_mrad = (uint16_t)get_rand_32();
    int16_t gy_mrad = (uint16_t)get_rand_32();
    int16_t gz_mrad = (uint16_t)get_rand_32();
    int16_t temp_cC = (uint16_t)get_rand_32();
    uint16_t pressure_dmbar = (uint16_t)get_rand_32();
    int16_t altitude_ft = (uint16_t)get_rand_32();
    int32_t lat_e7 = (uint16_t)get_rand_32();
    int32_t lon_e7 = (uint16_t)get_rand_32();
    uint32_t status = 3294967295;
};

#pragma pack(pop)

// put function declarations here:
void keyPress();

int timestamp = 1;

void setup() {
  Serial.begin(115200);
  Wire.begin();
  Serial.setTimeout(10);
  pinMode(p16, INPUT);
}

//https://forum.arduino.cc/t/basic-printf-implementation/1106424/6
void xprintf(const char *format, ...)
{
  char buffer[256];  // or smaller or static &c.
  va_list args;
  va_start(args, format);
  vsprintf(buffer, format, args);
  va_end(args);
  Serial.print(buffer);
}

/*
void loop() {
  timestamp = timestamp + 1;

  uint8_t x = (uint8_t)get_rand_32();
  uint8_t y = (uint8_t)get_rand_32();
  uint8_t z = (uint8_t)get_rand_32();

  uint8_t battVolt = (uint8_t)get_rand_32();
  uint8_t press = (uint8_t)get_rand_32();
  uint8_t temp = (uint8_t)get_rand_32();

  uint8_t speed = (uint8_t)get_rand_32();
  uint8_t acceleration = (uint8_t)get_rand_32();

  



  //Serial.print("test ,\n");
  //xprintf("%d, %d, %d, %d, %d, %d, %d, %d, %d\n", timestamp, x, y, z, battVolt, temp, press, speed, acceleration);

  
  delay(1000);

}
*/


static void printStatusFlags(uint32_t s)
{
    xprintf("Status: 0x%08lX (1=ON/data OK, 0=OFF/no data)\n", (unsigned long)s);
    xprintf("  BARO  ON=%d  data=%d\n", 1, 0);
    xprintf("  GPS   ON=%d  data=%d\n", 1,  0);
    xprintf("  SD    ON=%d  data=%d\n", 1,   0);
    xprintf("  INA   ON=%d  data=%d\n", 1,  0);
    xprintf("  IMU   ON=%d  data=%d\n", 1,  0);
    xprintf("  LoRa  ON=%d  data=%d\n", 1, 0);
}


void loop(){
    lastPacketNumber++;
    uint8_t buf[20];
    //uint8_t len = sizeof(buf);

    int rssi = 100;
    int snr = -96000;
    long freqError = 433;

    TelemetryPacket pkt;

    
    if (packetMissedCount == packetMissedThreshold - 1) {
        packetMissedCount = packetMissedCount + 1;
        Serial.print("Unexpected packet size: ");
        Serial.print(" (expected ");
        Serial.print(packetMissedCount);
        Serial.println(")");
        return;
    }
    

    Serial.println("------------------------------------------------");

    Serial.print("Callsign: ");
    Serial.println(pkt.callsign);

    Serial.print("Packet #: ");
    Serial.println(pkt.packetNum);

    if (!firstPacket)
    {
        lastPacketNumber++;
        pkt.packetNum = lastPacketNumber - 1;

        if (packetMissedCount == packetMissedThreshold){
            packetMissedCount = 0;
            Serial.print("Missed packets: ");
            Serial.println(1);
        }
        else{
            packetMissedCount++;
        }
    }

    lastPacketNumber = pkt.packetNum;
    firstPacket = false;

    Serial.print("Battery: ");
    Serial.print(pkt.battery_mV / 1000.0f);
    Serial.println(" V");

    Serial.print("Accel X/Y/Z: ");
    Serial.print(pkt.ax_mg / 1000.0f);
    Serial.print(", ");
    Serial.print(pkt.ay_mg / 1000.0f);
    Serial.print(", ");
    Serial.print(pkt.az_mg / 1000.0f);
    Serial.println(" g");

    Serial.print("Gyro X/Y/Z: ");
    Serial.print(pkt.gx_mrad / 1000.0f);
    Serial.print(", ");
    Serial.print(pkt.gy_mrad / 1000.0f);
    Serial.print(", ");
    Serial.print(pkt.gz_mrad / 1000.0f);
    Serial.println(" rad/s");

    Serial.print("Temp: ");
    Serial.print(pkt.temp_cC / 100.0f);
    Serial.println(" C");

    Serial.print("Pressure: ");
    Serial.print(pkt.pressure_dmbar / 10.0f);
    Serial.println(" mbar");

    Serial.print("Altitude: ");
    Serial.print(pkt.altitude_ft);
    Serial.println(" ft");

    Serial.print("Latitude: ");
    Serial.println(pkt.lat_e7 / 10000000.0, 7);

    Serial.print("Longitude: ");
    Serial.println(pkt.lon_e7 / 10000000.0, 7);

    printStatusFlags(pkt.status);

    Serial.print("RSSI: ");
    Serial.print(rssi);
    Serial.println(" dBm");

    Serial.print("SNR: ");
    Serial.print(snr);
    Serial.println(" dB");

    Serial.print("Freq Error: ");
    Serial.print(freqError);
    Serial.println(" Hz");

    delay(1500);

  
}


void keyPress(){

}
