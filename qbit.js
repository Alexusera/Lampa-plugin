(function () {
    'use strict';

    // Регистрируем плагин сразу, используя чистый стандарт Лампы
    try {
        Lampa.Plugins.add({
            id: 'qbit_remote',
            name: 'qBittorrent Remote',
            description: 'Отправка торрентов на ПК',
            version: '1.0.7',
            author: 'Mikhail',
            ready: function () {
                // Слушаем клики по торрентам только после успешной регистрации
                Lampa.Listener.follow('torrent', function (e) {
                    if (e.name === 'select' && e.element && e.element.magnet) {
                        e.ghost = true;
                        Lampa.Noty.show('Отправка на ПК...');

                        // Прячем IP-адрес глубоко внутри события, чтобы WebView не ругался при старте
                        var host = '192.168.88.247';
                        var port = '8080';
                        var qbit_url = 'http://' + host + ':' + port;

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
        });
    } catch (e) {
        console.error('qBit Plugin Error: ', e);
    }
})();
