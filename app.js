// --- PWA Service Worker登録 ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// --- CLIエンジン ---
const output = document.getElementById('output');
const form = document.getElementById('cli-form');
const input = document.getElementById('cli-input');

let memory = {}; // メモ帳内容 {ファイル名: 内容}

function print(msg) {
  output.textContent += msg + '\n';
  output.scrollTop = output.scrollHeight;
}

function listFiles() {
  const files = Object.keys(memory).length ? Object.keys(memory).join('\n') : '（ファイルなし）';
  print('ファイル一覧:\n' + files);
}

function saveFile(args) {
  const [filename, ...contentArr] = args.split(' ');
  if (!filename) {
    print('使い方: SAVE ファイル名');
    return;
  }
  const content = prompt('保存する内容を入力してください（日本語可）:', '');
  if (content !== null) {
    memory[filename] = content;
    localStorage.setItem('n88memo', JSON.stringify(memory));
    print(`"${filename}" を保存しました。`);
  }
}

function loadFile(args) {
  const filename = args.trim();
  if (!filename) {
    print('使い方: LOAD ファイル名');
    return;
  }
  if (memory[filename]) {
    print(`"${filename}" の内容:\n` + memory[filename]);
  } else {
    print('ファイルがありません。');
  }
}

function deleteFile(args) {
  const filename = args.trim();
  if (!filename) {
    print('使い方: DELETE ファイル名');
    return;
  }
  if (memory[filename]) {
    delete memory[filename];
    localStorage.setItem('n88memo', JSON.stringify(memory));
    print(`"${filename}" を削除しました。`);
  } else {
    print('ファイルがありません。');
  }
}

function help() {
  print(
    'コマンド一覧:\n' +
    'SAVE ファイル名 ... メモを保存\n' +
    'LOAD ファイル名 ... メモを表示\n' +
    'LIST ... ファイル一覧\n' +
    'DELETE ファイル名 ... ファイル削除\n' +
    'HELP ... コマンド一覧表示\n' +
    'CLEAR ... 画面クリア'
  );
}

function clearScreen() {
  output.textContent = '';
}

function handleCommand(cmd) {
  const [command, ...argsArr] = cmd.trim().split(' ');
  const args = argsArr.join(' ');
  switch (command.toUpperCase()) {
    case 'SAVE':
      saveFile(args);
      break;
    case 'LOAD':
      loadFile(args);
      break;
    case 'LIST':
      listFiles();
      break;
    case 'DELETE':
      deleteFile(args);
      break;
    case 'HELP':
      help();
      break;
    case 'CLEAR':
      clearScreen();
      break;
    case '':
      // 何もしない
      break;
    default:
      print('不明なコマンドです。HELP で一覧表示');
  }
}

// --- ロード時の初期化 ---
window.onload = () => {
  // ローカルストレージから読み込み
  const data = localStorage.getItem('n88memo');
  if (data) {
    memory = JSON.parse(data);
  }
  print('N88BASIC風メモ帳へようこそ！\n日本語入力可。HELP でコマンド一覧表示');
};

// --- コマンド入力イベント ---
form.onsubmit = (e) => {
  e.preventDefault();
  const cmd = input.value;
  print('> ' + cmd);
  handleCommand(cmd);
  input.value = '';
};
