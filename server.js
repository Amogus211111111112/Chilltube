const express = require('express');
const { YouTube } = require('youtube.js'); // youtube.js
const ytList = require('yt-list');          // yt-list

const app = express();
app.use(express.json());
app.use(express.static('public')); // фронтенд будет в папке public

const youtube = new YouTube();

// Поиск видео через youtube.js
app.get('/search', async (req, res) => {
  const q = req.query.q || 'minecraft';
  try {
    const results = await youtube.search(q, { type: 'video' });
    const videos = results.items.map(i => ({
      id: i.id,
      title: i.title,
      thumb: i.thumbnails[0]?.url || ''
    }));
    res.json(videos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка поиска видео' });
  }
});

// Пример плейлиста через yt-list
app.get('/playlist/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const pl = await ytList(id);
    const videos = pl.items.map(i => ({
      id: i.id,
      title: i.title,
      thumb: i.thumbnails[0]?.url || ''
    }));
    res.json(videos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка загрузки плейлиста' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
