#include <SPI.h>
#include "RF24.h"
#include <Wire.h>
#include "Kalman.h"
//라이브러리 포함


int msg[3]={0,0,0}; // 보낼 데이터값을 배열로 설정
int trig = 5; // 트리거 버튼

 
const u8 X = 1;
const u8 Y = 2; 
const u8 S = 0;  
 
byte address[6] = "1Node";
RF24 radio(7,8);  // CE, CSN
 
int16_t gyroX, gyroZ;
 
int Sensitivity;
 
int delayi = 3;
 
uint32_t timer;
 
uint8_t i2cData[14]; // Buffer for I2C data
//I2C통신을 통해 IMU센서와 주고받는 배열
/*
0~1 바이트: X축 가속도계 데이터
2~3 바이트: Y축 가속도계 데이터
4~5 바이트: Z축 가속도계 데이터
6~7 바이트: 온도 데이터
8~9 바이트: X축 자이로스코프 데이터
10~11 바이트: Y축 자이로스코프 데이터
12~13 바이트: Z축 자이로스코프 데이터
*/
const uint8_t IMUAddress = 0x68; // AD0 is logic low on the PCB
const uint16_t I2C_TIMEOUT = 1000; // Used to check for errors in I2C communication

//단일 바이트 데이터를 쓰는 경우
uint8_t i2cWrite(uint8_t registerAddress, uint8_t data, bool sendStop) {
  return i2cWrite(registerAddress,&data,1,sendStop); // Returns 0 on success
}

//여러 바이트 데이터를 쓰는 경우
uint8_t i2cWrite(uint8_t registerAddress, uint8_t* data, uint8_t length, bool sendStop) {
  Wire.beginTransmission(IMUAddress); // IMUAddress로 I2C 통신 시작
  Wire.write(registerAddress); // 레지스터 주소 전송
  Wire.write(data, length); // 데이터를 버퍼에 쓰기
  return Wire.endTransmission(sendStop); // Returns 0 on success
}


uint8_t i2cRead(uint8_t registerAddress, uint8_t* data, uint8_t nbytes) {
  uint32_t timeOutTimer;
  Wire.beginTransmission(IMUAddress); // IMUAddress로 I2C 통신 시작
  Wire.write(registerAddress); // 읽고자 하는 레지스터 주소 전송
  if(Wire.endTransmission(false)) // Don't release the bus
    return 1; // Error in communication
  Wire.requestFrom(IMUAddress, nbytes,(uint8_t)true); // Send a repeated start and then release the bus after reading
  for(uint8_t i = 0; i < nbytes; i++) {
    if(Wire.available()) // 읽을 데이터가 있으면
      data[i] = Wire.read(); // 데이터를 읽어 data 배열에 저장
    else {
      timeOutTimer = micros(); // 타이머 시작
      while(((micros() - timeOutTimer) < I2C_TIMEOUT) && !Wire.available());
      if(Wire.available()) // 타임아웃 전 데이터를 읽을 수 있으면
        data[i] = Wire.read(); // 데이터를 읽어 data 배열에 저장
      else
        return 2; // Error in communication
    }
  }
  return 0; // Success
}
 
void setup() {
 
  Serial.begin(9600);

  // 무선 통신 초기화
  radio.begin();
  radio.openWritingPipe(address); // 송신 파이프 열기
  radio.stopListening(); // 수신 모드를 중단하고 송신 모드로 전환
 
  pinMode(trig, INPUT);
  
  Wire.begin(); // I2C 버스 초기화
 
  i2cData[0] = 7; // Set the sample rate to 1000Hz - 8kHz/(7+1) = 1000Hz
 
  i2cData[1] = 0x00; // Disable FSYNC and set 260 Hz Acc filtering, 256 Hz Gyro filtering, 8 KHz sampling
  i2cData[3] = 0x00; // Set Accelerometer Full Scale Range to ±2g
 
  while(i2cWrite(0x19,i2cData,4,false)); // Write to all four registers at once
  while(i2cWrite(0x6B,0x01,true)); // PLL with X axis gyroscope reference and disable sleep mode
  while(i2cRead(0x75,i2cData,1));
 
  if(i2cData[0] != 0x68) { // Read "WHO_AM_I" register
 
    Serial.print(F("Error reading sensor"));
 
    while(1);
 
  }
 
  delay(100); // Wait for sensor to stabilize
 
  /* Set kalman and gyro starting angle */
 
  while(i2cRead(0x3B,i2cData,6));
 
  timer = micros();
 
}
 
void loop() {
 
   Sensitivity = map(analogRead(S), 0, 1023, 800, 200);
 
  /* Update all the values */

 
  while(i2cRead(0x3B,i2cData,14));
 
  gyroX = ((i2cData[8] << 8) | i2cData[9]); // x축 자이로스코프 값 추출
  gyroZ = ((i2cData[12] << 8) | i2cData[13]); // z축 자이로스코프 값 추출

  gyroX = gyroX / Sensitivity / 1.1  * -1; // 마우스 감도에 따른 x값 조정
  gyroZ = gyroZ / Sensitivity  * -1; // 마우스 감도에 따른 z값 조정

  msg[0]=gyroX; // x값 저장
  msg[1]=gyroZ; // z값 저장
  msg[2]=digitalRead(trig); // 버튼 상태 저장
 
  radio.write(&msg, sizeof(msg)); // 무선 통신으로 데이터 전송
  delay(delayi); // 주기적 전송을 위해 딜레이
 
}