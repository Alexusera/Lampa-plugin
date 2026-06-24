(function () {
    'use strict';

    // Укажите адрес вашего ПК с qBittorrent
    var qbit_url = 'http://192.168.88.247:8080'; 

    function addTorrent(magnetUrl) {
        var addUrl = qbit_url + '/api/v2/torrents/add';
        var boundary = '---------------------------' + Date.now();
        var xhr = new XMLHttpRequest();
        
        xhr.open('POST', addUrl, true);
        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
        xhr.withCredentials = true;

        var body = '--' + boundary + '\r\n' +
                   'Content-Disposition: form-data; name="urls"\r\n\r\n' +
                   magnetUrl + '\r\n' +
                   '--' + boundary + '\r\n' +
                   'Content-Disposition: form-data; name="sequentialDownload"\r\n\r\n' +
                   'true\r\n' +
                   '--' + boundary + '\r\n' +
                   'Content-Disposition: form-data; name="firstLastPiecePrio"\r\n\r\n' +
                   'true\r\n' +
                   '--' + boundary + '--\r\n';

        xhr.onload = function () {
            if (xhr.status === 200 || xhr.responseText === 'Ok.') {
                Lampa.Noty.show('Успешно отправлено в qBittorrent!');
            } else {
                Lampa.Noty.show('Ошибка добавления: ' + xhr.status + '. Проверьте, включен ли WebUI на ПК.');
            }
        };

        xhr.onerror = function () {
            Lampa.Noty.show('Не удалось связаться с ПК. Проверьте IP-адрес.');
        };

        xhr.send(body);
    }

    function startPlugin() {
        Lampa.Listener.follow('torrent', function (e) {
            if (e.name === 'select' && e.element && e.element.magnet) {
                e.ghost = true; // Блокируем ошибку андроида
                Lampa.Noty.show('Отправка на ПК...');
                addTorrent(e.element.magnet);
            }
        });
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', function (e) { if (e.name === 'ready') startPlugin(); });
})();
