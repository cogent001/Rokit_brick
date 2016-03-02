Process.prototype.exData = function() {
  exServoPin : undefined;
  exServoValue = undefined;
  exAnalogPin = undefined;
  exAnalogValue = undefined;
  exDigitalPin  = undefined;
  exDigitalValue = undefined;
  exMotorPin = undefined;
  exMotorDir = undefined;
  exMotorSpeed = undefined;
  sevenSensorValue = undefined;
  //exIRRemoconValue = 0xFF;
}

Process.prototype.exDataInit = function() {
  var myself = this;

  myself.exData.exServoValue = {};
  myself.exData.exAnalogValue = {};
  myself.exData.exDigitalValue = {};
  myself.exData.exMotorDir = {};
  myself.exData.exMotorSpeed = {};

  for(var i = 0; i < 32; i++) {
    myself.exData.exServoValue[i] = 0;
    myself.exData.exAnalogValue[i] = 0;
    myself.exData.exDigitalValue[i] = false;
    myself.exData.exMotorDir[i] = 0;
    myself.exData.exMotorSpeed[i] = 0;
  }
}


Process.prototype.sendData = function () {
    var sprite = this.homeContext.receiver;
    var buffer = new Buffer(10);
    var same = true;
    var i = 0;
    var checksum = 0;

    if (sprite.arduino.isBoardReady()) {

    //for( i = 0; i < 10; i++)  buffer[i] = sprite.arduino.board.dronePacket[i];
      for( i = 0; i < 10; i++)  buffer.writeInt8(sprite.arduino.board.dronePacket[i],i);

      for(i = 4; i < 9; i++ ) {
        if(sprite.arduino.board.dronePacket[i] != sprite.arduino.board.exDronePacket[i]) same = false;
      }

      if(same == false) {
        for( i = 2; i < 9; i++)  checksum = checksum + buffer[i];
        buffer[9] = checksum;

        sprite.arduino.board.write( buffer, function() {
          sprite.arduino.board.drain();
         });

        console.log(sprite.arduino.board.dronePacket[4]+" "+sprite.arduino.board.dronePacket[5]+" "+sprite.arduino.board.dronePacket[6]+" "+sprite.arduino.board.dronePacket[7]+" "+sprite.arduino.board.dronePacket[8]);
      }

      for( i = 0; i < 10; i++)  sprite.arduino.board.exDronePacket[i] = sprite.arduino.board.dronePacket[i];

      if(sprite.arduino.board.dronePacket[8] == -79 || sprite.arduino.board.dronePacket[8] == -95) {
        sprite.arduino.board.dronePacket[4] = 0x00;
        sprite.arduino.board.dronePacket[5] = 0x00;
        sprite.arduino.board.dronePacket[6] = 0x00;
        sprite.arduino.board.dronePacket[7] = 0x00;
        //sprite.arduino.board.exDronePacket[8] = 0x00;
        //console.log("clear");
      }



    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.throttle = function (pin) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {

      if(pin >= 100)  sprite.arduino.board.dronePacket[7] = 100;
      else if(pin <= - 100)  sprite.arduino.board.dronePacket[7] = -100;
      else sprite.arduino.board.dronePacket[7] = pin;

    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.yaw = function (pin) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {

      if(pin >= 100)  sprite.arduino.board.dronePacket[6] = 100;
      else if(pin <= - 100)  sprite.arduino.board.dronePacket[6] = -100;
      else sprite.arduino.board.dronePacket[6] = pin;

    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.roll = function (pin) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {

      if(pin >= 100)  sprite.arduino.board.dronePacket[4] = 100;
      else if(pin <= - 100)  sprite.arduino.board.dronePacket[4] = -100;
      else sprite.arduino.board.dronePacket[4] = pin;

    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.pitch = function (pin) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {

      if(pin >= 100)  sprite.arduino.board.dronePacket[5] = 100;
      else if(pin <= - 100)  sprite.arduino.board.dronePacket[5] = -100;
      else sprite.arduino.board.dronePacket[5] = pin;

    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.pushEvent = function (mode) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {
      var val = new Int8Array(1);

      switch(mode[0]) {
          case 'STOP': val[0] = 0xA1; break;
          case 'RESET_YAW': val[0] = 0xB1; break;
          case 'ABSOLUTE_MODE': val[0] = 0xE0; break;
          case 'NORMAL_MODE': val[0] = 0xE1; break;
          case 'PAIRING': val[0] = 0xB2; break;
          case 'TAKE_OFF': val[0] = 0xA0; break;
        }

      sprite.arduino.board.dronePacket[8] = val[0];
      //console.log(sprite.arduino.board.dronePacket[8]);
      //console.log(val[0]);

    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.pushTrim = function (mode) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {
      var val = new Int8Array(1);

      switch(mode[0]) {
          case 'RESET': val[0] = 0x80; break;
          case 'PITCH_INCREASE': val[0] = 0x81; break;
          case 'PITCH_DECREASE': val[0] = 0x82; break;
          case 'YAW_INCREASE': val[0] = 0x83; break;
          case 'YAW_DECREASE': val[0] = 0x84; break;
          case 'ROLL_INCREASE': val[0] = 0x85; break;
          case 'ROLL_DECREASE': val[0] = 0x86; break;
        }

      sprite.arduino.board.dronePacket[8] = val[0];
      //console.log(sprite.arduino.board.dronePacket[8]);
      //console.log(val[0]);

    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.setServo = function (pin, value) {
    var sprite = this.homeContext.receiver;
    var myself = this;

    if (sprite.arduino.isBoardReady()) {
      //if((myself.exData.exServoPin != pin)||(myself.exData.exServoValue != value)) {
      if( myself.exData.exServoValue[pin] != value) {
      //  sprite.arduino.board.write( new Buffer([0xFF, 0xFF, 0x03, 0x04, pin,value]));
        sprite.arduino.board.write( new Buffer([0xFF, 0XFF, 0x03, 0x04, pin, value]), function() {
        sprite.arduino.board.drain();
       });

       myself.exData.exServoValue[pin] = value;
      // world.Arduino.sleep(30);

      }
        //myself.doWait(500);
        //console.log("pin: " + myself.exData.exServoPin + "value: " + myself.exData.exServoValue);


    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.setAnalogPin = function (pin,value) {
    var sprite = this.homeContext.receiver;
    var myself = this;

    if (sprite.arduino.isBoardReady()) {

      if(value >= 255) value = 255;
      else if(value <= 0) value = 0;

      if(myself.exData.exAnalogValue[pin] != value) {

          sprite.arduino.board.write( new Buffer([0xFF, 0xFF, 0x03, 0x06, pin, value]), function() {
          sprite.arduino.board.drain();
        });

          myself.exData.exAnalogValue[pin] != value
          //world.Arduino.sleep(30);
      }
      //console.log("pin:"+pin+"value:"+booleanValue);

    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.setDigitalPin = function (pin, booleanValue) {
    var sprite = this.homeContext.receiver;
    var myself = this;

    if (sprite.arduino.isBoardReady()) {
        if(myself.exData.exDigitalValue[pin] != booleanValue) {
          sprite.arduino.board.write( new Buffer([0xFF, 0xFF, 0x03, 0x03, pin, booleanValue]), function() {
          sprite.arduino.board.drain();
         });
        if((pin >= 11)&&(pin <= 18)) myself.exData.sevenSensorValue = false;
          //console.log("pin:"+pin+"value:"+booleanValue);
        myself.exData.exDigitalValue[pin] = booleanValue;
        //world.Arduino.sleep(30);
      }

    }
     else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.setDCmotor = function (num, speed, dir) {
    var sprite = this.homeContext.receiver;
    var myself = this;
    var motorNumber = 0;
    var direction = 0;

    if (sprite.arduino.isBoardReady()) {

      switch(num[0]) {
          case 'M1': motorNumber = 1; break;
          case 'M2': motorNumber = 2; break;
      }
      switch(dir[0]) {
          case 'CW': direction = 1; break;
          case 'CCW': direction = 2; break;
          case 'STOP': direction = 3; break;
          case 'LOOSE': direction = 4; break;
      }
      if ((myself.exData.exMotorDir[num] != direction)||(myself.exData.exMotorSpeed[num] != speed)) {
         sprite.arduino.board.write( new Buffer([0xFF, 0xFF, 0x04, 0x01, motorNumber, direction, speed]), function() {
         sprite.arduino.board.drain();
        });
      //  console.log("send");
        myself.exData.exMotorDir[num] = direction;
        myself.exData.exMotorSpeed[num] = speed;
      //  world.Arduino.sleep(30);
      }

    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.setTone = function (num, speed, dir) {
    var sprite = this.homeContext.receiver;
    var myself = this;
    var motorNumber = 0;
    var direction = 0;

    if (sprite.arduino.isBoardReady()) {


    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.analogReading = function (pin) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {
      //sprite.arduino.board.write(new Buffer([0x05,pin]));
      //sprite.arduino.board.drain();
        //sprite.arduino.board.write( new Buffer([0x05,pin]), function() {
        //  sprite.arduino.board.drain();
        // });
        //console.log("send cmd: "+pin);
        //world.Arduino.sleep(25);

        if(sprite.arduino.board.dataReady[pin - 19] == true){
          //sprite.arduino.board.dataReady[pin - 19] = false;
          return sprite.arduino.board.readValue[pin - 19];
        }
        else {
        //console.log("value:" + sprite.arduino.board.readValue[pin - 19] + " zero:" +sprite.arduino.board.dataReady[pin - 19] );
        return 0;

        }
    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.digitalReading = function (pin) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {

       if(sprite.arduino.board.dataReady[9] == true) {
        //  sprite.arduino.board.dataReady[9] = false;
          var dirValues = sprite.arduino.board.readValue[9];

         if((pin >= 8)&&(pin <= 10)) dirValues = (((dirValues & 0x00FF) >> 5) >> (pin - 8)) & 0x0001;
         else if((pin >= 22)&&(pin < 27)) dirValues = ((dirValues & 0x00FF) >> (pin - 22)) & 0x0001;
         else if((pin >= 27)&&(pin < 32)) dirValues = (((pinValues & 0xFF00) >> 8) >> (pin - 27)) & 0x0001;
         //console.log("value:" + dirValues);
         if(dirValues == 1) {
            sprite.arduino.board.write( new Buffer([0xFF, 0xFF, 0x02, 0x02, pin]), function() {
               sprite.arduino.board.drain();
               console.log("value:" + dirValues);
            });
          }
        }

        if(sprite.arduino.board.dataReady[8] == true) {
        //  sprite.arduino.board.dataReady[8] = false;
          var pinValues = sprite.arduino.board.readValue[8];
          var pinStatus = false;

          //console.log("value:" + pinValues );
           if((pin >= 8)&&(pin <= 10)) {
             pinValues = (((pinValues & 0x00FF) >> 5) >> (pin - 8)) & 0x0001;
           }
          if((pin >= 22)&&(pin < 27)) {
             pinValues = ((pinValues & 0x00FF) >> (pin - 22)) & 0x0001;
             if(pinValues == 1) pinStatus = true;
          }
          else if((pin >= 27)&&(pin < 32)){
            pinValues = (((pinValues &0xFF00) >> 8) >> (pin - 27)) & 0x0001;
            if(pinValues == 1) pinStatus = true;
          }
        }

       if(sprite.arduino.board.dataReady[10] == true) {
           var sensorValue = sprite.arduino.board.readValue[10];

           if((pin >= 11)&&(pin <= 18)) pinValues = ((sensorValue & 0x00FF) >> (pin - 11)) & 0x0001;
           if(pinValues == 1) pinStatus = true; else pinStatus = false;
        }

      return pinStatus;

    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.sevenSensor = function () {
    var sprite = this.homeContext.receiver;
    var myself = this;

    if (sprite.arduino.isBoardReady()) {
      console.log("sevenbool: "+myself.exData.sevenSensorValue );
      if((myself.exData.sevenSensorValue == false)||(myself.exData.sevenSensorValue == undefined)) {
        myself.exData.sevenSensorValue = true;
        sprite.arduino.board.write( new Buffer([0xFF, 0xFF, 0x01, 0x07]), function() {
           sprite.arduino.board.drain();

        });
      }
      var sensorValue = sprite.arduino.board.readValue[10];
      if(sprite.arduino.board.dataReady[10] == true){
        //sprite.arduino.board.dataReady[10] = false;
        sensorValue = sensorValue & 0x00FF;

        return sensorValue;
        }
        else {
        //console.log("value:" + sprite.arduino.board.readValue[pin - 19] + " zero:" +sprite.arduino.board.dataReady[pin - 19] );
        return 0;

        }
    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.IRRemocon = function (pin) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {
        var IRValue = sprite.arduino.board.readValue[10];
        if(sprite.arduino.board.dataReady[10] == true){
          //sprite.arduino.board.dataReady[10] = false;
          IRValue = (IRValue & 0xFF00) >> 8;

          return IRValue;
        }
        else {
        //console.log("value:" + sprite.arduino.board.readValue[pin - 19] + " zero:" +sprite.arduino.board.dataReady[pin - 19] );
        return 0;

        }
    } else {
        throw new Error(localize("Board not connected"));
    }
}



Process.prototype.merongHello = function (pin) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {
      //sprite.arduino.board.write("OMG IT WORKS\n");          //pass
      //sprite.arduino.board.write(new Buffer([0,1,2,3,4]));   //pass
      sprite.arduino.board.write(new Buffer([pin]));
    } else {
        throw new Error(localize("board not connected"));
    }
}

Process.prototype.setPinMode = function (pin, mode) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {

        var board = sprite.arduino.board,
            val;

        switch(mode[0]) {
            case 'digital input': val = board.MODES.INPUT; break;
            case 'digital output': val = board.MODES.OUTPUT; break;
            case 'PWM': val = board.MODES.PWM; break;
            case 'servo': val = board.MODES.SERVO; break;
            // not used, but left it here anyway
            case 'analog input': val = board.MODES.ANALOG; break;
        }
        if (this.context.pinSet === undefined) {
            if (board.pins[pin].supportedModes.indexOf(val) > -1) {
                board.pinMode(pin, val);
            } else {
                return null
            }
        }
        if (board.pins[pin].mode === val) {
            this.context.pinSet = true;
            return null;
        }
        this.pushContext('doYield');
        this.pushContext();
    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.servoWrite = function (pin, value) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {

        var board = sprite.arduino.board;

        if (board.pins[pin].mode != board.MODES.SERVO) {
            board.pinMode(pin, board.MODES.SERVO);
        }

        var numericValue;
        switch (value[0]) {
            case "clockwise":
                numericValue = 1200;
            break;
            case "counter-clockwise":
                numericValue = 1700;
            break;
            case "stopped":
                numericValue = 1500;
            break;
            default:
                numericValue = value;
            break;
        }
        board.servoWrite(pin, numericValue);
        return null;
    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.reportAnalogReading = function (pin) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {

        var board = sprite.arduino.board;

        if (board.pins[board.analogPins[pin]].mode != board.MODES.ANALOG) {
            board.pinMode(board.analogPins[pin], board.MODES.ANALOG);
        }

        // Ugly hack that fixes issue #5
        // "say" block inside a "forever" loop shows only first reading on GNU/Linux and MS-Windows
        // Until we find the source of the problem and a cleaner solution...

        if (!this.context.justRead) {
            this.context.justRead = true;
        } else {
            this.context.justRead = false;
            return board.pins[board.analogPins[pin]].value;
        }

        this.pushContext('doYield');
        this.pushContext();

    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.reportDigitalReading = function (pin) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {
        var board = sprite.arduino.board;

        if (board.pins[pin].mode != board.MODES.INPUT) {
            board.pinMode(pin, board.MODES.INPUT);
            board.digitalRead(pin, nop);
        }
        return board.pins[pin].value == 1;
    } else {
        throw new Error(localize("Board not connected"));
    }

}

Process.prototype.digitalWrite = function (pin, booleanValue) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {
        var board = sprite.arduino.board,
            val;

        if (booleanValue) { val = board.HIGH } else { val = board.LOW };

        if (board.pins[pin].mode != board.MODES.OUTPUT) {
            board.pinMode(pin, board.MODES.OUTPUT);
        }

        board.digitalWrite(pin, val);

        return null;
    } else {
        throw new Error(localize("Board not connected"));
    }
}

Process.prototype.pwmWrite = function (pin, value) {
    var sprite = this.homeContext.receiver;

    if (sprite.arduino.isBoardReady()) {
        var board = sprite.arduino.board;

        if (board.pins[pin].mode != board.MODES.PWM) {
            board.pinMode(pin, board.MODES.PWM);
        }

        board.analogWrite(pin, value);
        return null;
    } else {
        throw new Error(localize("Board not connected"));
    }
}
