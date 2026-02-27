/**
 * @Description:根据订单查询的出来订单项信息，比列表管理的接口多报关相关字段
 * @author nan
 * @date 2024/6/18
 */
Ext.define('CGP.orderlineitemv2.model.OrderLineItemByOrder', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'amountStr',
            type: 'string'
        },
        'clazz',
        'createdDate',
        {
            name: 'datePurchased',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        'impressionVersion',
        'isCustomsClearance',
        {
            //是否包含外派生产产品
            name: 'isOutboundOrder',
            type: 'boolean'
        },
        {
            name: 'isRedo',
            type: 'boolean'
        },
        {
            name: 'isLock',
            type: 'boolean'
        },
        {
            name: 'isSupportBuilder',
            type: 'boolean'
        },
        {
            name: 'paibanStatus',
            type: 'number'
        },
        {
            name: 'isTest',
            type: 'boolean'
        },
        {
            name: 'itemGenerateStatus', //订单随机定制内容生成状态
            type: 'string',
        },
        'materialId',
        'materialName',
        'orderId',
        'orderNumber',
        {
            name: 'createDate',
            type: 'number'
        },
        {
            name: 'modifiedDate',
            type: 'number'
        },
        {
            name: 'weightStr',
            type: 'string'
        },
        {
            name: 'totalWeightStr',
            type: 'string'
        },
        {
            name: 'currencyExchangeRates',
            type: 'array'
        },
        {
            name: 'productAttributeValues',
            type: 'array'
        },
        'productDescription',
        {
            name: 'productId',
            type: 'int'
        },
        'productInstanceId',
        'productModel',
        'productName',
        'productSku',
        {
            name: 'qty',
            type: 'int'
        },
        {
            name: 'seqNo',
            type: 'int'
        },
        {
            name: 'statusId',
            type: 'int'
        },
        'statusName',
        'thumbnailInfo',
        '_id',
        'orderLineItemUploadStatus',
        {
            name: 'id',
            type: 'int',
            convert: function (value, record) {
                if (Ext.isEmpty(value)) {
                    return parseInt(record.get('_id'));
                } else {
                    return value;
                }
            }
        },
        'thirdManufactureName',
        'versionedProductAttributeId',
        {
            name: 'productCostingStr',
            type: 'string'
        },
        {
            name: 'confirmedDate',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'comment',
            type: 'string'
        },
        {
            //外派生产商信息
            name: 'thirdManufactureProduction',
            type: 'string'
        },
        {
            name: 'customsCategoryDTOList',
            type: 'array'
        },
        'customsCategoryId',
        {
            name: 'orderStatusId',
            type: 'int'
        },
        {
            name: 'updateProductInstanceHistories',
            type: 'array'
        },
        {
            name: 'finalManufactureCenter',
            type: 'string'
        },
        {
            name: 'manufactureCenter',
            type: 'string'
        },
        {
            name: 'isShip',
            type: 'boolean'
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
            name: 'allowDesign',
            type: 'boolean'
        },
        {
            name: 'designMethod',
            type: 'string'
        },
        {
            name: 'itemGenerateStatus',
            type: 'string'
        },
        //  v3版本新加字段
        {
            name: 'estimatedDeliveryDate',
            type: 'number'
        },
        {
            name: 'shipmentRequirement',
            type: 'object'
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
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders/{orderId}/lineItems/v2 ',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
