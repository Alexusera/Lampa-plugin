/**
 * @plugin qbit_remote
 * @title qBittorrent Remote
 * @description Отправка торрентов на ПК
 * @version 1.0.9
 * @author Mikhail
 */

(function () {
    'use strict';

    function startPlugin() {
        var qbit_url = 'http://192.168.88.247:8080';

        // 1. Регистрируем плагин в системе, чтобы Лампа видела его статус
        Lampa.Plugins.add({
            id: 'qbit_remote',
            name: 'qBittorrent Remote',
            description: 'Отправка торрентов на ПК',
            version: '1.0.9',
            author: 'Mikhail'
        });

        // 2. Перехватываем клик по торренту
        Lampa.Listener.follow('torrent', function (e) {
            // Если пользователь выбрал торрент (select) и у него есть магнет-ссылка
            if (e.name === 'select' && e.element && e.element.magnet) {
                
                // e.ghost = true запрещает Лампе запускать стандартный плеер
                e.ghost = true; 
                
                Lampa.Noty.show('Отправка на ПК...');

                // Формируем FormData запрос к API qBittorrent
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
                    Lampa.Noty.show('Ошибка сети. Проверьте WebUI на ПК.');
                };

                xhr.send(body);
            }
        });
    }

    // Ждем полной готовности приложения Лампа перед запуском логики
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.name === 'ready') startPlugin();
        });
    }
})();
