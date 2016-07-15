Array.prototype.toURL = function() {
    return this.join('/');
};

var toQueryString = function(obj) {
    var out = new Array();
    for (key in obj) {
        out.push(key + '=' + encodeURIComponent(obj[key]));
    }
    return out.join('&');
};

angular.module('CoreApi', ['CoreApiUtilities'])

.constant('lagConfig', {
    appName: 'Linkagoal',
    appVersion: '2.0.0',
    apiUrl: 'http://autotek.virtualsoftlab.com/api/',

})

.factory('httpService', ['$http', 'lagConfig', 'Utils', function($http, lagConfig, Utils) {
    return {
        $http: $http,
        lagConfig: lagConfig,
        Utils: Utils
    }
}])

angular.module('CoreApiUtilities', [])

.factory('Utils', ['lagConfig', 'localStorageService', function(lagConfig, localStorageService) {

    var makeHeader = function() {
        var sessionUser = localStorageService.get('loggedInUser');
        if (sessionUser != null) {
            return config = {
                headers: {
                    'x-client-id': sessionUser.credentials.client_id,
                    'token': sessionUser.credentials.token,
                    'x-api-signature': '',
                    "x-api-version": "1.0",
                }
            };
        } else {
            return config = {
                headers: { "x-api-version": "1.0" }
            };
        }
    }

    var defaultOffsetLimit = { offset: 0, limit: 5 }

    var buildUrl = function(urlSet, queryStringSet, isFileServer) {
        var isFileServer = isFileServer || false;
        queryStringSet = queryStringSet || false;

        if (!isFileServer) {
            var url = lagConfig.apiUrl;
        } else {
            var url = lagConfig.fileApi;
        }

        if (Object.prototype.toString.call(urlSet) === '[object Array]') {
            url += urlSet.toURL();
        }

        if (queryStringSet !== false) {
            url += '?' + toQueryString(queryStringSet);
        }
        return url;
    }

    return {
        getHeader: makeHeader,
        buildUrl: buildUrl,
        defaultOffsetLimit: defaultOffsetLimit
    };
}])
