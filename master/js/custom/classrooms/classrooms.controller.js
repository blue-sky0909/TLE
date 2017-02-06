(function () {
    'use strict';

    angular
        .module('app.classrooms')
        .controller('ClassroomsImageModelCtrl', ClassroomsImageModelCtrl);
    
    ClassroomsImageModelCtrl.$inject = [
        "$scope",
        "$rootScope",
        "ngDialog",
        "$compile",
        "$resource",
        "DTOptionsBuilder",
        "DTColumnDefBuilder",
        "DTColumnBuilder",
        "$http",
        "$q",
        "$confirm",
        "Flash",
        "SweetAlert"];
    function ClassroomsImageModelCtrl(
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
        SweetAlert) {

        $scope.dtInstance = {};
        $scope.firstRun = true;
        $scope.checkedFlag = false;
        $scope.showLoadingBar = false;
        $scope.showTableData = true;
        $scope.pageNation = false;

        $scope.classroomStatus = '';
        $scope.classroomTypes = [
            {name: 'B/A School', value: 'B/A School'},
            {name: 'Infant A', value: 'Infant A'},
            {name: 'Infant B', value: 'Infant B'},
            {name: 'Kindergarten', value: 'Kindergarten'}
        ];
        $scope.hstep = 1;
        $scope.mstep = 5;
        $scope.ismeridian = true;
        $scope.all = false;
        $scope.showBtnAction = false;

        $scope.checkedName = [];
        $scope.checkedType = [];
        $scope.checkedAssign = [];        
        $scope.checkedStatus = []; 

        $scope.classroomNameActionItem = [];
        $scope.classroomTypeActionItem = []; 
        $scope.assignActionItem = [];
        $scope.statusActionItem = [
            {id: 1, label: 'Active'},
            {id: 2, label: 'Inactive'},
        ];

        $scope.nameModel = [];
        $scope.typeModel = [];
        $scope.assignModel = [];
        $scope.statusModel = [];

        $scope.classroomNameTexts = { buttonDefaultText: 'Classroom Name' };
        $scope.classroomTypeTexts = { buttonDefaultText: 'Classroom Type' };
        $scope.assignTexts = { buttonDefaultText: 'Assigned' };
        $scope.statusTexts = { buttonDefaultText: 'Status' };
        $scope.dropSettings = { enableSearch: true, dynamicTitle: false };

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
           // $scope.checkedIsActive = true;            
            $scope.selectAll = false;
            $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
                var defer = $q.defer();
                $http.get('server/classrooms-table.json').then(function(result){
                    if($scope.firstRun == true) {
                        $scope.firstRun = false;
                        $scope.checkedClassrooms = [];
                        angular.forEach(result.data, function(classroom){
                            $scope.checkedClassrooms.push(classroom);
                        });
                    } else {
                        $scope.checkedClassrooms = [];
                        angular.forEach(result.data, function(classroom){
                            var flag = true;
                            if(flag == true && $scope.checkedName.length > 0 && $scope.checkedName.indexOf(classroom.classroomName) == -1){
                                flag = false;
                            }
                            if(flag == true && $scope.checkedType.length > 0 && $scope.checkedType.indexOf(classroom.classroomType) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedAssign.length > 0 && $scope.checkedAssign.indexOf(classroom.token) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedStatus.length > 0 && $scope.checkedStatus.indexOf(classroom.isActive) == -1) {
                                flag = false;
                            }
                            if(flag == true) {
                                $scope.checkedClassrooms.push(classroom);
                            }
                        });
                        if($scope.checkedName.length > 0 || $scope.checkedType.length > 0 ||
                            $scope.checkedAssign.length > 0 || $scope.checkedStatus.length > 0) {
                            $scope.checkedFlag = true;
                        }else
                            $scope.checkedFlag = false;
                    }
                    $scope.showLoadingBar = false;
                    $scope.showTableData = true;
                    $scope.pageNation = true;                
                    
                    defer.resolve($scope.checkedClassrooms);
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
            var titleHtml = '<div class="checkbox c-checkbox">'+
                                '<label>' +
                                    '<input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll)">' +
                                    '<span class="fa fa-check"></span>' +
                                '</label>' +
                            '</div>';
            
            var classroomNameStatusHtml = '<div ng-dropdown-multiselect="" options="classroomNameActionItem" selected-model="nameModel" checkboxes="true" extra-settings="dropSettings" translation-texts="classroomNameTexts" events="{ onItemSelect: onActionNameSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllNameSelected, onDeselectAll: onActionNameDeselected }"></div>';
            var classroomTypeStatusHtml = '<div ng-dropdown-multiselect="" options="classroomTypeActionItem" selected-model="typeModel" checkboxes="true" extra-settings="dropSettings" translation-texts="classroomTypeTexts" events="{ onItemSelect: onActionTypeSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllTypeSelected, onDeselectAll: onActionTypeDeselected }"></div>';
            var assignStatusHtml = '<div ng-dropdown-multiselect="" options="assignActionItem" selected-model="assignModel" checkboxes="true" extra-settings="dropSettings" translation-texts="assignTexts" events="{ onItemSelect: onActionAssignSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllAssignSelected, onDeselectAll: onActionAssignDeselected }"></div>';
            var titleStatusHtml = '<div ng-dropdown-multiselect="" options="statusActionItem" selected-model="statusModel" checkboxes="true" extra-settings="dropSettings" translation-texts="statusTexts" events="{ onItemSelect: onActionStatusSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllStatusSelected, onDeselectAll: onActionStatusDeselected }"></div>';
            $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable().renderWith(makeCheckBoxHtml),
                DTColumnBuilder.newColumn('classroomName').withTitle(classroomNameStatusHtml),              
                DTColumnBuilder.newColumn('classroomType').withTitle(classroomTypeStatusHtml),
                DTColumnBuilder.newColumn('token').withTitle(assignStatusHtml),
                DTColumnBuilder.newColumn(null).withTitle(titleStatusHtml).notSortable().renderWith(activeStatusHtml).withClass('child-status'),
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
                            '<input type="checkbox" ng-model="selected['+ data.classroomId +']" ng-click="toggleOne(selected)" ng-checked="all">' +
                            '<span class="fa fa-check"></span>' +
                        '</label>' +
                    '</div>';
            return html;
        }

        //make active status 
        function activeStatusHtml(data, type, full, meta) {
            var isActive = data.isActive;
            var html;
            if(isActive == true){
                html = '<div>Active</div>';
            } else{
                html = '<div>Inactive</div>';    
            }
            return html;
        }

        // make Action status change
        function statusActionHtml(data, type, full, meta) {
            var classroomsInfo = data.token + ',' + data.classroomName + ',' + data.classroomType + ',' + data.isActive + ',' + data.classroomId;
            var html;
            html = '<div class="btn-group">' +
                        '<button type="button" class="btn btn-primary" ng-click="showClassroomEdit(\''+ (classroomsInfo.replace("'", "\\'")) +'\')"  data-tooltip="Edit">' + 
                            '<i class="fa fa-pencil"></i>' +
                        '</button>' +
                        '<button type="button" class="btn btn-danger" ng-click="tokenClear(\''+ (classroomsInfo.replace("'", "\\'")) +'\')" data-tooltip="Clear Token">' +
                            '<i class ="fa fa-trash"></i>' +
                        '</button>' +
                    '</div>';
            return html;
        }

        // checked active status 
        $scope.checkedActive = function () {
            var activeStatus = $('#isActive').is(":checked");
            if(activeStatus == true && $scope.checkedIsActive == false) {
               $scope.checkedIsActive = true;              
            } else {
               $scope.checkedIsActive = false;
            }
            $scope.dtInstance.reloadData(function(result) {
                console.log('reload: ', result);
            }, true); 

        }       

        // show classroom edit Modal
        $scope.showClassroomEdit = function(data) {
            var classroomInfo = data.split(',');
            $scope.deviceToken = classroomInfo[0];
            $scope.classroomName = classroomInfo[1];
            $scope.classroomType = classroomInfo[2];
            $scope.classroomStatus = classroomInfo[3];
            $scope.selectedClassroomId = classroomInfo[4];

            $scope.selectedEventType = $scope.classroomTypes[0];

            var dialog = ngDialog.open({
                template: 'select-classroom-edit.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
            dialog.closePromise.then(function (data) {
                console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
            });
        }
        // change classroomStatus
        $scope.changeClassroomStatus = function() {
            if($scope.classroomStatus == 'true') {
                $scope.classroomStatus = 'false';
            } else {
                $scope.classroomStatus = 'true';
            }
        }

        // show token clear
        $scope.tokenClear = function(data) {
            var classroomInfo = data.split(',');
            $scope.deviceToken = classroomInfo[0];
            $scope.selectedClassroomId = classroomInfo[4];
            SweetAlert.swal({   
                title: 'Are you sure?',   
                text: 'This item will delete',   
                type: 'warning',   
                showCancelButton: true,   
                confirmButtonColor: '#DD6B55',   
                confirmButtonText: 'Yes, delete it!',
                closeOnConfirm: false,
                allowOutsideClick: false,
                showLoaderOnConfirm: true
            },  function(){  
                SweetAlert.swal('Deleted!','', 'success');
            });
        }
        
        // classroom edit action
        $scope.editClassroom = function () {
            ngDialog.close();
            console.log($scope.selectedClassroomId);
            SweetAlert.swal('Well done!', 'Operation Applied', 'success');            
        }

        // show add classroom schedule modal
        $scope.showAddClassroomSchedule = function() {
            var d = new Date();
            $scope.beginDate = d.getHours();
            $scope.endDate = d.getHours();
            var dialog = ngDialog.open({
                template: 'classroom-schedule-add.html',
                className: 'ngdialog-theme-default ngDialog-classroom-schedule',
                scope: $scope
            });
        }

        // show edit classroom schedule modal
        $scope.showEditClassroomSchedule = function(id) {
            $scope.selectedClassroomScheduleId = id;
            $scope.eventType = $scope.selectedEventType.name;
            var d = new Date();
            $scope.beginDate = d.setHours(12, 0);
            $scope.endDate = d.setHours(18, 0);
            var dialog = ngDialog.open({
                template: 'classroom-schedule-edit.html',
                className: 'ngdialog-theme-default ngDialog-classroom-schedule',
                scope: $scope
            });       
        }

        // show delete classroom schedule
        $scope.DeleteClassroomSchedule = function(id) {
            $scope.selectedClassroomScheduleId = id;
            SweetAlert.swal({   
                title: 'Are you sure?',   
                text: 'This item will delete',   
                type: 'warning',   
                showCancelButton: true,   
                confirmButtonColor: '#DD6B55',   
                confirmButtonText: 'Yes, delete it!',
                closeOnConfirm: false,
                allowOutsideClick: false,
                showLoaderOnConfirm: true
            },  function(){  
                SweetAlert.swal('Deleted!','', 'success');
            });
        }

        // close add classroom schedule modal
        $scope.addClassroomSchedule = function() {
            var windowIDs = ngDialog.getOpenDialogs();
            ngDialog.close(windowIDs[1]);
            SweetAlert.swal('Well done!', 'Operation Applied', 'success');
        }

        // close edit classroom schedule modal
        $scope.editClassroomSchedule = function() {
            var windowIDs = ngDialog.getOpenDialogs();
            ngDialog.close(windowIDs[1]);
            SweetAlert.swal('Well done!', 'Operation Applied', 'success');
        }

        // select all checkbox
        $scope.toggleAll = function (selectAll) {
            var item = {};         
            if(selectAll == true) {
                $scope.all = true;
                $scope.activityClassrooms = $scope.checkedClassrooms;
                angular.forEach($scope.activityClassrooms, function(activityClassroom){
                    item[activityClassroom.classroomId] = true;
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
            if($scope.selectedItems.length == 0) {
               $scope.showBtnAction = false; 
            } else if($scope.selectedItems.length == $scope.checkedClassrooms.length) {
                $scope.showBtnAction = true; 
                $scope.selectAll = true;
            } else {
                $scope.selectAll = false;
                $scope.showBtnAction = true;
            }
        }

        // clear classrooms
        $scope.clearClassrooms = function() {
            $scope.activityClassrooms = [];
            if ($scope.selectAll == true) {
                $scope.activityClassrooms = $scope.checkedClassrooms;
                SweetAlert.swal({   
                    title: 'Are you sure?',   
                    text: 'selected items will delete',   
                    type: 'warning',   
                    showCancelButton: true,   
                    confirmButtonColor: '#DD6B55',   
                    confirmButtonText: 'Yes, delete it!',
                    closeOnConfirm: false,
                    allowOutsideClick: false,
                    showLoaderOnConfirm: true
                },  function(){  
                    SweetAlert.swal('Clear!','', 'success');
                });
            } else {
                angular.forEach($scope.selectedItems, function(selectedItem){
                    angular.forEach($scope.allActivities, function(activity){
                        if(selectedItem == activity.individualMomentId) {
                            $scope.activityClassrooms.push(activity);
                        }
                    });
                });
                SweetAlert.swal({   
                    title: 'Are you sure?',   
                    text: 'selected items will delete',   
                    type: 'warning',   
                    showCancelButton: true,   
                    confirmButtonColor: '#DD6B55',   
                    confirmButtonText: 'Yes, delete it!',
                    closeOnConfirm: false,
                    allowOutsideClick: false,
                    showLoaderOnConfirm: true
                },  function(){  
                    SweetAlert.swal('Clear!','', 'success');
                });
/*                dialog.closePromise.then(function (data) {
                    console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
                });*/
            } 
        }

        // input value clear
        $scope.clearClassroomName = function () {
            $scope.classroomName = '';
        }

        $scope.clearDeviceToken = function () {
            $scope.deviceToken = '';
        }

        $scope.clearClassroomCapacity = function () {
            $scope.classroomCapacity = '';
        }

        // all actions for all action status.
        $scope.onActionSelected = function(item) {
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        ////////////////////////////////

        // checked item
        $scope.onActionNameSelected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedName.push(null);
            else
                $scope.checkedName.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionTypeSelected= function(item) {
            if(item.label == "(blank)")
                $scope.checkedType.push(null);
            else
            $scope.checkedType.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionAssignSelected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedAssign.push(null);
            else
            $scope.checkedAssign.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionStatusSelected = function(item) {
            if(item.label == 'Active')
                $scope.checkedStatus.push(true);
            else
                $scope.checkedStatus.push(false);    
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        // unchecked item
        $scope.onActionDeselected = function (item) {
            $scope.checkedName = removeUncheckedItem($scope.checkedName, item);
            $scope.checkedType = removeUncheckedItem($scope.checkedType, item);
            $scope.checkedAssign = removeUncheckedItem($scope.checkedAssign, item);
            $scope.checkedStatus = removeUncheckedItem($scope.checkedStatus, item);
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
        $scope.onActionAllNameSelected = function () {
            $scope.checkedName = checkedAllItem($scope.classroomNameActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionAllTypeSelected = function () {
            $scope.checkedType = checkedAllItem($scope.classroomTypeActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllAssignSelected = function () {
            $scope.checkedAssign = checkedAllItem($scope.assignActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllStatusSelected = function() {
            $scope.checkedStatus = [];
            angular.forEach($scope.statusActionItem, function(value, key){
                if(value.label == 'Active')
                    $scope.checkedStatus.push(true);
                else
                    $scope.checkedStatus.push(false);
            });
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
        $scope.onActionNameDeselected = function() {
            $scope.checkedName = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionTypeDeselected = function() {
            $scope.checkedType = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionAssignDeselected = function() {
            $scope.checkedAssign = [];
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
            $scope.checkedName = [];
            $scope.checkedType = [];
            $scope.checkedAssign = [];
            $scope.checkedStatus = [];

            $scope.nameModel = [];
            $scope.typeModel = [];
            $scope.assignModel = [];
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
            var nameArr = [], typeArr = [], assignArr = [];
            $http.get('server/classrooms-table.json').then(function(result){
                angular.forEach(result.data, function(classroom, key){
                    nameArr.push(classroom.classroomName);
                    typeArr.push(classroom.classroomType);
                    assignArr.push(classroom.token);
                });
                $scope.classroomNameActionItem = removeDuplicatesFromObjArray(nameArr);
                $scope.classroomTypeActionItem = removeDuplicatesFromObjArray(typeArr);
                $scope.assignActionItem = removeDuplicatesFromObjArray(assignArr);
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
                    console.log(value);
                    value.label = '(blank)';
                }
            });
            return objectArr;            
        }
        
        $scope.init();
    }
})();
