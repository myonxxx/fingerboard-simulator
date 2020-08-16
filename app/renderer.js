const { shell } = require('electron');
const Tone = require('tone');

const keySelector = document.querySelector('.key-selector');
const scaleSelector = document.querySelector('.scale-selector');
const modeCheckbox = document.querySelector('.mode-checkbox');
const notesList = document.querySelectorAll('.note');
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

keySelector.addEventListener('change', () => {
  emphasizeScale();
});

scaleSelector.addEventListener('change', () => {
  emphasizeScale();
});

modeCheckbox.addEventListener('change', () => {
  //If event listeners with the same content are duplicated, the event listeners are deleted.
  activateStrokeMode();
  activateStrokeZone();
  if(!modeCheckbox.checked) {
    deephasizeNotes();
  };
});

const playGuitar = (event) => {
  let dataset = event.target.dataset
  let note = dataset["note"]
  playSound(note);
};

const playGuitarFromStrokeZone = (strokeZone) => {
  let stringName = strokeZone.classList[0];
  let activeNote = document.querySelector(`.${stringName} .active`);
  if (activeNote) {
    let dataset = activeNote.dataset
    let note = dataset["note"]
    playSound(note);
  }
};

const playSound = (note) => {
  synth.triggerAttackRelease(note, '8n');
};

notesList.forEach(note => {
  note.addEventListener('mousedown', playGuitar, false);
});

const emphasizeScale = () => {
  let nowKey = keySelector.value;
  let nowScale = scaleSelector.value;
  let notesnameList = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  let nowKeyIndex = notesnameList.indexOf(nowKey);
  let scale = [];
  if (nowScale == 'major') {
    scale = [notesnameList[(nowKeyIndex)     %12],
             notesnameList[(nowKeyIndex + 2) %12],
             notesnameList[(nowKeyIndex + 4) %12],
             notesnameList[(nowKeyIndex + 5) %12],
             notesnameList[(nowKeyIndex + 7) %12],
             notesnameList[(nowKeyIndex + 9) %12],
             notesnameList[(nowKeyIndex + 11)%12],
            ];

  } else {
    scale = [notesnameList[(nowKeyIndex)     %12],
             notesnameList[(nowKeyIndex + 2) %12],
             notesnameList[(nowKeyIndex + 3) %12],
             notesnameList[(nowKeyIndex + 5) %12],
             notesnameList[(nowKeyIndex + 7) %12],
             notesnameList[(nowKeyIndex + 8) %12],
             notesnameList[(nowKeyIndex + 10)%12],
           ];
  };

  deephasizeNotes()

  if (nowKey != 'none') {
    scale.forEach(emphasizeNote => {
      notesList.forEach(note => {
        if (nowKey == note.dataset["simpleNote"]) {
          note.classList.add('emphasize-root-note');
        } else if (emphasizeNote == note.dataset["simpleNote"]) {
          note.classList.add('emphasize-scale');
        };
      });
    });
  };
}

const deephasizeNotes = () => {
  notesList.forEach(note => {
    note.classList.remove('active');
    note.classList.remove('emphasize-scale');
    note.classList.remove('emphasize-root-note');
  });
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

const activateStrokeZone = () => {
  strokeZonesList.forEach(strokeZone => {
    strokeZone.addEventListener('mouseenter', function(){playGuitarFromStrokeZone(strokeZone)});
  });
};

