(function () {
    'use strict';

    angular
        .module('app.coupons')
        .controller('CouponsImageModelCtrl', CouponsImageModelCtrl);

    CouponsImageModelCtrl.$inject = [
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
        "$filter",
        "$interval",
        "SweetAlert"
    ];

    function CouponsImageModelCtrl(
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
        $filter,
        $interval,
        SweetAlert
    ) {
        $scope.dtInstance = {};
        $scope.image = null;
        $scope.imageFileName = '';
        $scope.uploadme = {};
        $scope.uploadme.src = '';
        $scope.visibility = false;
        $scope.firstRun = true;
        $scope.showLoadingBar = false;
        $scope.showTableData = true;
        $scope.pageNation = false;
        $scope.checkedStatus = []; // checked action status array
        $scope.dropSettings = { enableSearch: true, dynamicTitle: false };

        $scope.descriptionActionItem = [];
        $scope.beginDateActionItem = [];
        $scope.endDateActionItem = [];
        $scope.descriptionTexts = { buttonDefaultText: 'Description' };
        $scope.beginDateTexts = { buttonDefaultText: 'Begin Date' };
        $scope.endDateTexts = { buttonDefaultText: 'End Date' };
       
        $scope.count = 25;
        $scope.filter = {};
        $scope.group = {};
        $scope.page = 1;
        if(typeof $rootScope.ddSelectCenterSelected !='undefined')
            $scope.schoolName = $rootScope.ddSelectCenterSelected.id;
        else
            $scope.schoolName = 6436;
        $scope.soting = { lastName: 'asc' };

        $scope.showCalendar = function () {
            if($scope.visibility == false) {
                $scope.visibility = !$scope.visibility;
            } else {
               $scope.visibility = !$scope.visibility;
            }
        }
        activate();

        function activate() {
            $rootScope.theme = 'ngdialog-theme-default dialogwidth800';
            $scope.checkedIsActive = true;            
            $scope.checkedAll = false;
            $scope.selectAll = false;


            $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function(){
                var defer = $q.defer();
                $http.get('server/coupons-table.json').then(function(result){
                    var result = result.data;
                    if($scope.firstRun == true) {
                        $scope.firstRun = false;
                        $scope.checkedCoupons = [];
                        angular.forEach(result.data, function(coupon){
                            $scope.checkedCoupons.push(coupon);
                        });
                    } else {
                        $scope.checkedCoupons = [];
                        angular.forEach($scope.checkedStatus, function(checkedStatus){
                            angular.forEach(result.data, function(coupon){
                                if(checkedStatus.label == coupon.description || checkedStatus.label == coupon.beginDate || checkedStatus.label == coupon.endDate) {
                                    $scope.checkedCoupons.push(coupon);    
                                }                                
                            });
                        });
                    }
                    $scope.showLoadingBar = false;
                    $scope.showTableData = true;
                    $scope.pageNation = true;
                    defer.resolve($scope.checkedCoupons);
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
            var titleHtml = '<div class="checkbox c-checkbox">'+
                                '<label>' +
                                    '<input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll)">' +
                                    '<span class="fa fa-check"></span>' +
                                '</label>' +
                            '</div>';
            var descriptionStatusHtml = '<div ng-dropdown-multiselect="" options="descriptionActionItem" selected-model="checkedStatus" checkboxes="true" extra-settings="dropSettings" translation-texts="descriptionTexts" events="{ onItemSelect: onActionSelected, onItemDeselect: onActionSelected, onSelectAll: onActionSelected, onDeselectAll: onActionSelected }"></div>';
            var beginDateStatusHtml = '<div ng-dropdown-multiselect="" options="beginDateActionItem" selected-model="checkedStatus" checkboxes="true" extra-settings="dropSettings" translation-texts="beginDateTexts" events="{ onItemSelect: onActionSelected, onItemDeselect: onActionSelected, onSelectAll: onActionSelected, onDeselectAll: onActionSelected }"></div>';
            var endDateStatusHtml = '<div ng-dropdown-multiselect="" options="endDateActionItem" selected-model="checkedStatus" checkboxes="true" extra-settings="dropSettings" translation-texts="endDateTexts" events="{ onItemSelect: onActionSelected, onItemDeselect: onActionSelected, onSelectAll: onActionSelected, onDeselectAll: onActionSelected }"></div>';
            $scope.dtColumns = [
                DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable().renderWith(makeCheckBoxHtml),
                DTColumnBuilder.newColumn(null).withTitle('Coupon').notSortable().renderWith(makeImageHtml),
                DTColumnBuilder.newColumn('description').withTitle(descriptionStatusHtml),
                DTColumnBuilder.newColumn(null).withTitle(beginDateStatusHtml).renderWith(makeBeginDateHtml),
                DTColumnBuilder.newColumn(null).withTitle(endDateStatusHtml).renderWith(makeEndDateHtml),
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
                            '<input type="checkbox" ng-model="selected['+ data.couponId +']" ng-click="toggleOne(selected)" ng-checked="all">' +
                            '<span class="fa fa-check"></span>' +
                        '</label>' +
                    '</div>';
            return html;
        }

        // make image
        function makeImageHtml(data, type, full, meta) {
            var html;

            if(data.fileName != null) {
                html = '<div class="media children-img">' + 
                        '<div class="user-block-picture">' +
                            '<div class="user-block-status" style="margin-top:5px;">' +
                                '<img src="' + data.fileName + '" class="media-object img-responsive">' +
                            '</div>' + 
                        '</div>' + 
                    '</div>';
   
            } else {
                html = '<div class="media children-img">' + 
                        '<div class="user-block-picture">' +
                            '<div class="user-block-status" style="margin-top:5px;">' +
                                '<img src="https://cdn.mytle.com/icons/placeholders/placeholder_M.jpg" class="media-object img-responsive">' +
                            '</div>' + 
                        '</div>' + 
                    '</div>';
            }
            return html;
            
        }

        // make Action status change
        function statusActionHtml(data, type, full, meta) {
            var html, coupon_info;
            coupon_info = data.couponId + ',' + data.description + ',' + data.fileName + ',' + data.state + ',' + data.location + ',' + data.beginDate + ',' + data.endDate;
            html = '<div class="btn-group">' +
                        '<button type="button" class="btn btn-primary" ng-click="showEditCoupon(\''+ (coupon_info.replace("'", "\\'")) +'\')" data-tooltip="Edit">' +
                            '<i class="fa fa-edit"></i>' +
                        '</button>' +
                        '<button type="button" class="btn btn-danger" ng-click="deleteCoupon(\''+ data.couponId + '\')" data-tooltip="Remove">' +
                            '<i class ="fa fa-trash"></i>' +
                        '</button>' +
                    '</div>';
            return html;
        }

        // make Begin Date
        function makeBeginDateHtml(data, type, full, meta) {
            var html;
            var beginDate = $filter('date')(new Date(data.beginDate), 'yyyy-MM-dd');
            html = '' + beginDate +'' ;
            return html;
        }
        
        // make end Date
        function makeEndDateHtml(data, type, full, meta) {
            var html, endDate;
            endDate = $filter('date')(new Date(data.endDate), 'yyyy-MM-dd');
            html = '' + endDate + '' ;
            return html;
        }

        // select all checkbox
        $scope.toggleAll = function (selectAll) {
            if(selectAll == true) {
                $scope.all = true;
            } else {
                $scope.all = false;
            }
        }

        // select item
        $scope.toggleOne = function(selectedItems) {
            $scope.selectedItems = selectedItems;
            for (var id in selectedItems) {
                if(selectedItems.hasOwnProperty(id)) {
                    if(!selectedItems[id]) {
                        $scope.selectAll = false;
                        return;
                    }
                }
            }
            $scope.selectAll = true;
        }

        // edit Coupon
        $scope.showEditCoupon = function (data) {
            var couponInfo = data.split(",");
            $scope.couponId = couponInfo[0];
            $scope.description = couponInfo[1];
            $scope.imagePath = couponInfo[2];
            $scope.state = couponInfo[3];
            $scope.location = couponInfo[4];
            $scope.fromDate = $filter('date')(new Date(couponInfo[5]), 'yyyy-MM-dd') ;
            $scope.toDate = $filter('date')(new Date(couponInfo[6]), 'yyyy-MM-dd') ;
            var dialog = ngDialog.open({
                template: 'coupon-edit.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                theme: 'dialogwidth800'
            });
            
            dialog.closePromise.then(function (data) {
                console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
            }); 
        }

        // add Coupon
        $scope.showAddCoupon = function () {
            $scope.couponId = '';
            $scope.description = '';
            $scope.imagePath = '';
            $scope.state = '';
            $scope.location = '';
            $scope.fromDate = '';
            $scope.toDate = '';
            var dialog = ngDialog.open({
                template: 'coupon-add.html',
                className: 'ngdialog-theme-default',
                scope: $scope,
                theme: 'dialogwidth800'
            });
           
            dialog.closePromise.then(function (data) {
                console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
            }); 
        }

        // delete Coupon
        $scope.deleteCoupon = function (id) {
            SweetAlert.swal({   
                title: 'Are you sure?',   
                text: 'This item will delete',   
                type: 'warning',   
                showCancelButton: true,   
                confirmButtonColor: '#DD6B55',   
                confirmButtonText: 'Yes, delete it!',
                closeOnConfirm: false
            },  function(){  
                SweetAlert.swal('Deleted!','', 'success');
            });
        }

        // new coupon
        $scope.addCoupon = function () {
            ngDialog.close();
            SweetAlert.swal('Well done!', 'Operation Applied', 'success');
        }

        // update coupon
        $scope.editCoupon = function () {
            ngDialog.close();
            SweetAlert.swal('Well done!', 'Operation Applied', 'success'); 
        }

        // input value clear
        $scope.clearInputValue = function (value) {
            if(value == 'location')
                $scope.location = '';
            else if(value == 'city')
                $scope.city = '';
            else if(value == 'state')
                $scope.state = '';
            else
                $scope.zipCode = '';
        }

        // all actions for all action status.
        $scope.onActionSelected = function(item) {
            $scope.dtInstance.reloadData(function(result) {
            }, true);
        }

        // clear all filter
        $scope.clearAllFilter = function () {
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
            var desArr = [], beginArr = [], endArr = [];
            $http.get('server/coupons-table.json').then(function(result){
                angular.forEach(result.data.data, function(coupon, key){
                    desArr.push(coupon.description);
                    beginArr.push(coupon.beginDate);
                    endArr.push(coupon.endDate);
                });
                $scope.descriptionActionItem = removeDuplicatesFromObjArray(desArr);
                $scope.beginDateActionItem = removeDuplicatesFromObjArray(beginArr);
                $scope.endDateActionItem = removeDuplicatesFromObjArray(endArr);
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