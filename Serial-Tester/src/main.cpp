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
  xprintf("%d, %d, %d, %d, %d, %d, %d, %d, %d\n", timestamp, x, y, z, battVolt, temp, press, speed, acceleration);
  delay(1000);

}


void keyPress(){

}
