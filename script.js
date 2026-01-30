

// Ваш Mapbox токен
mapboxgl.accessToken = 'pk.eyJ1IjoiZGltODEyOTUiLCJhIjoiY2x6eWp4d2JrMGc1bTJtb3J2dXVwM3AwaiJ9.hRZZSsWhuK1_HOCA8HGIWA';

// Создаем карту
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/dim81295/cltqxac7z00c501qwdrx0g501',
  center: [42.095701, 61.083111],
  zoom: 9
});


// Руссификация карты
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js');
map.addControl(new MapboxLanguage({ defaultLanguage: 'ru' }));

// Добавляем ползунок масштаба
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

// Ограничим карту рамками Архангельской области
const arkhangelskBounds = [
  [36.0, 59.0], // юго-запад
  [53.0, 68.0]  // северо-восток
];
map.setMaxBounds(arkhangelskBounds);


// Получаем элементы поиска и списка
const markerListContent = document.getElementById('marker-list__content');
const searchInput = document.querySelector('.marker-list__search');

// Функция загрузки данных из JSON
async function loadMarkers() {
  try {
    const response = await fetch('./markers.json');

    if (!response.ok) {
      throw new Error(`HTTP ошибка: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return [];
  }
}

// Массив для хранения маркеров и элементов списка
const markersOnMap = [];

loadMarkers().then(locations => {
  locations.forEach((location, index) => {
    // Создаем маркер
    const marker = new mapboxgl.Marker({ color: location.color })
      .setLngLat(location.coordinates)
      .addTo(map);

    // Попап
    const popupContent = `
      <div style="max-width: 300px;">
        <img src="${location.image}" style="width: 100%; border-radius: 6px; margin-bottom: 8px;">
        <strong>${location.name}</strong><br>
        ${location.road}<br><br>
        <strong>Длина:</strong> ${location.length} <br>
        <strong>Материал:</strong> ${location.material}<br>
        <strong>Год постройки:</strong> ${location.year}<br>
        <strong>Категория дороги:</strong> ${location.category}
      </div>
    `;
    const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(popupContent);
    marker.setPopup(popup);

    // Элемент списка
    const listItem = document.createElement('li');
    listItem.classList.add('marker-list__item')
    listItem.textContent = `${location.name}`;
    listItem.style.cursor = 'pointer';
    listItem.addEventListener('click', () => {
      map.flyTo({ center: location.coordinates, zoom: 12 });
      marker.togglePopup();
    });

    markerListContent.appendChild(listItem);

    markersOnMap.push({
      marker,
      listItem,
      name: location.name.toLowerCase()
    });
  });
});

// Поиск по списку и маркерам
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();

  markersOnMap.forEach(item => {
    const match = item.name.includes(query);
    item.listItem.style.display = match ? '' : 'none';
    item.marker.getElement().style.display = match ? '' : 'none';
  });
});

