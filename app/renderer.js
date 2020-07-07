const { shell } = require('electron');
const { PythonShell } = require('python-shell');

const scaleSelector = document.querySelector('.scale-selector');
const keys = document.querySelectorAll('.key');
const scales = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const CAmScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const myEval = (convertString) => {
  Function(convertString)();
}
scales.forEach(scale => {
  myEval(`${scale}Keys = document.querySelectorAll('.${scale}')`);
});

//Error Check
const log = require('electron-log');
process.on('uncaughtException', function(err) {
  log.error('electron:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
  app.quit();
});

keys.forEach(key => {
  key.addEventListener('click', () => playPiano(key));
});

scaleSelector.addEventListener('change', (event) => {
  console.log(event);
  console.log(event.target.value);
  CAmScale.forEach(note => {
    eval(`${note}Keys.forEach(note => {
      note.classList.add('emphasize-scale');
    });`)
  });
});

const playPiano = (key) => {
  const audio = document.getElementById(key.dataset.sound);
  audio.currentTime = 0;
  audio.play();
};
