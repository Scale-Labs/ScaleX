angular.module('SLModule.uploadCatalogue')

    .controller('UploadCatalogueController', ["$scope", "$uibModal", "$window", "slDashboardConfig", "localStorageService", "SharedService", "UploadCatalogueService","FileSaver",
        function($scope, $uibModal, $window, slDashboardConfig, localStorageService, SharedService, UploadCatalogueService,FileSaver) {
            console.log('UploadCatalogueController');

            $scope.fileName = "No File Selected";
            $scope.oJS = [];

            $scope.disableUploadButton = true;
            $scope.disableDownloadButton = true;
            $scope.disableSellerUB = false;

            var options = {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            };
            $scope.updatedAt = new Date();
            $scope.formattedDate = $scope.updatedAt.toLocaleTimeString("en-us", options);

            $scope.alerts = {
                "alert": false,
                "type": "",
                "msg": ""
            };

            $scope.closeAlert = function() {
                $scope.alerts.alert = false;
            };


            userData = localStorageService.get('userData');
            userName = userData.userName;
            groupName = userData.groupName;

            $scope.managerList = ["Select"];
            $scope.sellerList = ["Select"];
            $scope.selectedManager = "Select";
            $scope.selectedSeller = "Select";

            $scope.isAdmin = (groupName === "ADMIN") ? true : false;
            $scope.isManager = (groupName === "MANAGER") ? true : false;
            $scope.isSeller = (groupName === "SELLER") ? true : false;

            $scope.selectedSeller = (groupName === "SELLER") ? userName : "Select";
            $scope.selectedManager = (groupName === "MANAGER") ? userName : "Select";

            if ($scope.selectedManager === "Select" && $scope.selectedSeller === "Select") {
                $scope.alerts.alert = true;
                $scope.alerts.type = 'warning';
                $scope.alerts.msg = "Please Select Manager to display the Seller List!!";
            }

            $scope.mpList = ["Select", "amazon", "ebay", "cDiscount", "lazada", "elevenStreet", "sears", "etsy"];
            $scope.catList = ["Select"];
            amazonCat = ["autoaccessory", "baby", "beauty", "clothing", "computers", "consumerelectronics", "foodandbeverages", "furniture", "giftcards", "health", "home", "lawnandgarden", "luggage", "musicalinstruments", "office", "petsupplies", "shoes", "sports", "toys", "watches", "jewelry"];
            lazadaCat = ["Bedding_Bath", "Cameras", "Computers_Laptops", "Digital_Goods", "Fashion", "Furniture_Décor", "Groceries", "Home_Appliances", "Health_Beauty", "Kitchen_Dining", "Laundry_Cleaning", "Mobiles_Tablets", "Media_Music_Books", "Mother_Baby", "Pet_Supplies", "Motors", "Stationery_Craft", "Sports_Outdoors", "Toys_Games", "Tools_DIY", "TV_Audio_Video_Gaming_Wearables", "Bags_Travel"];
            cDiscountCat = ["ADULT_EROTIC", "ARTICLES_FOR_SMOKERS", "BEDDING", "BEEKEEPING", "BLU-RAY_DVD", "BOOKSHOP", "CARS_MOTORCYCLES", "CLOTHING_LINGERIE", "COMPUTING", "CREATIVE_HOBBIES_FINE_ARTS_STATIONARY", "DECORATION_LINEN_LIGHTS", "DIY_TOOLS_HARDWARE", "EARLY_CHILDHOOD_CARE", "ELECTRONICS", "FRANPRIX_BIO_DIETETIQUE", "FRANPRIX_CHARCUTERIE_TRAITEUR", "FRANPRIX_CREMERIE_AND_OEUFS", "FRANPRIX_EPICERIE_SALEE", "FRANPRIX_EPICERIE_SUCREE", "FRANPRIX_FRUIT_AND_LEGUME", "FRANPRIX_LE_PRET_A_MANGER", "FRANPRIX_PAIN_PATISSERIE", "FRANPRIX_PROMOS_ET_BONS_PLANS", "FRANPRIX_VIANDE_AND_POISSON", "FRESH_PRODUCE", "FROZEN_PRODUCTS", "FUNERARY", "FURNISHING_UNIT", "GARDEN_SWIMMING_POOL", "GIFT_BOX", "GROCERY", "HABERDASHERY", "HANDLING", "HARDWARE_SHOP", "HOME_APPLIANCES", "HYGIENE_BEAUTY_PERFUME", "JEWELLERY_GLASSES_WATCHES", "LUGGAGE", "MEDICAL_EQUIPMENT", "MOTOR_BOAT_SAILBOAT", "MUSIC", "MUSICAL_INSTRUMENTS", "OFFICE_EQUIPMENT", "PA_DJ_SOUND", "PACKAGING", "PARAPHARMACEUTICAL_PRODUCT", "PARTNER_OFFERS", "PET_SHOP", "PHOTO_OPTICAL", "POINT_OF_SALE-COMMERCE_ADMINISTRATION", "PROFESSIONAL_DRESS", "SHOES_ACCESSORIES", "SPORT", "SPORT_COMBAT_WEAPONS", "SUBSCRIPTION___SERVICE", "TABLEWARE_CULINARY_ITEMS", "TATOOING_PIERCING", "TELEPHONE_GPS", "TOY", "TV_VIDEO_AUDIO", "URBAN_DEVELOPMENT_ROADS", "VIDEO_GAMES", "WINE_SPIRITS_LIQUIDS"];
            searsCat = ["Clothing"];


            $scope.selectedMP = "Select";
            $scope.selectedCat = "Select";


            /*$scope.mpChanged = function() {
                $scope.disableSellerUB = $scope.selectedMP === "Select" ? true : false;

                console.log("Market Place Changed : ", $scope.selectedMP);

                if ($scope.selectedMP === "amazon") {
                    $scope.catList = ["Select", "autoaccessory", "baby", "beauty", "clothing", "computers", "consumerelectronics", "foodandbeverages", "furniture", "giftcards", "health", "home", "lawnandgarden", "luggage", "musicalinstruments", "office", "petsupplies", "shoes", "sports", "toys", "watches", "jewelry"];
                    $scope.selectedCat = "Select";
                } else if ($scope.selectedMP === "lazada") {
                    $scope.catList = ["Select", "Bedding_Bath", "Cameras", "Computers_Laptops", "Digital_Goods", "Fashion", "Furniture_Décor", "Groceries", "Home_Appliances", "Health_Beauty", "Kitchen_Dining", "Laundry_Cleaning", "Mobiles_Tablets", "Media_Music_Books", "Mother_Baby", "Pet_Supplies", "Motors", "Stationery_Craft", "Sports_Outdoors", "Toys_Games", "Tools_DIY", "TV_Audio_Video_Gaming_Wearables", "Bags_Travel"];
                    $scope.selectedCat = "Select";
                } else if ($scope.selectedMP === "elevenStreet") {
                    $scope.catList = ["Select"];
                    $scope.selectedCat = "Select";
                } else if ($scope.selectedMP === "sears") {
                    $scope.catList = ["Select", "Clothing"];
                    $scope.selectedCat = "Select";
                } else if ($scope.selectedMP === "cDiscount") {
                    $scope.catList = ["Select", "ADULT_EROTIC", "ARTICLES_FOR_SMOKERS", "BEDDING", "BEEKEEPING", "BLU-RAY_DVD", "BOOKSHOP", "CARS_MOTORCYCLES", "CLOTHING_LINGERIE", "COMPUTING", "CREATIVE_HOBBIES_FINE_ARTS_STATIONARY", "DECORATION_LINEN_LIGHTS", "DIY_TOOLS_HARDWARE", "EARLY_CHILDHOOD_CARE", "ELECTRONICS", "FRANPRIX_BIO_DIETETIQUE", "FRANPRIX_CHARCUTERIE_TRAITEUR", "FRANPRIX_CREMERIE_AND_OEUFS", "FRANPRIX_EPICERIE_SALEE", "FRANPRIX_EPICERIE_SUCREE", "FRANPRIX_FRUIT_AND_LEGUME", "FRANPRIX_LE_PRET_A_MANGER", "FRANPRIX_PAIN_PATISSERIE", "FRANPRIX_PROMOS_ET_BONS_PLANS", "FRANPRIX_VIANDE_AND_POISSON", "FRESH_PRODUCE", "FROZEN_PRODUCTS", "FUNERARY", "FURNISHING_UNIT", "GARDEN_SWIMMING_POOL", "GIFT_BOX", "GROCERY", "HABERDASHERY", "HANDLING", "HARDWARE_SHOP", "HOME_APPLIANCES", "HYGIENE_BEAUTY_PERFUME", "JEWELLERY_GLASSES_WATCHES", "LUGGAGE", "MEDICAL_EQUIPMENT", "MOTOR_BOAT_SAILBOAT", "MUSIC", "MUSICAL_INSTRUMENTS", "OFFICE_EQUIPMENT", "PA_DJ_SOUND", "PACKAGING", "PARAPHARMACEUTICAL_PRODUCT", "PARTNER_OFFERS", "PET_SHOP", "PHOTO_OPTICAL", "POINT_OF_SALE-COMMERCE_ADMINISTRATION", "PROFESSIONAL_DRESS", "SHOES_ACCESSORIES", "SPORT", "SPORT_COMBAT_WEAPONS", "SUBSCRIPTION___SERVICE", "TABLEWARE_CULINARY_ITEMS", "TATOOING_PIERCING", "TELEPHONE_GPS", "TOY", "TV_VIDEO_AUDIO", "URBAN_DEVELOPMENT_ROADS", "VIDEO_GAMES", "WINE_SPIRITS_LIQUIDS"];
                    $scope.selectedCat = "Select";
                } else if ($scope.selectedMP === "ebay") {
                    $scope.catList = ["Select"];
                    $scope.selectedCat = "Select";
                }
            }

            $scope.catChanged = function() {
                // $scope.disableSellerUB = $scope.selectedMP === "Select" ? true : false;
            }*/

            $scope.managerUpload = function() {

                managerUploadReq = {
                    "user": {
                        "sellerName": $scope.selectedSeller
                    },
                    "productDetails": []
                };
                var rowsSelected = $scope.gridApi.selection.getSelectedRows();


                rowsSelected.forEach(function(data) {
                    var temp = {
                        "id": "",
                        "marketPlace": "",
                        "productCategory": ""
                    };
                    temp.id = data.id;
                    temp.marketPlace = data.marketPlace;
                    temp.productCategory = data.productCategory;
                    managerUploadReq.productDetails.push(temp);
                });


                $scope.onLoad = true;
                UploadCatalogueService.managerUploadCatalogue(managerUploadReq).success(function(result) {
                    if (result.responseCode === 0) {
                        $scope.onLoad = false;
                        getAllProducts();
                    } else {
                        $scope.onLoad = false;
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'danger';
                        $scope.alerts.msg = result.errorMsg;
                    }
                }).
                error(function(data, status, headers, config) {
                    $scope.onLoad = false;
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'danger';
                    $scope.alerts.msg = SharedService.getErrorMessage(status);
                });


            };

            $scope.populateSeller = function() {

                $scope.alerts.alert = false;

                if ($scope.selectedManager === "Select") {
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'warning';
                    $scope.alerts.msg = "Please Select Manager to display the Seller List!!";

                    $scope.sellerList = ["Select"];
                    $scope.selectedSeller = "Select";

                    $scope.orderDetailsGridData = [];

                } else {
                    var getASRequest = {
                        "userName": userName,
                        "user": {
                            "managerUserName": $scope.selectedManager
                        }
                    };

                    $scope.onSyncFS = true;
                    SharedService.getAllocateSellers(getASRequest).success(function(result) {
                        $scope.onSyncFS = false;
                        if (result.responseCode === 0 && result.response.allocatedUser) {

                            _.forEach(result.response.allocatedUser, function(data) {
                                $scope.sellerList.push(data.value);
                            });


                        } else {
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = result.errorMsg;
                            $scope.disableSubmit = false;
                        }
                    }).
                    error(function(data, status, headers, config) {
                        $scope.onGetSeller = false;
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'danger';
                        $scope.alerts.msg = SharedService.getErrorMessage(status);
                    });
                }
            };
            $scope.getAP = function() {
                getAllProducts();
            };
            getAllProducts = function() {

                $scope.onLoad = true;
                request = {
                    "userName": $scope.selectedSeller
                };
                $scope.productDetailsData = [];
                UploadCatalogueService.getAllProducts(request).success(function(result) {
                    if (result.responseCode === 0) {
                        
                        result.response.productDetails.forEach(function(data) {
                            $scope.productDetailsData.push(data);

                        });
                        $scope.onLoad = false;
                    } else {
                        $scope.onLoad = false;
                        $scope.alert.alert = true;
                        $scope.alert.type = 'danger';
                        $scope.alert.msg = result.errorMsg;
                    }
                }).
                error(function(data, status, headers, config) {
                    $scope.onLoad = false;
                    $scope.alert.alert = true;
                    $scope.alert.type = 'danger';
                    $scope.alert.msg = SharedService.getErrorMessage(status);
                });
            };


            if ($scope.isSeller == true) {
                getAllProducts();
            }


            if ($scope.isManager == true) {
                $scope.populateSeller();
            }
            $scope.productDetailsData = [];
            $scope.selectedRow = [];
            $scope.productDetails = {};
            $scope.productDetails.data = 'productDetailsData';
            $scope.productDetails.enableRowSelection = $scope.isManager || $scope.isSeller ? true : false;
            $scope.productDetails.enableSelectAll = $scope.isManager || $scope.isSeller ? true : false;
            $scope.productDetails.selectionRowHeaderWidth = 35;
            $scope.productDetails.enableSorting = true;
            $scope.productDetails.enableColumnResizing = true;
            $scope.productDetails.enableFiltering = false;
            $scope.productDetails.enableGridMenu = true;
            $scope.productDetails.enableRowHeaderSelection = $scope.isManager || $scope.isSeller ? true : false;
            $scope.productDetails.modifierKeysToMultiSelect = false;
            $scope.productDetails.noUnselect = false;
            $scope.productDetails.rowHeight = 35
            $scope.productDetails.showGridFooter = true;
            $scope.productDetails.showColumnFooter = false;
            $scope.productDetails.paginationPageSizes = [10, 20, 30];
            $scope.productDetails.paginationPageSize = 10;
            $scope.productDetails.exporterMenuCsv = false;
            $scope.productDetails.exporterMenuPdf = false;
            $scope.productDetails.enableFullRowSelection = true;
            $scope.productDetails.multiSelect = true;


            $scope.productDetails.columnDefs = [
		{
                    displayName: 'Seller Sku',
                    name: 'sellerSku',
                    width: 150,
                    enableColumnMenu: false,
                    visible: true
		},
		{
                    displayName: 'Brand',
                    name: 'brand',
                    width: 150,
                    enableColumnMenu: false,
                    visible: true
                },
		{
			displayName: 'Product Name',
			name: 'name',
                        width: 300,
                        enableColumnMenu: false,
                        visible: true
		},
                {
                    displayName: 'Product Color',
                    name: 'color',
                    width: 130,
                    enableColumnMenu: false,
                    visible: true
                },
		{
                    model: 'Model',
                    name: 'model',
                    width: 130,
                    enableColumnMenu: false,
                    visible: true
		},
                {
                    displayName: 'Quantity',
                    name: 'quantity',
                    width: 100,
                    enableColumnMenu: false,
                    visible: true
                },
                {
                    displayName: 'Price',
                    name: 'price',
                    width: 100,
                    enableColumnMenu: false,
                    visible: true
                },
                {
                    displayName: 'Lazada Upload Status',
                    name: 'lazadaUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                },
                {
                    displayName: '11Street Upload Status',
                    name: 'elevenStreetUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                },
                {
                    displayName: 'Sears Upload Status',
                    name: 'searsUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                },
                {
                    displayName: 'Ebay Upload Status',
                    name: 'ebayUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                },
                {
                    displayName: 'Amazon-US Upload Status',
                    name: 'amazonUsUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                },
                {
                    displayName: 'Amazon-CA Upload Status',
                    name: 'amazonCaUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                },
                {
                    displayName: 'Amazon-MX Upload Status',
                    name: 'amazonMxUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                },
                {
                    displayName: 'Amazon-UK Upload Status',
                    name: 'amazonUkUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                },
                {
                    displayName: 'Amazon-FR Upload Status',
                    name: 'amazonFrUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                },
                {
                    displayName: 'Amazon-DE Upload Status',
                    name: 'amazonDeUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                },
                {
                    displayName: 'Amazon-IT Upload Status',
                    name: 'amazonItUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                },
                {
                    displayName: 'Amazon-ES Upload Status',
                    name: 'amazonEsUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                },
                {
                    displayName: 'cDiscount Upload Status',
                    name: 'cDiscountUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                },
                {
                    displayName: 'Etsy Upload Status',
                    name: 'etsyUploadStatus',
                    width: 140,
                    enableColumnMenu: false,
                    visible: false
                }
            ];

            $scope.toggleMultiSelect = function() {
                $scope.gridApi.selection.setMultiSelect(!$scope.gridApi.grid.options.multiSelect);
            };

            $scope.toggleModifierKeysToMultiSelect = function() {
                $scope.gridApi.selection.setModifierKeysToMultiSelect(!$scope.gridApi.grid.options.modifierKeysToMultiSelect);
            };

            $scope.selectAll = function() {
                $scope.gridApi.selection.selectAllRows();
            };

            $scope.clearAll = function() {
                $scope.gridApi.selection.clearSelectedRows();
            };

            $scope.toggleRow1 = function() {
                $scope.gridApi.selection.toggleRowSelection($scope.productDetails.data[0]);
            };

            $scope.toggleFullRowSelection = function() {
                $scope.productDetails.enableFullRowSelection = !$scope.productDetails.enableFullRowSelection;
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
            };




            $scope.setSelectable = function() {
                $scope.gridApi.selection.clearSelectedRows();
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            };


            $scope.productDetails.onRegisterApi = function(gridApi) {
                //set gridApi on scope
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                    if ($scope.gridApi.selection.getSelectedRows().length > 0) {
                        $scope.disableUploadButton = false;
                    } else {
                        $scope.disableUploadButton = true;
                    }
                    if ($scope.gridApi.selection.getSelectedRows().length > 0) {
                        $scope.disableDownloadButton = false;
                    } else {
                        $scope.disableDownloadButton = true;
                    }

                });

                gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                    if ($scope.gridApi.selection.getSelectedRows().length > 0) {
                        $scope.disableUploadButton = false;

                    } else {
                        $scope.disableUploadButton = true;

                    }
                });


            };

            $scope.selectRow = function() {};

            $scope.load_excel = function() {
                if (groupName !== "SELLER") {
                    $scope.onSyncFS = true;

                    var getManagerListReq = {
                        "userName": userName
                    };
                    SharedService.getManagerRole(getManagerListReq).success(function(result) {
                        $scope.onSyncFS = false;
                        if (result.responseCode === 0) {
                            result.response.managerUsers.forEach(function(row) {
                                $scope.managerList.push(row.userName);
                            });
                        } else {
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = result.errorMsg;
                            $scope.disableSubmit = false;
                        }
                    }).
                    error(function(data, status, headers, config) {
                        $scope.onSyncFS = false;
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'danger';
                        $scope.alerts.msg = SharedService.getErrorMessage(status);
                    });
                }
                var oFileIn;
                oFileIn = document.getElementById('cat-file');
                if (oFileIn.addEventListener) {
                    oFileIn.addEventListener('change', filePicked, false);
                }

            }

            filePicked = function(oEvent) {
                var ext = this.value.match(/\.([^\.]+)$/)[1];
                switch (ext) {
                    case 'xlsx':
                        break;
                    case 'xlsm':
                        break;
                    default:
                        alert('not allowed');
                        this.value = '';
                }

                // Get The File From The Input
                var oFile = oEvent.target.files[0];

                $scope.fileName = oFile.name;
                $scope.$apply();
                // Create A File Reader HTML5
                var reader = new FileReader();

                // Ready The Event For When A File Gets Selected
                reader.onload = function(e) {

                    var data = e.target.result;
                    var cfb = XLSX.read(data, {
                        type: 'binary',
                       
                         blankrows: false,
                    });
                    var sheet = [cfb.SheetNames[0]];
                    sheet.forEach(function(sheetName) {
                        // Obtain The Current Row As CSV
                        
                        var range = XLSX.utils.decode_range(cfb.Sheets[sheetName]['!ref']);
                        
                        range.s.r = 3; // <-- zero-indexed, so setting to 1 will skip row 0
                        
                        cfb.Sheets[sheetName]['!ref'] = XLSX.utils.encode_range(range);
                        
                        var oJS = XLS.utils.sheet_to_json(cfb.Sheets[sheetName]);
                        console.log(oJS)
                        $scope.oJS = oJS;

                    });
                };

                // Tell JS To Start Reading The File.. You could delay this if desired
                reader.readAsBinaryString(oFile);
            }
            $scope.getProductExcel = function(){
               var selectedProIds =[];
               $scope.gridApi.selection.getSelectedRows().forEach(function(row){
                    selectedProIds.push({"id": row.id});
               });
               var uploadRequest = {
                    "userName": $scope.selectedSeller,
                    "productDetails":selectedProIds
                }
               UploadCatalogueService.getProductExcel(uploadRequest).success(function(data,status,headers){
                    var file = data.response.fileName;
                    window.location.href = slDashboardConfig.restServer + slDashboardConfig.restApis.GET_PRODUCT_FILE+"/"+file;
               });
            }

            $scope.uploadToServer = function() {
              $scope.alerts.alert = false;
                uploadRequest = {
                    "userName": $scope.selectedSeller,
                    "marketPlace": $scope.selectedMP,
                    "productCategory": $scope.selectedCat === "Select" ? "" : $scope.selectedCat,
                    "productDetails": [],
                }

                if ($scope.oJS.length === 0) {
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'danger';
                    $scope.alerts.msg = "Please select File";
                } else {
                    $scope.oJS.forEach(function(data) {
                        uploadRequest.productDetails.push(data);
                    });
                    $scope.onLoad = true;

                    UploadCatalogueService.uploadCatalogue(uploadRequest).success(function(result) {

                        if (result.responseCode === 0) {
                            $scope.onLoad = false;
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'info';
                            $scope.alerts.msg = "File uploaded to server successfully";

                            $scope.onLoad = true;

                            getAllProducts();

                            $scope.onLoad = false;

                        } else {
                            $scope.onLoad = false;
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = result.errorMsg;
                        }
                    }).
                    error(function(data, status, headers, config) {
                        $scope.onLoad = false;
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'danger';
                        $scope.alerts.msg = SharedService.getErrorMessage(status);
                    });
                }

            };
            $scope.updateProductExcel = function() {
              $scope.alerts.alert = false;
                uploadRequest = {
                    "userName": $scope.selectedSeller,
                    "marketPlace": $scope.selectedMP,
                    "productCategory": $scope.selectedCat === "Select" ? "" : $scope.selectedCat,
                    "productDetails": [],
                }

                if ($scope.oJS.length === 0) {
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'danger';
                    $scope.alerts.msg = "Please select File";
                } else {
                    $scope.oJS.forEach(function(data) {
                        uploadRequest.productDetails.push(data);
                    });
                    $scope.onLoad = true;

                    UploadCatalogueService.updateProductExcel(uploadRequest).success(function(result) {

                        if (result.responseCode === 0) {
                            $scope.onLoad = false;
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'info';
                            $scope.alerts.msg = "File uploaded to server successfully";

                            $scope.onLoad = true;

                            getAllProducts();

                            $scope.onLoad = false;

                        } else {
                            $scope.onLoad = false;
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = result.errorMsg;
                        }
                    }).
                    error(function(data, status, headers, config) {
                        $scope.onLoad = false;
                        $scope.alerts.alert = true;
                        $scope.alerts.type = 'danger';
                        $scope.alerts.msg = SharedService.getErrorMessage(status);
                    });
                }

            };
            $scope.load_excel();
        }
    ]);
