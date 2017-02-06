(function () {
    'use strict';

    angular.module('app.token')
        .factory('UserTokenService', UserTokenService);
        UserTokenService.$inject = ['$log', 'localStorageService'];
        function UserTokenService($log, localStorageService){
            var self = this;
            self.userToken = null;
            function getUserToken() {
                return self.userToken;
            }
            function setUserToken(token) {
                self.userToken = token;
                localStorageService.set('UserToken', self.userToken);
            }
            return {
                getUserToken: getUserToken,
                setUserToken: setUserToken
            };
        }
})();
