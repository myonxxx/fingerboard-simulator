let fingerBoard = document.querySelector('.fingerboard');

const makeFingerboard = () => {
  let firstStringElement  = makeString('4', 'E');
  let secondStringElement = makeString('3', 'B');
  let thirdStringElement  = makeString('3', 'G');
  let fourthStringElement = makeString('3', 'D');
  let fifthStringElement  = makeString('2', 'A');
  let sixthStringElement  = makeString('2', 'E');
  
  firstStringElement.className = "first string"
  secondStringElement.className = "second string"
  thirdStringElement.className = "third string"
  fourthStringElement.className = "fourth string"
  fifthStringElement.className = "fifth string"
  sixthStringElement.className = "sixth string"

  fingerBoard.appendChild(firstStringElement);
  fingerBoard.appendChild(secondStringElement);
  fingerBoard.appendChild(thirdStringElement);
  fingerBoard.appendChild(fourthStringElement);
  fingerBoard.appendChild(fifthStringElement);
  fingerBoard.appendChild(sixthStringElement);
}

const makeString = (firstOctave, firstNote) => {
  let octave = firstOctave;
  let stringLength = 24;
  let scaleLength = 12;
  let stringElement = document.createElement("div");
  let notesnameList = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  let firstNoteIndex = notesnameList.indexOf(firstNote);

  for (let i = 0; i < stringLength; i++) {
    let note = notesnameList[(firstNoteIndex + i) % scaleLength];
    if(note == 'C' && i != 0) {
      octave = String(Number(octave) + 1);
    }
    let noteElement = makeNote(octave, note);
    stringElement.appendChild(noteElement);
  };

  return stringElement;
};

const makeNote = (octave, note) => {
  let notesFullnameList = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F',
                       'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
  let notesnameList = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  let noteIndex = notesnameList.indexOf(note);
  let noteFullname = notesFullnameList[noteIndex];
  let keyElement = document.createElement("div");
  let labelElement = document.createElement("div");

  keyElement.className = "key";
  keyElement.dataset["octave"] = octave;
  keyElement.dataset["note"] = note;

  labelElement.className = "label-div"
  labelElement.innerHTML = noteFullname;

  keyElement.appendChild(labelElement);

  return keyElement;
};

makeFingerboard();