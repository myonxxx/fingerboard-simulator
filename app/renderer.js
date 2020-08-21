const { shell } = require('electron');
const Tone = require('tone');

const keySelector = document.querySelector('.key-selector');
const scaleSelector = document.querySelector('.scale-selector');
const chordMainSelector = document.querySelector('.chord-main-selector');
const chordSubSelector = document.querySelector('.chord-sub-selector');
const modeCheckbox = document.querySelector('.mode-checkbox');
const notesList = document.querySelectorAll('.key');
const strokeZonesList = document.querySelectorAll('.stroke-zone');

const synth = new Tone.PolySynth().toMaster();

//Error Check
const log = require('electron-log');
process.on('uncaughtException', function(err) {
  log.error('electron:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
  app.quit();
});

const playGuitar = (event) => {
  let dataset = event.target.dataset;
  let octave = dataset["octave"];
  let note = dataset["note"];
  let noteName = note + octave;
  playSound(noteName);
};

const playGuitarFromStrokeZone = (event) => {
  let strokeZone = event.target;
  let stringName = strokeZone.classList[0];
  let activeNote = document.querySelector(`.${stringName} .active`);
  console.log(activeNote);

  if (activeNote) {
    let dataset = activeNote.dataset
    let octave = dataset["octave"]
    let note = dataset["note"]
    let noteName = note + octave;
    playSound(noteName);
  }
};

const playSound = (noteName) => {
  synth.triggerAttackRelease(noteName, '8n');
};

const emphasizeScale = () => {
  let nowKey = keySelector.value;
  let nowScale = scaleSelector.value;
  let majorScale = [0, 2, 4, 5, 7, 9, 11];
  let minorScale = [0, 2, 3, 5, 7, 8, 10];
  let scale = [];

  if (nowScale == 'major') {
    scale = makeEmphasizeNoteList(majorScale, nowKey);
  };
  if (nowScale == 'minor') {
    scale = makeEmphasizeNoteList(minorScale, nowKey)
  };

  deephasizeScale()

  if (nowKey != 'none') {
    emphasizeNotes(scale, 'emphasize-scale')
  };
};

const makeEmphasizeNoteList = (numList, startNote) => {
  let notesnameList = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  let startNoteIndex = notesnameList.indexOf(startNote);
  let emphasizeNotelist = [];

  numList.forEach(num => {
    emphasizeNotelist.push(notesnameList[(startNoteIndex + num) % 12])
  });

  return emphasizeNotelist;
}

const emphasizeNotes = (emphasizeNotelist, className) => {
  emphasizeNotelist.forEach(emphasizeNote => {
    notesList.forEach(note => {
      if (emphasizeNotelist[0] == note.dataset["note"]) {
        note.classList.add(className + '-rootnote');
      } else if (emphasizeNote == note.dataset["note"]) {
        note.classList.add(className);
      };
    });
  });
}

const deephasizeScale = () => {
  notesList.forEach(note => {
    note.classList.remove('emphasize-scale');
    note.classList.remove('emphasize-scale-rootnote');
  });
};

const deephasizeNotes = () => {
  notesList.forEach(note => {
    note.classList.remove('active');
  });
};

const activateStrokeMode = () => {
  notesList.forEach(note => {
    note.addEventListener('click', emphasizeActiveNote, false);
  });
};

const deactivateStrokeMode = () => {
  notesList.forEach(note => {
    note.removeEventListener('click', emphasizeActiveNote, false);
    if (note.classList.contains('active')) {
      note.removeChild(note.childNodes[1]);
    };
  });
};

const emphasizeActiveNote = (event) => {
  let activeNote = event.target;
  let stringElement = event.target.parentElement;
  let sameStringNotes = stringElement.querySelectorAll('.key');

  let preActiveNote = null;
  sameStringNotes.forEach(note => {
    if (note.classList.contains('active')) {
      preActiveNote = note;
    };
  });

  let activeNoteElement = document.createElement("div");
  activeNoteElement.className = 'active-note';

  if(preActiveNote == activeNote) {
    preActiveNote.classList.remove('active');
    preActiveNote.removeChild(preActiveNote.childNodes[1])
  } else if (preActiveNote == null) {
    activeNote.classList.add('active');
    activeNote.appendChild(activeNoteElement)
  } else {
    preActiveNote.classList.remove('active');
    preActiveNote.removeChild(preActiveNote.childNodes[1])
    activeNote.classList.add('active');
    activeNote.appendChild(activeNoteElement)
  };
};

const activateStrokeZone = () => {
  strokeZonesList.forEach(strokeZone => {
    strokeZone.addEventListener('mouseenter', playGuitarFromStrokeZone, false);
  });
};

const deactivateStrokeZone = () => {
  strokeZonesList.forEach(strokeZone => {
    strokeZone.removeEventListener('mouseenter', playGuitarFromStrokeZone, false);
  });
};

const emphasizeChord = () => {
  let nowMainChord = chordMainSelector.value;
  let nowSubChord = chordSubSelector.value;
  let chordNoteList = null;

  let major = [0, 4, 7];
  let minor = [0, 3, 7];
  let seventh = [0, 4, 7, 10];
  let minorSeventh = [0, 3, 7, 10];
  let majorSeventh = [0, 4, 7, 11];
  let minorSeventhFlatFifth = [0, 3, 6, 10];
  let diminish = [0, 3, 6, 9];
  let susFour = [0, 5, 7];
  let seventhSusFour = [0, 5, 7, 10];
  let augment = [0, 4, 8];
  let minorSixth = [0, 3, 7, 9];  
  let seventhNineth = [0, 4, 7, 10, 14];
  let minorSeventhNineth = [0, 3, 7, 10, 14];
  let seventhThirteenth = [0, 4, 7, 10, 21];
  let addNineth = [0, 4, 7, 14];
  let sixth = [0, 4, 7, 9];
  let minorMajorSeventh = [0, 3, 7, 11];
  let sevenFlatFive = [0, 4, 6, 10];

  let chordList = [['major', major],
                   ['minor', minor],
                   ['seventh', seventh],
                   ['minor-seventh', minorSeventh],
                   ['major-seventh', majorSeventh],
                   ['minor-seventh-flat-fifth', minorSeventhFlatFifth],
                   ['diminish', diminish],
                   ['sus-four', susFour],
                   ['seventh-sus-four', seventhSusFour],
                   ['augment', augment],
                   ['minor-sixth', minorSixth],
                   ['seventh-nineth', seventhNineth],
                   ['minor-seventh-nineth', minorSeventhNineth],
                   ['seventh-thirteenth', seventhThirteenth],
                   ['add-nineth', addNineth],
                   ['sixth', sixth],
                   ['minor-major-seventh', minorMajorSeventh],
                   ['seven-flat-five', sevenFlatFive]
                  ];

  let subChord = null;

  chordList.forEach(chord => {
    if (nowSubChord == chord[0]) {
      subChord = chord[1];
    };
  });

  console.log(subChord);
 
  chordNoteList = makeEmphasizeNoteList(subChord, nowMainChord);
  
  deemphasizeChord();
  
  if (nowMainChord != 'none') {
    emphasizeNotes(chordNoteList, 'emphasize-chord');
  };
}

const deemphasizeChord = () => {
  notesList.forEach(note => {
    note.classList.remove('emphasize-chord');
    note.classList.remove('emphasize-chord-rootnote');
  })
}

keySelector.addEventListener('change', emphasizeScale, false);

scaleSelector.addEventListener('change', emphasizeScale, false);

chordMainSelector.addEventListener('change', emphasizeChord, false);

chordSubSelector.addEventListener('change', emphasizeChord, false);

modeCheckbox.addEventListener('change', () => {
  if (modeCheckbox.checked) {
    activateStrokeMode();
    activateStrokeZone();
  } else {
    deactivateStrokeMode();
    deactivateStrokeZone();
    deephasizeNotes();
  };
});

notesList.forEach(note => {
  note.addEventListener("mousedown", playGuitar, false);
});