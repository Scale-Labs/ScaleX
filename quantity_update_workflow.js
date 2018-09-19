'use strict';
var quantityUpdateWorkflow = {};
var jsonxml = require('jsontoxml');


quantityUpdateWorkflow.quantityUpdate = function(request, responseCallback) {
    var failureResponse = {
        "responseCode": -1,
        "response": {},
        "errorMsg": "Issue with Quantity Update"
    };

    var sucessResponse = {
        "responseCode": 0,
        "response": "",
        "errorMsg": ""
    };

    var amazonUpdateQuantityRequest = {
        "@noNamespaceSchemaLocation": "amzn-envelope.xsd",
        "Header": {
            "DocumentVersion": "1.01",
            "MerchantIdentifier": "M_SELLER_354577"
        },
        "MessageType": "Inventory",
        "Message": [{
            "MessageID": request.messageId,
            "OperationType": "Update",
            "Inventory": {
                "SKU": request.sku,
                "Quantity": request.quantity,
                "FulfillmentLatency": request.fulfilmentLatency
            }
        }]
    };

var xmlRequest = jsonxml(amazonUpdateQuantityRequest);
console.log(xmlRequest);
responseCallback(sucessResponse);

};

var request = {
    "messageId" : "1234",
    "sku": "sku-1234",
    "quantity": "4",
    "fulfilmentLatency": "234"
};

quantityUpdateWorkflow.quantityUpdate(request,function(response){
    console.log(response);
});
