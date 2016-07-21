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
    appName: 'Autotek',
    appVersion: '1.0.0',
    apiAuthUrl: 'http://autotecauth.azurewebsites.net/',
    apiUrl: 'http://autotecapi.azurewebsites.net/'

})

.factory('httpService', ['$http', 'lagConfig', 'Utils', function($http, lagConfig, Utils) {
    return {
        $http: $http,
        lagConfig: lagConfig,
        Utils: Utils
    }
}])

.service('User', ['httpService', function(httpService) {
    this.login = function(param) {
        var params = httpService.Utils.getStringParams(param);
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('identity', 'connect', 'token'), '', true);
        return httpService.$http.post(url, params, config);
    }

    this.getUser = function() {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('api', 'Customer'));
        return httpService.$http.get(url, config);
    }

    this.getOrderHistory = function(pageNumber, pageSize) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('api', 'CustomerOrder',pageNumber,pageSize));
        return httpService.$http.get(url, config);
    }
}])


.service('Appointment', ['httpService', function(httpService) {
    this.get = function(pageNumber,pageSize) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('api', 'CustomerAppointments', pageNumber, pageSize));
        return httpService.$http.get(url, config);
    }

    this.getBranches = function(cityId) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('api', 'Branches', cityId));
        return httpService.$http.get(url, config);
    }

    this.getAvailableDays = function(branchId,year,month) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('api', 'AvailableAppointmentDays', branchId, year, month));
        return httpService.$http.get(url, config);
    }

    this.getAvailableSlots = function(branchId,year,month,day) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('api', 'AvailableAppointmentSlots', branchId, year, month,day));
        return httpService.$http.get(url, config);
    }
}])

angular.module('CoreApiUtilities', [])

.factory('Utils', ['lagConfig', 'localStorageService', function(lagConfig, localStorageService) {

    var makeHeader = function() {
        // var config = {
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //     }
        // }

        // return config;
        var access_token = localStorageService.get('access_token');
        if (access_token != null) {
            return config = {
                headers: {
                    'Authorization': "Bearer" + " " + access_token
                }
            };
        } else {
            return config = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            };
        }
    }

    var makeString = function(queryStringSet) {
        var param = "";
        if (queryStringSet !== false) {
            param += '?' + toQueryString(queryStringSet);
        }
        param = param.substr(1);
        return param;
    }

    var defaultOffsetLimit = { offset: 0, limit: 5 }

    var buildUrl = function(urlSet, queryStringSet, isAuthUrl) {


        queryStringSet = queryStringSet || false;
        if (!isAuthUrl) {
            var url = lagConfig.apiUrl;
        } else {
            var url = lagConfig.apiAuthUrl;
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
        defaultOffsetLimit: defaultOffsetLimit,
        getStringParams: makeString
    };
}])
