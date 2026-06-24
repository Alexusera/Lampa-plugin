/**
 * @plugin qbit_remote
 * @title qBittorrent Remote
 * @description Отправка торрентов на ПК
 * @version 1.0.5
 * @author Mikhail
 */

(function () {
    'use strict';

    // Простейшая инициализация плагина для проверки
    Lampa.Plugins.add({
        id: 'qbit_remote',
        name: 'qBittorrent Remote',
        description: 'Отправка торрентов на ПК',
        version: '1.0.5',
        author: 'Mikhail',
        ready: function() {
            console.log('qBit Remote Ready');
        }
    });
})();
