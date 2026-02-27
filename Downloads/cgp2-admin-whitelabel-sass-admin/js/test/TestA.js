function expression(p) {
    var attribute_20880462 = 0;
    var attIds = [20880462];
    var productAtrributeValue = p.productAtrributeValue;

    function isContained(aa, bb) {
        if (typeof (bb) == 'string') {
            bb = bb.split(',')
        }
        if (aa == null || aa == undefined || aa == '') {
            return false
        }
        if (bb == null || bb == undefined || bb == '') {
            return false
        }
        for (var i = 0; i < bb.length; i++) {
            var flag = false;
            for (var j = 0; j < aa.length; j++) {
                if (aa[j] == bb[i]) {
                    flag = true;
                    break
                }
            }
            if (flag == false) {
                return flag
            }
        }
        return true
    };

    function equal(arr1, arr2) {
        var flag = true;
        if (typeof (arr1) == 'string') {
            arr1 = arr1.split(',')
        }
        if (typeof (arr2) == 'string') {
            arr2 = arr2.split(',')
        }
        if (arr1 == '' || arr1 == undefined || arr1 == null) {
            if (arr2.length == 0) {
                return true
            } else {
                return false
            }
        }
        if (arr2 == '' || arr2 == undefined || arr2 == null) {
            if (arr1.length == 0) {
                return true
            } else {
                return false
            }
        }
        if (arr1.length !== arr2.length) {
            flag = false
        } else {
            arr1.forEach(function (item, index, arr) {
                if (!isContained(arr2, [item])) {
                    flag = false
                }
            })
        }
        return flag
    };
    if (!productAtrributeValue || JSON.stringify(productAtrributeValue) === '{}') {
        return false;
    }
    attribute_20880462 = productAtrributeValue['20880462'];
    return attribute_20880462 && (attribute_20880462[0] == 20880463) ? true : false;
}

var aa = [
    {
        "key": 8127646,
        "type": "skuAttribute",
        "valueType": "String",
        "selectType": "SINGLE",
        "attrOptions": [
            {
                "id": 8127647,
                "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                "createdDate": 1586593754000,
                "createdBy": "495659",
                "modifiedDate": 1620720047145,
                "modifiedBy": "8993500",
                "name": "1.6mm thick",
                "sortOrder": 0,
                "imageUrl": "",
                "value": "1.6mm thick",
                "displayValue": "1.6mm thick",
                "attributeId": 8127646,
                "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
            },
            {
                "id": 8127648,
                "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                "createdDate": 1586593754000,
                "createdBy": "495659",
                "modifiedDate": 1620720047147,
                "modifiedBy": "8993500",
                "name": "2.5mm thick",
                "sortOrder": 1,
                "imageUrl": "",
                "value": "2.5mm thick",
                "displayValue": "2.5mm thick",
                "attributeId": 8127646,
                "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
            }],
        "required": false,
        "displayName": "StandardTilesMaterial(20554113)",
        "path": "lineItems[0].productAttributeValueMap",
        "attributeInfo": {
            "id": 20554113,
            "clazz": "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute",
            "createdDate": 1587034165000,
            "createdBy": "495659",
            "modifiedDate": 1631177416113,
            "modifiedBy": "568",
            "displayName": "StandardTilesMaterial",
            "sortOrder": 0,
            "attribute": {
                "id": 8127646,
                "clazz": "com.qpp.cgp.domain.attribute.Attribute",
                "createdDate": 1586593754000,
                "createdBy": "495659",
                "modifiedDate": 1620720047140,
                "modifiedBy": "8993500",
                "name": "StandardTilesMaterial",
                "required": false,
                "inputType": "DropList",
                "validationExp": "",
                "options": [{
                    "id": 8127647,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "createdDate": 1586593754000,
                    "createdBy": "495659",
                    "modifiedDate": 1620720047145,
                    "modifiedBy": "8993500",
                    "name": "1.6mm thick",
                    "sortOrder": 0,
                    "imageUrl": "",
                    "value": "1.6mm thick",
                    "displayValue": "1.6mm thick",
                    "attributeId": 8127646,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 8127648,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "createdDate": 1586593754000,
                    "createdBy": "495659",
                    "modifiedDate": 1620720047147,
                    "modifiedBy": "8993500",
                    "name": "2.5mm thick",
                    "sortOrder": 1,
                    "imageUrl": "",
                    "value": "2.5mm thick",
                    "displayValue": "2.5mm thick",
                    "attributeId": 8127646,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }],
                "code": "StandardTilesMaterial",
                "showInFrontend": false,
                "sortOrder": 1,
                "valueType": "String",
                "selectType": "SINGLE",
                "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
            },
            "attributeId": 8127646,
            "productId": 20554109,
            "required": false,
            "hidden": false,
            "enable": true,
            "isSku": true,
            "defaultValue": "8127647",
            "code": "StandardTilesMaterial",
            "readOnly": false,
            "sku": true,
            "multilingualKey": "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute"
        }
    },
    {
        "key": 8128250,
        "type": "skuAttribute",
        "valueType": "String",
        "selectType": "SINGLE",
        "attrOptions": [{
            "id": 8128251,
            "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
            "createdDate": 1586594089000,
            "createdBy": "495659",
            "modifiedDate": 1620720082744,
            "modifiedBy": "8993500",
            "name": "Gloss laminated(smooth finish)",
            "sortOrder": 0,
            "imageUrl": "",
            "value": "Gloss laminated(smooth finish)",
            "displayValue": "Gloss laminated(smooth finish)",
            "attributeId": 8128250,
            "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
        }, {
            "id": 8128254,
            "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
            "createdDate": 1586594089000,
            "createdBy": "495659",
            "modifiedDate": 1620720082746,
            "modifiedBy": "8993500",
            "name": "Matte laminated(smooth finish)",
            "sortOrder": 1,
            "imageUrl": "",
            "value": "Matte laminated(smooth finish)",
            "displayValue": "Matte laminated(smooth finish)",
            "attributeId": 8128250,
            "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
        }, {
            "id": 8128253,
            "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
            "createdDate": 1586594089000,
            "createdBy": "495659",
            "modifiedDate": 1620720082749,
            "modifiedBy": "8993500",
            "name": "Gloss laminated(Linen finish)",
            "sortOrder": 2,
            "imageUrl": "",
            "value": "Gloss laminated(Linen finish)",
            "displayValue": "Gloss laminated(Linen finish)",
            "attributeId": 8128250,
            "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
        }, {
            "id": 8128252,
            "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
            "createdDate": 1586594089000,
            "createdBy": "495659",
            "modifiedDate": 1620720082751,
            "modifiedBy": "8993500",
            "name": "Matte laminated(Linen finish)",
            "sortOrder": 3,
            "imageUrl": "",
            "value": "Matte laminated(Linen finish)",
            "displayValue": "Matte laminated(Linen finish)",
            "attributeId": 8128250,
            "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
        }],
        "required": false,
        "displayName": "StandardTilesFinish(20554114)",
        "path": "lineItems[0].productAttributeValueMap",
        "attributeInfo": {
            "id": 20554114,
            "clazz": "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute",
            "createdDate": 1587034165000,
            "createdBy": "495659",
            "modifiedDate": 1631177416131,
            "modifiedBy": "568",
            "displayName": "StandardTilesFinish",
            "sortOrder": 1,
            "attribute": {
                "id": 8128250,
                "clazz": "com.qpp.cgp.domain.attribute.Attribute",
                "createdDate": 1586594089000,
                "createdBy": "495659",
                "modifiedDate": 1620720082737,
                "modifiedBy": "8993500",
                "name": "StandardTilesFinish",
                "required": false,
                "inputType": "DropList",
                "validationExp": "",
                "options": [{
                    "id": 8128251,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "createdDate": 1586594089000,
                    "createdBy": "495659",
                    "modifiedDate": 1620720082744,
                    "modifiedBy": "8993500",
                    "name": "Gloss laminated(smooth finish)",
                    "sortOrder": 0,
                    "imageUrl": "",
                    "value": "Gloss laminated(smooth finish)",
                    "displayValue": "Gloss laminated(smooth finish)",
                    "attributeId": 8128250,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 8128254,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "createdDate": 1586594089000,
                    "createdBy": "495659",
                    "modifiedDate": 1620720082746,
                    "modifiedBy": "8993500",
                    "name": "Matte laminated(smooth finish)",
                    "sortOrder": 1,
                    "imageUrl": "",
                    "value": "Matte laminated(smooth finish)",
                    "displayValue": "Matte laminated(smooth finish)",
                    "attributeId": 8128250,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 8128253,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "createdDate": 1586594089000,
                    "createdBy": "495659",
                    "modifiedDate": 1620720082749,
                    "modifiedBy": "8993500",
                    "name": "Gloss laminated(Linen finish)",
                    "sortOrder": 2,
                    "imageUrl": "",
                    "value": "Gloss laminated(Linen finish)",
                    "displayValue": "Gloss laminated(Linen finish)",
                    "attributeId": 8128250,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 8128252,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "createdDate": 1586594089000,
                    "createdBy": "495659",
                    "modifiedDate": 1620720082751,
                    "modifiedBy": "8993500",
                    "name": "Matte laminated(Linen finish)",
                    "sortOrder": 3,
                    "imageUrl": "",
                    "value": "Matte laminated(Linen finish)",
                    "displayValue": "Matte laminated(Linen finish)",
                    "attributeId": 8128250,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }],
                "code": "StandardTilesFinish",
                "showInFrontend": false,
                "sortOrder": 1,
                "valueType": "String",
                "selectType": "SINGLE",
                "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
            },
            "attributeId": 8128250,
            "productId": 20554109,
            "required": false,
            "hidden": false,
            "enable": true,
            "isSku": true,
            "defaultValue": "8128251",
            "code": "StandardTilesFinish",
            "readOnly": false,
            "sku": true,
            "multilingualKey": "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute"
        }
    },
    {
        "key": 14537445,
        "type": "skuAttribute",
        "valueType": "Number",
        "selectType": "NON",
        "attrOptions": [],
        "required": false,
        "displayName": "Hexagon_2'x 1.75'_Max_QTY(20554115)",
        "path": "lineItems[0].productAttributeValueMap",
        "attributeInfo":
            {
                "id": 20554115,
                "clazz": "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute", "createdDate":
                    1603431962000, "createdBy":
                    "1919543", "modifiedDate":
                    1631177416139, "modifiedBy":
                    "568", "displayName": "Hexagon_2'x1.75'_Max_QTY",
                "sortOrder":
                    2, "attribute":
                    {
                        "id":
                            14537445, "clazz":
                            "com.qpp.cgp.domain.attribute.Attribute", "createdDate":
                            1603431849000, "createdBy":
                            "1919543", "modifiedDate":
                            1607938175632, "modifiedBy":
                            "1919543", "name":
                            "Hexagon_2'x1.75'_Max_QTY", "required":
                            false, "inputType":
                            "TextField", "validationExp":
                            "", "options":
                            [], "code":
                            "Hexagon_2'x1.75'_Max_QTY", "showInFrontend":
                            false, "sortOrder":
                            1, "valueType":
                            "Number", "selectType":
                            "NON", "multilingualKey":
                            "com.qpp.cgp.domain.attribute.Attribute"
                    }
                ,
                "attributeId":
                    14537445, "productId":
                    20554109, "required":
                    false, "hidden":
                    true, "enable":
                    true, "isSku":
                    false, "defaultValue":
                    "15", "code":
                    "Hexagon_2'x1.75'_Max_QTY", "readOnly":
                    true, "sku":
                    false, "multilingualKey":
                    "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute"
            }
    },
    {
        "key":
            9120809, "type":
            "skuAttribute", "valueType":
            "Number", "selectType":
            "NON", "attrOptions":
            [], "required":
            true, "displayName":
            "hexagon2x17Qty(20554116)", "path":
            "lineItems[0].productAttributeValueMap", "attributeInfo":
            {
                "id":
                    20554116, "clazz":
                    "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute", "createdDate":
                    1588903778000, "createdBy":
                    "179830", "modifiedDate":
                    1631177416146, "modifiedBy":
                    "568", "displayName":
                    "hexagon2x17Qty", "sortOrder":
                    2, "attribute":
                    {
                        "id":
                            9120809, "clazz":
                            "com.qpp.cgp.domain.attribute.Attribute", "createdDate":
                            1588903573000, "createdBy":
                            "179830", "modifiedDate":
                            1607938175596, "modifiedBy":
                            "179830", "name":
                            "hexagon2x17Qty", "required":
                            false, "inputType":
                            "TextField", "validationExp":
                            "", "options":
                            [], "code":
                            "hexagon2x17Qty", "showInFrontend":
                            false, "sortOrder":
                            0, "valueType":
                            "Number", "selectType":
                            "NON", "multilingualKey":
                            "com.qpp.cgp.domain.attribute.Attribute"
                    }
                ,
                "attributeId":
                    9120809, "productId":
                    20554109, "required":
                    true, "hidden":
                    false, "enable":
                    true, "isSku":
                    false, "defaultValue":
                    "15", "code":
                    "hexagon2x17Qty", "readOnly":
                    false, "sku":
                    false, "multilingualKey":
                    "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute"
            }
    },
    {
        "key":
            9120814, "type":
            "skuAttribute", "valueType":
            "String", "selectType":
            "SINGLE", "attrOptions":
            [{
                "id": 9120815,
                "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                "createdDate": 1588903664000,
                "createdBy": "179830",
                "modifiedDate": 1620719901741,
                "modifiedBy": "8993500",
                "name": "Same Image",
                "sortOrder": 0,
                "imageUrl": "",
                "value": "Same Image",
                "displayValue": "Same Image",
                "attributeId": 9120814,
                "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
            }, {
                "id": 9120816,
                "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                "createdDate": 1588903664000,
                "createdBy": "179830",
                "modifiedDate": 1620719901746,
                "modifiedBy": "8993500",
                "name": "Different Images",
                "sortOrder": 1,
                "imageUrl": "",
                "value": "Different Images",
                "displayValue": "Different Images",
                "attributeId": 9120814,
                "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
            }], "required":
            true, "displayName":
            "hexagon2x17-Front(20554117)", "path":
            "lineItems[0].productAttributeValueMap", "attributeInfo":
            {
                "id":
                    20554117, "clazz":
                    "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute", "createdDate":
                    1588903790000, "createdBy":
                    "179830", "modifiedDate":
                    1631177416153, "modifiedBy":
                    "568", "displayName":
                    "hexagon2x17-Front", "sortOrder":
                    3, "attribute":
                    {
                        "id":
                            9120814, "clazz":
                            "com.qpp.cgp.domain.attribute.Attribute", "createdDate":
                            1588903663000, "createdBy":
                            "179830", "modifiedDate":
                            1620719901728, "modifiedBy":
                            "8993500", "name":
                            "Front", "required":
                            false, "inputType":
                            "DropList", "validationExp":
                            "", "options":
                            [{
                                "id": 9120815,
                                "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                                "createdDate": 1588903664000,
                                "createdBy": "179830",
                                "modifiedDate": 1620719901741,
                                "modifiedBy": "8993500",
                                "name": "Same Image",
                                "sortOrder": 0,
                                "imageUrl": "",
                                "value": "Same Image",
                                "displayValue": "Same Image",
                                "attributeId": 9120814,
                                "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                            }, {
                                "id": 9120816,
                                "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                                "createdDate": 1588903664000,
                                "createdBy": "179830",
                                "modifiedDate": 1620719901746,
                                "modifiedBy": "8993500",
                                "name": "Different Images",
                                "sortOrder": 1,
                                "imageUrl": "",
                                "value": "Different Images",
                                "displayValue": "Different Images",
                                "attributeId": 9120814,
                                "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                            }], "code":
                            "Front", "showInFrontend":
                            false, "sortOrder":
                            0, "valueType":
                            "String", "selectType":
                            "SINGLE", "multilingualKey":
                            "com.qpp.cgp.domain.attribute.Attribute"
                    }
                ,
                "attributeId":
                    9120814, "productId":
                    20554109, "required":
                    true, "hidden":
                    false, "enable":
                    true, "isSku":
                    false, "defaultValue":
                    "9120815", "code":
                    "Front", "readOnly":
                    false, "sku":
                    false, "multilingualKey":
                    "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute"
            }
    },
    {
        "key":
            9120919, "type":
            "skuAttribute", "valueType":
            "String", "selectType":
            "SINGLE", "attrOptions":
            [{
                "id": 9120920,
                "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                "createdDate": 1588903753000,
                "createdBy": "179830",
                "modifiedDate": 1607938177244,
                "modifiedBy": "179830",
                "name": "Same Image",
                "sortOrder": 0,
                "imageUrl": "",
                "value": "Same Image",
                "displayValue": "Same Image",
                "attributeId": 9120919,
                "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
            }, {
                "id": 9120921,
                "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                "createdDate": 1588903753000,
                "createdBy": "179830",
                "modifiedDate": 1607938177244,
                "modifiedBy": "179830",
                "name": "Different Images",
                "sortOrder": 0,
                "imageUrl": "",
                "value": "Different Images",
                "displayValue": "Different Images",
                "attributeId": 9120919,
                "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
            }], "required":
            true, "displayName":
            "hexagon2x17-Back(20554118)", "path":
            "lineItems[0].productAttributeValueMap", "attributeInfo":
            {
                "id":
                    20554118, "clazz":
                    "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute", "createdDate":
                    1588903799000, "createdBy":
                    "179830", "modifiedDate":
                    1631177416163, "modifiedBy":
                    "568", "displayName":
                    "hexagon2x17-Back", "sortOrder":
                    4, "attribute":
                    {
                        "id":
                            9120919, "clazz":
                            "com.qpp.cgp.domain.attribute.Attribute", "createdDate":
                            1588903753000, "createdBy":
                            "179830", "modifiedDate":
                            1607938175597, "modifiedBy":
                            "1919543", "name":
                            "Back", "required":
                            false, "inputType":
                            "DropList", "validationExp":
                            "", "options":
                            [{
                                "id": 9120920,
                                "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                                "createdDate": 1588903753000,
                                "createdBy": "179830",
                                "modifiedDate": 1607938177244,
                                "modifiedBy": "179830",
                                "name": "Same Image",
                                "sortOrder": 0,
                                "imageUrl": "",
                                "value": "Same Image",
                                "displayValue": "Same Image",
                                "attributeId": 9120919,
                                "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                            }, {
                                "id": 9120921,
                                "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                                "createdDate": 1588903753000,
                                "createdBy": "179830",
                                "modifiedDate": 1607938177244,
                                "modifiedBy": "179830",
                                "name": "Different Images",
                                "sortOrder": 0,
                                "imageUrl": "",
                                "value": "Different Images",
                                "displayValue": "Different Images",
                                "attributeId": 9120919,
                                "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                            }], "code":
                            "Back", "showInFrontend":
                            false, "sortOrder":
                            0, "valueType":
                            "String", "selectType":
                            "SINGLE", "multilingualKey":
                            "com.qpp.cgp.domain.attribute.Attribute"
                    }
                ,
                "attributeId":
                    9120919, "productId":
                    20554109, "required":
                    true, "hidden":
                    false, "enable":
                    true, "isSku":
                    false, "defaultValue":
                    "9120920", "code":
                    "Back", "readOnly":
                    false, "sku":
                    false, "multilingualKey":
                    "com.qpp.cgp.domain.product.ConfigurableProductSkuAttribute"
            }
    }
]


function expression(args) {
    function isContained(aa, bb) {
        if (typeof (bb) == "string") {
            bb = bb.split(",")
        }
        if (aa == null || aa == undefined || aa == "") {
            return false
        }
        if (bb == null || bb == undefined || bb == "") {
            return false
        }
        for (var i = 0; i < bb.length; i++) {
            var flag = false;
            for (var j = 0; j < aa.length; j++) {
                if (aa[j] == bb[i]) {
                    flag = true;
                    break
                }
            }
            if (flag == false) {
                return flag
            }
        }
        return true
    };

    function equal(arr1, arr2) {
        var flag = true;
        if (typeof (arr1) == "string") {
            arr1 = arr1.split(",")
        }
        if (typeof (arr2) == "string") {
            arr2 = arr2.split(",")
        }
        if (arr1 == "" || arr1 == undefined || arr1 == null) {
            if (arr2.length == 0) {
                return true
            } else {
                return false
            }
        }
        if (arr2 == "" || arr2 == undefined || arr2 == null) {
            if (arr1.length == 0) {
                return true
            } else {
                return false
            }
        }
        if (arr1.length !== arr2.length) {
            flag = false
        } else {
            arr1.forEach(function (item, index, arr) {
                if (!isContained(arr2, [item])) {
                    flag = false
                }
            })
        }
        return flag
    };
    return (args.productAtrributeValue['20880462'] == '20880463' && args.productAtrributeValue['20880346'] == '20880347' && args.qty['qty'] == 111)
}
