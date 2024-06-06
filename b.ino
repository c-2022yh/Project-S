#include <SPI.h> // SPI통신을 위한 라이브러리
#include <Mouse.h> // 마우스 라이브러리
#include <Keyboard.h> // 키보드 라이브러리
#include "RF24.h" // NRF24L01 무선 통신 모듈 제어 라이브러리
//라이브러리 포함
 
int msg[3]; // 수신된 데이터를 저장할 배열
 
byte address[6] = "1Node"; // 무선 통신 주소
RF24 radio(7,8);  // CE, CSN
 
void setup(void) {
 
  Serial.begin(9600);
 
  radio.begin(); // 무선 통신 모듈 초기화
  Mouse.begin(); // 마우스 제어 초기화
 
  radio.openReadingPipe(1, address); // 수신 파이프를 열고 주소 설정
  radio.startListening(); // 수신 모드 시작
 
}
 
void loop(void) {
 
  if(radio.available()) { // 데이터 수신 대기
 
    radio.read(&msg, sizeof(msg)); // 데이터를 읽어 msg배열에 저장
   
    Mouse.move(msg[1], -msg[0]); // 마우스 이동

    if(msg[2]==1){ // 마우스 클릭
      Mouse.press(); 
      }
    else{
      Mouse.release();
      }

  }