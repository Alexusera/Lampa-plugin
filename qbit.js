(function () {
    'use strict';

    function startQbitRemote() {
        var qbit_url = 'http://192.168.88.247:8080';

        // Стандартная регистрация плагина, которую парсер Лампы гарантированно считает
        Lampa.Plugins.add({
            id: 'qbit_remote',
            name: 'qBittorrent Remote',
            description: 'Отправка торрентов на ПК',
            version: '1.0.4',
            author: 'Mikhail'
        });

        // Слушатель событий торрента
        Lampa.Listener.follow('torrent', function (e) {
            if (e.name === 'select' && e.element && e.element.magnet) {
                e.ghost = true; // Блокируем стандартный плеер Лампы
                Lampa.Noty.show('Отправка на ПК...');

                var boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
                var xhr = new XMLHttpRequest();
                
                xhr.open('POST', qbit_url + '/api/v2/torrents/add', true);
                xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

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

    // Официальный метод инициализации расширений в Лампе
    if (window.Lampa) {
        startQbitRemote();
    } else {
        window.plugin_qbit_remote_ready = startQbitRemote;
    }
})();
