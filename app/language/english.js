import { ROOM_TYPE } from '@global/roomConstants';
import { getUrlParams } from '../utils/url';

const roomType = parseInt(getUrlParams('roomtype'), 10) || parseInt(getUrlParams('type'), 10) || ROOM_TYPE.CLASS_ROOM;
const roleTexts = {
  // roleTexts.classEnd
  [ROOM_TYPE.CLASS_ROOM]: {
    teacherName: 'Teacher',
    studentName: 'student',
    assistant: 'assistant',
    courseLib: 'Course lib',
    courseware: 'Document',
    classStatus: 'class',
    classEnd: 'finish class',
    classType: 'class',
  },
  [ROOM_TYPE.LIVE_ROOM]: {
    teacherName: 'Lecturer',
    studentName: 'student',
    assistant: 'assistant',
    courseLib: 'Course lib',
    courseware: 'Document',
    classStatus: 'live',
    classEnd: 'end live',
    classType: 'live',
  },
  [ROOM_TYPE.MEETING_ROOM]: {
    teacherName: 'Host',
    studentName: 'Attendee',
    assistant: 'assistant',
    courseLib: ' File lib',
    courseware: 'file',
    classStatus: 'Meeting',
    classEnd: 'to end the meeting',
    classType: 'meeting',
  },
}[roomType];

// const isLiveRoom = roomType === ROOM_TYPE.LIVE_ROOM;

const englishLanguage = {
  header: {
    delayLanguage: 'Delay',
    packetlossLanguage: 'Packet loss',
    statusLanguage: 'Status',
    roomNoLanguage: 'Room No.',
    chatLanguage: 'Chat',
    inquiryLanguage: 'Inquiry',
    NoticeLanguage: 'Notice',
    SendLanguage: 'Send',
    SayLanguage: 'Say something.',
    excellent: 'excellent',
    good: 'good',
    middle: 'middle',
    bad: 'bad',
    onlineNumber: 'online number:',
    switchLayout: 'Layout of the switch',
    roomName: 'room name',
  },
  chat: {
    errorNotice: {
      getMediaErrorBefore: '',
      getMediaErrorBack: ' failed to connect  due to equipment',
    },
    question: {
      feedback1: 'Your question “',
      feedback2: '” has been submitted. Please be patient and wait for answer.',
      sendStatus: 'Question',
      answerStatus: 'Answer',
      inspectStatus: 'Inspect',
      delOperation: 'Delete',
      passOperation: 'Pass',
    },
    chatInput: {
      fontNameNor: 'normal',
      fontNameMid: 'middle',
      fontNameLar: 'large',
      flowersTitle: 'Send flowers',
      onlyMe: 'View own chats',
      justLook: 'View XX chats',
      allMsg: 'Show all chats',
      onlyAnchor: 'Show lecturer chats',
      lookMe: 'Show my chats',
      bannedToPost: 'All chats forbidden',
      banAllAudio: "Turn off everyone's microphone",
      toAllAudio: "Turn on everyone's microphone",
      LecturerForbidChat: 'Lecturer forbid chat',
      barrage: 'Bullet screen',
      phiz: 'Emoji',
      picture: 'Picture',
      toWho: 'Chat to ',
      owner: 'All',
      openOnlyme: 'View own chats status',
      openAnchor: 'View lecture chats status',
      openAllMsg: 'View all chats status',
      openTheBarrage: 'Bullet screen open',
      closeTheBarrage: 'Bullet screen close',
      textWrong1: 'Sending messages too frequently, pleasetry again in ',
      textWrong2: 'seconds',
      toSomeOnem: 'to',
      keyCode: 'keyboard',
      nameList: 'List of winners',
      forbiddenToChat: 'You are forbidden to chat',
      toChat: 'You can start speaking',
      toTeacher: 'To the teacher',
      LiftAllGagOrders: 'Lift all gag orders',
      joinLive: 'Join a room',
      leaveLive: 'Leave the room',
      mine: 'I',
      dui: 'to',
      you: 'you',
      said: 'said',
      sure: 'Confirm',
      congratulateWinner: 'Congratulations on your winning',
    },
    chatSendBtn: {
      sendBtn: 'Send',
      subBtn: 'submit',
    },
    chatSubject: {
      onGoing: 'with',
      private: 'Private chat',
      forbid: 'You are forbidden to chat',
      maxNumber: 'Input up to 140 words',
    },
    chatTip: {
      iconWraning: 'The length of chat to be sent shall not exceed 140 words',
    },
    chatTitleBoxInner: {
      chitChat: 'Chat',
      ask: 'Inquiry',
    },
    classNoticeText: {
      startTimes: 'Start time',
      endTimes: 'End time',
    },
    chatContent: {
      speaker: 'lecturer',
      assistant: roleTexts.assistant,
      classTeacher: 'Class teacher',
      system: 'system administrator',
      enterprise: 'enterprise adminstrator',
      admin: 'adminstrator',
      playBack: 'Recorder',
      naughty: 'naughty',
      happy: 'Happy',
      complacent: 'Proud',
      curl: 'curl',
      grieved: 'sad',
      cry: 'lacrimation',
      kiss: 'kiss',
      xoxo: 'mua',
    },
  },
  video: {
    closeAudio: 'Turn off audio',
    closeVideo: 'Close video',
    openAudio: 'Turn on audio',
    openVideo: 'Open video',
    scrawlOn: 'Operation',
    scrawlOff: 'No Operation',
    platformOn: 'Start speaking',
    platformOff: 'Stop speaking',
    sendGift: 'Award Trophy',
    restoreDrag: 'Restore Position',
    pressedHome: `The ${roleTexts.studentName} pressed home`,
    videoCapture: 'Video screenshot',
    videoReminder: `${roleTexts.teacherName} enteredroom,please wait`,
    switchOne2oneVideoLayout: 'Video Switch',
  },
  whiteboard: {
    fullScreen: 'Full Screen',
    exitFullScreen: 'Exit Full Screen',
    tools: {
      toolName: 'whiteboard tools',
      tool_mouse: 'mouse',
      tool_laserPen: 'laserPen',
      tool_pen: 'pen',
      tool_writing: 'word',
      tool_shape: 'shape',
      tool_eraser: 'eraser',
      tool_revoke: 'revoke',
      tool_recovery: 'recovery',
      tool_clear: 'clear',
    },
  },
  courseList: {
    dynamicPPT: {
      addppt: 'Add dynamic ppt',
      noremind: 'No more notify',
      attentionP: 'Tips：',
      one: '(1) the dynamic ppt conversion time may be long. In order not to affect use, recommended to upload through the background in advance.',
      two: '(2) the file cannot be opened during the conversion , can be used  after the conversion is completed.',
      continue: 'Continue',
    },
    fileFilterInner: {
      fileTime: 'Time',
      fileType: 'Type',
      fileName: 'Name',
      fileAdd: 'Add',
      courseware: roleTexts.courseLib,
    },
    fileProgressBarInner: {
      fileConversion: 'File converting',
      fileConversionPPT: 'Dynamic files converting...',
      removeFile: 'Are you sure you want to delete this file?',
      confirm: 'ok',
      cancel: 'cancel',
    },
    serviceInner: {
      serFileName: 'Whiteboard',
      conversionWrong: 'File conversion failed！',
      uploadWrong: 'File upload failed！',
      locationWrong: 'Error uploading file location！',
      typeWrong: 'File type not support！',
      conversionCode: 'File upload failed, error code ',
      noneClass: 'Room not exist or has been deleted！',
      affiliationClass: 'The room does not belong to the enterprise.',
      exceed: `${roleTexts.courseware} Pages Overrun！`,
      fairly: 'Cloud Storage Failure！',
      lackIndex: 'Wrong,  missing index.html file！',
      maxMumberPeople: 'The number of people on stage exceeded the maximum limit',
    },
  },
  toolsBoxInner: {
    titleInfo: 'Notice',
    issue: 'Submit',
    customInfo: 'After the submission, it will be displayed directly in the chat area and visible to all users',
    titleAnn: 'release announcement',
    customAnn: 'After the submission, it will be displayed directly in the chat area and visible to all users.',
    share: 'Desktop sharing',
    rollName: 'Roll call',
    draw: 'Luck draw',
    vote: 'Vote',
    answer: 'I-Clicker',
    inform: 'Notice',
    announcement: 'Announce',
    announcementWarnMsg: 'Please fill in the announcement',
    noticeWarnMsg: 'Please fill in the notice',
  },
  deviceTest: {
    detectionAudioInner: {
      headset: 'Headset Options',
      earphoneVolume: 'Volume',
      hear: 'Hi, this is your test assistant. I’m here to help you test your audio and video devices so that you can have a better experience. Can you hear me now?',
      warm: "Warm Tips: If you can't hear the music, please check it in the following way:",
      warm1: '1. If anti-virus software (such as 360 Guard, Baidu Guard) pops up prompt information, please click "Allow"',
      warm2: '2. Confirm that the microphone and speaker are connected and turned on',
      warm3: '3. Make sure that the volume of microphone and loudspeaker has been adjusted to sufficiently high.',
      warm4: '4. Choose the right microphone and speaker options, and disable them will make the device unavailable.',
      warm5: '5. Replacement of socket and re-insertion of microphone and loudspeaker',
      warm6: '6. Restart the compute',
      noHear: 'Can’t hear',
      canHear: 'Can hear',
      sure: 'Confirm',
      agin: 'Listen again',
      nosound: 'No sound? Click here to',
      loudspeaker: 'loudspeaker',
    },
    microphoneInner: {
      microphoneset: 'Mic Option',
      microphon: 'Now talk into the microphone, see if there is any fluctuation in the volume bar below, the fluctuation means the microphone is normal!',
      warm: "Warm Tips: If you can't hear the music, please check it in the following way:",
      warm1: '1. If anti-virus software (such as 360 Guard, Baidu Guard) pops up prompt information, please click "Allow"',
      warm2: '2. Confirm that the microphone and speaker are connected and turned on',
      warm3: '3.Make sure that the volume of microphone and loudspeaker has been adjusted to sufficiently high.',
      warm4: '4. Choose the right microphone and speaker options, and disable them will make the device unavailable.',
      warm5: '5. Replacement of socket and re-insertion of microphone and loudspeaker',
      warm6: '6. Restart the compute',
      nochange: 'Can’t see wave',
      canchange: 'Can see wave',
      sure: 'Confirm',
      microphone: 'microphone',
      mcroWrong: 'Choose the right microphone options, and disable them will make the device unavailable.',
    },
    resultsInner: {
      detec: 'Detection Content',
      result: 'Detection Result',
      detail: 'Detection Detail',
      detecVideo: 'Video Detect',
      detecSpeacker: 'Speaker Detect',
      detecMicro: 'Mic Detect',
      systemMsg: 'System Info',
      anew: 'Re-detection',
      intoClass: 'Enter room',
      normal: 'Normal',
      abnormal: 'Abnormal',
      okVideo: 'Can see video',
      noVideo: 'No cameras detected',
      oklisten: 'Can hear',
      nolisten: 'You chose "can’t hear"',
      okMicro: 'Can see mic wave',
      noMicro: 'You chose "can’t see wave"',
      set: 'set',
      zc_result: 'Congratulations! You’ve passed the test. All your devices are working fine. Now you can choose “Enter Room” and try the online audio and video interaction.',
      yc_result: 'Wow, something is wrong with the device!Please adjust and check the equipment against the test report, otherwise it may affect the use experience.',
    },
    videoInner: {
      camera: 'Camera Option',
      notice: 'Now let’s check your camera. Can you see yourself in the window? “Mirror Window” function is optional if needed.',
      mirror: 'Mirror mode',
      warm: "Warm Tips: If you can't see the video, please check it in the following way:",
      warm1: '1. If anti-virus software (such as 360 Guard, Baidu Guard) pops up prompt information, please choose "Allow"',
      warm2: '2. Confirm that the camera is connected and opened',
      warm3: '3.If the camera still does not have a picture, replace an outlet and re-insert the camera.',
      warm4: '4. Please choose the right camera option. Disabling the camera will make it unavailable.',
      warm5: '5.Make sure the camera is not occupied by other programs',
      warm6: '6. Restart the computer',
      okVideo: 'can see',
      noVideo: 'can’t see',
      sure: 'Confirm',
      noVideoBtn: "Can't see the video? Click here to",
      cameraText: 'camera',
    },
    systemInner: {
      present: 'Current user:',
      operation: 'Operating system：',
      ip: 'IP Address：',
      equi: 'Login device：',
      throw: 'Packet loss rate：',
      brow: 'Browser：',
      roomid: 'Room No.',
      versionid: 'Version No.',
      sure: 'Confirm',
      mediaServer: 'Media Server',
      docAddress: `${roleTexts.courseware} Address`,
    },
  },
  liveMobilePage: {
    enterLanguage: 'Entering room...',
    disconnectedTip: 'Network has a jitter. Trying to restore for you...',
  },
  callRollCom: {
    callroll: 'Roll call',
    signIn: 'Sign in',
    close: 'close',
    tips: 'Used for room roll call and conference check-in. After published  appear in the center of audience screen in the form of pop-up window',
    setType: 'Set time of duration',
    timerType0: '1Minute',
    timerType1: '3Minute',
    timerType2: '5Minute',
    timerType3: '10Minute',
    timerType4: '30Minute',
    state0: 'roll call',
    state1: 'Completed',
    crTime: 'Duration time',
    totalNum: 'Numbers:',
    signInNum: 'Response number',
    startRollCall: 'Start roll call',
    endRollCall: 'End roll call',
    person: 'people',
    SignInSuccessfully: 'Sign in successfully',
  },
  lucky: {
    pubPanelInner: {
      luckyBig: 'Lucky Draw',
      setLuckNum: 'Set number of winners',
      lottery: 'Start',
      exclude: 'Filter winners',
      luckName: 'Winners list',
      start: 'Start lucky draw',
      end: 'Publish the list of winners',
      nameList: 'List of winners',
      inThelottery: 'In lucky draw',
      noWinnersWarnMsg: 'Please set the number of winners',
      onlinePassWinners: 'The number of winners cannot exceed the number of online winners',
    },
    luckyServiceInner: {
      abnormalNum: 'Parametric anomaly',
      failure: 'operation failed',
      abnormalTransfor: 'Abnormal transmission parameters',
      siginEnd: 'Check-in is over',
      noneList: 'No data',
      insuNum: 'Inadequate number of participants',
    },
  },
  noTifi: {
    notice: 'Notice',
  },
  shareDeskTop: {
    clientDesk: {
      chooseShare: 'Choose Sharing Mode',
      areaShare: 'Zone sharing',
      deskShare: 'Desktop sharing',
      suggest: 'Your current resolution is greater than 1080P. It is recommended to choose zone sharing.',
      startShare: 'Start sharing',
      ensShare: 'Stop sharing',
    },
    plugCheck: {
      title: 'plug-in install guide',
      explain: 'system detected you not installed the desktop sharing plug-in. Please download and install it.',
      chromeTrue: 'If you can visit Google Chrome Store',
      chromeTrueClick: 'click directly',
      addPlugin: 'Add plug-ins',
      chromeFalse: 'If you can’t visit Google Chrome Store',
      one:
        '1、Visit chrome://extensions/, Open the Extension Management Interface, Open the Developer Mode, and drag the downloaded. ZIP file to the Extension Management Interface to confirm the addition.',
      two:
        '2. After successful installation, the icon in the upper right corner of the browser will appear as follows, which means that the installation is successful and you can use it normally. If no icon appears, close the Chrome browser and reopen it. You can also open the installed plug-in through the Chrome Extension Manager.',
    },
  },
  userListInner: {
    roster: 'Name list',
    searchPlacehoder: 'Please enter in search',
    removeStudent: {
      text: 'Are you sure you want to kick it out',
      confirm: 'ok',
      cancel: 'cancel',
      confirmEnd: 'Are you sure you want to kick it out',
    },
    remoteControl: {
      remoteTitle: 'Remote Control',
      refresh: 'Force Refresh',
      deviceManagement: 'Device Control',
      optimalServer: 'Optimal server',
      kick: 'Kicked out of the classroom',
      getDocAddress: `${roleTexts.courseware} Server`,
      line1: 'Roadofcloud CDN Server',
      line2: 'CDN Server',
    },
    networkExtend: {
      title: {
        select: 'Select',
        area: 'Region',
        delay: 'Delay',
        text: 'Please choose the nearest server',
        sure: 'ok',
      },
      testBtn: 'Server delay test',
    },
    button: {
      Scrawl: {
        on: {
          title: 'Draw',
        },
        off: {
          title: 'No Drawing',
        },
      },
      answered: {
        on: {
          title: 'Answered',
        },
        off: {
          title: 'No Answered',
        },
      },
      video: {
        on: {
          title: 'Video On',
        },
        off: {
          title: 'Video Off',
        },
        disabled: {
          title: 'Video disabled',
        },
      },
      update: {
        up: {
          title: 'step down',
        },
        down: {
          title: 'go up onto the platform',
        },
        disabled: {
          title: 'disabled',
        },
      },
      audio: {
        on: {
          title: 'All mute',
        },
        off: {
          title: 'All speaker open',
        },
        disabled: {
          title: 'Microphone disabled',
        },
      },
      allmute: {
        on: {
          title: 'All chats forbidden',
        },
        off: {
          title: 'Remove banned',
        },
      },
      mute: {
        on: {
          title: 'Banned On',
        },
        off: {
          title: 'Banned OFF',
        },
        patrol: {
          on: {
            title: 'quit',
          },
          off: {
            title: 'make an inspection tour',
          },
        },
      },
      remove: {
        title: 'Kick Out',
      },
      trophy: {
        title: 'Trophy for everyone',
      },
      restoreDrag: {
        title: 'restore Drag for everyone',
      },
    },
  },
  voteCom: {
    maxNumber: 'Enter a maximum of 24 words',
    detail: 'details',
    hosterInner: {
      inTheVote: 'In voting',
      voteEnded: 'finished',
      multiple: 'multi choice',
      choseOne: 'Single choice',
      beginVote: 'Create vote',
      submit: 'submit',
      fiveS: 'Automatically update voting schedule every five seconds',
      openTheresult: 'Proclaim the results',
      endVote: 'Finish voting',
      from: 'from',
      startTitle1: 'To make voting more meaningful,',
      startTitle2: 'please fill in the voting subject and details clearly',
      voteHistoryTitle: 'Historical voting',
    },
    pubpanerInner: {
      least: 'Choose at least one！',
      voteMsg: 'Fill in the voting information！',
      theme: 'Topic',
      voteDetail: 'Details',
      chooseType: 'Select mode',
      multiple: 'multi choice',
      choseOne: 'Single choice',
      option: 'Options',
      addOption: 'Add Option',
      trueChoose: 'You can choose the right option, If there is no choice, it will not be displayed.',
      cancel: 'Cancel',
      save: 'Save',
      submit: 'Submit',
      maxOptions: 'Up to 7 options can be entered',
    },
    voteInner: {
      norapet: 'Options cannot be repeated！',
      chooseVote: 'Select vote option',
      votetitle: 'Vote',
    },
    voteResult: {
      rightAnswers: 'right answers',
      backToLive: 'back to live',
    },
  },
  answer: {
    title: 'I-Clicker',
    answerPersons: 'Answer number',
    duration: 'Time',
    rightAnswers: 'Right answers',
    myAnswer: 'My answer',
    nickName: 'Nick name',
    selectAnswers: 'The selected the answer',
    setRightAnswer: 'Set rightAnswer',
    person: 'people',
    btns: {
      detail: 'detail',
      stop: 'stop',
      reStart: 'reStart',
      statistical: 'statistical',
      addAnswer: 'Add',
      rmvAnswer: 'Delete',
      pubAnswer: 'release',
      publishAnswer: 'publish',
      commit: 'commit',
      updateCommit: 'Modify the answer',
    },
  },
  welcomDete: {
    welComToClass: 'welcome to live web-cast',
    ensure: 'for better effect, please complete equipment testing first.',
    startDetection: 'Starting test',
  },
  serviceText: {
    roomListner: {
      roomDelmsg: 'receive roomDelmsg',
      msgTitle: 'prompt message',
      okBtn: 'Confirm',
      leaveMsg: 'Users with the same identity enter, and you have left the room！',
      removeUser: 'You were kicked out of the classroom',
      userOut: 'Users were kicked out:',
      userEnjoy: 'User join the room',
      playBackUse: 'replay',
      code_1: 'Failed to get room info！',
      code_3001: 'Server expired！',
      code_3002: 'Enterprise accounts frozen！',
      code_3003: 'room deleted or expired！',
      code_4007: 'Room not exist！',
      code_4008: 'Room password wrong！',
      code_4110: 'The room needs password. Please input！',
      code_4109: 'Identification error！',
      code_4103: 'Room capacity is limited！',
      code_4112: 'Enterprise capacity is limited！',
      lostClass: 'Failure to get room information！',
      roomEndNotice_1: `${roleTexts.teacherName} left the room for 10 minutes，system ended interaction`,
      roomEndNotice_2: 'Room reservation time arrived,Will be closed in 30 minutes',
      roomEndNotice_3: 'Expired 30 minutes,system ended interaction',
      roomEndNotice_4: 'Room reservation time arrived,Will be closed in 2 minutes',
    },
    roomservice: {
      intoBack: 'Enter replay',
      playbackError: 'Playback error',
    },
  },
  pagesText: {
    livePageInner: {
      intoBack: 'Enter replay…',
      classOver: `${roleTexts.classType} room is over`,
      updateClient: 'Update now',
      foundNewVersion: 'New version found',
      newVersionTips: 'There is a new version, please click "upgrade now", download and install it before real-time interactive experience!',
      laterUpdate: 'Update later',
      downloadPkg: 'Downloading installation package',
      updateComplete: 'The system has ended this interaction',
    },
    navBarInner: {
      courseware: roleTexts.courseware,
      classRoom: 'room',
      chatText: 'Chat',
      questionText: 'Inquiry',
      tools: 'Tools',
      courseLib: roleTexts.courseLib,
      fileList: 'file list',
      userList: 'user list',
      set: 'setting',
      roster: 'Name list',
      netWorkState: 'network state',
      fullScreen: 'fullScreen',
      exitFullScreen: 'exit full screen',
      inClass: `in ${roleTexts.classStatus}`,
    },
    classMsg: {
      confirmEnd: 'Confirm end of live broadcast?',
      confirm: 'confirm',
    },
    classRoomMsg: {
      confirmEnd: `Confirm ${roleTexts.classStatus} is over？`,
      confirm: 'confirm',
    },
    classButton: {
      beginLive: `begin ${roleTexts.classStatus}`,
      endLive: roleTexts.classEnd,
      confirm: 'confirm',
      cancel: 'cancel',
    },
    dialogOut: {
      confirm: 'confirm',
      cancel: 'cancel',
      question: "Are you sure you're quitting?",
    },
  },
  toUpdata: {
    upLoadPicture: 'upload pictures',
    getTwo: 'Get pictures uploaded by qr code',
    smToLoadPic: 'Scan the code to upload pictures',
    uploadWrong: 'Please do not close this window before uploading successfully',
  },
  applyForWheat: {
    WaitingWheat: 'WAIT',
    ApplicationWheat: 'SPEECH',
    wrong: 'To ensure the interactive effect of audio and video, please select and test the equipment first',
    cancel: 'cancel',
    sure: 'confirm',
    BanWheat: 'close',
    alloWheat: 'start',
    ignore: 'all ignore',
    onWheat: 'Apply',
    startText: 'click start, audiences can apply video connect',
    closeText: "click close, audiences can't apply video connect",
    maxNumFull: 'The wheat table is full',
    hasVideo: 'has video connection',
    applicationFailed: 'Your connection application failed',
    applicationon: 'video connection application opened',
    applicationoff: 'video connection application closed',
    pass: 'PASS',
    rej: 'REJ',
  },
};
export default englishLanguage;
