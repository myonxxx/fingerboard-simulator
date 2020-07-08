const { shell } = require('electron');
const { PythonShell } = require('python-shell');
var _ = require('lodash');

const scaleSelector = document.querySelector('.scale-selector');
const keys = document.querySelectorAll('.key');
const scales = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const CAmScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

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
  keys.forEach(key => {
    console.log(_.intersection([key.classList[key.classList.length - 2]], CAmScale)[0])
    if (_.intersection([key.classList[key.classList.length - 2]], CAmScale)[0]) {
      key.classList.add('emphasize-scale');
    }
  });
});

const playPiano = (key) => {
  const audio = document.getElementById(key.dataset.sound);
  audio.currentTime = 0;
  audio.play();
};
