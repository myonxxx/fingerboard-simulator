const { shell } = require('electron');

const keySelector = document.querySelector('.key-selector');
const scaleSelector = document.querySelector('.scale-selector');
const notesList = document.querySelectorAll('.note');
const firstStrokeZone = document.querySelector('#first-stroke-zone')
const secondStrokeZone = document.querySelector('#second-stroke-zone')
const thirdStrokeZone = document.querySelector('#third-stroke-zone')
const fourthStrokeZone = document.querySelector('#fourth-stroke-zone')
const fifthStrokeZone = document.querySelector('#fifth-stroke-zone')
const sixthStrokeZone = document.querySelector('#sixth-stroke-zone')
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

notesList.forEach(note => {
  note.addEventListener('click', () => {
    let parentString = note.parentElement;
    let sameStringNotes = parentString.querySelectorAll('.note');
    sameStringNotes.forEach(note => {
      note.classList.remove('active');
    });
    note.classList.add('active');
  });
});

firstStrokeZone.addEventListener('mouseenter', () => {
  let activeNote = document.querySelector('.first-string .active');
  if(activeNote){
    playGuitar(activeNote);
  };
});

secondStrokeZone.addEventListener('mouseenter', () => {
  let activeNote = document.querySelector('.second-string .active');
  if(activeNote){
    playGuitar(activeNote);
  };
});

thirdStrokeZone.addEventListener('mouseenter', () => {
  let activeNote = document.querySelector('.third-string .active');
  if(activeNote){
    playGuitar(activeNote);
  };
});

fourthStrokeZone.addEventListener('mouseenter', () => {
  let activeNote = document.querySelector('.fourth-string .active');
  if(activeNote){
    playGuitar(activeNote);
  };
});

fifthStrokeZone.addEventListener('mouseenter', () => {
  let activeNote = document.querySelector('.fifth-string .active');
  if(activeNote){
    playGuitar(activeNote);
  };
});

sixthStrokeZone.addEventListener('mouseenter', () => {
  let activeNote = document.querySelector('.sixth-string .active');
  if(activeNote){
    playGuitar(activeNote);
  };
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
  }
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
  const audio = document.getElementById(note.dataset.sound);
  audio.currentTime = 0;
  audio.play();
};
