const worker = new Worker('./web-worker/index.js');

async function steamData () {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const options = { mimeType: 'video/webm' };
  worker.postMessage({ type: 'init' });
  const mediaRecorder = new MediaRecorder(stream, options);
  mediaRecorder.addEventListener('dataavailable', (e) => {
    worker.postMessage({ type: 'store', data: e.data });
  });
  mediaRecorder.start(250);
}

window.worker = worker;

const createVideoURL = () => {
  worker.onmessage = ({ data }) => {
    console.log(data.url)
    document.getElementById('videoUrl').innerText = data.url;
    document.getElementById('videoUrl').href = data.url;
  }
  worker.postMessage({ type: 'retrieve' })
}
  

const start = document.getElementById('start');
start.onclick = steamData;

const stop = document.getElementById('stop');
stop.onclick = createVideoURL;