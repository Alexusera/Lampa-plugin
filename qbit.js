(function () {
    'use strict';

    function startPlugin() {
        var qbit_url = 'http://192.168.88.247:8080';

        // Регистрируем плагин в системе Лампы
        Lampa.Plugins.add({
            id: 'qbit_remote',
            name: 'qBittorrent Remote',
            description: 'Отправка торрентов на ПК',
            version: '1.0.3',
            author: 'Mikhail'
        });

        // Отслеживаем клик по торренту
        Lampa.Listener.follow('torrent', function (e) {
            if (e.name === 'select' && e.element && e.element.magnet) {
                e.ghost = true; // Отменяем стандартный запуск плеера
                Lampa.Noty.show('Отправка на ПК...');

                // Генерируем boundary старым методом без ES6-строк
                var boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
                var xhr = new XMLHttpRequest();
                
                xhr.open('POST', qbit_url + '/api/v2/torrents/add', true);
                xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

                // Собираем тело запроса обычной конкатенацией строк (+)
                var body = '--' + boundary + '\r\n' +
                           'Content-Disposition: form-data; name="urls"\r\n\r\n' +
                           e.element.magnet + '\r\n' +
                           '--' + boundary + '--\r\n';

                xhr.onload = function () {
                    if (xhr.status === 200 || xhr.responseText === 'Ok.') {
                        Lampa.Noty.show('Успешно отправлено!');
                    } else {
                        Lampa.Noty.show('Ошибка qBit: ' + xhr.status);
                    }
                };

                xhr.onerror = function () {
                    Lampa.Noty.show('Ошибка сети. Проверьте ПК.');
                };

                xhr.send(body);
            }
        });
    }

    // Запуск строго по готовности приложения
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.name === 'ready') startPlugin();
        });
    }
})();
