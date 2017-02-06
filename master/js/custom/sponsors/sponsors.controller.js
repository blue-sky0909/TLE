(function () {
    'use strict';

    angular
        .module('app.sponsors')
        .controller('SponsorsImageModelCtrl', SponsorsImageModelCtrl);

    SponsorsImageModelCtrl.$inject = [
        '$scope',
        '$rootScope', 
        'ngDialog', 
        '$compile',
        '$resource',
        'DTOptionsBuilder',
        'DTColumnDefBuilder',
        'DTColumnBuilder',
        'DTDefaultOptions',
        '$http',
        '$q',
        'ApiService',
        'UserTokenService',
        'SweetAlert'
    ];

    function SponsorsImageModelCtrl(
        $scope,
        $rootScope,
        ngDialog,
        $compile,
        $resource,
        DTOptionsBuilder,
        DTColumnDefBuilder,
        DTColumnBuilder,
        DTDefaultOptions,
        $http,
        $q,
        ApiService,
        UserTokenService,
        SweetAlert
    ) {
        $scope.dtInstance = {};
        $scope.firstRun = true;
        $scope.checkedFlag = false;
        $scope.showBtnAction = false;
        $scope.showLoadingBar = false;
        $scope.showTableData = true;
        $scope.pageNation = false;

        $scope.searchTerm = {};
        $scope.activitySponsors = []; // checked row's all info array
        $scope.selectedItems = []; // checked row id array
        $scope.items = []; // clicked row array
        $scope.ddSelectSelected = {
            name: 'Bulk Actions'
        };
        $scope.ddSelectOptions = [
            {name: 'Daily Activities', value: 'activity'},
            {name: 'Generate Access Code', value: 'code'},
            {name: 'Send Notification', value: 'notification'},
            {name: 'Create Album', value: 'album'}
        ];

        $scope.selectActionItem = [
            {id: 1, label: 'Active'},
            {id: 2, label: 'Inactive'}
        ];
        $scope.checkedStatus = []; // checked action status array

        $scope.checkedLastName = [];
        $scope.checkedFirstName = [];
        $scope.checkedPhone1 = [];
        $scope.checkedPhone2 = [];
        $scope.checkedPhone3 = [];
        $scope.checkedEmail = [];
        $scope.checkedActiveStatus = [];
        $scope.checkedDaily = [];

        $scope.lastModel = [];
        $scope.firstModel = [];
        $scope.phone1Model = [];
        $scope.phone2Model = [];
        $scope.phone3Model = [];
        $scope.emailModel = [];
        $scope.dailyModel = [];
        $scope.statusModel = [];

        $scope.dropSettings = { enableSearch: true, dynamicTitle: false };
        $scope.customTexts = { buttonDefaultText: 'Status' };

        $scope.lastNameActionItem = [];
        $scope.firstNameActionItem = [];
        $scope.phone1ActionItem = [];
        $scope.phone2ActionItem = [];
        $scope.phone3ActionItem = [];
        $scope.emailActionItem = [];
        $scope.dailyActionItem = [
            {id: 1, label: true},
            {id: 2, label: false}
        ];
        $scope.lastNameTexts = { buttonDefaultText: 'Last Name' };
        $scope.firstNameTexts = { buttonDefaultText: 'First Name' };
        $scope.phone1Texts = { buttonDefaultText: 'Phone1' };
        $scope.phone2Texts = { buttonDefaultText: 'Phone2' };
        $scope.phone3Texts = { buttonDefaultText: 'Phone3' };
        $scope.emailTexts = { buttonDefaultText: 'Email' };
        $scope.lastNameTexts = { buttonDefaultText: 'Last Name' };
        $scope.lastNameTexts = { buttonDefaultText: 'Last Name' };
        $scope.phoneTexts = { buttonDefaultText: 'Phone' };
        $scope.emailTexts = { buttonDefaultText: 'Email' };
        $scope.dailyTexts = { buttonDefaultText: 'Daily Notifications' };

        $scope.today = new Date();

        if(typeof $rootScope.ddSelectCenterSelected !='undefined')
            $scope.schoolName = $rootScope.ddSelectCenterSelected.id;
        else
            $scope.schoolName = 6436;
        $scope.soting = { lastName: 'asc' };

        activate();

        function activate() {
            var checkedIsActive ='';
            $rootScope.theme = 'ngdialog-theme-default dialogwidth800';
            $scope.checkedIsActive = true;            
            $scope.checkedAll = false;
            $scope.selectAll = false;
            $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
                var defer = $q.defer();
                ApiService().getSponsor(
                    {
                        count: $scope.count,
                        filter: $scope.filter,
                        group: $scope.group,
                        page: $scope.page,
                        schoolName: $scope.schoolName,
                        sorting: $scope.soting
                    }
                ).$promise.then(function(result){
                    $scope.allSponsors = result.data;
                    $scope.checkedSponsors = [];
                    if($scope.firstRun == true) {
                        $scope.firstRun = false;
                        angular.forEach(result.data, function(sponsor){
                            $scope.checkedSponsors.push(sponsor);
                        });
                    } else {
                        angular.forEach(result.data, function(sponsor){
                            var flag = true;
                            if(flag == true && $scope.checkedLastName.length > 0 && $scope.checkedLastName.indexOf(sponsor.lastName) == -1){
                                flag = false;
                            }
                            if(flag == true && $scope.checkedFirstName.length > 0 && $scope.checkedFirstName.indexOf(sponsor.firstName) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedPhone1.length > 0 && $scope.checkedPhone1.indexOf(sponsor.phone1) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedPhone2.length > 0 && $scope.checkedPhone2.indexOf(sponsor.phone2) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedPhone3.length > 0 && $scope.checkedPhone3.indexOf(sponsor.phone3) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedEmail.length > 0 && $scope.checkedEmail.indexOf(sponsor.email) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedDaily.length > 0 && $scope.checkedDaily.indexOf(sponsor.dailyNotificationsOptIn) == -1) {
                                flag = false;
                            }
                            if(flag == true && $scope.checkedActiveStatus.length > 0 && $scope.checkedActiveStatus.indexOf(sponsor.isActive) == -1) {
                                flag = false;
                            }
                            if(flag == true) {
                                $scope.checkedSponsors.push(sponsor);
                            }
                        });
                        if( $scope.checkedLastName.length > 0 || $scope.checkedFirstName.length > 0 || $scope.checkedPhone1.length > 0 ||
                            $scope.checkedPhone2.length > 0 || $scope.checkedPhone3.length > 0 || $scope.checkedEmail.length > 0 ||
                            $scope.checkedDaily.length > 0 || $scope.checkedActiveStatus.length > 0) 
                            $scope.checkedFlag = true;
                        else
                            $scope.checkedFlag = false;
                    }
                    $scope.showLoadingBar = false;
                    $scope.showTableData = true;
                    $scope.pageNation = true;

                    defer.resolve($scope.checkedSponsors);
                });
                return defer.promise;
            })
            .withDisplayLength(200)
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
            })
            .withOption('processing', true)
            .withOption('fnRowCallback', function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                return nRow;
            });

            var titleHtml = '<div class="checkbox c-checkbox">'+
                                '<label>' +
                                    '<input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll)">' +
                                    '<span class="fa fa-check"></span>' +
                                '</label>' +
                            '</div>';
            var titleStatusHtml = '<div ng-dropdown-multiselect="" options="selectActionItem" selected-model="statusModel" checkboxes="true" extra-settings="dropSettings" translation-texts="customTexts" events="{ onItemSelect: onActionStatusSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllStatusSelected, onDeselectAll: onActionStatusDeselected }"></div>';
            var lastNameStatusHtml = '<div ng-dropdown-multiselect="" options="lastNameActionItem" selected-model="lastModel" checkboxes="true" extra-settings="dropSettings" translation-texts="lastNameTexts" events="{ onItemSelect: onActionLastSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllLastSelected, onDeselectAll: onActionLastDeselected }"></div>';
            var firstNameStatusHtml = '<div ng-dropdown-multiselect="" options="firstNameActionItem" selected-model="firstModel" checkboxes="true" extra-settings="dropSettings" translation-texts="firstNameTexts" events="{ onItemSelect: onActionFirstSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllFirstSelected, onDeselectAll: onActionFirstDeselected }"></div>';
            var phone1StatusHtml = '<div ng-dropdown-multiselect="" options="phone1ActionItem" selected-model="phone1Model" checkboxes="true" extra-settings="dropSettings" translation-texts="phone1Texts" events="{ onItemSelect: onActionPhone1Selected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllPhone1Selected, onDeselectAll: onActionPhone1Deselected }"></div>';
            var phone2StatusHtml = '<div ng-dropdown-multiselect="" options="phone2ActionItem" selected-model="phone2Model" checkboxes="true" extra-settings="dropSettings" translation-texts="phone2Texts" events="{ onItemSelect: onActionPhone2Selected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllPhone2Selected, onDeselectAll: onActionPhone2Deselected }"></div>';
            var phone3StatusHtml = '<div ng-dropdown-multiselect="" options="phone3ActionItem" selected-model="phone3Model" checkboxes="true" extra-settings="dropSettings" translation-texts="phone3Texts" events="{ onItemSelect: onActionPhone3Selected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllPhone3Selected, onDeselectAll: onActionPhone3Deselected }"></div>';
            var emailStatusHtml = '<div ng-dropdown-multiselect="" options="emailActionItem" selected-model="emailModel" checkboxes="true" extra-settings="dropSettings" translation-texts="emailTexts" events="{ onItemSelect: onActionEmailSelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllEmailSelected, onDeselectAll: onActionEmailDeselected }"></div>';
            var dailyStatusHtml = '<div ng-dropdown-multiselect="" options="dailyActionItem" selected-model="dailyModel" checkboxes="true" extra-settings="dropSettings" translation-texts="dailyTexts" events="{ onItemSelect: onActionDailySelected, onItemDeselect: onActionDeselected, onSelectAll: onActionAllDailySelected, onDeselectAll: onActionDailyDeselected }"></div>';
            $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable().renderWith(makeCheckBoxHtml),
                DTColumnBuilder.newColumn(null).withTitle('').notSortable().renderWith(imageActionHtml),
                DTColumnBuilder.newColumn('lastName').withTitle(lastNameStatusHtml),
                DTColumnBuilder.newColumn('firstName').withTitle(firstNameStatusHtml),
                DTColumnBuilder.newColumn('phone1').withTitle(phone1StatusHtml),
                DTColumnBuilder.newColumn('phone2').withTitle(phone2StatusHtml),
                DTColumnBuilder.newColumn('phone3').withTitle(phone3StatusHtml),            
                DTColumnBuilder.newColumn('email').withTitle(emailStatusHtml),
                DTColumnBuilder.newColumn(null).withTitle('Daily Notifications').notSortable().renderWith(switchHtml),
                DTColumnBuilder.newColumn(null).withTitle(titleStatusHtml).notSortable().renderWith(activeStatusHtml).withClass('child-status')
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
                            '<input type="checkbox" ng-model="selected['+ data.sponsorId +']" ng-click="toggleOne(selected)" ng-checked="all">' +
                            '<span class="fa fa-check"></span>' +
                        '</label>' +
                    '</div>';
            return html;
        }

        // make image tag
        function imageActionHtml(data, type, full, meta) {
            var html, emailError;
            if(data.aspNetUsers_Email_Errors.length > 0) {
                angular.forEach(data.aspNetUsers_Email_Errors, function(aspNetUsers_Email_Error, key){
                    emailError = aspNetUsers_Email_Error.description;
                });
            } else {
                emailError = '';
            }
            
            var sponsor_info =  data.s3Path + ',' +
                                data.firstName + ',' +
                                data.lastName + ',' +
                                data.phone1 + ','+
                                data.phone2 + ','+
                                data.phone3 + ',' +
                                data.email + ',' +
                                data.accessCode + ',' +
                                data.isActive + ',' +
                                data.nDevices + ',' +
                                data.lastInvoiceUpdate + ',' +
                                data.notificationsSent + ',' +
                                emailError;
            //var sponsor_info = JSON.stringify(data);
            html = '<div class="media teacher-img">' + 
                        '<div class="user-block-picture">' +
                            '<div class="user-block-status" style="margin-top:5px;">' +
                            '<img src="' + data.s3Path + '" class="media-object img-responsive" ng-click="openPhoto(\''+ (sponsor_info.replace("'", "\\'")) +'\')">' +
                        '</div>' + 
                    '</div>' + 
                '</div>';
            return  html;
        }

        // make switch button
        function switchHtml(data, type, full, meta) {
            var html;
            var datas = data.sponsorId + ',' + data.dailyNotificationsOptIn;
            html =  '<div class="switch-buttons">'; 
            if(data.dailyNotificationsOptIn == true){
                html += '<i class="fa fa-toggle-on active" ng-click="changeNotificationStatus(\''+ (datas.replace("'", "\\'")) +'\')"></i>'+
                    '</div>';
            } else {
                html += '<i class="fa fa-toggle-on fa-rotate-180 inactive" ng-click="changeNotificationStatus(\''+ (datas.replace("'", "\\'")) +'\')"></i>' + 
                    '</div>';
            }
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

        // sponsor detail page 
        $scope.openPhoto = function (info) {
            var selectedSponsorInfo = info.split(',');
            $scope.imagePath = selectedSponsorInfo[0];
            $scope.firstName = selectedSponsorInfo[1];
            $scope.lastName = selectedSponsorInfo[2];
            $scope.phone1 = selectedSponsorInfo[3];
            if($scope.phone1 == 'null'){
                $scope.phone1 = '';
            }
            $scope.phone2 = selectedSponsorInfo[4];
            if($scope.phone2 == 'null'){
                $scope.phone2 = '';
            }
            $scope.phone3 = selectedSponsorInfo[5];
            if($scope.phone3 == 'null'){
                $scope.phone3 = '';        
            }
            $scope.email = selectedSponsorInfo[6];
            $scope.accesscode = selectedSponsorInfo[7];
            $scope.status = selectedSponsorInfo[8];
            $scope.deviceNum = selectedSponsorInfo[9];
            $scope.lastInvoiceUpdate = selectedSponsorInfo[10];
            $scope.notificationsSent = selectedSponsorInfo[11];
            $scope.emailError = selectedSponsorInfo[12];
            var dialog = ngDialog.open({
                template: 'sponsor-detail.html',
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
                $scope.activitySponsors = $scope.checkedSponsors;
                angular.forEach($scope.activitySponsors, function(activitySponsor){
                    item[activitySponsor.sponsorId] = true;
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
            } else if($scope.selectedItems.length == $scope.checkedSponsors.length) {
                $scope.showBtnAction = true; 
                $scope.selectAll = true;
            } else {
                $scope.selectAll = false;
                $scope.showBtnAction = true;
            }
        }


        // check selected Items.
        $scope.selectedAction = function(item) {
            $scope.selectAction = item.value;
            $scope.activitySponsors = [];
            if ($scope.selectAll == true) {
                $scope.activitySponsors = $scope.checkedSponsors;
            } else {
                angular.forEach($scope.selectedItems, function(selectedItem){
                    angular.forEach($scope.allSponsors, function(activity){
                        if(selectedItem == activity.sponsorId) {
                            $scope.activitySponsors.push(activity);
                        }
                    });
                });
            }                             
            // mass action
            if($scope.selectAction =='notification') {
                var datas = [];
                angular.forEach($scope.activitySponsors, function(activitySponsor, key){
                    datas.push(activitySponsor.sponsorId);
                });          
                
                SweetAlert.swal({
                    title: 'Input Notification',
                    text: '',
                    type: 'input',
                    inputType: 'text',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Send',
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true
                }, function(inputValue){
                       ApiService().sendNotification(
                        {
                            Sponsors: datas,
                            Comment:   inputValue,
                            SchoolName: $scope.schoolName
                        }
                    ).$promise.then(function(success){
                        console.log(success);
                        $scope.getAllActivities();
                        SweetAlert.swal('Changes Applied!', '', 'success');
                        ngDialog.close();
                        $scope.activitySponsors = []; // checked row's all info array
                        $scope.selectedItems = []; // checked row id array
                        $scope.items = []; // clicked row array
                        $scope.selected = {};
                        $scope.showBtnAction = false;
                        $scope.dtInstance.reloadData(function(result) {
                        }, true);
                    }); 
                });

            } else if($scope.selectAction =='code') {
                var datas = [];
                angular.forEach($scope.activitySponsors, function(activitySponsor, key){
                    var data = {email: activitySponsor.email, phone: activitySponsor.phone1}
                    datas.push(data);
                });
                SweetAlert.swal({   
                    title: 'Are you sure?',   
                    text: '',   
                    type: 'success',   
                    showCancelButton: true,   
                    confirmButtonColor: '#5d9cec',   
                    confirmButtonText: 'Apply',   
                    closeOnConfirm: false,                    
                    allowOutsideClick: false,
                    showLoaderOnConfirm: true
                }, function(isConfirm){
                    if(isConfirm) {
                        ApiService().generateAccessCode(
                            {
                                Sponsors: datas,
                                SchoolName: $scope.schoolName
                            }
                        ).$promise.then(function(success){
                            console.log(success);
                            $scope.getAllActivities();
                            SweetAlert.swal('Changes Applied!', '', 'success');
                            $scope.showBtnAction = false;
                            $scope.dtInstance.reloadData(function(result) {
                            }, true);
                            $scope.activitySponsors = []; // checked row's all info array
                            $scope.selectedItems = []; // checked row id array
                            $scope.items = []; // clicked row array
                            $scope.selected = {};
                        }); 
                    }                  
                });
            } else if($scope.selectAction =='album') {
                var dialog = ngDialog.open({
                    template: 'sponsor-album.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    theme: 'dialogwidth800'
                });
            } 
        }

        $scope.apply = function() {
            var datas = [];
            angular.forEach($scope.activitySponsors, function(activitySponsor, key){
                datas.push(activitySponsor.sponsorId);
            });            
            ApiService().sendNotification(
                {
                    Sponsors: datas,
                    Comment:   $scope.sendNotificationText,
                    SchoolName: $scope.schoolName
                }
            ).$promise.then(function(success){
                console.log(success);
                $scope.getAllActivities();
                SweetAlert.swal('Changes Applied!', '', 'success');
                ngDialog.close();
                $scope.activitySponsors = []; // checked row's all info array
                $scope.selectedItems = []; // checked row id array
                $scope.items = []; // clicked row array
                $scope.selected = {};
                $scope.showBtnAction = false;
                $scope.dtInstance.reloadData(function(result) {
                }, true);
            }); 
        }

        // close dialog 
        $scope.close = function() {
            ngDialog.close();
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

        //send notification
        $scope.changeNotificationStatus = function(data) {
            var selectedSponsorInfo = data.split(',');
            $scope.selectedId = selectedSponsorInfo[0];
            $scope.notificationStatus = selectedSponsorInfo[1];
            if($scope.notificationStatus == 'true') {
                var comment = 'Are you sure you want to: disable notifications for sponsor?';
            } else {
                var comment = 'Are you sure you want to: enable notifications for sponsor?';
            }
            var notification = false;
            if($scope.notificationStatus == 'true')
                notification = "false";
            else
                notification = "true";
            
            SweetAlert.swal({   
                title: 'Are you sure?',   
                text: comment,   
                type: 'success',   
                showCancelButton: true,   
                confirmButtonColor: '#5d9cec',   
                confirmButtonText: 'Apply',   
                closeOnConfirm: false,
                allowOutsideClick: false,
                showLoaderOnConfirm: true
            }, function(isConfirm){
                if(isConfirm) {                    
                    console.log(SweetAlert.swal);
                    ApiService().updateDailyNotification(
                        {
                            "schoolName": $scope.schoolName,
                            "sponsor": {
                                "sponsorId": $scope.selectedId,
                                "dailyNotificationsOptIn": notification
                            }                    
                        }
                    ).$promise.then(function(success){
                        console.log(success);
                        $scope.getAllActivities();
                        SweetAlert.swal('Changes Applied!', '', 'success');
                        ngDialog.close();
                        $scope.activitySponsors = []; // checked row's all info array
                        $scope.selectedItems = []; // checked row id array
                        $scope.items = []; // clicked row array
                        $scope.selected = {};
                        $scope.showBtnAction = false;
                        $scope.dtInstance.reloadData(function(result) {
                        }, true);
                    });
                }                  
            });           
        }      
        
        ////////////////////////////////

        // checked item
        $scope.onActionStatusSelected = function(item) {
            if(item.label == 'Active')
                $scope.checkedActiveStatus.push(true);
            else
                $scope.checkedActiveStatus.push(false);    
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        $scope.onActionLastSelected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedLastName.push(null);
            else
                $scope.checkedLastName.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionFirstSelected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedFirstName.push(null);
            else
                $scope.checkedFirstName.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionPhone1Selected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedPhone1.push(null);
            else
                $scope.checkedPhone1.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionPhone2Selected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedPhone2.push(null);
            else
                $scope.checkedPhone2.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionPhone3Selected = function(item) {
            if(item.label == "(blank)")
                $scope.checkedPhone3.push(null);
            else
                $scope.checkedPhone3.push(item.label);
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
        $scope.onActionDailySelected = function(item){
            if(item.label == "(blank)")
                $scope.checkedDaily.push(null);
            else
                $scope.checkedDaily.push(item.label);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        // unchecked item
        $scope.onActionDeselected = function (item) {
            $scope.checkedActiveStatus = removeUncheckedItem($scope.checkedActiveStatus, item);
            $scope.checkedLastName = removeUncheckedItem($scope.checkedLastName, item);
            $scope.checkedFirstName = removeUncheckedItem($scope.checkedFirstName, item);
            $scope.checkedPhone1 = removeUncheckedItem($scope.checkedPhone1, item);
            $scope.checkedPhone2 = removeUncheckedItem($scope.checkedPhone2, item);
            $scope.checkedPhone3 = removeUncheckedItem($scope.checkedPhone3, item);
            $scope.checkedEmail = removeUncheckedItem($scope.checkedEmail, item);
            $scope.checkedDaily = removeUncheckedItem($scope.checkedDaily, item);
            console.log($scope.checkedActiveStatus);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        function removeUncheckedItem(arr, item) {
            if(arr != $scope.checkedActiveStatus) {
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
            $scope.checkedActiveStatus = [];
            angular.forEach($scope.selectActionItem, function(value, key){
                if(value.label == 'Active')
                    $scope.checkedActiveStatus.push(true);
                else
                    $scope.checkedActiveStatus.push(false);
            });
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        $scope.onActionAllLastSelected = function () {
            $scope.checkedLastName = checkedAllItem($scope.lastNameActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllFirstSelected = function () {
            $scope.checkedFirstName = checkedAllItem($scope.firstNameActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllPhone1Selected = function () {
            $scope.checkedPhone1 = checkedAllItem($scope.phone1ActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllPhone2Selected = function () {
            $scope.checkedPhone2 = checkedAllItem($scope.phone2ActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllPhone3Selected = function () {
            $scope.checkedPhone3 = checkedAllItem($scope.phone3ActionItem);
            $scope.dtInstance.reloadData(function(result) {
            }, true);   
        }
        $scope.onActionAllEmailSelected = function () {
            $scope.checkedEmail = checkedAllItem($scope.emailActionItem);
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
            $scope.checkedActiveStatus = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionLastDeselected = function() {
            $scope.checkedLastName = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionFirstDeselected= function() {
            $scope.checkedFirstName = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionPhone1Deselected = function() {
            $scope.checkedPhone1 = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionPhone2Deselected = function() {
            $scope.checkedPhone2 = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionPhone3Deselected = function() {
            $scope.checkedPhone3 = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionEmailDeselected = function() {
            $scope.checkedEmail = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.onActionDailyDeselected = function() {
            $scope.checkedDaily = [];
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        ////////////////////

        // clear all filter
        $scope.clearAllFilter = function () {
            $scope.checkedLastName = [];
            $scope.checkedFirstName = [];
            $scope.checkedPhone1 = [];
            $scope.checkedPhone2 = [];
            $scope.checkedPhone3 = [];
            $scope.checkedEmail = [];
            $scope.checkedActiveStatus = [];

            $scope.lastModel = [];
            $scope.firstModel = [];
            $scope.phone1Model = [];
            $scope.phone2Model = [];
            $scope.phone3Model = [];
            $scope.emailModel = [];
            $scope.dailyModel = [];
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
            var lastNameArr = [], firstNameArr = [], phone1Arr = [], phone2Arr = [], phone3Arr = [], emailArr = [];
            ApiService().getSponsor(
                {
                    count: $scope.count,
                    filter: $scope.filter,
                    group: $scope.group,
                    page: $scope.page,
                    schoolName: $scope.schoolName,
                    sorting: $scope.soting      
                }
            ).$promise.then(function(result){                
                angular.forEach(result.data, function(sponsor, key){
                    lastNameArr.push(sponsor.lastName);
                    firstNameArr.push(sponsor.firstName);
                    phone1Arr.push(sponsor.phone1);
                    phone2Arr.push(sponsor.phone2);
                    phone3Arr.push(sponsor.phone3);
                    emailArr.push(sponsor.email);
                });
                $scope.lastNameActionItem = removeDuplicatesFromObjArray(lastNameArr);
                $scope.firstNameActionItem = removeDuplicatesFromObjArray(firstNameArr);
                $scope.phone1ActionItem = removeDuplicatesFromObjArray(phone1Arr);
                $scope.phone2ActionItem = removeDuplicatesFromObjArray(phone2Arr);
                $scope.phone3ActionItem = removeDuplicatesFromObjArray(phone3Arr);
                $scope.emailActionItem = removeDuplicatesFromObjArray(emailArr);
            });
        }

        $scope.init = function() {
            $scope.count = 25;
            $scope.filter = {};
            $scope.group = {};
            $scope.page = 1;         
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

        angular.element('body').on('search.dt', function(e, api) {  
           if(!$scope.$$phase) { 
                $scope.$apply(function() {
                    $scope.searchTerm = api.oPreviousSearch;
                    $scope.searchTerm.table = e.target.id;
                }); 
            }
            $scope.filter = $scope.searchTerm.sSearch;
            console.log($scope.filter);
       })

        // page nation
        $scope.setPagePrevNum = function() {
            if($scope.page > 1) {
                $scope.page = $scope.page - 1;
            } else {
                $scope.page = 1;
            }
            console.log($scope.page);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        $scope.setPageNextNum = function() {
            $scope.page = $scope.page + 1;
            console.log($scope.page);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }
        $scope.setPageCurrentNum = function(page) {
            $scope.page = page;
            console.log($scope.page);
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }  

        $scope.setCount = function(count) {
            $scope.count = count;
            $scope.page = 1;            
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }


        $rootScope.$on('ngDialog.opened', function (e, $dialog) {
            console.log('ngDialog opened: ' + $dialog.attr('id'));
        });

        $rootScope.$on('ngDialog.closed', function (e, $dialog) {
            console.log('ngDialog closed: ' + $dialog.attr('id'));
        });

        $rootScope.$on('ngDialog.closing', function (e, $dialog) {
            console.log('ngDialog closing: ' + $dialog.attr('id'));
        });


    }
})();
