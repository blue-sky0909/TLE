(function () {
    'use strict';

    angular
        .module('app.auth')
		.factory('AuthService', AuthService);
		 AuthService.$inject = ['$log', 'localStorageService', 'UserTokenService', 'ApiService', '$q'];
		function AuthService($log, localStorageService, UserTokenService, ApiService, $q){
            var self = this;
            self.user = localStorageService.get('User');

			return {
				setUser: function(data) {
					self.user = data;
                    localStorageService.set('User', self.user);
				},

				getUser: function() {
					return self.user;
				},
				isLoggedIn: function() {
                    if ( self.user ){
                        return true;
                    } else {
                        return false;
                    }
                }
			};
		}
})();
