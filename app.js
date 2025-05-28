// --- PWA Service Worker登録 ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// --- ファイル管理用 ---
const filenameInput = document.getElementById('filename');
const editor = document.getElementById('editor');
const filelist = document.getElementById('filelist');

const STORAGE_KEY = 'n88basic_files';

// ファイルリスト取得
function getFiles() {
  const files = localStorage.getItem(STORAGE_KEY);
  return files ? JSON.parse(files) : {};
}

// ファイルリスト保存
function saveFiles(files) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

// ファイルリスト更新
function updateFileList() {
  const files = getFiles();
  filelist.innerHTML = '';
  Object.keys(files).forEach(fname => {
    const opt = document.createElement('option');
    opt.value = fname;
    opt.textContent = fname;
    filelist.appendChild(opt);
  });
}

// 新規作成
function newFile() {
  filenameInput.value = '';
  editor.value = '';
  filelist.selectedIndex = -1;
}

// 保存
function saveFile() {
  const fname = filenameInput.value.trim();
  if (!fname) {
    alert('ファイル名を入力してください');
    filenameInput.focus();
    return;
  }
  const files = getFiles();
  files[fname] = editor.value;
  saveFiles(files);
  updateFileList();
  alert(`"${fname}" を保存しました`);
}

// 読込
function loadFile() {
  const fname = filenameInput.value.trim() || filelist.value;
  if (!fname) {
    alert('ファイル名を入力するか、リストから選択してください');
    return;
  }
  const files = getFiles();
  if (files[fname] !== undefined) {
    editor.value = files[fname];
    filenameInput.value = fname;
    filelist.value = fname;
  } else {
    alert('ファイルが存在しません');
  }
}

// 削除
function deleteFile() {
  const fname = filenameInput.value.trim() || filelist.value;
  if (!fname) {
    alert('ファイル名を入力するか、リストから選択してください');
    return;
  }
  const files = getFiles();
  if (files[fname] !== undefined) {
    if (confirm(`"${fname}" を削除しますか？`)) {
      delete files[fname];
      saveFiles(files);
      updateFileList();
      if (filelist.options.length) {
        filelist.selectedIndex = 0;
        filenameInput.value = filelist.value;
        editor.value = files[filelist.value] || '';
      } else {
        newFile();
      }
    }
  } else {
    alert('ファイルが存在しません');
  }
}

// ファイルリストから選択時
filelist.addEventListener('change', () => {
  filenameInput.value = filelist.value;
  loadFile();
});

// ボタンイベント
document.getElementById('new-btn').onclick = newFile;
document.getElementById('save-btn').onclick = saveFile;
document.getElementById('load-btn').onclick = loadFile;
document.getElementById('delete-btn').onclick = deleteFile;

// 初期化
window.onload = () => {
  updateFileList();
  newFile();
};
