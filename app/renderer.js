const { shell } = require('electron');

const audioContext = new AudioContext();
const gain = new GainNode(audioContext);

const keySelector = document.querySelector('.key-selector');
const scaleSelector = document.querySelector('.scale-selector');
const modeCheckbox = document.querySelector('.mode-checkbox');
const notesList = document.querySelectorAll('.note');
const strokeZonesList = document.querySelectorAll('.stroke-zone');
const notenamesList = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
let majorScaleLists = []
notenamesList.forEach(rootNote => {
  let rootNoteIndex = notenamesList.indexOf(rootNote);
  majorScaleLists[rootNoteIndex] = [notenamesList[(rootNoteIndex)     %12],
                                    notenamesList[(rootNoteIndex + 2) %12],
                                    notenamesList[(rootNoteIndex + 4) %12],
                                    notenamesList[(rootNoteIndex + 5) %12],
                                    notenamesList[(rootNoteIndex + 7) %12],
                                    notenamesList[(rootNoteIndex + 9) %12],
                                    notenamesList[(rootNoteIndex + 11)%12],
                                    ];
});
let minorScaleLists = []
notenamesList.forEach(rootNote => {
  let rootNoteIndex = notenamesList.indexOf(rootNote);
  minorScaleLists[rootNoteIndex] = [notenamesList[(rootNoteIndex)     %12],
                                    notenamesList[(rootNoteIndex + 2) %12],
                                    notenamesList[(rootNoteIndex + 3) %12],
                                    notenamesList[(rootNoteIndex + 5) %12],
                                    notenamesList[(rootNoteIndex + 7) %12],
                                    notenamesList[(rootNoteIndex + 8) %12],
                                    notenamesList[(rootNoteIndex + 10)%12],
                                    ];
});
let nowKey = '';

//Error Check
const log = require('electron-log');
process.on('uncaughtException', function(err) {
  log.error('electron:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
  app.quit();
});

notesList.forEach(note => {
  note.addEventListener('click', () => playGuitar(note));
});

keySelector.addEventListener('change', (event) => {
  nowKey = event.target.value
  let scale = scaleSelector.value;
  if(scale == 'major') {
    emphasizeScale(majorScaleLists);
  } else {
    emphasizeScale(minorScaleLists);
  }
  console.log('KeySelector.addEventListener\nscale: ' + scale);
});

scaleSelector.addEventListener('change', () => {
  if(scaleSelector.value == 'major') {
    emphasizeScale(majorScaleLists);
  } else {
    emphasizeScale(minorScaleLists);
  };
});

modeCheckbox.addEventListener('change', () => {
  //If event listeners with the same content are duplicated, the event listeners are deleted.
  activateStrokeMode();
  activateStrokeZone();
  if(!modeCheckbox.checked) {
    deephasizeNotes();
  };
});

const emphasizeScale = (scaleLists) => {
  let rootNoteIndex = notenamesList.indexOf(nowKey);
  console.log(rootNoteIndex);
  notesList.forEach(note => {
    note.classList.remove('emphasize-scale')
    note.classList.remove('emphasize-root-note')
  });

  if ((rootNoteIndex) >= 0) {
    notesList.forEach(note => {
      let notenameIndex = note.classList.length - 2;
      let notename = note.classList[notenameIndex];

      if (scaleLists[rootNoteIndex].includes(notename)) {
        if (notename ==　scaleLists[rootNoteIndex][0]) {
        note.classList.add('emphasize-root-note')
        } else {
        note.classList.add('emphasize-scale');
        };
      };
    });
  };
};

const playGuitar = (note) => {
  let oscillator = new OscillatorNode(audioContext);
  oscillator.connect(gain).connect(audioContext.destination);

  noteFreq = createNoteTable();

  let customWaveform = createCustomWave();
  oscillator.setPeriodicWave(customWaveform);
  console.log(oscillator);

  oscillator.frequency.value = noteFreq[note.dataset.num][note.dataset.key];
  oscillator.start();
  oscillator.stop(2);
};

const activateStrokeMode = () => {
  notesList.forEach(note => {
    let parentString = note.parentElement;
    let sameStringNotes = parentString.querySelectorAll('.note');
    note.addEventListener('click', function(){emphasizeActiveNote(note, sameStringNotes)});
  });
};

const emphasizeActiveNote = (note, sameStringNotes) => {
  if(note.classList.contains('active')) {
    sameStringNotes.forEach(note => {
      note.classList.remove('active');
    });
  } else {
    sameStringNotes.forEach(note => {
      note.classList.remove('active');
    });
    note.classList.add('active');
  };
};

const deephasizeNotes = () => {
  notesList.forEach(note => {
    note.classList.remove('active');
  });
};

const activateStrokeZone = () => {
  strokeZonesList.forEach(strokeZone => {
    strokeZone.addEventListener('mouseenter', function(){playGuitarFromStrokeZone(strokeZone)});
  });
};

const playGuitarFromStrokeZone = (strokeZone) => {
  let stringName = strokeZone.classList[0];
  let activeNote = document.querySelector(`.${stringName} .active`);
  if(activeNote){
    playGuitar(activeNote);
  };
};

const createNoteTable = () => {
  let notenamesList = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  let noteFreq = [];
  for (let i=0; i< 9; i++) {
    noteFreq[i] = [];
  };
  let initFreq = 16.351597831287414;

  for (let i=0; i<9; i++) {
    notenamesList.forEach(note => {
      if (note == 'C' && i == 0) {
        noteFreq[i][note] = initFreq;
      } else {
        noteFreq[i][note] = tmpFreq * (2 ** (1/12));
      };
      tmpFreq = noteFreq[i][note];
    });
  }
  return noteFreq;
};

const createCustomWave = () => {
  sineTerms = new Float32Array([0, 1, 0.68, 0.19, 0.03, 0.08]);
  cosineTerms = new Float32Array(sineTerms.length);
  customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);
  return customWaveform;
}