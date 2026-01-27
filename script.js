
  // Ваш Mapbox токен
  mapboxgl.accessToken = 'pk.eyJ1IjoiZGltODEyOTUiLCJhIjoiY2x6eWp4d2JrMGc1bTJtb3J2dXVwM3AwaiJ9.hRZZSsWhuK1_HOCA8HGIWA';

  // Функция загрузки данных из JSON-файла
  function loadMarkers() {
    return fetch('./markers.json')
      .then(response => response.json())
      .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
        return [];
      });
  }

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

  // Получаем элемент списка маркеров
  const markerListContent = document.getElementById('marker-list-content');

  // Загружаем маркеры из JSON-файла и добавляем их на карту
  loadMarkers().then(locations => {
    locations.forEach((location, index) => {
      // Добавляем маркер
      const marker = new mapboxgl.Marker({ color: location.color })
        .setLngLat(location.coordinates)
        .addTo(map);
        

      // Создаем попап
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
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false}).setHTML(popupContent);
      marker.setPopup(popup);

      // Добавляем название маркера в список
      const listItem = document.createElement('li');
      listItem.textContent = `${index+1}. ${location.name}` ;

      // Добавляем событие клика по элементу списка
      listItem.addEventListener('click', () => {
        map.flyTo({ center: location.coordinates, zoom: 12 });
      });

      markerListContent.appendChild(listItem);
    });
  });
  // Ограничим карту рамками Архангельской области
// bbox: [minLng, minLat, maxLng, maxLat]
const arkhangelskBounds = [
  [36.0, 59.0], // юго-запад
  [53.0, 68.0]  // северо-восток
];

map.setMaxBounds(arkhangelskBounds);

