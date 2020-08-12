//synth音源
let synth = new Tone.PolySynth().toMaster();

//1.メロディのリストは配列作成(配列で設定した順番に音が鳴るんだよ)
//要素ごとに1拍でカウントされているので、配列の中に更に配列を入れると、1拍内でそのメロディーを全て再生する
let kaeru = ['C5','D5','E5','F5','E5','D5','C5',null,'E5','F5','G5','A5','G5','F5','E5',null,'C5',null,'C5',null,'C5',null,'C5',null,['C5','C5'],['D5','D5'],['E5','E5'],['F5','F5'],'E5','D5','C5']; 
//「null」で休符を設定できる

//1.メロディのリストは配列作成(配列で設定した順番に音が鳴るんだよ)
let CM=["C3","E3","G3","C4"];
let kaerusuper = [
  ['0:0:0',["C4","E4","G4","C5"]],
  ['0:1:0',"D5"],
  ['0:2:0',["E4","G4","B4","E5"]],//←単音を使うこともできる
  ['0:3:0',"F5"],
  ['1:0:0',["C4","E5"]],
  ['1:0:1',"G4"],
  ['1:0:2',"B4"],
  ['1:0:3',"E5"],
  ['1:1:0',["G4","D5"]],
  ['1:2:0',["C3","E4","G4","C5"]],
  ['1:2:0.5',"B4"],
  ['1:2:1',"A4"],
  ['1:2:1.5',"G4"],
  ['1:2:2',"F4"],
  ['1:2:2.5',"E4"],
  ['1:2:3',"D4"],
  ['1:2:3.5',"C4#"],
  ['1:3:0',CM]//変数も使用できるよ☆
];

//timeの絶対値で指定しているため、BPM変更の影響を受けない。
//J●Lの世界時計と照らし合わせてみても、ぴったり1秒ごとに音が発しているよ。
let kaerusuper_time = [{"time": 0, "note":["C4","E4","G4","C5"], "duration": "4n"},//←変数の指定はできる
         {"time": 1, "note": "D5", "duration": "4n"},
         {"time": 2, "note":["E4","G4","B4","E5"], "duration": "4n"},//←個別和音と変数を同時に指定することはできない
         {"time": 3, "note": "F5", "duration": "4n"},
         {"time": 4, "note": "E5", "duration": "8n"},
         {"time": 4.25, "note": "C5", "duration": "8n"},
         {"time": 4.5, "note": "D5", "duration": "8n"},
         {"time": 4.75, "note": "E5", "duration": "8n"},
         {"time": 5, "note": "D5", "duration": "4n"},
         {"time": 6, "note": "C5", "duration": "4n"},
         ];

function playkaerusuper_time(){
    let part = new Tone.Part(function(time, note){
        //the notes given as the second element in the array
        //will be passed in as the second argument
        synth.triggerAttackRelease(note.note, note.duration, time);
    }, kaerusuper_time).start(0);
};

//2．関数を作成
function kaeruPlay(time, note) {
    synth.triggerAttackRelease(note, '4n', time);
}

$("#tonejs_kaeru").on("click",function(){
    let melody = new Tone.Sequence(kaeruPlay, kaeru).start()
  //繰り返し回数を2回に設定(繰り返し回数を指定しないと無限にループする)
    melody.loop = 2
});

function kaeruPlay_8n(time, note) {
    synth.triggerAttackRelease(note, '8n', time);
}

$("#tonejs_kaerusuper").on("click",function(){
    let kaerusuper_play = new Tone.Part(kaeruPlay_8n, kaerusuper).start();
   //loopendはデフォルトで1mになっているので、伸ばす
  kaerusuper_play.loopEnd="5m";
});

$("#tonejs_kaerusuper_time").on("click",function(){
  playkaerusuper_time();
});

$("#transport_start").on("click",function(){
    Tone.Transport.start();
});

//BPMを120に設定
Tone.Transport.bpm.value = 90;

$("#transport_stop").on("click",function(){
   Tone.Transport.stop();//←transportをストップ
});

$("#transport_stop_delete").on("click",function(){
   Tone.Transport.stop();//←transportをストップ
   Tone.Transport.cancel();//transport上のイベントを削除している
});