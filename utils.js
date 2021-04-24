"use strict";
const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");
const softSPI = new SoftSPI({
  clock: 23, // pin number of SCLK
  mosi: 19, // pin number of MOSI
  miso: 21, // pin number of MISO
  client: 24, // pin number of CS
});
// GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
// I believe that channing pattern is better for configuring pins which are optional methods to use.

const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

function read(data, io) {
  //# This loop keeps checking for chips. If one is near it will get the UID and authenticate
  console.log("scanning...");
  console.log("Please put chip or keycard in the antenna inductive zone!");
  console.log("Press Ctrl-C to stop.");

  // GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
  // I believe that channing pattern is better for configuring pins which are optional methods to use.
  let timerId = setInterval(scan, 200);
  let timeout = setTimeout(() => {
    clearInterval(timerId);
    io.sockets.emit("error", { messagee: "timeout" });
  }, 10000);

  function scan() {
    //# reset card
    mfrc522.reset();

    //# Scan for cards
    let response = mfrc522.findCard();
    if (!response.status) {
      console.log("No Card");
      return;
    }
    console.log("Card detected, CardType: " + response);

    //# Get the UID of the card
    response = mfrc522.getUid();
    if (!response.status) {
      io.sockets.emit("error", { messagee: "UID Scan Error" })
      return;
    }
    //# If we have the UID, continue
    const uid = response.data;
    console.log(
      "Card read UID: %s %s %s %s",
      uid[0].toString(16),
      uid[1].toString(16),
      uid[2].toString(16),
      uid[3].toString(16)
    );

    //# Select the scanned card
    const memoryCapacity = mfrc522.selectCard(uid);

    //# This is the default key for authentication
    const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

    //# Authenticate on Block 8 with key and uid
    if (!mfrc522.authenticate(8, key, uid)) {
      io.sockets.emit("error", { messagee: "Authentication error" })
      return;
    }

    let textRead = mfrc522.getDataForBlock(8);
    console.log(`Block: 8 Data: ${hexToString(textRead)}`);

    //# Stop
    mfrc522.stopCrypto();
    clearInterval(timerId);
    clearTimeout(timeout);

    io.sockets.emit("detected", {
      uid: [
        uid[0].toString(16),
        uid[1].toString(16),
        uid[2].toString(16),
        uid[3].toString(16),
      ],
      "read data": hexToString(textRead),
    });
    return true;
  }
}

function write(data, io) {
  //# This loop keeps checking for chips. If one is near it will get the UID and authenticate
  console.log("scanning...");
  console.log("Please put chip or keycard in the antenna inductive zone!");
  console.log("Press Ctrl-C to stop.");

  //# reset card
  mfrc522.reset();

  //# Scan for cards

  async function waitUntil() {
    return await new Promise((resolve, reject) => {
      let flag = false;
      let timeout = setTimeout(() => {
        clearInterval(timeout);
        reject("error");
      }, 10000);

      let timerid = setInterval(() => {
        response = mfrc522.findCard();
        flag = response.status;
        if (flag) {
          resolve(response.status);
          clearInterval(timerid);
          clearTimeout(timeout);
        }
      }, 200);
    });
  }

  let response = waitUntil();
  response
    .then((response) => {
      //# Get the UID of the card
      response = mfrc522.getUid();
      if (!response.status) {
        io.sockets.emit("error", { messagee:  "UID Scan Error"})
        return;
      }
      //# If we have the UID, continue
      const uid = response.data;
      console.log(
        "Card read UID: %s %s %s %s",
        uid[0].toString(16),
        uid[1].toString(16),
        uid[2].toString(16),
        uid[3].toString(16)
      );

      //# Select the scanned card
      const memoryCapacity = mfrc522.selectCard(uid);

      //# This is the default key for authentication
      const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

      //# Authenticate on Block 8 with key and uid
      if (!mfrc522.authenticate(8, key, uid)) {
        io.sockets.emit("error", { messagee: "Authentication error" })
        return;
      }
 
      let datatoWrite = new Int16Array(
        data.text.split("").map((x) => x.charCodeAt(0))
      );
      mfrc522.writeDataToBlock(8, datatoWrite);
      mfrc522.stopCrypto();
      io.sockets.emit("success", { message: "written" });
    })
    .catch((err) =>
      io.sockets.emit("error", { messagee: "timeout,no card read" })
    );
}

function hexToString(arr) {
  let res = "";
  for (let i = 0; i < arr.length; i++) {
    res += String.fromCharCode(parseInt(arr[i]));
  }
  return res;
}

module.exports = { read, write };