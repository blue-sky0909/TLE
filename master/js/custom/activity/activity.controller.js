(function () {
    'use strict';

    angular
        .module('app.activity')
        .config(['$uibTooltipProvider', function  ($uibTooltipProvider) { 
            $uibTooltipProvider.options({ appendToBody: true });            
        }])
        .controller('ActivitiesModerationCtrl', ActivitiesModerationCtrl);

    ActivitiesModerationCtrl.$inject = [
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
        '$confirm',
        'Flash',
        '$timeout',
        'SweetAlert',
        'ApiService'

    ];
    // Called from the route state. 'tpl' is resolved before
    function ActivitiesModerationCtrl(
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
        $confirm,
        Flash,
        $timeout,
        SweetAlert,
        ApiService     
    ) {
        $scope.dtInstance = {};
        $scope.selectAll = false;
        $scope.firstRun = true;
        $scope.checkedFlag = false;
        $scope.showBtnAction = false;
        $scope.showLoadingBar = false;
        $scope.showTableData = true;
        $scope.pageNation = false;

        $scope.activityimages = []; // checked row's all info array
        $scope.selectedItems = []; // checked row id array
        $scope.items = []; // clicked row array

        $scope.ddSelectSelected = {
            value: 'Bulk Actions'
        };
        $scope.ddSelectOptions = [
            {name: 'Pending', value: 'Pending'},
            {name: 'Approve', value: 'Approve'},
            {name: 'Denied', value: 'Denied'}
        ];

        $scope.checkedChild = [];
        $scope.checkedTeacher = [];
        $scope.checkedCreateOn = [];
        $scope.checkedActivity = [];
        $scope.checkedStatus = [];

        $scope.childModel = [];
        $scope.teacherModel = [];
        $scope.createonModel = [];
        $scope.activityModel = [];
        $scope.statusModel = [];

        $scope.childActionItem = []; 
        $scope.teacherActionItem = [];
        $scope.createonActionItem = [];
        $scope.activityActionItem = [];
        $scope.statusActionItem = [];

        $scope.childTexts = { buttonDefaultText: 'Child Name' };
        $scope.teacherTexts = { buttonDefaultText: 'Teacher Name' };
        $scope.createonTexts = { buttonDefaultText: 'Create On' };
        $scope.activityTexts = { buttonDefaultText: 'Activity Text' };
        $scope.customTexts = { buttonDefaultText: 'Status' };

        $scope.dropSettings = { enableSearch: true, dynamicTitle: false };

        $scope.count = 25;
        $scope.filter = {};
        $scope.group = {};
        $scope.page = 1;
        $scope.soting = { lastName: 'asc' };
        if(typeof $rootScope.ddSelectCenterSelected !='undefined')
            $scope.schoolName = $rootScope.ddSelectCenterSelected.id;
        else
            $scope.schoolName = 6436;
        activate();

        function activate() {
            $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
                var defer = $q.defer();
                ApiService().getActivities(
                    {
                        count: $scope.count,
                        filter: $scope.filter,
                        group: $scope.group,
                        page: $scope.page,
                        schoolName: $scope.schoolName,
                        sorting: $scope.soting
                    }
                ).$promise.then(function(result){
                    $scope.allActivities = result.data;
                    $scope.checkedActivities = [];
                    if($scope.firstRun == true) {
                        $scope.firstRun = false;
                        angular.forEach(result.data, function(activity){
                            $scope.checkedActivities.push(activity);
                        });
                    } else {
                        $scope.checkedActivities = [];
                        angular.forEach(result.data, function(value, key){
                            var childName = value.childFirstName + ' ' + value.childLastName;
                            var teacherName = value.teacherFirstName + ' ' + value.teacherLastName;
                            var flag = true;
                            if(flag == true && $scope.checkedChild.length > 0 && $scope.checkedChild.indexOf(childName) == -1){
                                flag = false;
                            }
                            if(flag == true && $scope.checkedTeacher.length > 0 && $scope.checkedTeacher.indexOf(teacherName) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedCreateOn.length > 0 && $scope.checkedCreateOn.indexOf(value.createdOn) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedActivity.length > 0 && $scope.checkedActivity.indexOf(value.activityText) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedStatus.length > 0 && $scope.checkedStatus.indexOf(value.status) == -1) {
                                flag = false;
                            }
                            if(flag == true) {
                                $scope.checkedActivities.push(value);
                            }             
                        });
                        if($scope.checkedChild.length > 0 || $scope.checkedTeacher.length > 0 || $scope.checkedCreateOn.length > 0 ||
                            $scope.checkedActivity.length > 0 || $scope.checkedStatus.length > 0) {
                            $scope.checkedFlag = true;
                        }else
                            $scope.checkedFlag = false;
                    }
                    $scope.showLoadingBar = false;
                    $scope.showTableData = true;
                    $scope.pageNation = true;
                    
                    defer.resolve($scope.checkedActivities);
                });
                return defer.promise;
            })
            .withDisplayLength(200)
            .withOption('responsive', true)
            .withOption('aaSorting', [])
            .withOption('fnPreDrawCallback', function () { 
                var html = 'test';
                console.log('loading..') 
            })
            .withOption('fnDrawCallback', function () { console.log('stop loading..') })
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
            var titleCheckBoxHtml = '<div class="checkbox c-checkbox">'+
                                        '<label>' +
                                            '<input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll)">' + 
                                            '<span class="fa fa-check"></span>' +
                                        '</label>' +
                                    '</div>';
            var childStatusHtml = '<div ng-dropdown-multiselect="" options="childActionItem" selected-model="childModel" checkboxes="true" extra-settings="dropSettings" translation-texts="childTexts" events="{ onItemSelect: onActionChildSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllChildSelected, onDeselectAll: onActionChildDeselected }"></div>';
            var teacherStatusHtml = '<div ng-dropdown-multiselect="" options="teacherActionItem" selected-model="teacherModel" checkboxes="true" extra-settings="dropSettings" translation-texts="teacherTexts" events="{ onItemSelect: onActionTeacherSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllTeacherSelected, onDeselectAll: onActionTeacherDeselected }"></div>';
            var createonStatusHtml = '<div ng-dropdown-multiselect="" options="createonActionItem" selected-model="createonModel" checkboxes="true" extra-settings="dropSettings" translation-texts="createonTexts" events="{ onItemSelect: onActionCreateOnSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllCreateOnSelected, onDeselectAll: onActionCreateOnDeselected }"></div>';
            var activityStatusHtml = '<div ng-dropdown-multiselect="" options="activityActionItem" selected-model="activityModel" checkboxes="true" extra-settings="dropSettings" translation-texts="activityTexts" events="{ onItemSelect: onActionActivitySelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllActivitiesSelected, onDeselectAll: onActionActivityDeselected }"></div>';
            var titleStatusHtml = '<div ng-dropdown-multiselect="" options="statusActionItem" selected-model="statusModel" checkboxes="true" extra-settings="dropSettings" translation-texts="customTexts" events="{ onItemSelect: onActionStatusSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllStatusSelected, onDeselectAll: onActionStatusDeselected }"></div>';

            $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).withTitle(titleCheckBoxHtml).notSortable().renderWith(makeCheckBoxHtml),
                DTColumnBuilder.newColumn(null).withTitle('Activity').notSortable().renderWith(makeActivityPictureHtml).withClass('activity-photo'),
                DTColumnBuilder.newColumn(null).withTitle('').notSortable().renderWith(childPhotoActionHtml),
                DTColumnBuilder.newColumn(null).withTitle(childStatusHtml).renderWith(makeChildNameHtml),
                DTColumnBuilder.newColumn(null).withTitle(teacherStatusHtml).renderWith(makeTeacherNameHtml),
                DTColumnBuilder.newColumn('createdOn').withTitle(createonStatusHtml),
                DTColumnBuilder.newColumn('activityText').withTitle(activityStatusHtml),
                DTColumnBuilder.newColumn(null).withTitle(titleStatusHtml).notSortable().renderWith(makeStatusHtml).withClass('child-status'),
                DTColumnBuilder.newColumn(null).withTitle('Action').renderWith(statusActionHtml)
            ];
        }

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        // make checkbox
        function makeCheckBoxHtml(data, type, full, meta) {
            var html;
            html = '<div class="checkbox c-checkbox">'+
                        '<label>' +
                            '<input type="checkbox" ng-model="selected['+ data.individualMomentId +']" ng-click="toggleOne(selected)" ng-checked="all">' +
                            '<span class="fa fa-check"></span>' +
                        '</label>' +
                    '</div>';
            return html;
        }

        // make Activity image
        function makeActivityPictureHtml(data, type, full, meta) {
            var html;
            var imagePath_info = data.s3Path + "," + data.childS3Path;
            html = '<img src="' + data.s3Path + '" class="media-object img-responsive activity-picture" ng-click="openActivityPhoto(\''+ imagePath_info.replace("'", "\\'") +'\')">';
            return html;
        }

        // make child photo tag
        function childPhotoActionHtml(data, type, full, meta) {
            var html;
            var imagePath_info = data.s3Path + "," + data.childS3Path;
            html = '<img src="' + data.childS3Path + '" class="media-object img-responsive activity-picture" ng-click="openActivityPhoto(\''+ imagePath_info.replace("'", "\\'") +'\')">';
            return  html;
        }

        // make children name 
        function makeChildNameHtml(data, type, full, meta) {
            var html;
            if(data.childMiddleName != null) {
                html = '<p>' + data.childFirstName  + ' ' + data.childMiddleName + ' ' + data.childLastName + '</p>';    
            } else {
                html = '<p>' + data.childFirstName  + ' ' + data.childLastName + '</p>';
            }
            
            return html;
        }

        // make Teacher name
        function makeTeacherNameHtml(data, type, full, meta) {
            var html;
            html = '<p>' + data.teacherFirstName + ' ' + data.teacherLastName + '</p>';
            return html;
        }

        // make Status
        function makeStatusHtml(data, type, full, meta) {
            var html;
            if (data.status == 'Pending') {
                html = '<i class="fa fa-minus pending"></i>';
            } else if (data.status == 'Approved') {
                html = '<i class ="fa fa-check approved"></i>';
            } else {
                html = '<i class ="fa fa-close denied"></i>';
            }
            return html;
        }

        // make Action status change
        function statusActionHtml(data, type, full, meta) {
            var html;
            html = '<div class="btn-group">' +
                        '<button type="button" class="btn btn-primary" ng-click="statusPendingChange(\''+ data.individualMomentId +'\')"  data-tooltip="Pending">' + 
                            '<i class="fa fa-minus"></i>' +
                        '</button>' +
                        '<button type="button" class="btn btn-success" ng-click="statusApproveChange(\''+ data.individualMomentId +'\')" data-tooltip="Approve">' +
                            '<i class ="fa fa-check"></i>' +
                        '</button>' +
                        '<button type="button" class="btn btn-danger" ng-click="statusDeniedChange(\''+ data.individualMomentId +'\')" data-tooltip="Denied">' +
                            '<i class ="fa fa-close"></i>' +
                        '</button>' +
                    '</div>';
            return html;
        }

        // checked Child Status
        $scope.checkedChildStatus = function() {
            $scope.items = [];
            $scope.selected = [];
            $scope.selectAll = false;
            $scope.all = false;
            $scope.showBtnAction = false;
            $timeout(function() {
                $scope.checkedStatus = window.changedStatusActivity;                
                $scope.dtInstance.reloadData(function(result) {
                    console.log('reload: ', result);
                }, true);
            });
        }

        // activity detail page 
        $scope.openActivityPhoto = function (imagePath) {
            var Photos = imagePath.split(',');
            $scope.activityPhoto = Photos[0];
            $scope.childPhoto = Photos[1];
            var dialog = ngDialog.open({
                template: 'activity-detail.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                theme: 'dialogwidth800'
            });
             
            dialog.closePromise.then(function (data) {
                console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
            });
        };

        // select all checkbox
        $scope.toggleAll = function (selectAll) {
            var item = {};         
            if(selectAll == true) {
                $scope.all = true;
                $scope.activityimages = $scope.checkedActivities;
                angular.forEach($scope.activityimages, function(activityImage){
                    item[activityImage.individualMomentId] = true;
                });
                $scope.selected = item;
                $scope.showBtnAction = true;
            } else {
                $scope.all = false;
                $scope.items = [];
                $scope.selected = [];
                $scope.showBtnAction = false;
            }
        }

        // select item
        $scope.toggleOne = function(selectedItems) {
            $scope.items = selectedItems;
            $scope.selectedItems = [];
            angular.forEach($scope.items, function(value, key){
                if(value == true) {
                    $scope.selectedItems.push(key);
                }
            });
            console.log($scope.selectedItems);
            if($scope.selectedItems.length == 0) {
                 $scope.showBtnAction = false; 
            } else if($scope.selectedItems.length == $scope.checkedActivities.length) {
                $scope.showBtnAction = true; 
                $scope.selectAll = true;
            } else {
                $scope.selectAll = false;
                $scope.showBtnAction = true;
            }
        }

        // check selected Items.
        $scope.selectedAction = function(item) {
            console.log(item);
            $scope.selectAction = item.value;
            $scope.activityimages = [];
            if ($scope.selectAll == true) {
                $scope.activityimages = $scope.checkedActivities;
                var dialog = ngDialog.open({
                    template: 'select-approved-detail.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            } else {
                angular.forEach($scope.selectedItems, function(selectedItem){
                    angular.forEach($scope.allActivities, function(activity){
                        if(selectedItem == activity.individualMomentId) {
                            $scope.activityimages.push(activity);
                        }
                    });
                });
                var dialog = ngDialog.open({
                    template: 'select-approved-detail.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
                dialog.closePromise.then(function (data) {
                    console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
                });
            }                             
        }

        // set approve selected items
        $scope.Apply = function () {
            var datas = [];
            if($scope.selectAction =='Approve') {                
                angular.forEach($scope.activityimages, function(activityimage, key){
                    var data = {IndividualMomentId :activityimage.individualMomentId, DomainIndividualMomentStatusId: 208}
                    datas.push(data);
                });
            } else if($scope.selectAction =='Pending') {
                angular.forEach($scope.activityimages, function(activityimage, key){
                    var data = {IndividualMomentId: activityimage.individualMomentId, DomainIndividualMomentStatusId: 207}
                    datas.push(data);
                });
            } else {
                angular.forEach($scope.activityimages, function(activityimage, key){
                    var data = {IndividualMomentId: activityimage.individualMomentId, DomainIndividualMomentStatusId: 209}
                    datas.push(data);
                });
            }
            ApiService().setActivityStatus(
                {
                    IndividualMoments: datas,
                    SchoolName: $scope.schoolName
                }
            ).$promise.then(function(success){
                console.log(success);
                $scope.getAllActivities();
                SweetAlert.swal('Well done!', 'Operation Applied', 'success');
                ngDialog.close();
                $scope.activityimages = []; // checked row's all info array
                $scope.selectedItems = []; // checked row id array
                $scope.items = []; // clicked row array
                $scope.showBtnAction = false;
                $scope.dtInstance.reloadData(function(result) {
                }, true);
            }, function(error){
                console.log(error);
                SweetAlert.swal('Oh Snap!', 'Operation is failed', 'danger');
                ngDialog.close();
                $scope.activityimages = []; // checked row's all info array
                $scope.selectedItems = []; // checked row id array
                $scope.items = []; // clicked row array
                $scope.showBtnAction = false;
            });

        }

        // close dialog 
        $scope.Close = function() {
            ngDialog.close();
        }

        // change status "pending"
        $scope.statusPendingChange = function(individualMomentId) {
            var datas =[];
            var data = {IndividualMomentId: individualMomentId, DomainIndividualMomentStatusId: 207};
            datas.push(data);
            SweetAlert.swal({   
                title: 'Are you sure?',   
                text: '',   
                type: 'warning',   
                showCancelButton: true,   
                confirmButtonColor: '#5d9cec',   
                confirmButtonText: 'Apply',
                closeOnConfirm: false,
                allowOutsideClick: false,
                showLoaderOnConfirm: true
            },  function(isConfirm){
                if(isConfirm) {
                    ApiService().setActivityStatus(
                        {
                            IndividualMoments: datas,
                            SchoolName: $scope.schoolName
                        }
                    ).$promise.then(function(success){
                        console.log(success);
                        $scope.getAllActivities();
                        SweetAlert.swal('Pending!','', 'success');
                        $scope.dtInstance.reloadData(function(result) {
                        }, true);  
                    });
                }                                
            });
        }

        // change status "Approve"
        $scope.statusApproveChange = function(individualMomentId) {
            var datas =[];
            var data = {IndividualMomentId: individualMomentId, DomainIndividualMomentStatusId: 208};
            datas.push(data);
            SweetAlert.swal({   
                title: 'Are you sure?',   
                text: 'This item will approve',   
                type: 'warning',   
                showCancelButton: true,   
                confirmButtonColor: '#5d9cec',   
                confirmButtonText: 'Apply',
                closeOnConfirm: false,
                allowOutsideClick: false,
                showLoaderOnConfirm: true
            },  function(isConfirm){
                if(isConfirm) {
                    ApiService().setActivityStatus(
                        {
                            IndividualMoments: datas,
                            SchoolName: $scope.schoolName
                        }
                    ).$promise.then(function(success){
                        console.log(success);
                        $scope.getAllActivities();
                        SweetAlert.swal('Approved!','', 'success');
                        $scope.dtInstance.reloadData(function(result) {
                        }, true);
                    }); 
                }                               
            });
        }

        // change status "Denied"
        $scope.statusDeniedChange = function(individualMomentId) {
            var datas =[];
            var data = {IndividualMomentId: individualMomentId, DomainIndividualMomentStatusId: 209};
            datas.push(data);
            SweetAlert.swal({   
                title: 'Are you sure?',   
                text: 'selected item will be denied',   
                type: 'warning',   
                showCancelButton: true,   
                confirmButtonColor: '#DD6B55',   
                confirmButtonText: 'Apply, denied it!',   
                closeOnConfirm: false,
                allowOutsideClick: false,
                showLoaderOnConfirm: true
            }, function(isConfirm){
                if(isConfirm) {
                    ApiService().setActivityStatus(
                        {
                            IndividualMoments: datas,
                            SchoolName: $scope.schoolName
                        }
                    ).$promise.then(function(success){
                        console.log(success);
                        $scope.getAllActivities();
                        SweetAlert.swal('Denied!', 'This Item has been denied.', 'success');
                        $scope.dtInstance.reloadData(function(result) {
                        }, true);
                    }); 
                }                  
            });
        }

        // all actions for all action status.
        $scope.onActionSelected = function(item) {
            console.log($scope.checkedStatus);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        ////////////////////////////////

        // checked item
        $scope.onActionChildSelected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedChild.push(null);
            else
                $scope.checkedChild.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionTeacherSelected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedTeacher.push(null);
            else
                $scope.checkedTeacher.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionCreateOnSelected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedCreateOn.push(null);
            else
                $scope.checkedCreateOn.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionActivitySelected = function(item){
            if(item.label == "(blank)")
                $scope.checkedActivity.push(null);
            else
                $scope.checkedActivity.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionStatusSelected = function(item) {            
            $scope.checkedStatus.push(item.label);    
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        // unchecked item
        $scope.onActionDeselected = function (item) {
            $scope.checkedChild = removeUncheckedItem($scope.checkedChild, item);
            $scope.checkedTeacher = removeUncheckedItem($scope.checkedTeacher, item);
            $scope.checkedCreateOn = removeUncheckedItem($scope.checkedCreateOn, item);
            $scope.checkedActivity = removeUncheckedItem($scope.checkedActivity, item);
            $scope.checkedStatus = removeUncheckedItem($scope.checkedStatus, item);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        function removeUncheckedItem(arr, item) {
            angular.forEach(arr, function(value, key){
                if(item.label == '(blank)')
                    item.label = null;
                if(value == item.label) {
                    arr.splice(key, 1);
                }
            });        
            return arr;
        }

        // checked all
        $scope.onActionAllChildSelected = function () {
            $scope.checkedChild = checkedAllItem($scope.childActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionAllTeacherSelected = function () {
            $scope.checkedTeacher = checkedAllItem($scope.teacherActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllCreateOnSelected = function () {
            $scope.checkedCreateOn = checkedAllItem($scope.createonActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllActivitiesSelected = function () {
            $scope.checkedActivity = checkedAllItem($scope.activityActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllStatusSelected = function() {
            $scope.checkedStatus = checkedAllItem($scope.statusActionHtml);
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
        $scope.onActionChildDeselected = function() {
            $scope.checkedChild = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionTeacherDeselected = function() {
            $scope.checkedTeacher = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionCreateOnDeselected = function() {
            $scope.checkedCreateOn = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionActivityDeselected = function() {
            $scope.checkedActivity = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionStatusDeselected = function() {
            $scope.checkedStatus = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        ////////////////////

        // clear all filter
        $scope.clearAllFilter = function () {
            $scope.checkedChild = [];
            $scope.checkedTeacher = [];
            $scope.checkedCreateOn = [];
            $scope.checkedActivity = [];
            $scope.checkedStatus = [];

            $scope.childModel = [];
            $scope.teacherModel = [];
            $scope.createonModel = [];
            $scope.activityModel = [];
            $scope.statusModel = [];
            $scope.checkedFlag = false;

            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        // get all activities
        $scope.getAllActivities = function () {
            var childNameArr = [], teacherNameArr = [], createOnArr = [], activityArr = [], statusArr = [];
            ApiService().getActivities(
                {
                    count: $scope.count,
                    filter: $scope.filter,
                    group: $scope.group,
                    page: $scope.page,
                    schoolName: $scope.schoolName,
                    sorting: $scope.soting      
                }
            ).$promise.then(function(result){
                angular.forEach(result.data, function(activity, key){
                    var childName = activity.childFirstName + ' ' + activity.childLastName;
                    var teacherName = activity.teacherFirstName + ' ' + activity.teacherLastName;
                    childNameArr.push(childName);
                    teacherNameArr.push(teacherName);
                    createOnArr.push(activity.createdOn);
                    activityArr.push(activity.activityText);
                    statusArr.push(activity.status);
                });
                $scope.childActionItem = removeDuplicatesFromObjArray(childNameArr);
                $scope.teacherActionItem = removeDuplicatesFromObjArray(teacherNameArr);
                $scope.createonActionItem = removeDuplicatesFromObjArray(createOnArr);
                $scope.activityActionItem = removeDuplicatesFromObjArray(activityArr);
                $scope.statusActionItem = removeDuplicatesFromObjArray(statusArr);
            });
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
