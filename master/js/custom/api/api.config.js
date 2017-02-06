(function() {
    'use strict';

    angular
        .module('app.core')
        .config(apiConfig);

    apiConfig.$inject = ['$provide', '$httpProvider'];
    function apiConfig($provide, $httpProvider){
        $provide.factory('authHeaderInterceptor',
            function($q, UserTokenService) {
                return {
                    'request': function(config) {
                      if ( config.headers.Authorization === 'Bearer'){
                          // set Authorization header to contain current userToken
                          config.headers.Authorization = 'Bearer ' + UserTokenService.getUserToken();
                      }
                      return config;
                    }
              };
          });
        $httpProvider.interceptors.push('authHeaderInterceptor');
    }
})();
