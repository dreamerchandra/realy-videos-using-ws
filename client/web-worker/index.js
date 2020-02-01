import Dexie from 'dexie';


let db;
let title;
let track_no = 0;

const initDB = () => {
  db = new Dexie("video_db");
  db.version(1).stores({
    video: '++track_no, title, blob'
  });
  title = new Date().toISOString();
  db.open();
}

const appendBlob = (data) => {
  
  db.video.add(
    {
      title,
      blob: data,
    }
  )
  track_no++;
}

const getURL = () => {
  const collection = db.video.where('title').equalsIgnoreCase(title);
  return collection.sortBy('track_no', (data) => {
    return new Promise((res, rej) => {
      const blobs = data.reduce((acc, cur) => [...acc, cur.blob], [])
      console.log('blobs', blobs);
      const blob = new Blob(blobs, { type: 'video/webm'})
      res(URL.createObjectURL(blob));
    })
  })
}

onmessage = async (event) => {
  switch (event.data.type) {
    case 'init':
      initDB();
      break;
    case 'store':
      appendBlob(event.data.data);
      break;
    case 'retrieve':
      postMessage({ 'url': await getURL() })
      break;
  }
}