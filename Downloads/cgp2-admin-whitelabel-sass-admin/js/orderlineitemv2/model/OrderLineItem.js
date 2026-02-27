Ext.define('CGP.orderlineitemv2.model.OrderLineItem', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
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
        {
            name: '_id',
            type: 'int'
        },
        {
            name: 'statusId',
            type: 'int'
        },
        {
            name: 'bindOrderNumber',
            type: 'string'
        },
        'statusName',
        'productInstanceId',
        {
            name: 'productDescription',
            type: 'string'
        },
        {
            name: 'isFinishedProduct',
            type: 'boolean'
        },
        {
            name: 'bindOrderId',
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
            name: 'designId',
            type: 'string'
        },
        {
            name: 'isCustomsClearance',
            type: 'boolean',
        },
        {
            name: 'currencyExchangeInfo',
            type: 'object',
        },
        {
            name: 'currencyExchangeRates',
            type: 'array',
        },
        {
            name: 'customsCategoryDTOList',
            type: 'array',
        },
        {
            name: 'customsCategoryId',
            type: 'string',
        },
        {
            name: 'bindSeqNo',
            type: 'string'
        },
        {
            name: 'priceStr',
            type: 'string'
        },
        {
            name: 'finalManufactureCenter',
            type: 'string'
        },
        {
            name: 'isLock',
            type: 'boolean'
        },
        {
            name: 'amountStr',
            type: 'string'
        },
        {
            name: 'productCostingStr',
            type: 'string'
        },
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
            name: 'orderId',
            type: 'int',
        },
        {
            name: 'orderNumber',
            type: 'string',
        },
        {
            name: 'manufactureCenter',
            type: 'string',
        },
        {
            name: 'seqNo',
            type: 'int'
        },
        {
            name: 'orderLineItemUploadStatus',
            type: 'string'
        },
        {
            name: 'qty',
            type: 'int'
        },
        'productName',
        'productModel',
        'productSku',
        {
            name: 'productId',
            type: 'int'
        },
        {
            name: 'comment',
            type: 'string'
        },
        {
            name: 'isRedo',
            type: 'boolean'
        },
        {
            name: 'thumbnailInfo',
            type: 'object',
        },
        {
            //是否包含外派生产产品
            name: 'isOutboundOrder',
            type: 'boolean'
        },
        {
            name: 'thirdManufactureName',
            type: 'string'
        },
        {
            name: "isTest",
            type: 'string'
        },
        {
            name: 'orderStatusId',
            type: 'int'
        },
        'materialCode',
        'materialId',
        'materialName',
        'impressionVersion',
        'isTest',
        'orderStatusId',
        {
            name:'paibanStatus',
            type:'number'
        },
        {
            name: 'allowDesign',
            type: 'boolean'
        },
        {
            name: 'designMethod',
            type: 'string'
        },
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orderItemsV2',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
/*
var a = [
    {
        name: 'websiteId',
        type: 'int'
    },
    'websiteCode',
    {
        name: 'orderStatusId',
        type: 'int'
    }, {
        name: 'order',
        type: 'object'
    }, {
        name: 'status',
        type: 'object'
    }, {
        name: 'productInstance',
        type: 'object'
    }, {
        name: 'product',
        type: 'object'
    },
    'orderStatusName',


    //orderItemStatus
    {
        name: 'orderItemStatusId',
        type: 'int'
    },
    'orderItemStatusName',

    {
        name: 'producingQty',
        type: 'int'
    },
    {
        name: 'finishedProduceQty',
        type: 'int'
    },
    {
        name: 'price',
        type: 'string'
    },
    {
        name: 'amount',
        type: 'string'
    },
    {
        name: 'product',
        type: 'object'
    },

    'productImageUrl',
    //work info
    {
        name: 'workLineItemExist',
        type: 'boolean'
    },
    {
        name: 'workOrderLineItemQty',
        type: 'int'
    },
    //name totalQty completedQty status
    {
        name: 'workOrderLineItems',
        type: 'array'
    },

    //project info
    {
        name: 'isProject',
        type: 'boolean'
    },
    {
        name: 'projectId',
        type: 'int',
        useNull: true
    },
    'projectThumbnail',

    {
        name: 'productAttributeValues',
        type: 'array'
    },
    {
        name: 'customAttributeValues',
        type: 'array'
    },
    {
        name: 'showOrderInfo',
        type: 'boolean'
    },
    'builderType', 'projectImage', {
        name: 'addressBook',
        type: 'object'
    }, {
        name: 'store',
        type: 'object'
    },
    {
        name: 'partnerId',
        type: 'int'
    }, {
        name: 'statusHistories',
        type: 'array'
    },
    {
        name: 'workOrderLineItem',
        type: 'object'
    },

    {
        name: 'uploadFiles',
        type: 'array'
    }, 'builderPreviewUrl', 'builderEditUrl', 'impressionVersion', 'originalOrderItemId', 'materialPath',
    {
        name: 'updateProductInstanceHistories',
        type: 'array'
    }
    ,  {
        //外派生产商信息
        name: 'thirdManufactureProduction',
        type: 'string'
    },

    //外派订单项的快递信息,数组结构,现在默认自取第一个数据
    {
        name: 'deliveryInformations',
        type: 'array'
    }
]
*/

