const { shell } = require('electron');

const scaleSelector = document.querySelector('.scale-selector');
const notesList = document.querySelectorAll('.note');
const notenamesList = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
let scaleLists = []
notenamesList.forEach(rootNote => {
  let rootNoteIndex = notenamesList.indexOf(rootNote);
  scaleLists[rootNoteIndex] = [notenamesList[(rootNoteIndex)     %12],
                               notenamesList[(rootNoteIndex + 2) %12],
                               notenamesList[(rootNoteIndex + 4) %12],
                               notenamesList[(rootNoteIndex + 5) %12],
                               notenamesList[(rootNoteIndex + 7) %12],
                               notenamesList[(rootNoteIndex + 9) %12],
                               notenamesList[(rootNoteIndex + 11)%12],
                              ];
});


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

scaleSelector.addEventListener('change', (event) => {
  let rootNoteIndex = notenamesList.indexOf(event.target.value);
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
});

const playGuitar = (note) => {
  const audio = document.getElementById(note.dataset.sound);
  audio.currentTime = 0;
  audio.play();
};
