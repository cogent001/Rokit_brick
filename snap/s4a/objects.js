// init decorator

SpriteMorph.prototype.originalInit = SpriteMorph.prototype.init;
SpriteMorph.prototype.init = function(globals) {
    var myself = this;

    myself.originalInit(globals);

    myself.arduino = {
        board : undefined,	// Reference to arduino board - to be created by new firmata.Board()
        connecting : false,	// Flag to avoid multiple attempts to connect
        disconnecting : false,  // Flag to avoid serialport communication when it is being closed
        justConnected: false,	// Flag to avoid double attempts
        dataPin: undefined,
        readValue: undefined,
        dataReady: undefined,
        dronePacket: null,
        exDronePacket: null
    };


    myself.arduino.disconnect = function(silent) {

        if (this.isBoardReady()) { // Prevent disconnection attempts before board is actually connected
            this.connecting = false;
            this.justConnected = false;
            this.board.close();
            this.closeHandler(silent);
        } else if (!this.board) {  // Don't send info message if the board has been connected
            if (!silent) {
                ide.inform(myself.name, localize('Board is not connected'))
            }
        }
    }

    // This should belong to the IDE
    myself.arduino.showMessage = function(msg) {
        if (!this.message) { this.message = new DialogBoxMorph() };

        var txt = new TextMorph(
                msg,
                this.fontSize,
                this.fontStyle,
                true,
                false,
                'center',
                null,
                null,
                MorphicPreferences.isFlat ? null : new Point(1, 1),
                new Color(255, 255, 255)
                );

        if (!this.message.key) { this.message.key = 'message' + myself.name + msg };

        this.message.labelString = myself.name;
        this.message.createLabel();
        if (msg) { this.message.addBody(txt) };
        this.message.drawNew();
        this.message.fixLayout();
        this.message.popUp(world);
        this.message.show();
    }

    myself.arduino.hideMessage = function() {
        if (this.message) {
            this.message.cancel();
            this.message = null;
        }
    }

    myself.arduino.attemptConnection = function() {

        if (!this.connecting) {
            //if (this.board === undefined) {
                // Get list of ports (Arduino compatible)
                var ports = world.Arduino.getSerialPorts(function(ports) {
                    // Check if there is at least one port on ports object (which for some reason was defined as an array)
                    if (Object.keys(ports).length == 0) {
                        ide.inform(myself.name, localize('Could not connect an device\nNo boards found'));
                        return;
                    } //else if (Object.keys(ports).length == 1) {
                        //myself.arduino.connect(ports[Object.keys(ports)[0]]);}
                      else if (Object.keys(ports).length >= 1) {
                        var portMenu = new MenuMorph(this, 'select a port');
                        Object.keys(ports).forEach(function(each) {
                            portMenu.addItem(each, function() {
                                myself.arduino.connect(each);
                            })
                        });
                        portMenu.popUpAtHand(world);
                    }
                });
        //    } else {
          //      ide.inform(myself.name, localize('There is already a board connected to this sprite'));
            //}
        }
        else {ide.inform(myself.name, localize('There is already a board connected to this sprite')); }

        if (this.justConnected) {
            this.justConnected = undefined;
            return;
        }

    }

    myself.arduino.closeHandler = function(silent) {

        var portName = 'unknown',
            thisArduino = myself.arduino;

        if (thisArduino.board) {
            portName = thisArduino.board.path;

            //thisArduino.board.sp.removeListener('disconnect', thisArduino.disconnectHandler);
            //thisArduino.board.sp.removeListener('close', thisArduino.closeHandler);
            //thisArduino.board.sp.removeListener('error', thisArduino.errorHandler);

            thisArduino.board = undefined;
        };

        world.Arduino.unlockPort(thisArduino.port);
        thisArduino.connecting = false;
        thisArduino.disconnecting = false;

        if (thisArduino.disconnected & !silent) {
            ide.inform(myself.name, localize('Board was disconnected from port\n') + portName + '\n\nIt seems that someone pulled the cable!');
            thisArduino.disconnected = false;
        } else if (!silent) {
            ide.inform(myself.name, localize('Board was disconnected from port\n') + portName);
        }
    }

    myself.arduino.disconnectHandler = function() {
        // This fires up when the cable is plugged, but only in recent versions of the serialport plugin
        myself.arduino.disconnected = true;
    }

    myself.arduino.errorHandler = function(err) {
        ide.inform(myself.name, localize('An error was detected on the board\n\n') + err, myself.arduino.disconnect(true));
    }

    myself.arduino.connect = function(port) {
          //this.disconnect(true);
        this.showMessage(localize('Connecting board at port\n') + port);
        var SerialPort = require("serialport").SerialPort;
        var parsers = require('serialport').parsers;

        this.board = new SerialPort(port, {baudrate:57600, parser: parsers.readline('\n')});
        this.disconnecting = false;
        this.connecting = true;
        this.justConnected = true;
        this.port = port;
        world.Arduino.lockPort(port);

        Process.prototype.exDataInit();

        myself.arduino.board.dataPin = {};
        myself.arduino.board.readValue = {};
        myself.arduino.board.dataReady = {};
        myself.arduino.board.dronePacket = {};
        myself.arduino.board.exDronePacket = {};

        for(var i = 0; i < 10; i++) {
          myself.arduino.board.dataReady[i] = false;
          myself.arduino.board.dronePacket[i] = 0;
          myself.arduino.board.exDronePacket[i] = 0;
        }

        myself.arduino.board.dronePacket[0] = 0x0A;     //header
        myself.arduino.board.dronePacket[1] = 0x55;
        myself.arduino.board.dronePacket[2] = 0x20;    //control
        myself.arduino.board.dronePacket[3] = 0x05;    //length


        this.board.on("open", function () {
            console.log('serialport open');
            myself.arduino.board.on('data', function(data) {
              var rData, pin, value;
              rData = parseInt(data);
            //  if ( data && data > 1 ) {
                   pin = rData >> 16;
                   value = rData & 0xFFFF;
                   myself.arduino.board.dataPin[pin] = pin;
                   myself.arduino.board.readValue[pin] = value;
                   myself.arduino.board.dataReady[pin] = true;
                   //myself.arduino.board.flush();
                   //console.log('pinNumber:'+ pin);
                   //console.log('data:' +  myself.arduino.board.readValue[pin - 19] + 'pin:'+ pin);
            //  }
                //console.log('data received: ' + data);
            });
            myself.arduino.board.on('close', function() { console.log('serialport closed'); });
            myself.arduino.board.on('error', function(error) { consloe.log('error' + error );  });
           });

        myself.arduino.hideMessage();
        ide.inform(myself.name, localize(' Board has been connected at port \n') + port);
        // Set timeout to check if device does not speak firmata (in such case new Board callback was never called, but board object exists)
        return;
    }

    myself.arduino.isBoardReady = function() {
        return ((this.board !== undefined)
              //  && (this.board.pins.length>0)
                && (!this.disconnecting));
    }
}



// Definition of a new Arduino Category

SpriteMorph.prototype.categories.push('Rokit');
SpriteMorph.prototype.blockColor['Rokit'] = new Color(64, 136, 182);

SpriteMorph.prototype.categories.push('Drone');
SpriteMorph.prototype.blockColor['Drone'] = new Color(105, 128,150);


SpriteMorph.prototype.originalInitBlocks = SpriteMorph.prototype.initBlocks;
SpriteMorph.prototype.initArduinoBlocks = function() {

    this.blocks.sendData =
    {
       only: SpriteMorph,
       type: 'command',
       category: 'Drone',
       spec: 'sending command',
       translatable: true
    };

    this.blocks.throttle =
    {
       only: SpriteMorph,
       type: 'command',
       category: 'Drone',
       spec: 'throttle %throttleValue',
       defaults: ['0'],
       translatable: true
    };

    this.blocks.yaw =
    {
       only: SpriteMorph,
       type: 'command',
       category: 'Drone',
       spec: 'yaw %yawValue',
       defaults: ['0'],
       translatable: true
    };

    this.blocks.pitch =
    {
       only: SpriteMorph,
       type: 'command',
       category: 'Drone',
       spec: 'pitch %pitchValue',
       defaults: ['0'],
       translatable: true
    };

    this.blocks.roll =
    {
       only: SpriteMorph,
       type: 'command',
       category: 'Drone',
       spec: 'roll %rollValue',
       defaults: ['0'],
       translatable: true
    };

    this.blocks.pushEvent =
    {
       only: SpriteMorph,
       type: 'command',
       category: 'Drone',
       spec: 'event %eventName',
       defaults: ['STOP'],
       translatable: true
    };

    this.blocks.pushTrim =
    {
       only: SpriteMorph,
       type: 'command',
       category: 'Drone',
       spec: 'trim %trimName',
       defaults: [null],
       translatable: true
    };

    this.blocks.merongHello =
    {
        only: SpriteMorph,
        type: 'command',
        category: 'Rokit',
        spec: 'merong %hello',
        defaults: ['100'],
        translatable: true
    };

    this.blocks.setServo =
    {
       only: SpriteMorph,
       type: 'command',
       category: 'Rokit',
       spec: 'set servo %servoPin to %servoValue',
         defaults: [null, null],
       translatable: true
    };

    this.blocks.setDigitalPin =
    {
       only: SpriteMorph,
       type: 'command',
       category: 'Rokit',
       spec: 'set digital pin %digitalPin to %b',
       defaults: [null],
       translatable: true
    };

    this.blocks.setAnalogPin =
    {
       only: SpriteMorph,
       type: 'command',
       category: 'Rokit',
       spec: 'set analog pin %analogPin to %analogValue',
       defaults: [null, null],
       translatable: true
    };

    this.blocks.setDCmotor =
    {
       only: SpriteMorph,
       type: 'command',
       category: 'Rokit',
       spec: 'DCmotor %motorNumber speed %motorSpeed with %direction',
       defaults: [null, null, null],
       translatable: true
    };

    this.blocks.setTone =
    {
       only: SpriteMorph,
       type: 'command',
       category: 'Rokit',
       spec: 'tone %pitch note %duration',
       defaults: [null, null],
       translatable: true
    };

    this.blocks.analogReading =
    {
       only: SpriteMorph,
       type: 'reporter',
       category: 'Rokit',
       spec: 'analog reading %sensor',
         defaults: ['19'],
       translatable: true
    };

    this.blocks.digitalReading =
    {
       only: SpriteMorph,
       type: 'reporter',
       category: 'Rokit',
       spec: 'digital reading %digitalReportPin',
       defaults: ['22'],
       translatable: true
    };

    this.blocks.sevenSensor =
    {
       only: SpriteMorph,
       type: 'reporter',
       category: 'Rokit',
       spec: 'seven sensor report',
       translatable: true
    };

    this.blocks.IRRemocon =
    {
       only: SpriteMorph,
       type: 'reporter',
       category: 'Rokit',
       spec: 'IR Remocon report',
       translatable: true
    };

    this.blocks.reportAnalogReading =
    {
        only: SpriteMorph,
        type: 'reporter',
        category: 'Rokit',
        spec: 'analog reading %analogPin',
        translatable: true
    };

    this.blocks.reportDigitalReading =
    {
        only: SpriteMorph,
        type: 'reporter',
        category: 'Rokit',
        spec: 'digital reading %digitalPin',
        translatable: true
    };

    this.blocks.connectArduino =
    {
        only: SpriteMorph,
        type: 'command',
        category: 'Rokit',
        spec: 'connect arduino at %port'
    };

    // Keeping this block spec, although it's not used anymore!
    this.blocks.setPinMode =
    {
        only: SpriteMorph,
        type: 'command',
        category: 'Rokit',
        spec: 'setup digital pin %digitalPin as %pinMode',
        defaults: [null, 'servo'],
        translatable: true
    };

    this.blocks.digitalWrite =
    {
        only: SpriteMorph,
        type: 'command',
        category: 'Rokit',
        spec: 'set digital pin %digitalPin to %b',
        translatable: true
    };

    this.blocks.servoWrite =
    {
        only: SpriteMorph,
        type: 'command',
        category: 'Rokit',
        spec: 'set servo %servoPin to %servoValue',
        defaults: [null, 'clockwise'],
        translatable: true
    };

    this.blocks.pwmWrite =
    {
        only: SpriteMorph,
        type: 'command',
        category: 'Rokit',
        spec: 'set PWM pin %pwmPin to %n',
        translatable: true
    };

    // Ardui... nization?
    // Whatever, let's dumb this language down:

    this.blocks.receiveGo.translatable = true;
    this.blocks.doWait.translatable = true;
    this.blocks.doForever.translatable = true;
    this.blocks.doRepeat.translatable = true;
    this.blocks.doIf.translatable = true;
    this.blocks.doIfElse.translatable = true;
    this.blocks.reportSum.translatable = true;
    this.blocks.reportDifference.translatable = true;
    this.blocks.reportProduct.translatable = true;
    this.blocks.reportQuotient.translatable = true;
    this.blocks.reportModulus.translatable = true;
    this.blocks.reportMonadic.translatable = true;
    this.blocks.reportRandom.translatable = true;
    this.blocks.reportLessThan.translatable = true;
    this.blocks.reportEquals.translatable = true;
    this.blocks.reportGreaterThan.translatable = true;
    this.blocks.reportAnd.translatable = true;
    this.blocks.reportOr.translatable = true;
    this.blocks.reportNot.translatable = true;
    this.blocks.reportTrue.translatable = true;
    this.blocks.reportFalse.translatable = true;
    this.blocks.reportJoinWords.translatable = true;
    this.blocks.doSetVar.translatable = true;
    this.blocks.doChangeVar.translatable = true;
    this.blocks.doDeclareVariables.translatable = true;

    StageMorph.prototype.codeMappings['delim'] = ',';
    StageMorph.prototype.codeMappings['tempvars_delim'] = ',';
    StageMorph.prototype.codeMappings['string'] = '"<#1>"';

    StageMorph.prototype.codeMappings['doWait'] = 'delay(<#1> * 1000);';
    StageMorph.prototype.codeMappings['doForever'] = 'void loop() {\n  <#1>\n}';
    StageMorph.prototype.codeMappings['doRepeat'] = 'for (int i = 0; i < <#1>; i++) {\n  <#2>\n}';
    StageMorph.prototype.codeMappings['doIf'] = 'if (<#1>) {\n  <#2>\n}';
    StageMorph.prototype.codeMappings['doIfElse'] = 'if (<#1>) {\n  <#2>\n} else {\n  <#3>\n}';

    StageMorph.prototype.codeMappings['reportSum'] = '(<#1> + <#2>)';
    StageMorph.prototype.codeMappings['reportDifference'] = '(<#1> - <#2>)';
    StageMorph.prototype.codeMappings['reportProduct'] = '(<#1> * <#2>)';
    StageMorph.prototype.codeMappings['reportQuotient'] = '(<#1> / <#2>)';
    StageMorph.prototype.codeMappings['reportModulus'] = '(<#1> % <#2>)';
    StageMorph.prototype.codeMappings['reportMonadic'] = '<#1>(<#2>)';
    StageMorph.prototype.codeMappings['reportRandom'] = 'random(<#1>, <#2>)';
    StageMorph.prototype.codeMappings['reportLessThan'] = '(<#1> < <#2>)';
    StageMorph.prototype.codeMappings['reportEquals'] = '(<#1> == <#2>)';
    StageMorph.prototype.codeMappings['reportGreaterThan'] = '(<#1> > <#2>)';
    StageMorph.prototype.codeMappings['reportAnd'] = '(<#1> && <#2>)';
    StageMorph.prototype.codeMappings['reportOr'] = '(<#1> || <#2>)';
    StageMorph.prototype.codeMappings['reportNot'] = '!(<#1>)';
    StageMorph.prototype.codeMappings['reportTrue'] = 'true';
    StageMorph.prototype.codeMappings['reportFalse'] = 'false';

    StageMorph.prototype.codeMappings['doSetVar'] = '<#1> = <#2>;';
    StageMorph.prototype.codeMappings['doChangeVar'] = '<#1> += <#2>;';
    StageMorph.prototype.codeMappings['doDeclareVariables'] = 'int <#1>;'; // How do we deal with types? Damn types...

    StageMorph.prototype.codeMappings['sendData'] = 'SmartDroneControl.send();';
    StageMorph.prototype.codeMappings['throttle'] = 'THROTTLE = <#1>;';
    StageMorph.prototype.codeMappings['yaw'] = 'YAW = <#1>;';
    StageMorph.prototype.codeMappings['pitch'] = 'PITCH = <#1>;';
    StageMorph.prototype.codeMappings['roll'] = 'ROLL = <#1>;';
    StageMorph.prototype.codeMappings['pushEvent'] = 'SmartDroneControl.event = <#1>;';
    StageMorph.prototype.codeMappings['pushTrim'] = 'SmartDroneControl.event = <#1>;';
    //StageMorph.prototype.codeMappings['merongHello'] = 'analogRead(<#1>)';
    StageMorph.prototype.codeMappings['setServo'] = 'servo(<#1>, <#2>);';
    StageMorph.prototype.codeMappings['setDigitalPin'] = 'digitalWrite(<#1>, <#2>));';
    StageMorph.prototype.codeMappings['setAnalogPin'] = 'analogWrite(<#1>, <#2>));';
    StageMorph.prototype.codeMappings['analogReading'] = 'analogRead(<#1>);';
    StageMorph.prototype.codeMappings['digitalReading'] = 'digitalRead(<#1>);';
    StageMorph.prototype.codeMappings['sevenSensor'] = 'sevenSensor();';
    StageMorph.prototype.codeMappings['IRRemocon'] = 'SmartInventor.RFRemoconData();';
    StageMorph.prototype.codeMappings['setDCmotor'] = 'SmartInventor.DCmotor(<#1>, <#2> ,<#3>);';
    StageMorph.prototype.codeMappings['setTone'] = 'tone(7, <#1>, <#2>);';
    //StageMorph.prototype.codeMappings['reportAnalogReading'] = 'analogRead(<#1>)';
    //StageMorph.prototype.codeMappings['reportDigitalReading'] = 'digitalRead(<#1>)';
    //StageMorph.prototype.codeMappings['setPinMode'] = 'pinMode(<#1>, <#2>);';
    //StageMorph.prototype.codeMappings['digitalWrite'] = 'digitalWrite(<#1>, <#2>);';
    //StageMorph.prototype.codeMappings['servoWrite'] = 'servo<#1>.write(<#2>);';
    //StageMorph.prototype.codeMappings['pwmWrite'] = 'analogWrite(<#1>, <#2>);';
}

SpriteMorph.prototype.initBlocks =  function() {
    this.originalInitBlocks();
    this.initArduinoBlocks();
}

SpriteMorph.prototype.initBlocks();

// blockTemplates decorator

SpriteMorph.prototype.originalBlockTemplates = SpriteMorph.prototype.blockTemplates;
SpriteMorph.prototype.blockTemplates = function(category) {
    var myself = this;

    var blocks = myself.originalBlockTemplates(category);

    //  Button that triggers a connection attempt

    var arduinoConnectButton = new PushButtonMorph(
            null,
            function () {
                myself.arduino.attemptConnection();
            },
            'Connect board'
            );

    //  Button that triggers a disconnection from board

    var arduinoDisconnectButton = new PushButtonMorph(
            null,
            function () {
                myself.arduino.disconnect();;
            },
            'Disconnect board'
            );

	var DroneConnectButton = new PushButtonMorph(
            null,
            function () {
                myself.arduino.attemptConnection();
            },
            'Connect Drone'
            );

    //  Button that triggers a disconnection from board

    var DroneDisconnectButton = new PushButtonMorph(
            null,
            function () {
                myself.arduino.disconnect();;
            },
            'Disconnect Drone'
            );

    function blockBySelector(selector) {
        var newBlock = SpriteMorph.prototype.blockForSelector(selector, true);
        newBlock.isTemplate = true;
        return newBlock;
    };

    if (category === 'Rokit') {
        blocks.push(arduinoConnectButton);
        blocks.push(arduinoDisconnectButton);
        blocks.push('-');
        blocks.push(blockBySelector('sevenSensor'));
        blocks.push(blockBySelector('IRRemocon'));
        blocks.push('-');
        blocks.push(blockBySelector('analogReading'));
        blocks.push(blockBySelector('digitalReading'));

        //blocks.push(blockBySelector('pwmWrite'));
        //blocks.push(blockBySelector('merongHello'));
        blocks.push('-');
        blocks.push(blockBySelector('setServo'));
        blocks.push(blockBySelector('setDigitalPin'));
        blocks.push(blockBySelector('setAnalogPin'));
        blocks.push(blockBySelector('setDCmotor'));
        //blocks.push(blockBySelector('setTone'));
        //blocks.push(blockBySelector('reportAnalogReading'));
        //blocks.push(blockBySelector('reportDigitalReading'));
    };

	 if (category === 'Drone') {
      //blocks.push(DroneConnectButton);
      //blocks.push(DroneDisconnectButton);
	    blocks.push('-');
      blocks.push(blockBySelector('throttle'));
      blocks.push(blockBySelector('yaw'));
      blocks.push(blockBySelector('pitch'));
      blocks.push(blockBySelector('roll'));
      blocks.push(blockBySelector('pushEvent'));
      blocks.push(blockBySelector('pushTrim'));
      blocks.push(blockBySelector('sendData'));
     };

    return blocks;
}
