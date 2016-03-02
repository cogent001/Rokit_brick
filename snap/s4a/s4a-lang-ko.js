s4aTempDict = {

    /*
       Special characters: (see <http://0xcc.net/jsescape/>)

       Ä, ä   \u00c4, \u00e4
       Ö, ö   \u00d6, \u00f6
       Ü, ü   \u00dc, \u00fc
       ß      \u00df
       */
    // primitive blocks:

    /*
       Attention Translators:
       ----------------------
       At this time your translation of block specs will only work
       correctly, if the order of formal parameters and their types
       are unchanged. Placeholders for inputs (formal parameters) are
       indicated by a preceding % prefix and followed by a type
       abbreviation.

       For example:

       'say %s for %n secs'

       can currently not be changed into

       'say %n secs long %s'

       and still work as intended.

       Similarly

       'point towards %dst'

       cannot be changed into

       'point towards %cst'

       without breaking its functionality.
       */

    // arduino:

    'Rokit':
        '로킷 스마트',

    'Drone':
        '드론 파이터',

    'Connect board':
        '보드에 연결하기',

    'Disconnect board':
        '보드와 연결끊기',

    'seven sensor report':
        '7조 센서값 읽기',

    'IR Remocon report':
        'IR 리모컨값 읽기',

    'analog reading %sensor':
        '아날로그 값 읽기 %sensor',

    'digital reading %digitalReportPin':
        '디지털 값 읽기 %digitalReportPin',

    'set servo %servoPin to %servoValue':
        '서보 모터 %servoPin 각도 %servoValue' ,

    'set digital pin %digitalPin to %b':
            '디지털 핀 %digitalPin 번을 %b 으로 설정' ,

    'set analog pin %analogPin to %analogValue':
            '아날로그 핀 %analogPin 번을 %analogValue 으로 설정' ,

    'DCmotor %motorNumber speed %motorSpeed with %direction':
            'DC모터 %motorNumber 속도 %motorSpeed 방향 %direction' ,

    'CW':
      '정회전',

    'CCW':
      '역회전',

    'STOP':
      '멈춤',

    'LOOSE':
      '풀림',

    'tone %pitch note %duration':
        '버저 음계 %pitch 음표는 %duration',

    'throttle %throttleValue':
        'throttle 입력 %throttleValue',

    'yaw %yawValue':
        'yaw 입력 %yawValue',

    'pitch %pitchValue':
        'pitch 입력 %pitchValue',

    'roll %rollValue':
        'roll 입력 %rollValue',

    'event %eventName':
        '동작 선택 %eventName',

    'trim %trimName':
        '미세 조종 %trimName',

    'sending command':
        '드론에게 명령 내리기',

    'RESET_YAW':
        'YAW_재설정',

    'ABSOLUTE_MODE':
        '앱솔루트_모드',

    'NORMAL_MODE':
        '일반_모드',

    'PAIRING':
        '페어링',

    'TAKE_OFF':
        '이륙하기',

    'RESET':
        '초기화',

    'PITCH_INCREASE':
        'PITCH_증가',

    'PITCH_DECREASE':
        'PITCH_감소',

    'YAW_INCREASE':
        'YAW_증가',

    'YAW_DECREASE':
        'YAW_감소',

    'ROLL_INCREASE':
        'ROLL_증가',

    'ROLL_DECREASE':
        'ROLL_감소',

    'Could not connect an device\nNo boards found':
        '장치에 연결할 수 없습니다.\n보드 발견 못함',

    'select a port':
        '포트 선택',

    'Board is not connected':
        '보드에 연결되지 않았습니다.',

    'There is already a board connected to this sprite':
        '이미 이 스프라이트에 보드가 연결되어 있습니다.',

    'Board was disconnected from port\n':
        '보드 연결이 끊어졌습니다\n',

    'Connecting board at port\n':
        '포트에 연결중입니다.\n',

    ' Board has been connected at port \n':
        '포트에 보드가 연결되었습니다.\n',

    'It seems that someone pulled the cable!':
        '선 연결이 끊어진것 같습니다!',

    'Error connecting the board.':
        '보드와의 연결에 문제가 있습니다.',

    'An error was detected on the board\n\n':
        '동작에 문제가 있습니다.\n\n',

    'Board not connected':
        '보드와 연결 안됨',

};

// Add attributes to original SnapTranslator.dict.ca
for (var attrname in s4aTempDict) { SnapTranslator.dict.ko[attrname] = s4aTempDict[attrname]; }
