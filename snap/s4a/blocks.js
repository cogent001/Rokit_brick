function pinsSettableToMode(aMode) {
    // Retrieve a list of pins that support a particular mode
    var sprite = world.children[0].currentSprite,
        board = sprite.arduino.board;

    var pinNumbers = {};
    var pins = board.pins;
    pins.forEach(
        function(each){
            if (each.supportedModes.indexOf(aMode) > -1) {
                var number = pins.indexOf(each).toString();
                pinNumbers[number] = number;
            }
        }
    );
    return pinNumbers;
}


// labelPart() proxy

SyntaxElementMorph.prototype.originalLabelPart = SyntaxElementMorph.prototype.labelPart;

SyntaxElementMorph.prototype.labelPart = function(spec) {
    var part;
    switch (spec) {
        case '%pinMode':
            part = new InputSlotMorph(
                null,
                false,
                {
                    'digital input' : ['digital input'],
                    'digital output' : ['digital output'] ,
                    'PWM' : ['PWM'],
                    'servo' : ['servo']
                },
                true
        );
        break;
        case '%servoValue':
            part = new InputSlotMorph(
                null,
                false,
                {
                    'angle (0-179)' : 90
                }
        );
        break;
        case '%servoPin':
            part = new InputSlotMorph(
                null,
                false,
                {
                  '22':[22],
                  '23':[23],
                  '24':[24],
                  '25':[25],
                  '26':[26],
                  '27':[27],
                  '28':[28],
                  '29':[29],
                  '30':[30],
                  '31':[31]
                }
        );
        break;
        case '%pwmPin':
            part = new InputSlotMorph(
                null,
                true,
                function() {
                    // Get board associated to currentSprite
                    var sprite = world.children[0].currentSprite,
                        board = sprite.arduino.board;

                    if (board) {
                        return pinsSettableToMode(board.MODES.PWM);
                    } else {
                        return [];
                    }
                },
                true
        );
        break;
        case '%throttleValue':
            part = new InputSlotMorph(null, true);
        break;
        case '%yawValue':
            part = new InputSlotMorph(null, true);
        break;
        case '%pitchValue':
            part = new InputSlotMorph(null, true);
        break;
        case '%rollValue':
            part = new InputSlotMorph(null, true);
        break;
        case '%eventName':
            part = new InputSlotMorph(
                null,
                false,
                {
                  'STOP':['STOP'],
                  'RESET_YAW':['RESET_YAW'],
                  'ABSOLUTE_MODE':['ABSOLUTE_MODE'],
                  'NORMAL_MODE':['NORMAL_MODE'],
                  'PAIRING':['PAIRING'],
                  'TAKE_OFF':['TAKE_OFF']
                },
                true
        );
        break;
        case '%trimName':
            part = new InputSlotMorph(
                null,
                false,
                {
                  'RESET':['RESET'],
                  'PITCH_INCREASE':['PITCH_INCREASE'],
                  'PITCH_DECREASE':['PITCH_DECREASE'],
                  'YAW_INCREASE':['YAW_INCREASE'],
                  'YAW_DECREASE':['YAW_DECREASE'],
                  'ROLL_INCREASE':['ROLL_INCREASE'],
                  'ROLL_DECREASE':['ROLL_DECREASE']
                },
                true
        );
        break;
	    	case '%hello':
            part = new InputSlotMorph(
                null,
                false,
                {
                  '100':[100],
                  '101':[101],
                  '102':[102],
                  '103':[103],
                  '104':[104]
                },
                true
        );
        break;
        case '%sensor':
            part = new InputSlotMorph(
                null,
                false,
                {
                  '19':[19],
                  '20':[20],
                  '21':[21],
                  '22':[22],
                  '23':[23],
                  '24':[24],
                  '25':[25],
                  '26':[26]
                }
        );
        break;
        case '%analogPin':
            part = new InputSlotMorph(
                null,
                false,
                {
                  '29':[29],
                  '30':[30]
                },
                true
        );
        break;
        case '%analogValue':
            part = new InputSlotMorph(null, true);
        break;
        case '%digitalPin':
            part = new InputSlotMorph(
                null,
                false,
                {
                  '11':[11],
                  '12':[12],
                  '13':[13],
                  '14':[14],
                  '15':[15],
                  '16':[16],
                  '17':[17],
                  '18':[18],
                  '22':[22],
                  '23':[23],
                  '24':[24],
                  '25':[25],
                  '26':[26],
                  '27':[27],
                  '28':[28],
                  '29':[29],
                  '30':[30],
                  '31':[31]
                }
        );
        break;
        case '%motorNumber':
            part = new InputSlotMorph(
                null,
                false,
                {
                  'M1':['M1'],
                  'M2':['M2']
                },
                true
        );
        break;
        case '%motorSpeed':
            part = new InputSlotMorph(
                null,
                false,
                {
                  '0':[0],
                  '10':[10],
                  '20':[20],
                  '30':[30],
                  '40':[40],
                  '50':[50],
                  '60':[60],
                  '70':[70],
                  '80':[80],
                  '90':[90],
                  '100':[100]
                }
        );
        break;
        case '%direction':
            part = new InputSlotMorph(
                null,
                false,
                {
                  'CW':['CW'],
                  'CCW':['CCW'],
                  'STOP':['STOP'],
                  'LOOSE':['LOOSE']
                },
                true
        );
        break;
        case '%pitch':
            part = new InputSlotMorph(
                null,
                false,
                {
                  '(DIRECT_INPUT)':null,
                  'NOTE_C2':['C2'],
                  'NOTE_CS2':['CS2'],
                  'NOTE_D2':['D2'],
                  'NOTE_DS2':['DS2'],
                  'NOTE_E2':['E2'],
                  'NOTE_F2':['F2'],
                  'NOTE_FS2':['FS2'],
                  'NOTE_G2':['G2'],
                  'NOTE_GS2':['GS2'],
                  'NOTE_A2':['A2'],
                  'NOTE_AS2':['AS2'],
                  'NOTE_B2':['B2'],
                  'NOTE_C3':['C3'],
                  'NOTE_CS3':['CS3'],
                  'NOTE_D3':['D3'],
                  'NOTE_DS3':['DS3'],
                  'NOTE_E3':['E3'],
                  'NOTE_F3':['F3'],
                  'NOTE_FS3':['FS3'],
                  'NOTE_G3':['G3'],
                  'NOTE_GS3':['GS3'],
                  'NOTE_A3':['A3'],
                  'NOTE_AS3':['AS3'],
                  'NOTE_B3':['B3'],
                  'NOTE_C4':['C4'],
                  'NOTE_CS4':['CS4'],
                  'NOTE_D4':['D4'],
                  'NOTE_DS4':['DS4'],
                  'NOTE_E4':['E4'],
                  'NOTE_F4':['F4'],
                  'NOTE_FS4':['FS4'],
                  'NOTE_G4':['G4'],
                  'NOTE_GS4':['GS4'],
                  'NOTE_A4':['A4'],
                  'NOTE_AS4':['AS4'],
                  'NOTE_B4':['B4'],
                  'NOTE_C4':['C4']
                }
        );
        break;
        case '%duration':
            part = new InputSlotMorph(
                null,
                false,
                {
                  '(DIRECT_INPUT)':null,
                  'WHOLE_NOTE':['WHOLE_NOTE'],
                  'HALF_NOTE':['HALF_NOTE'],
                  'QUARTER_NOTE':['QUARTER_NOTE'],
                  'EIGHTH_NOTE':['EIGHTH_NOTE'],
                  'SIXTEENTH_NOTE':['SIXTEENTH_NOTE']
                }
        );
        break;
        case '%digitalReportPin':
            part = new InputSlotMorph(
                null,
                false,
                {
                  '8':[8],
                  '9':[9],
                  '10':[10],
                  '11':[11],
                  '12':[12],
                  '13':[13],
                  '14':[14],
                  '15':[15],
                  '16':[16],
                  '17':[17],
                  '18':[18],
                  '22':[22],
                  '23':[23],
                  '24':[24],
                  '25':[25],
                  '26':[26],
                  '27':[27],
                  '28':[28],
                  '29':[29],
                  '30':[30],
                  '31':[31]
                }
        );
        break;
        default:
            part = this.originalLabelPart(spec);
    }
    return part;
}

BlockMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this),
        world = this.world(),
        myself = this,
        shiftClicked = world.currentKey === 16,
        alternatives,
        top,
        blck;

    menu.addItem(
        "help...",
        'showHelp'
    );
    if (shiftClicked) {
        top = this.topBlock();
        if (top instanceof ReporterBlockMorph) {
            menu.addItem(
                "script pic with result...",
                function () {
                    top.ExportResultPic();
                },
                'open a new window\n' +
                    'with a picture of both\nthis script and its result',
                new Color(100, 0, 0)
            );
        }
    }
    if (this.isTemplate) {
        if (!(this.parent instanceof SyntaxElementMorph)) {
            if (this.selector !== 'evaluateCustomBlock') {
                menu.addItem(
                    "hide",
                    'hidePrimitive'
                );
            }
        }
        return menu;
    }

    menu.addLine();
    if (this.selector === 'reportGetVar') {
        blck = this.fullCopy();
        blck.addShadow();
        menu.addItem(
            'rename...',
            function () {
                new DialogBoxMorph(
                    myself,
                    myself.setSpec,
                    myself
                ).prompt(
                    "Variable name",
                    myself.blockSpec,
                    world,
                    blck.fullImage(), // pic
                    InputSlotMorph.prototype.getVarNamesDict.call(myself)
                );
            }
        );
    } else if (SpriteMorph.prototype.blockAlternatives[this.selector]) {
        menu.addItem(
            'relabel...',
            function () {
                myself.relabel(
                    SpriteMorph.prototype.blockAlternatives[myself.selector]
                );
            }
        );
    } else if (this.definition && this.alternatives) { // custom block
        alternatives = this.alternatives();
        if (alternatives.length > 0) {
            menu.addItem(
                'relabel...',
                function () {myself.relabel(alternatives); }
            );
        }
    }

    menu.addItem(
        "duplicate",
        function () {
            var dup = myself.fullCopy(),
                ide = myself.parentThatIsA(IDE_Morph);
            dup.pickUp(world);
            if (ide) {
                world.hand.grabOrigin = {
                    origin: ide.palette,
                    position: ide.palette.center()
                };
            }
        },
        'make a copy\nand pick it up'
    );
    if (this instanceof CommandBlockMorph && this.nextBlock()) {
        menu.addItem(
            this.thumbnail(0.5, 60, false),
            function () {
                var cpy = this.fullCopy(),
                    nb = cpy.nextBlock(),
                    ide = myself.parentThatIsA(IDE_Morph);
                if (nb) {nb.destroy(); }
                cpy.pickUp(world);
                if (ide) {
                    world.hand.grabOrigin = {
                        origin: ide.palette,
                        position: ide.palette.center()
                    };
                }
            },
            'only duplicate this block'
        );
    }
    menu.addItem(
        "delete",
        'userDestroy'
    );
    menu.addItem(
        "script pic...",
        function () {
            window.open(myself.topBlock().fullImage().toDataURL());
        },
        'open a new window\nwith a picture of this script'
    );
    if (this.parentThatIsA(RingMorph)) {
        menu.addLine();
        menu.addItem("unringify", 'unringify');
        menu.addItem("ringify", 'ringify');
        return menu;
    }

    if (StageMorph.prototype.enableCodeMapping && this.selector == 'receiveGo') {
        menu.addLine();
        menu.addItem(
            'export as Arduino sketch...',
            'exportAsArduinoC'
        );
    }

    if (this.parent instanceof ReporterSlotMorph
            || (this.parent instanceof CommandSlotMorph)
            || (this instanceof HatBlockMorph)
            || (this instanceof CommandBlockMorph
                && (this.topBlock() instanceof HatBlockMorph))) {
        return menu;
    }
    menu.addLine();
    menu.addItem("ringify", 'ringify');

    return menu;
};

BlockMorph.prototype.exportAsArduinoC = function () {
    var fs = require('fs'),
        ide = this.parentThatIsA(IDE_Morph),
        fileName = homePath() + (ide.projectName ? ide.projectName.replace(/[^a-zA-Z]/g,'') : 'snap4arduino') + '.ino';

    try {
        fs.writeFileSync(fileName, this.world().Arduino.processC(this.mappedCode()));
        ide.showMessage('Exported as ' + fileName, 1);
    } catch (error) {
        ide.inform('Error exporting to Arduino sketch!', error.message)
    }
};
