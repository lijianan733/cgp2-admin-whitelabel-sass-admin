Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.OrderLineItem', {
    extend: 'Ext.data.Model',
    fields: [
        {
            "name": "amountStr",
            "type": "string"
        },
        "clazz",
        "createdDate",
        {
            "name": "datePurchased",
            "type": "date",
            "convert": function (value) {
                return new Date(value)
            },
            "serialize": function (value) {
                var time = value.getTime();
                return time;
            }
        },
        "impressionVersion",
        {
            "name": "isCustomsClearance",
            "type": "boolean",
            "allowBlank": true,
            "convert": null
        },
        {
            "name": "isOutboundOrder",
            "type": "boolean"
        },
        {
            "name": "isRedo",
            "type": "boolean"
        },
        {
            "name": "isLock",
            "type": "boolean"
        },
        {
            "name": "isSupportBuilder",
            "type": "boolean"
        },
        {
            "name": "paibanStatus",
            "type": "number"
        },
        {
            "name": "isTest",
            "type": "boolean"
        },
        {
            "name": "itemGenerateStatus",
            "type": "string"
        },
        {
            "name": "materialId",
            "type": "string"
        },
        {
            "name": "materialName",
            "type": "string"
        },
        {
            "name": "orderId",
            "type": "int"
        },
        "orderNumber",
        {
            "name": "createDate",
            "type": "number"
        },
        {
            "name": "modifiedDate",
            "type": "number"
        },
        {
            "name": "weightStr",
            "type": "string"
        },
        {
            "name": "totalWeightStr",
            "type": "string"
        },
        {
            "name": "currencyExchangeRates",
            "type": "array"
        },
        {
            "name": "productAttributeValues",
            "type": "array",
            "convert": function (value) {
                if (!Ext.isEmpty(value)) {
                    Ext.Array.each(value, function (item) {
                        if (!Ext.isEmpty(item.attributeOptionIds)) {
                            Ext.Array.each(item?.attribute?.options, function (option) {
                                if (item.attributeOptionIds == option.id && !Ext.isEmpty(option.imageUrl)) {
                                    item.imageUrl = option.imageUrl;
                                }
                            })
                        }
                    });
                    return value
                }
            }
        },
        "productDescription",
        {
            "name": "productId",
            "type": "int"
        },
        {
            "name": "productInstanceId",
            "type": "string"
        },
        "productModel",
        "productName",
        "productSku",
        {
            "name": "qty",
            "type": "int"
        },
        {
            "name": "seqNo",
            "type": "int"
        },
        {
            "name": "statusId",
            "type": "number"
        },
        "statusName",
        {
            "name": "thumbnailInfo",
            "type": "object"
        },
        {
            "name": "_id",
            "type": "int"
        },
        {
            "name": "id",
            "type": "int",
            "convert": function (value, record) {
                if (Ext.isEmpty(value)) {
                    return parseInt(record.get('_id'));
                } else {
                    return value;
                }
            }
        },
        {
            "name": "thirdManufactureName",
            "type": "string"
        },
        {
            "name": "versionedProductAttributeId",
            "type": "string"
        },
        {
            "name": "productCostingStr",
            "type": "string"
        },
        {
            "name": "confirmedDate",
            "type": "date",
            "convert": function (value) {
                return new Date(value)
            },
            "serialize": function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            "name": "comment",
            "type": "string"
        },
        {
            "name": "thirdManufactureProduction",
            "type": "string"
        },
        {
            "name": "customsCategoryDTOList",
            "type": "object"
        },
        {
            "name": "customsCategoryId",
            "type": "string"
        },
        {
            "name": "orderStatusId",
            "type": "int"
        },
        {
            "name": "updateProductInstanceHistories",
            "type": "array"
        },
        {
            "name": "finalManufactureCenter",
            "type": "string"
        },
        {
            "name": "manufactureCenter",
            "type": "string"
        },
        {
            "name": "isShip",
            "type": "boolean"
        },
        {
            "name": "websiteId",
            "type": "int"
        },
        "websiteCode",
        {
            "name": "productInstance",
            "type": "object"
        },
        {
            "name": "builderPreviewUrls",
            "type": "array"
        },
        {
            "name": "product",
            "type": "object"
        },
        {
            "name": "order",
            "type": "object"
        },
        "orderStatusName",
        {
            "name": "orderItemStatusId",
            "type": "int"
        },
        {
            "name": "status",
            "type": "object"
        },
        {
            "name": "componentInfoStatus",
            "type": "string"
        },
        {
            "name": "isComp",
            "type": "string"
        },
        {
            "name": "description",
            "type": "string"
        },
        {
            "name": "isMainComponent",
            "type": "boolean"
        },
        "orderItemStatusName",
        {
            "name": "price",
            "type": "string"
        },
        {
            "name": "amount",
            "type": "string"
        },
        {
            "name": "productImageUrl",
            "type": "string"
        },
        {
            "name": "workLineItemExist",
            "type": "boolean"
        },
        {
            "name": "workOrderLineItemQty",
            "type": "int"
        },
        {
            "name": "workOrderLineItems",
            "type": "array"
        },
        {
            "name": "isProject",
            "type": "boolean"
        },
        {
            "name": "projectId",
            "type": "int",
            "useNull": true
        },
        {
            "name": "projectThumbnail",
            "type": "string"
        },
        {
            "name": "customAttributeValues",
            "type": "array"
        },
        {
            "name": "builderType",
            "type": "string"
        },
        {
            "name": "uploadFiles",
            "type": "array"
        },
        "builderEditUrl",
        "comment",
        "originalOrderItemId",
        "materialPath",
        {
            "name": "material",
            "type": "object"
        },
        {
            name: 'bindOrderNumber',
            type: 'string'
        },
        {
            name: 'bindSeqNo',
            type: 'number'
        },
        {
            name: 'storeName',
            type: 'string'
        },
        {
            name: 'storeProductId',
            type: 'string'
        },
        {
            name: 'storeId',
            type: 'string'
        },

        {
            name: 'randomDesignReview',
            type: 'boolean'
        },
        {
            name: 'fixDesignReview',
            type: 'boolean'
        },
        {
            name: 'isFinishedProduct',
            type: 'boolean'
        },
        {
            name: 'designId',
            type: 'string'
        },
    ]
});
