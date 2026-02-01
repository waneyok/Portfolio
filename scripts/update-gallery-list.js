/**
 * Скрипт обновляет assets/group/images.json — список всех фото в папке assets/group.
 * Запускайте после добавления новых фото: node scripts/update-gallery-list.js
 * Тогда в модальном окне галереи появятся все новые фото (при следующем открытии модалки).
 */

const fs = require('fs');
const path = require('path');

const GROUP_DIR = path.join(__dirname, '..', 'assets', 'group');
const OUTPUT_FILE = path.join(GROUP_DIR, 'images.json');
const IMAGE_EXT = /\.(jpg|jpeg|png|webp|gif)$/i;

try {
  const files = fs.readdirSync(GROUP_DIR);
  const images = files
    .filter(f => IMAGE_EXT.test(f) && f !== 'images.json')
    .sort();

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(images, null, 2), 'utf8');
  console.log('✅ Обновлено: assets/group/images.json, фото:', images.length);
} catch (err) {
  console.error('Ошибка:', err.message);
  process.exit(1);
}
