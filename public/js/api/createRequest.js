/**
 * Основная функция для совершения запросов
 * на сервер.
 * */


const defaultCallback = (err, response) => {
    if (err) {
        console.log('Произошла ошибка: ', err);
    } else {
        console.log('Данные: ', response);
    }
}

const createOptions = (url, method, data = null, callback) => ({ url, method, data, callback });

const createRequest = (options) => {
    const xhr = new XMLHttpRequest;
    let url = options.url;
    let body = null;

    if (options.method === 'GET') {
        
        if (options.data) {
            const queryString = new URLSearchParams(options.data).toString();
            url += '?' + queryString;
        }

    } else {
        const formData = new FormData;

        for (let key in options.data) {
            formData.append(key, options.data[key]);
        }

        body = formData;
    }

    xhr.open(options.method, url, true);
    xhr.responseType = 'json';

    xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            options.callback(null, xhr.response);
        } else {
            options.callback(xhr.status, null);
        }
    });

    xhr.addEventListener('error', () => {
        options.callback(new Error('Запрос не удался'), null);
    });

    xhr.send(body);
};