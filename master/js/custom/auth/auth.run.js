(function() {
    'use strict';

    angular
        .module('app.auth')
        .run(authRun);

	authRun.$inject = ['$rootScope', '$state', 'AuthService', 'ApiService'];
	function authRun($rootScope, $state, AuthService, ApiService) {
		$rootScope.$on('$stateChangeStart', function( event, toState, toParams, fromState, fromParams, options) {
            if ( toState.name !== 'page.login' ){
                if ( AuthService.isLoggedIn() === false ){
                    event.preventDefault();
                    $state.go('page.login');
                } else {
                    $rootScope.$broadcast('myTLE.userActive');
                    ApiService().getSchoolName(
                        {
                            User: {
                                login: "test_manager",
                                password: "tle123"
                            }
                        }
                    ).$promise.then(function(result){
                        $rootScope.ddSelectCenterOptions = [];
                        $rootScope.schoolList = result.School;
                        angular.forEach(result.School, function(school, key){
                            var schoolList = {id:school.School.id, label: school.School.name};
                            $rootScope.ddSelectCenterOptions.push(schoolList);
                        });
                        if (typeof $rootScope.ddSelectCenterSelected == 'undefined' || 
                            $rootScope.ddSelectCenterSelected.label == '' ||
                            $rootScope.ddSelectCenterSelected.label == null
                        ) {
                            $rootScope.ddSelectCenterSelected = {
                                label: $rootScope.schoolList[0].School.name, id: $rootScope.schoolList[0].School.id
                            };
                        }           
                    });
                }
            }
		});
	}
})();
