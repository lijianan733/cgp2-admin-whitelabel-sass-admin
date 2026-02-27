Ext.define('CGP.orderlineitem.model.OrderLineItem', {
    extend: 'Ext.data.Model',
    fields: [
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
        }, {
            name: 'productDescription',
            type: 'string'
        },
        'orderStatusName',
        {
            name: 'priceStr',
            type: 'string'
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
            convert: function (value, record) {
                var order = record.get('order');
                if (!Ext.isEmpty(order)) {
                    return order.id;
                }
            }
        }, {
            name: 'orderNumber',
            type: 'string',
            convert: function (value, record) {
                var order = record.get('order');
                if (!Ext.isEmpty(order)) {
                    return order.orderNumber;
                }
            }
        },
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'orderLineItemUploadStatus',
            type: 'string'
        },
        {
            name: 'seqNo',
            type: 'int'
        },
        //orderItemStatus
        {
            name: 'orderItemStatusId',
            type: 'int'
        },
        'orderItemStatusName',
        {
            name: 'qty',
            type: 'int'
        },
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
        {
            name: 'productId',
            type: 'int'
        },
        'productName',
        'productModel',
        'productSku',
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
            name: 'comment',
            type: 'string'
        },
        {
            name: 'uploadFiles',
            type: 'array'
        }, {
            name: 'isRedo',
            type: 'boolean'
        }, {
            name: 'thumbnailInfo',
            type: 'object',
        }, 'builderPreviewUrl', 'builderEditUrl', 'impressionVersion', 'originalOrderItemId', 'materialPath',
        {
            name: 'updateProductInstanceHistories',
            type: 'array'
        }
        , {
            //是否包含外派生产产品
            name: 'isOutboundOrder',
            type: 'boolean'
        }, {
            //外派生产商信息
            name: 'thirdManufactureProduction',
            type: 'string'
        },
        {
            name: 'thirdManufactureName',
            type: 'string'
        },
        //外派订单项的快递信息,数组结构,现在默认自取第一个数据
        {
            name: 'deliveryInformations',
            type: 'array'
        },{
            name: 'bindOrderNumber',
            type: 'string'
        },{
            name: 'bindSeqNo',
            type: 'int'
        },
        {
            name: 'manufactureCenter',
            type: 'string'
        },
        {
            name: 'finalManufactureCenter',
            type: 'string'
        },
        {
            name: 'isShip',
            type: 'boolean'
        }
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

