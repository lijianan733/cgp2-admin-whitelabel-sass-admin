function expression(p) {
    var attribute_6418952 = 0;
    var attIds = [6418952];
    var attrs = p.product.attributeValues;
    for (var i = 0; i < attrs.length; i++) {
        if (attIds.indexOf(parseInt(attrs[i].attribute.id)) > -1) {
            attribute_6418952 = attrs[i].optionIds ? attrs[i].optionIds : attrs[i].value;
        }
    }
    return attribute_6418952 == 6418953
}

var _args = {
    "product": {
        "attributeValues": [{"id": 133720, "value": "244", "attribute": {"id": 133720}}, {
            "id": 133721,
            "value": "244",
            "attribute": {"id": 133721}
        }, {"id": 133722, "value": "72", "attribute": {"id": 133722}}, {
            "id": 1410540,
            "value": "1410543",
            "optionIds": "1410543",
            "attribute": {"id": 1410540}
        }, {"id": 1410534, "value": "1410535", "optionIds": "1410535", "attribute": {"id": 1410534}}, {
            "id": 1410528,
            "value": "1991285",
            "optionIds": "1991285",
            "attribute": {"id": 1410528}
        }, {"id": 1445182, "value": "1445183", "optionIds": "1445183", "attribute": {"id": 1445182}}, {
            "id": 1445185,
            "value": ["1575780"],
            "optionIds": "1575780",
            "attribute": {"id": 1445185}
        }]
    },
    "qty": 1
};

function expression(p) {
    var attribute_7599162 = 0;
    var attIds = [7599162];
    var productAtrributeValue = p.productAtrributeValue;

    function equal(arr1, arr2) {
        var flag = true;
        if (arr1.length !== arr2.length) {
            flag = false
        } else {
            arr1.forEach(function (item, index, arr) {
                if (arr2.indexOf(item) === -1) {
                    flag = false
                }
            })
        }
        return flag
    };

    function isContained(aa, bb) {
        if (aa == null && aa == undefined) {
            return false
        }
        ;
        for (var i = 0; i < bb.length; i++) {
            var flag = false;
            for (var j = 0; j < aa.length; j++) {
                if (aa[j] == bb[i]) {
                    flag = true;
                    break;
                }
            }
            if (flag == false) {
                return flag;
            }
        }
        return true;
    };
    attribute_7599162 = productAtrributeValue["7599162"];
    return productAtrributeValue["7599162"][0] == 7599166
}

console.log(expression(_args));


function expression(p) {
    var attribute_7599162 = 0;
    var attIds = ["7599162"];
    var attrs = p.productAtrributeValue;
    for (var i = 0; i < attIds.length; i++) {
        if (attrs[attIds[i]]) {
            attribute_7599162 = attrs[attIds[i]];
        }
    }
    return attribute_7599162 == 7599164
}


function expression(args) {
    var value = 0;
    for (i in args) {
        value += args[i];
    }
    return value == 0 ? 1000 : value;
}

console.log(expression([3.3, 1.79]));


var data = {
    "product": {
        "id": 17299946,
        "clazz": "com.qpp.cgp.domain.product.SkuProduct",
        "modifiedDate": 1617677003671,
        "modifiedBy": "16339953",
        "model": "BGM17022304-DA394923",
        "name": "PlasticHouse",
        "salePrice": 0.13,
        "weight": 10.0,
        "compositeId": "",
        "medias": [{
            "id": 17299947,
            "clazz": "com.qpp.cgp.domain.product.media.ProductMedia",
            "modifiedDate": 1617677003693,
            "modifiedBy": "16339953",
            "type": "PRODUCT_IMAGE",
            "name": "fa105a1589efd542a5501dea06ac375c.jpg",
            "format": "jpg",
            "sortOrder": 0,
            "productId": 17299946,
            "width": 1000,
            "height": 1000,
            "multilingualKey": "com.qpp.cgp.domain.product.media.ProductMedia"
        }],
        "template": {
            "id": 17299945,
            "clazz": "com.qpp.cgp.domain.product.ProductTemplate",
            "modifiedDate": 1617677003653,
            "modifiedBy": "16339953",
            "multilingualKey": "com.qpp.cgp.domain.product.ProductTemplate"
        },
        "templateId": 17299945,
        "mainCategoryId": 17298537,
        "subCategories": [{
            "id": 16791097,
            "clazz": "com.qpp.cgp.domain.product.category.SubProductCategory",
            "modifiedDate": 1614848148383,
            "modifiedBy": "8993500",
            "website": {
                "id": 11,
                "code": "WHITELABEL",
                "name": "WhiteLabel",
                "url": "http://192.168.26.15",
                "showInAdmin": true,
                "multilingualKey": "com.qpp.cgp.domain.common.Website"
            },
            "websiteId": 11,
            "sortOrder": 1,
            "invisible": false,
            "name": "BGM",
            "shortDescription": "",
            "description1": "",
            "description2": "",
            "description3": "",
            "template": {
                "id": 16791096,
                "clazz": "com.qpp.cgp.domain.product.category.ProductCategoryTemplate",
                "modifiedDate": 1614848148380,
                "modifiedBy": "8993500",
                "pageTitle": "",
                "pageKeyWords": "",
                "pageDescription": "",
                "pageUrl": "",
                "multilingualKey": "com.qpp.cgp.domain.product.category.ProductCategoryTemplate"
            },
            "templateId": 16791096,
            "isLeaf": true,
            "status": 1,
            "multilingualKey": "com.qpp.cgp.domain.product.category.SubProductCategory"
        }],
        "subCategoryIds": [16791097],
        "composingType": {
            "id": 3,
            "clazz": "com.qpp.cgp.domain.product.ComposingType",
            "createdDate": 1456817412000,
            "modifiedDate": 1610527025395,
            "code": "NONE",
            "name": "",
            "multilingualKey": "com.qpp.cgp.domain.product.ComposingType"
        },
        "composingTypeId": 3,
        "builderType": "",
        "mustOrderQuantity": 0,
        "quantityPrices": [],
        "mode": "TEST",
        "attributeValues": [{
            "id": 17299948,
            "clazz": "com.qpp.cgp.domain.product.ProductAttributeValue",
            "modifiedDate": 1617677003729,
            "modifiedBy": "16339953",
            "value": "12mm x 10mm",
            "optionIds": "17298533",
            "attribute": {
                "id": 17298530,
                "clazz": "com.qpp.cgp.domain.attribute.Attribute",
                "modifiedDate": 1617674602165,
                "modifiedBy": "16339953",
                "name": "PlasticHouse_Size",
                "required": false,
                "inputType": "DropList",
                "validationExp": "",
                "options": [{
                    "id": 17298531,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "modifiedDate": 1617674602254,
                    "modifiedBy": "16339953",
                    "name": "10mm x 10mm",
                    "sortOrder": 0,
                    "imageUrl": "",
                    "value": "10mm x 10mm",
                    "displayValue": "10mm x 10mm",
                    "attributeId": 17298530,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 17298532,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "modifiedDate": 1617674602273,
                    "modifiedBy": "16339953",
                    "name": "10mm x 14mm",
                    "sortOrder": 1,
                    "imageUrl": "",
                    "value": "10mm x 14mm",
                    "displayValue": "10mm x 14mm",
                    "attributeId": 17298530,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 17298533,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "modifiedDate": 1617674602274,
                    "modifiedBy": "16339953",
                    "name": "12mm x 10mm",
                    "sortOrder": 2,
                    "imageUrl": "",
                    "value": "12mm x 10mm",
                    "displayValue": "12mm x 10mm",
                    "attributeId": 17298530,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 17298534,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "modifiedDate": 1617674602275,
                    "modifiedBy": "16339953",
                    "name": "18mm x16mm",
                    "sortOrder": 3,
                    "imageUrl": "",
                    "value": "18mm x16mm",
                    "displayValue": "18mm x16mm",
                    "attributeId": 17298530,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }],
                "code": "PlasticHouse_Size_BGM",
                "showInFrontend": false,
                "sortOrder": 0,
                "valueType": "String",
                "selectType": "SINGLE",
                "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
            },
            "attributeId": 17298530,
            "productId": 17299946,
            "multilingualKey": "com.qpp.cgp.domain.product.ProductAttributeValue"
        }, {
            "id": 17299949,
            "clazz": "com.qpp.cgp.domain.product.ProductAttributeValue",
            "modifiedDate": 1617677003731,
            "modifiedBy": "16339953",
            "value": "12mm x 10mm",
            "optionIds": "17298533",
            "attribute": {
                "id": 17298530,
                "clazz": "com.qpp.cgp.domain.attribute.Attribute",
                "modifiedDate": 1617674602165,
                "modifiedBy": "16339953",
                "name": "PlasticHouse_Size",
                "required": false,
                "inputType": "DropList",
                "validationExp": "",
                "options": [{
                    "id": 17298531,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "modifiedDate": 1617674602254,
                    "modifiedBy": "16339953",
                    "name": "10mm x 10mm",
                    "sortOrder": 0,
                    "imageUrl": "",
                    "value": "10mm x 10mm",
                    "displayValue": "10mm x 10mm",
                    "attributeId": 17298530,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 17298532,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "modifiedDate": 1617674602273,
                    "modifiedBy": "16339953",
                    "name": "10mm x 14mm",
                    "sortOrder": 1,
                    "imageUrl": "",
                    "value": "10mm x 14mm",
                    "displayValue": "10mm x 14mm",
                    "attributeId": 17298530,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 17298533,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "modifiedDate": 1617674602274,
                    "modifiedBy": "16339953",
                    "name": "12mm x 10mm",
                    "sortOrder": 2,
                    "imageUrl": "",
                    "value": "12mm x 10mm",
                    "displayValue": "12mm x 10mm",
                    "attributeId": 17298530,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }, {
                    "id": 17298534,
                    "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                    "modifiedDate": 1617674602275,
                    "modifiedBy": "16339953",
                    "name": "18mm x16mm",
                    "sortOrder": 3,
                    "imageUrl": "",
                    "value": "18mm x16mm",
                    "displayValue": "18mm x16mm",
                    "attributeId": 17298530,
                    "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                }],
                "code": "PlasticHouse_Size_BGM",
                "showInFrontend": false,
                "sortOrder": 0,
                "valueType": "String",
                "selectType": "SINGLE",
                "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
            },
            "attributeId": 17298530,
            "productId": 17299946,
            "multilingualKey": "com.qpp.cgp.domain.product.ProductAttributeValue"
        }],
        "sku": "BGM17022304-DA394923-3",
        "configurableProductId": 17298675,
        "packages": [],
        "type": "SKU",
        "multilingualKey": "com.qpp.cgp.domain.product.SkuProduct"
    },
    "productAtrributeValue": {
        "986953": [17606968],
        "17606967": [17604203],
        "16791067": [17604203]
    },
    "material": {
        "_id": "17299952",
        "clazz": "com.qpp.cgp.domain.bom.MaterialSpu",
        "createdDate": 1617674373420,
        "createdBy": "16339953",
        "modifiedDate": 1617677003945,
        "modifiedBy": "16339953",
        "code": "PlasticHouse_Set_BGM",
        "name": "PlasticHouse_Set",
        "childItems": [],
        "parentMaterialType": {
            "_id": "17298527",
            "idReference": "Material",
            "clazz": "com.qpp.cgp.domain.bom.MaterialType",
            "isOutSourcing": false,
            "packageQty": 0,
            "multilingualKey": "com.qpp.cgp.domain.bom.Material",
            "superClazz": "com.qpp.cgp.domain.bom.MaterialType"
        },
        "rtType": {
            "_id": "17298419",
            "idReference": "RtType",
            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
            "attributesToRtTypes": [],
            "multilingualKey": "com.qpp.cgp.domain.bom.attribute.RtType"
        },
        "rtObject": {
            "_id": "17299953",
            "idReference": "RtObject",
            "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
            "createdDate": 1617677003923,
            "createdBy": "16339953",
            "modifiedDate": 1617677003923,
            "modifiedBy": "16339953",
            "rtType": {
                "_id": "17298419",
                "idReference": "RtType",
                "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                "attributesToRtTypes": [],
                "multilingualKey": "com.qpp.cgp.domain.bom.attribute.RtType"
            },
            "objectJSON": {
                "GamePieces_Shape_House": "House",
                "GamePieces_Material_Plastic": "Plastic"
            },
            "multilingualKey": "com.qpp.cgp.domain.bom.runtime.RtObject"
        },
        "spuRtTypeRtObject": {
            "_id": "17299954",
            "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
            "createdDate": 1617677003944,
            "createdBy": "16339953",
            "modifiedDate": 1617677003944,
            "modifiedBy": "16339953",
            "rtType": {
                "_id": "17298418",
                "idReference": "RtType",
                "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                "attributesToRtTypes": [],
                "multilingualKey": "com.qpp.cgp.domain.bom.attribute.RtType"
            },
            "objectJSON": {
                "PlasticHouse_Color": "Green",
                "PlasticHouse_Size": "12mm x 10mm"
            },
            "multilingualKey": "com.qpp.cgp.domain.bom.runtime.RtObject"
        },
        "category": "17298486",
        "categoryName": "",
        "leaf": false,
        "isOutSourcing": false,
        "packageQty": 0,
        "isPackage": false,
        "multilingualKey": "com.qpp.cgp.domain.bom.Material",
        "superClazz": "com.qpp.cgp.domain.bom.MaterialSpu"
    },
    "qty": 1
};

function expression(p) {
    var attribute_8127646 = 0;
    var attIds = [8127646];
    var productAtrributeValue = p.productAtrributeValue;

    function equal(arr1, arr2) {
        var flag = true;
        if (arr1.length !== arr2.length) {
            flag = false
        } else {
            arr1.forEach(function (item, index, arr) {
                if (arr2.indexOf(item) === -1) {
                    flag = false
                }
            })
        }
        return flag
    };

    function isContained(aa, bb) {
        if (aa == null && aa == undefined) {
            return false
        }
        ;
        for (var i = 0; i < bb.length; i++) {
            var flag = false;
            for (var j = 0; j < aa.length; j++) {
                if (aa[j] == bb[i]) {
                    flag = true;
                    break;
                }
            }
            if (flag == false) {
                return flag;
            }
        }
        return true;
    };attribute_8127646 = productAtrributeValue["8127646"];
    return attribute_8127646[0] == 8127648
}

console.log(expression(data));

var args = [
    [19.95], {
        "product": {
            "id": 15641808,
            "clazz": "com.qpp.cgp.domain.product.SkuProduct",
            "createdDate": 1609292070000,
            "createdBy": "9416876",
            "modifiedDate": 1610527139693,
            "modifiedBy": "856766",
            "model": "PS1214HU26",
            "name": "14X11 Wall Calendar",
            "salePrice": 17.95,
            "weight": 315.0,
            "compositeId": "",
            "medias": [],
            "template": {
                "id": 15641809,
                "clazz": "com.qpp.cgp.domain.product.ProductTemplate",
                "createdDate": 1609292070000,
                "createdBy": "9416876",
                "modifiedDate": 1610527019936,
                "modifiedBy": "9416876",
                "multilingualKey": "com.qpp.cgp.domain.product.ProductTemplate"
            },
            "templateId": 15641809,
            "mainCategoryId": 15014949,
            "subCategories": [{
                "id": 6062342,
                "clazz": "com.qpp.cgp.domain.product.category.SubProductCategory",
                "createdDate": 1584697997000,
                "createdBy": "495659",
                "modifiedDate": 1609989811103,
                "modifiedBy": "140800",
                "website": {
                    "id": 0,
                    "code": "global_config",
                    "name": "global website config",
                    "url": "global website config",
                    "showInAdmin": false,
                    "multilingualKey": "com.qpp.cgp.domain.common.Website"
                },
                "websiteId": 0,
                "sortOrder": 1,
                "invisible": false,
                "name": "FlashToH5",
                "shortDescription": "",
                "description1": "",
                "description2": "",
                "description3": "",
                "template": {
                    "id": 15738268,
                    "clazz": "com.qpp.cgp.domain.product.category.ProductCategoryTemplate",
                    "createdDate": 1589527153000,
                    "createdBy": "504",
                    "modifiedDate": 1609989811098,
                    "modifiedBy": "140800",
                    "pageTitle": "",
                    "pageKeyWords": "",
                    "pageDescription": "",
                    "pageUrl": "",
                    "multilingualKey": "com.qpp.cgp.domain.product.category.ProductCategoryTemplate"
                },
                "templateId": 15738268,
                "isLeaf": true,
                "status": 1,
                "multilingualKey": "com.qpp.cgp.domain.product.category.SubProductCategory"
            }],
            "subCategoryIds": [6062342],
            "composingType": {
                "id": 3,
                "clazz": "com.qpp.cgp.domain.product.ComposingType",
                "createdDate": 1456817412000,
                "modifiedDate": 1610527025395,
                "code": "NONE",
                "name": '',
                "multilingualKey": "com.qpp.cgp.domain.product.ComposingType"
            },
            "composingTypeId": 3,
            "builderType": "",
            "mustOrderQuantity": 0,
            "quantityPrices": [],
            "mode": "TEST",
            "attributeValues": [{
                "id": 15641810,
                "clazz": "com.qpp.cgp.domain.product.ProductAttributeValue",
                "createdDate": 1609292070000,
                "createdBy": "9416876",
                "modifiedDate": 1610527041911,
                "modifiedBy": "9416876",
                "value": "2020-12",
                "attribute": {
                    "id": 15004643,
                    "clazz": "com.qpp.cgp.domain.attribute.Attribute",
                    "createdDate": 1606181947000,
                    "createdBy": "9318118",
                    "modifiedDate": 1610527029578,
                    "modifiedBy": "9318118",
                    "name": "Start Month",
                    "required": false,
                    "inputType": "TextField",
                    "validationExp": "",
                    "options": [],
                    "code": "StartMonth",
                    "showInFrontend": false,
                    "sortOrder": 0,
                    "valueType": "YearMonth",
                    "selectType": "NON",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
                },
                "attributeId": 15004643,
                "productId": 15641808,
                "multilingualKey": "com.qpp.cgp.domain.product.ProductAttributeValue"
            }, {
                "id": 15641811,
                "clazz": "com.qpp.cgp.domain.product.ProductAttributeValue",
                "createdDate": 1609292070000,
                "createdBy": "9416876",
                "modifiedDate": 1610527041911,
                "modifiedBy": "9416876",
                "value": "12",
                "optionIds": "15039670",
                "attribute": {
                    "id": 15039669,
                    "clazz": "com.qpp.cgp.domain.attribute.Attribute",
                    "createdDate": 1606302925000,
                    "createdBy": "495659",
                    "modifiedDate": 1610527029578,
                    "modifiedBy": "9318118",
                    "name": "Months",
                    "required": false,
                    "inputType": "DropList",
                    "validationExp": "",
                    "options": [{
                        "id": 15039670,
                        "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                        "createdDate": 1606302925000,
                        "createdBy": "495659",
                        "modifiedDate": 1610527030324,
                        "modifiedBy": "9318118",
                        "name": "12 Months",
                        "sortOrder": 0,
                        "imageUrl": "",
                        "value": "12",
                        "displayValue": "12 Months",
                        "attributeId": 15039669,
                        "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                    }, {
                        "id": 15039671,
                        "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                        "createdDate": 1606302925000,
                        "createdBy": "495659",
                        "modifiedDate": 1610527030325,
                        "modifiedBy": "9318118",
                        "name": "18 Months",
                        "sortOrder": 0,
                        "imageUrl": "",
                        "value": "18",
                        "displayValue": "18 Months",
                        "attributeId": 15039669,
                        "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                    }],
                    "code": "Wall calendar month",
                    "showInFrontend": false,
                    "sortOrder": 1,
                    "valueType": "String",
                    "selectType": "SINGLE",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
                },
                "attributeId": 15039669,
                "productId": 15641808,
                "multilingualKey": "com.qpp.cgp.domain.product.ProductAttributeValue"
            }, {
                "id": 15641812,
                "clazz": "com.qpp.cgp.domain.product.ProductAttributeValue",
                "createdDate": 1609292070000,
                "createdBy": "9416876",
                "modifiedDate": 1610527041912,
                "modifiedBy": "9416876",
                "value": "Value paper (matte)",
                "optionIds": "15039215",
                "attribute": {
                    "id": 15015639,
                    "clazz": "com.qpp.cgp.domain.attribute.Attribute",
                    "createdDate": 1606208172000,
                    "createdBy": "495659",
                    "modifiedDate": 1610527029578,
                    "modifiedBy": "495659",
                    "name": "Paper & finishing",
                    "required": false,
                    "inputType": "DropList",
                    "validationExp": "",
                    "options": [{
                        "id": 15039215,
                        "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                        "createdDate": 1606302399000,
                        "createdBy": "495659",
                        "modifiedDate": 1610527030323,
                        "modifiedBy": "495659",
                        "name": "Value paper (matte)",
                        "sortOrder": 0,
                        "imageUrl": "",
                        "value": "Value paper (matte)",
                        "displayValue": "Value paper (matte)",
                        "attributeId": 15015639,
                        "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                    }, {
                        "id": 15039216,
                        "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                        "createdDate": 1606302399000,
                        "createdBy": "495659",
                        "modifiedDate": 1610527030323,
                        "modifiedBy": "495659",
                        "name": "Premium paper (gloss)",
                        "sortOrder": 0,
                        "imageUrl": "",
                        "value": "Premium paper (gloss)",
                        "displayValue": "Premium paper (gloss)",
                        "attributeId": 15015639,
                        "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                    }],
                    "code": "Paper & finishing",
                    "showInFrontend": false,
                    "sortOrder": 1,
                    "valueType": "String",
                    "selectType": "SINGLE",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
                },
                "attributeId": 15015639,
                "productId": 15641808,
                "multilingualKey": "com.qpp.cgp.domain.product.ProductAttributeValue"
            }, {
                "id": 15641813,
                "clazz": "com.qpp.cgp.domain.product.ProductAttributeValue",
                "createdDate": 1609292070000,
                "createdBy": "9416876",
                "modifiedDate": 1610527041912,
                "modifiedBy": "9416876",
                "value": "None",
                "optionIds": "15015372",
                "attribute": {
                    "id": 15014711,
                    "clazz": "com.qpp.cgp.domain.attribute.Attribute",
                    "createdDate": 1606205534000,
                    "createdBy": "495659",
                    "modifiedDate": 1610527029578,
                    "modifiedBy": "420092",
                    "name": "Holidays",
                    "required": false,
                    "inputType": "DropList",
                    "validationExp": "",
                    "options": [{
                        "id": 15039613,
                        "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                        "createdDate": 1606302739000,
                        "createdBy": "495659",
                        "modifiedDate": 1610527030324,
                        "modifiedBy": "495659",
                        "name": "United States",
                        "sortOrder": 0,
                        "imageUrl": "",
                        "value": "United States",
                        "displayValue": "United States",
                        "attributeId": 15014711,
                        "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                    }, {
                        "id": 15015629,
                        "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                        "createdDate": 1606208059000,
                        "createdBy": "495659",
                        "modifiedDate": 1610527030323,
                        "modifiedBy": "495659",
                        "name": "Australia",
                        "sortOrder": 1,
                        "imageUrl": "",
                        "value": "Australia",
                        "displayValue": "Australia",
                        "attributeId": 15014711,
                        "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                    }, {
                        "id": 15039614,
                        "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                        "createdDate": 1606302739000,
                        "createdBy": "495659",
                        "modifiedDate": 1610527030324,
                        "modifiedBy": "495659",
                        "name": "Canada",
                        "sortOrder": 2,
                        "imageUrl": "",
                        "value": "Canada",
                        "displayValue": "Canada",
                        "attributeId": 15014711,
                        "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                    }, {
                        "id": 15015605,
                        "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                        "createdDate": 1606208008000,
                        "createdBy": "495659",
                        "modifiedDate": 1610527030322,
                        "modifiedBy": "495659",
                        "name": "United Kingdom",
                        "sortOrder": 3,
                        "imageUrl": "",
                        "value": "United Kingdom",
                        "displayValue": "United Kingdom",
                        "attributeId": 15014711,
                        "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                    }, {
                        "id": 15015372,
                        "clazz": "com.qpp.cgp.domain.attribute.AttributeOption",
                        "createdDate": 1606207572000,
                        "createdBy": "140800",
                        "modifiedDate": 1610527030322,
                        "modifiedBy": "495659",
                        "name": "None",
                        "sortOrder": 4,
                        "imageUrl": "",
                        "value": "None",
                        "displayValue": "None",
                        "attributeId": 15014711,
                        "multilingualKey": "com.qpp.cgp.domain.attribute.AttributeOption"
                    }],
                    "code": "Holidays",
                    "showInFrontend": false,
                    "sortOrder": 1,
                    "valueType": "String",
                    "selectType": "SINGLE",
                    "multilingualKey": "com.qpp.cgp.domain.attribute.Attribute"
                },
                "attributeId": 15014711,
                "productId": 15641808,
                "multilingualKey": "com.qpp.cgp.domain.product.ProductAttributeValue"
            }],
            "sku": "PS1214HU26-1",
            "hashCode": "5cd4a72b18f30a20a530ddb69dd6a2c5",
            "configurableProductId": 15054622,
            "packages": [],
            "type": "SKU",
            "multilingualKey": "com.qpp.cgp.domain.product.SkuProduct"
        },
        "productAtrributeValue": {
            "15039669": [15039670],
            "15015639": [15039215],
            "15004643": "2020-12",
            "15014711": [15015372]
        },
        "material": {
            "_id": "15040016",
            "clazz": "com.qpp.cgp.domain.bom.MaterialSpu",
            "modifiedDate": 1606303688875,
            "modifiedBy": "495659",
            "code": "Wall Calendar",
            "name": "Wall Calendar",
            "childItems": [{
                "_id": "15040010",
                "clazz": "com.qpp.cgp.domain.bom.bomitem.FixedBOMItem",
                "name": "Cover",
                "quantityStrategy": "basic",
                "itemMaterial": {
                    "_id": "15040011",
                    "clazz": "com.qpp.cgp.domain.bom.MaterialSpu",
                    "modifiedDate": 1606303688715,
                    "modifiedBy": "495659",
                    "code": "Cover",
                    "name": "Cover",
                    "childItems": [],
                    "parentMaterialType": {
                        "_id": "15013509",
                        "idReference": "Material",
                        "clazz": "com.qpp.cgp.domain.bom.MaterialType",
                        "isOutSourcing": false,
                        "packageQty": 0,
                        "multilingualKey": "com.qpp.cgp.domain.bom.Material",
                        "superClazz": "com.qpp.cgp.domain.bom.MaterialType"
                    },
                    "spuRtTypeRtObject": {
                        "_id": "15040012",
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "modifiedDate": 1606303688711,
                        "modifiedBy": "495659",
                        "rtType": {
                            "_id": "15013494",
                            "idReference": "RtType",
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "attributesToRtTypes": [],
                            "multilingualKey": "com.qpp.cgp.domain.bom.attribute.RtType"
                        },
                        "objectJSON": {
                            "Material": "157",
                            "finish": "matte"
                        },
                        "multilingualKey": "com.qpp.cgp.domain.bom.runtime.RtObject"
                    },
                    "category": "15013504",
                    "categoryName": "",
                    "leaf": true,
                    "isOutSourcing": false,
                    "packageQty": 0,
                    "isPackage": false,
                    "multilingualKey": "com.qpp.cgp.domain.bom.Material",
                    "superClazz": "com.qpp.cgp.domain.bom.MaterialSpu"
                },
                "constraints": [],
                "quantity": 1,
                "sourceBomItemId": "15014127",
                "isCompleted": true,
                "multilingualKey": "com.qpp.cgp.domain.bom.bomitem.FixedBOMItem"
            }, {
                "_id": "15040013",
                "clazz": "com.qpp.cgp.domain.bom.bomitem.FixedBOMItem",
                "name": "Inner",
                "quantityStrategy": "basic",
                "itemMaterial": {
                    "_id": "15040014",
                    "clazz": "com.qpp.cgp.domain.bom.MaterialSpu",
                    "modifiedDate": 1606303688851,
                    "modifiedBy": "495659",
                    "code": "Inner",
                    "name": "Inner",
                    "childItems": [],
                    "parentMaterialType": {
                        "_id": "15014125",
                        "idReference": "Material",
                        "clazz": "com.qpp.cgp.domain.bom.MaterialType",
                        "isOutSourcing": false,
                        "packageQty": 0,
                        "multilingualKey": "com.qpp.cgp.domain.bom.Material",
                        "superClazz": "com.qpp.cgp.domain.bom.MaterialType"
                    },
                    "spuRtTypeRtObject": {
                        "_id": "15040015",
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "modifiedDate": 1606303688850,
                        "modifiedBy": "495659",
                        "rtType": {
                            "_id": "15013494",
                            "idReference": "RtType",
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "attributesToRtTypes": [],
                            "multilingualKey": "com.qpp.cgp.domain.bom.attribute.RtType"
                        },
                        "objectJSON": {
                            "Material": "157",
                            "finish": "matte"
                        },
                        "multilingualKey": "com.qpp.cgp.domain.bom.runtime.RtObject"
                    },
                    "category": "15013504",
                    "leaf": true,
                    "isOutSourcing": false,
                    "packageQty": 0,
                    "multilingualKey": "com.qpp.cgp.domain.bom.Material",
                    "superClazz": "com.qpp.cgp.domain.bom.MaterialSpu"
                },
                "constraints": [],
                "quantity": 12,
                "sourceBomItemId": "15014128",
                "isCompleted": true,
                "multilingualKey": "com.qpp.cgp.domain.bom.bomitem.FixedBOMItem"
            }],
            "parentMaterialType": {
                "_id": "15014126",
                "idReference": "Material",
                "clazz": "com.qpp.cgp.domain.bom.MaterialType",
                "isOutSourcing": false,
                "packageQty": 0,
                "multilingualKey": "com.qpp.cgp.domain.bom.Material",
                "superClazz": "com.qpp.cgp.domain.bom.MaterialType"
            },
            "category": "15013504",
            "categoryName": "",
            "leaf": true,
            "isOutSourcing": false,
            "packageQty": 0,
            "isPackage": false,
            "multilingualKey": "com.qpp.cgp.domain.bom.Material",
            "superClazz": "com.qpp.cgp.domain.bom.MaterialSpu"
        },
        "qty": 1
    }
];

function expression(p) {
    var result = 0;
    var attrs = p.productAtrributeValue;
    if (!attrs || JSON.stringify(attrs) === '{}') {
        return result;
    } else if (attrs['15015639'] && attrs['15015639'][0] == 15039215) {
        result = 1;
    } else if (isContained([15039216, 15039215], [attrs['15015639'] && attrs['15015639'][0]])) {
        result = 2;
    } else {
        result = 1;
    }
    return result;
}

console.log(expression(["0.06"]));
