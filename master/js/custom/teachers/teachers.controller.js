(function () {
    'use strict';

    angular
        .module('app.teachers')
        //.controller('WithButtonsCtrl', WithButtonsCtrl)
        .controller('TeachersImageModelCtrl', TeachersImageModelCtrl);
    
    TeachersImageModelCtrl.$inject = [
        '$scope',
        '$rootScope',
        'ngDialog',
        '$compile',
        '$resource',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        'DTColumnBuilder',
        '$http',
        '$q',
        'ApiService'];
    function TeachersImageModelCtrl(
        $scope,
        $rootScope,
        ngDialog,
        $compile,
        $resource,
        DTOptionsBuilder,
        DTColumnDefBuilder,
        DTColumnBuilder,
        $http,
        $q,
        ApiService
    ) {
        $scope.dtInstance = {};
        $scope.firstRun = true;
        $scope.checkedFlag = false;
        $scope.showLoadingBar = false;
        $scope.showTableData = true;
        $scope.pageNation = false;

        $scope.checkedStatus = []; // checked action status array
        $scope.checkedName = [];
        $scope.checkedPhone = [];
        $scope.checkedEmail = [];
        $scope.checkedAccesscode = [];

        $scope.statusModel = [];
        $scope.nameModel = [];
        $scope.phoneModel = [];
        $scope.emailModel = [];
        $scope.accesscodeModel = [];

        $scope.dropSettings = { enableSearch: true, dynamicTitle: false };        

        $scope.nameActionItem = []; 
        $scope.phoneActionItem = []; 
        $scope.emailActionItem = [];
        $scope.accesscodeActionItem = [];
        $scope.selectActionItem = [
            {id: 1, label: 'Active'},
            {id: 2, label: 'Inactive'}
        ];
        $scope.nameTexts = { buttonDefaultText: 'Name' };
        $scope.phoneTexts = { buttonDefaultText: 'Phone' };
        $scope.emailTexts = { buttonDefaultText: 'Email' };
        $scope.accesscodeTexts = { buttonDefaultText: 'Access Code' };
        $scope.customTexts = { buttonDefaultText: 'Status' };

        $scope.count = 25;
        $scope.filter = {};
        $scope.group = {};
        $scope.page = 1;
        if(typeof $rootScope.ddSelectCenterSelected !='undefined')
            $scope.schoolName = $rootScope.ddSelectCenterSelected.id;
        else
            $scope.schoolName = 6436;
        $scope.soting = { lastName: 'asc' };

        activate();
        
        function activate() {
           // $scope.checkedIsActive = 'Active';
            $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
                var defer = $q.defer();
                ApiService().getTeacher(
                    {
                        count: $scope.count,
                        filter: $scope.filter,
                        group: $scope.group,
                        page: $scope.page,
                        schoolName: $scope.schoolName,
                        sorting: $scope.soting      
                    }
                ).$promise.then(function(result){
                    $scope.checkedTeachers = [];
                    if($scope.firstRun == true) {
                        $scope.firstRun = false;
                        angular.forEach(result.data, function(teacher){
                            $scope.checkedTeachers.push(teacher);
                        });
                    } else {
                        angular.forEach(result.data, function(teacher){
                            var flag = true;
                            if(flag == true && $scope.checkedName.length > 0 && $scope.checkedName.indexOf(teacher.name) == -1){
                                flag = false;
                            }
                            if(flag == true && $scope.checkedPhone.length > 0 && $scope.checkedPhone.indexOf(teacher.phone) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedEmail.length > 0 && $scope.checkedEmail.indexOf(teacher.email) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedAccesscode.length > 0 && $scope.checkedAccesscode.indexOf(teacher.accesscode) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedStatus.length > 0 && $scope.checkedStatus.indexOf(teacher.isActive) == -1) {
                                flag = false;
                            }
                            if(flag == true) {
                                $scope.checkedTeachers.push(teacher);
                            }
                        });
                        if( $scope.checkedName.length > 0 || $scope.checkedPhone.length > 0 || $scope.checkedEmail.length > 0 ||
                            $scope.checkedAccesscode.length > 0 || $scope.checkedStatus.length > 0)
                            $scope.checkedFlag = true;
                        else
                            $scope.checkedFlag = false;
                    }
                    $scope.showLoadingBar = false;
                    $scope.showTableData = true;
                    $scope.pageNation = true;
                    
                    defer.resolve($scope.checkedTeachers);
                });
                return defer.promise;
            })
            .withPaginationType('full_numbers').withDisplayLength(200)
            .withOption('responsive', true)
            .withOption('aaSorting', [])
            .withTableTools('app/css/copy_csv_xls_pdf.swf')
            .withTableToolsButtons([
                'csv',
                'xls',
                'pdf'
            ])
            .withOption('createdRow', createdRow)
            .withOption('headerCallback', function(header) {
                if (!$scope.headerCompiled) {
                    $scope.headerCompiled = true;
                    $compile(angular.element(header).contents())($scope);
                }
            });
            var titleStatusHtml = '<div ng-dropdown-multiselect="" options="selectActionItem" selected-model="statusModel" checkboxes="true" extra-settings="dropSettings" translation-texts="customTexts" events="{ onItemSelect: onActionStatusSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllStatusSelected, onDeselectAll: onActionStatusDeselected }"></div>';
            var nameStatusHtml = '<div ng-dropdown-multiselect="" options="nameActionItem" selected-model="nameModel" checkboxes="true" extra-settings="dropSettings" translation-texts="nameTexts" events="{ onItemSelect: onActionNameSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllNameSelected, onDeselectAll: onActionNameDeselected }"></div>';
            var phoneStatusHtml = '<div ng-dropdown-multiselect="" options="phoneActionItem" selected-model="phoneModel" checkboxes="true" extra-settings="dropSettings" translation-texts="phoneTexts" events="{ onItemSelect: onActionPhoneSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllPhoneSelected, onDeselectAll: onActionPhoneDeselected }"></div>';
            var emailStatusHtml = '<div ng-dropdown-multiselect="" options="emailActionItem" selected-model="emailModel" checkboxes="true" extra-settings="dropSettings" translation-texts="emailTexts" events="{ onItemSelect: onActionEmailSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllEmailSelected, onDeselectAll: onActionEmailDeselected }"></div>';
            var accesscodeStatusHtml = '<div ng-dropdown-multiselect="" options="accesscodeActionItem" selected-model="accesscodeModel" checkboxes="true" extra-settings="dropSettings" translation-texts="accesscodeTexts" events="{ onItemSelect: onActionCodeSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllCodeSelected, onDeselectAll: onActionCodeDeselected }"></div>';
            $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).withTitle('').notSortable().renderWith(actionHtml),
                DTColumnBuilder.newColumn('name').withTitle(nameStatusHtml),
                DTColumnBuilder.newColumn('phone').withTitle(phoneStatusHtml),              
                DTColumnBuilder.newColumn('email').withTitle(emailStatusHtml),
                DTColumnBuilder.newColumn('accesscode').withTitle(accesscodeStatusHtml),
                DTColumnBuilder.newColumn(null).withTitle(titleStatusHtml).notSortable().renderWith(activeStatusHtml).withClass('child-status')
            ];
        }

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        // make actionHtml
        function actionHtml(data, type, full, meta) {
            console.log(data);
            var html;
            var teacher_info = data.s3Path + ',' + 
                               data.name + ',' +
                               data.phone + ',' +
                               data.email + ',' +
                               data.accesscode + ',' +
                               data.status + ',' +
                               data.currentClassroom + ',' +
                               data.defaultClassroom + ',' +
                               data.lastCheckedInTime + ',' +
                               data.lastCheckedOutTime;
            //var teacher_info = JSON.stringify(data);
            html = '<div class="media teacher-img">' + 
                        '<div class="user-block-picture">' +
                            '<div class="user-block-status" style="margin-top:5px;">' ;
            if(!data.s3Path.includes('placeholders')) {
                html += '<img src="https://cdn.mytle.com/' + data.s3Path + '" class="media-object img-responsive" ng-click="openPhoto(\''+ (teacher_info.replace("'", "\\'")) +'\')" >' +
                    '</div>' + 
                '</div>' + 
            '</div>';
            } else {
                html += '<img src="' + data.s3Path + '" class="media-object img-responsive" ng-click="openPhoto(\''+ (teacher_info.replace("'", "\\'")) +'\')">' +
                        '</div>' + 
                    '</div>' + 
                '</div>';
            }

            return  html;
        }

        //make active status 
        function activeStatusHtml(data, type, full, meta) {
            var isActive = data.status;
            var html;
            if(isActive == 'Active'){
                html = '<div>Active</div>';
            } else{
                html = '<div>Inactive</div>';    
            }
            return html;
        }

        // checked active status 
        $scope.checkedActive = function () {
            var activeStatus = $('#isActive').is(":checked");
            if(activeStatus == true && $scope.checkedIsActive == 'Inactive') {
               $scope.checkedIsActive = 'Active';              
            } else {
               $scope.checkedIsActive = 'Inactive';
            }
            $scope.dtInstance.reloadData(function(result) {
                console.log('reload: ', result);
            }, true);
        }

        // show teacher's detail page
        $scope.openPhoto = function (info) {
            var selectedTeacherInfo = info.split(',');
            $scope.imagePath = selectedTeacherInfo[0];
            $scope.name = selectedTeacherInfo[1];
            $scope.phone = selectedTeacherInfo[2];
            if($scope.phone == "null") {
                $scope.phone = '';
            }
            $scope.email = selectedTeacherInfo[3];
            $scope.accesscode = selectedTeacherInfo[4];
            $scope.status = selectedTeacherInfo[5];
            $scope.currentClass = selectedTeacherInfo[6];
            $scope.defaultClass = selectedTeacherInfo[7];            
            $scope.lastCheckedInTime = new Date(selectedTeacherInfo[8]);
            $scope.lastCheckedOutTime = new Date(selectedTeacherInfo[9]);           
            
            console.log($scope.lastCheckedInTime);
            console.log($scope.lastCheckedOutTime);
            var dialog = ngDialog.open({
                template: 'teacher-detail.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
               // plain: true,
                theme: 'dialogwidth800'
            });
           
            dialog.closePromise.then(function (data) {
                console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
            });
        };

        ////////////////////////////////

        // checked item
        $scope.onActionStatusSelected = function(item) {
            console.log(item);
            if(item.label == 'Active')
                $scope.checkedStatus.push(true);
            else
                $scope.checkedStatus.push(false);    
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        $scope.onActionNameSelected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedName.push(null);
            else
                $scope.checkedName.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionPhoneSelected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedPhone.push(null);
            else
                $scope.checkedPhone.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionEmailSelected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedEmail.push(null);
            else
                $scope.checkedEmail.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionCodeSelected = function(item){
            if(item.label == "(blank)")
                $scope.checkedAccesscode.push(null);
            else
                $scope.checkedAccesscode.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        // unchecked item
        $scope.onActionDeselected = function (item) {
            $scope.checkedStatus = removeUncheckedItem($scope.checkedStatus, item);
            $scope.checkedName = removeUncheckedItem($scope.checkedName, item);
            $scope.checkedPhone = removeUncheckedItem($scope.checkedPhone, item);
            $scope.checkedEmail = removeUncheckedItem($scope.checkedEmail, item);
            $scope.checkedAccesscode = removeUncheckedItem($scope.checkedAccesscode, item);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        function removeUncheckedItem(arr, item) {
            if(arr != $scope.checkedStatus) {
                angular.forEach(arr, function(value, key){
                    if(item.label == '(blank)')
                        item.label = null;
                    if(value == item.label) {
                        arr.splice(key, 1);
                    }
                });
            } else {
                angular.forEach(arr, function(value, key){
                    if(value == true)
                        value = 'Active';
                    else
                        value = 'Inactive';
                    if(value == item.label) {
                        arr.splice(key, 1);
                    }
                });
            }          
            return arr;
        }

        // checked all
        $scope.onActionAllStatusSelected = function() {
            $scope.checkedStatus = [];
            angular.forEach($scope.selectActionItem, function(value, key){
                if(value.label == 'Active')
                    $scope.checkedStatus.push(true);
                else
                    $scope.checkedStatus.push(false);
            });
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        $scope.onActionAllNameSelected = function () {
            $scope.checkedName = checkedAllItem($scope.nameActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllPhoneSelected = function () {
            $scope.checkedPhone = checkedAllItem($scope.phoneActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllEmailSelected = function () {
            $scope.checkedEmail = checkedAllItem($scope.emailActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllCodeSelected = function () {
            $scope.checkedAccesscode = checkedAllItem($scope.accesscodeActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }

        function checkedAllItem(arr) {
            var newarr = [];
            angular.forEach(arr, function(value, key){
                newarr.push(value.label);
            });
            return newarr;
        }

        // unchecked all
        $scope.onActionStatusDeselected = function() {
            $scope.checkedStatus = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionNameDeselected = function() {
            $scope.checkedName = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionPhoneDeselected = function() {
            $scope.checkedPhone = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionEmailDeselected = function() {
            $scope.checkedEmail = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionCodeDeselected = function() {
            $scope.checkedAccesscode = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        ////////////////////

        // clear all filter
        $scope.clearAllFilter = function () {
            $scope.checkedName = [];
            $scope.checkedPhone = [];
            $scope.checkedEmail = [];
            $scope.checkedAccesscode = [];
            $scope.checkedStatus = [];

            $scope.nameModel = [];
            $scope.phoneModel = [];
            $scope.emailModel = [];
            $scope.accesscodeModel = [];
            $scope.statusModel = [];
            $scope.checkedFlag = false;
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        // change select center
        $scope.selectedCenterAction = function(item) {
            $scope.showLoadingBar = true;
            $scope.showTableData = false;
            $scope.pageNation = false;
            $rootScope.ddSelectCenterSelected = {label: item.label, id: item.id};
            $scope.schoolName = item.id;
            $scope.clearAllFilter();
            $scope.getAllActivities();
        };

        $scope.getAllActivities = function() {
            var nameArr = [], phoneArr = [], emailArr = [], accesscodeArr = [];
            ApiService().getTeacher(
                {
                    count: $scope.count,
                    filter: $scope.filter,
                    group: $scope.group,
                    page: $scope.page,
                    schoolName: $scope.schoolName,
                    sorting: $scope.soting      
                }
            ).$promise.then(function(result){
                angular.forEach(result.data, function(teacher, key){
                    nameArr.push(teacher.name);
                    phoneArr.push(teacher.phone);
                    emailArr.push(teacher.email);
                    accesscodeArr.push(teacher.accesscode);
                });
                $scope.nameActionItem = removeDuplicatesFromObjArray(nameArr);
                $scope.phoneActionItem = removeDuplicatesFromObjArray(phoneArr);
                $scope.emailActionItem = removeDuplicatesFromObjArray(emailArr);
                $scope.accesscodeActionItem = removeDuplicatesFromObjArray(accesscodeArr);
            });
        }
        $scope.init = function() {
            $scope.getAllActivities();
        };

        function removeDuplicatesFromObjArray(arr) {
            var objectArr = [];          
            var unique = arr.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            });
            angular.forEach(unique, function(value, key){
                objectArr.push({id: key+1, label: value});
            });
            angular.forEach(objectArr, function(value, key){
                if(value.label == '' || value.label == null ) {
                    value.label = '(blank)';
                }
            });
            return objectArr;
        }
        $scope.init();

        // page nation
        $scope.setPagePrevNum = function() {
            if($scope.page > 1) {
                $scope.page = $scope.page - 1;
            } else {
                $scope.page = 1;
            }
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        $scope.setPageNextNum = function() {
            $scope.page = $scope.page + 1;
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.setPageCurrentNum = function(page) {
            $scope.page = page;
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        $scope.setCount = function(count) {
            $scope.count = count;
            //$scope.$apply();
            console.log($scope.count);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
    }
})();
