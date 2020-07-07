const { shell } = require('electron');
const { PythonShell } = require('python-shell');

const keys = document.querySelectorAll('.key')

//Error Check
const log = require('electron-log');
process.on('uncaughtException', function(err) {
  log.error('electron:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
  app.quit();
});

keys.forEach(key => {
  key.addEventListener('click', () => playPiano(key))
})

const playPiano = (key) => {
  const audio = document.getElementById(key.dataset.sound)
  audio.currentTime = 0
  audio.play()
}