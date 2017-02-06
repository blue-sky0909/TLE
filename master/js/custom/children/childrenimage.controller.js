(function () {
    'use strict';

    angular
        .module('app.childrens')
        .controller('ChildrenImageModelCtrl', ChildrenImageModelCtrl);
    
    ChildrenImageModelCtrl.$inject = [
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
        'ApiService'
    ];

    function ChildrenImageModelCtrl(
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

        $scope.checkedName = [];
        $scope.checkedFamily = [];
        $scope.checkedClassroom = [];
        $scope.checkedAllergy = [];
        $scope.checkedStatus = []; // checked action status array
        
        $scope.firstNameModel = [];
        $scope.familyModel = [];
        $scope.classroomModel = [];
        $scope.allergyModel = [];
        $scope.statusModel = [];

        $scope.dropSettings = { enableSearch: true, dynamicTitle: false };

        $scope.firstNameActionItem = [];
        $scope.familyActionItem = [];
        $scope.classroomActionItem = [];
        $scope.allergyActionItem = [];
        $scope.selectActionItem = [
            {id: 1, label: 'Active'},
            {id: 2, label: 'Inactive'}
        ];

        $scope.firstNameTexts = { buttonDefaultText: 'First Name' };
        $scope.familyTexts = { buttonDefaultText: 'Family Name' };
        $scope.classroomTexts = { buttonDefaultText: 'Classroom' };
        $scope.allergyTexts = { buttonDefaultText: 'Allergies' };
        $scope.customTexts = {  buttonDefaultText: 'Status' };

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
            //$scope.checkedIsActive = true;
            $rootScope.theme = 'ngdialog-theme-default dialogwidth800';

            $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
                var defer = $q.defer();
                ApiService().getChildren(
                    {
                        count: $scope.count,
                        filter: $scope.filter,
                        group: $scope.group,
                        page: $scope.page,
                        schoolName: $scope.schoolName,
                        sorting: $scope.soting      
                    }
                ).$promise.then(function(result){
                    if($scope.firstRun == true) {
                        $scope.firstRun = false;
                        $scope.checkedChildren = [];
                        angular.forEach(result.data, function(children){
                            $scope.checkedChildren.push(children);
                        });
                    } else {
                        $scope.checkedChildren = [];
                        angular.forEach(result.data, function(children, key){
                            var flag = true;
                            if(flag == true && $scope.checkedName.length > 0 && $scope.checkedName.indexOf(children.firstName) == -1){
                                flag = false;
                            }
                            if(flag == true && $scope.checkedFamily.length > 0 && $scope.checkedFamily.indexOf(children.lastName) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedClassroom.length > 0 && $scope.checkedClassroom.indexOf(children.classroom) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedAllergy.length > 0 && $scope.checkedAllergy.indexOf(children.allergies) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedStatus.length > 0 && $scope.checkedStatus.indexOf(children.status) == -1) {
                                flag = false;
                            }
                            if(flag == true) {
                                $scope.checkedChildren.push(children);
                            }
                        });
                        if($scope.checkedName.length > 0 || $scope.checkedFamily.length > 0 || $scope.checkedClassroom.length > 0 ||
                            $scope.checkedAllergy.length > 0 || $scope.checkedStatus.length > 0) {
                            $scope.checkedFlag = true;
                        }else
                            $scope.checkedFlag = false;
                    }
                    
                    $scope.showLoadingBar = false;
                    $scope.showTableData = true;
                    $scope.pageNation = true;
                    defer.resolve($scope.checkedChildren);
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
                    // Use this headerCompiled field to only compile header once
                    $scope.headerCompiled = true;
                    $compile(angular.element(header).contents())($scope);
                }
            });
            
            var firstNameStatusHtml = '<div ng-dropdown-multiselect="" options="firstNameActionItem" selected-model="firstNameModel" checkboxes="true" extra-settings="dropSettings" translation-texts="firstNameTexts" events="{ onItemSelect: onActionNameSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllNameSelected, onDeselectAll: onActionNameDeselected }"></div>';
            var familyNameStatusHtml = '<div ng-dropdown-multiselect="" options="familyActionItem" selected-model="familyModel" checkboxes="true" extra-settings="dropSettings" translation-texts="familyTexts" events="{ onItemSelect: onActionFamilySelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllFamilySelected, onDeselectAll: onActionFamilyDeselected }"></div>';
            var classroomStatusHtml = '<div ng-dropdown-multiselect="" options="classroomActionItem" selected-model="classroomModel" checkboxes="true" extra-settings="dropSettings" translation-texts="classroomTexts" events="{ onItemSelect: onActionClassroomSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllClassroomSelected, onDeselectAll: onActionClassroomDeselected }"></div>';
            var allergyStatusHtml = '<div ng-dropdown-multiselect="" options="allergyActionItem" selected-model="allergyModel" checkboxes="true" extra-settings="dropSettings" translation-texts="allergyTexts" events="{ onItemSelect: onActionAllergySelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllAllergySelected, onDeselectAll: onActionAllergyDeselected }"></div>';
            var titleStatusHtml = '<div ng-dropdown-multiselect="" options="selectActionItem" selected-model="statusModel" checkboxes="true" extra-settings="dropSettings" translation-texts="customTexts" events="{ onItemSelect: onActionStatusSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllStatusSelected, onDeselectAll: onActionStatusDeselected }"></div>';
            
            $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).withTitle('').notSortable().renderWith(imageActionHtml),
                DTColumnBuilder.newColumn('firstName').withTitle(firstNameStatusHtml),
                DTColumnBuilder.newColumn('lastName').withTitle(familyNameStatusHtml),
                DTColumnBuilder.newColumn('classroom').withTitle(classroomStatusHtml),
                DTColumnBuilder.newColumn('allergies').withTitle(allergyStatusHtml),
                DTColumnBuilder.newColumn('status').withTitle(titleStatusHtml).withClass('child-status'),
                /*DTColumnBuilder.newColumn(null).withTitle(
                    'Status' + 
                    '<div class="checkbox c-checkbox">'+
                        '<label>' +
                            '<input type="checkbox" class="isActive" id="isActive" onclick="angular.element(this).scope().checkedActive();" checked>' +
                            '<span class="fa fa-check"></span>' +
                            'Active' + 
                        '</label>' +
                    '</div>'
                ).notSortable().renderWith(activeStatusHtml)*/
            ];
        }

        function createdRow(row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        }

        // make image tag
        function imageActionHtml(data, type, full, meta) {
            var html;
            var children_info = data.s3Path + '///' +
                                data.firstName + '///' +
                                data.lastName + '///' +
                                data.dob + '///' +
                                data.medicine + '///' +
                                data.emergency + '///' +
                                data.lastCheckedInTime + '///' +
                                data.lastCheckedOutTime + '///' +
                                data.amountActivities + '///' +
                                data.approvedActivities + '///' +
                                data.deniedActivities + '///' +
                                data.pendingActivities;
            html = '<div class="media children-img">' + 
                        '<div class="user-block-picture">' +
                            '<div class="user-block-status" style="margin-top:5px;">' +
                                '<img src="' + data.s3Path + '" class="media-object img-responsive" ng-click="openPhoto(\''+ (children_info.replace("'", "\\'")) +'\')">' +
                            '</div>' + 
                        '</div>' + 
                    '</div>';
            return  html;
        }

        //make active status 
        function activeStatusHtml(data, type, full, meta) {
            console.log(data);
            var isActive = data.isActive;
            var html;
            if(isActive == true){
                html = '<div>Active</div>';
            } else{
                html = '<div>Inactive</div>';    
            }
            return html;
        }

        // children detail page 
        $scope.openPhoto = function (info) {
            var selectedChildrenInfo = info.split('///');
            $scope.imagePath = selectedChildrenInfo[0];
            $scope.firstName = selectedChildrenInfo[1];
            $scope.lastName = selectedChildrenInfo[2];
            $scope.dob = new Date(selectedChildrenInfo[3]);
            $scope.medicine = selectedChildrenInfo[4];
            $scope.emergency = selectedChildrenInfo[5];
            $scope.lastCheckedInTime = new Date(selectedChildrenInfo[6]);
            $scope.lastCheckedOutTime = new Date(selectedChildrenInfo[7]);
            $scope.amountActivities = selectedChildrenInfo[8];
            $scope.approveActivities = selectedChildrenInfo[9];
            $scope.deniedActivities = selectedChildrenInfo[10];
            $scope.pendingActivities = selectedChildrenInfo[11];

            var dialog = ngDialog.open({
                template: 'children-detail.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
               // plain: true,
                theme: 'dialogwidth800'
            });
           
            dialog.closePromise.then(function (data) {
                console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
            });
        };

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
        $scope.onActionFamilySelected= function(item) {
            if(item.label == "(blank)")
                $scope.checkedFamily.push(null);
            else
            $scope.checkedFamily.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionClassroomSelected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedClassroom.push(null);
            else
            $scope.checkedClassroom.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionAllergySelected = function(item){
            if(item.label == "(blank)")
                $scope.checkedAllergy.push(null);
            else
            $scope.checkedAllergy.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionStatusSelected = function(item) {
            $scope.checkedStatus.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
            /*if(item.label == 'Active')
                $scope.checkedStatus.push(true);
            else
                $scope.checkedStatus.push(false);    
            $scope.dtInstance.reloadData(function(result) {
            }, true);*/
        }

        // unchecked item
        $scope.onActionDeselected = function (item) {
            $scope.checkedName = removeUncheckedItem($scope.checkedName, item);
            $scope.checkedFamily = removeUncheckedItem($scope.checkedFamily, item);
            $scope.checkedClassroom = removeUncheckedItem($scope.checkedClassroom, item);
            $scope.checkedAllergy = removeUncheckedItem($scope.checkedAllergy, item);
            $scope.checkedStatus = removeUncheckedItem($scope.checkedStatus, item);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        function removeUncheckedItem(arr, item) {
          //  if(arr != $scope.checkedStatus) {
                angular.forEach(arr, function(value, key){
                    if(item.label == '(blank)')
                        item.label = null;
                    if(value == item.label) {
                        arr.splice(key, 1);
                    }
                });
           /* } else {
                angular.forEach(arr, function(value, key){
                    if(value == true)
                        value = 'Active';
                    else
                        value = 'Inactive';
                    if(value == item.label) {
                        arr.splice(key, 1);
                    }
                });
            }    */      
            return arr;
        }

        // checked all
        $scope.onActionAllNameSelected = function () {
            $scope.checkedName = checkedAllItem($scope.firstNameActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionAllFamilySelected = function () {
            $scope.checkedFamily = checkedAllItem($scope.familyActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllClassroomSelected = function () {
            $scope.checkedClassroom = checkedAllItem($scope.classroomActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllAllergySelected = function () {
            $scope.checkedAllergy = checkedAllItem($scope.allergyActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
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
        $scope.onActionFamilyDeselected = function() {
            $scope.checkedFamily = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionClassroomDeselected = function() {
            $scope.checkedClassroom = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionAllergyDeselected = function() {
            $scope.checkedAllergy = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        ////////////////////

        // clear all filter
        $scope.clearAllFilter = function () {
            $scope.checkedName = [];
            $scope.checkedFamily = [];
            $scope.checkedClassroom = [];
            $scope.checkedAllergy = [];
            $scope.checkedStatus = [];

            $scope.firstNameModel = [];
            $scope.familyModel = [];
            $scope.classroomModel = [];
            $scope.allergyModel = [];
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

        $scope.getAllActivities = function () {
            console.log($scope.schoolName);
            var firstArr = [], familyArr = [], classroomArr = [], allergiesArr = [];
            ApiService().getChildren(
                {
                    count: $scope.count,
                    filter: $scope.filter,
                    group: $scope.group,
                    page: $scope.page,
                    schoolName: $scope.schoolName,
                    sorting: $scope.soting      
                }
            ).$promise.then(function(result){
                angular.forEach(result.data, function(children, key){
                    firstArr.push(children.firstName);
                    familyArr.push(children.lastName);
                    classroomArr.push(children.classroom);
                    allergiesArr.push(children.allergies);
                });
                $scope.firstNameActionItem = removeDuplicatesFromObjArray(firstArr);
                $scope.familyActionItem = removeDuplicatesFromObjArray(familyArr);
                $scope.classroomActionItem = removeDuplicatesFromObjArray(classroomArr);
                $scope.allergyActionItem = removeDuplicatesFromObjArray(allergiesArr);
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
