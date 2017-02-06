(function () {
    'use strict';

    angular.module('app.api')
        .factory('ApiService', ApiService);
        ApiService.$inject = ['$log', '$resource', 'localStorageService'];
        function ApiService($log, $resource, localStorageService){
            var self = this;
            self.baseUrl = 'https://api.mytle.com/api/';
            var customResource = function() {
                var token = localStorageService.get('UserToken');
                return $resource('', {}, {
                    login: {
                        url: self.baseUrl + 'users/login.json',
                        method: 'POST',
                    },
                    getUser: {
                        url: self.baseUrl + 'users/user.json',
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer'
                        }
                    },
                    getSponsor: {
                        url: self.baseUrl + 'Sponsor',
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer' + ' ' + token,
                        }
                    },
                    sendNotification: {
                        url: self.baseUrl + 'Sponsor/PushNotification',
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer' + ' ' + token,
                        }
                    },
                    generateAccessCode: {
                        url: self.baseUrl + 'Sponsor/GenerateAccessCode',
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer' + ' ' + token,
                        }
                    },
                    generateDailyReport: {
                        url: self.baseUrl + 'Sponsor/GenerateDailyReport',
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer' + ' ' + token,
                        }
                    },
                    updateDailyNotification: {
                        url: self.baseUrl + 'sponsor/UpdateDailyNotificationOpt',
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer' + ' ' + token,
                        }
                    },
                    getTeacher: {
                        url: self.baseUrl + 'teachers/teacher',
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer' + ' ' + token,
                        }
                    },
                    getChildren: {
                        url: self.baseUrl + 'Child',
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer' + ' ' + token,
                        }
                    },
                    getSchoolName: {
                        url: 'https://mytle.com/schools/ajaxGetManageParentAppSchoolIds',
                        method: 'POST'
                    },
                    getActivities: {
                        url: self.baseUrl + 'individualmoment',
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer' + ' ' + token,
                        }
                    },
                    setActivityStatus: {
                        url: self.baseUrl + 'individualmoment/update',
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer' + ' ' + token,
                        }
                    }
                });
            };
            return customResource;
        }
})();
