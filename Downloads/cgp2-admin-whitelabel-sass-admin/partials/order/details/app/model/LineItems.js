Ext.define('CGP.orderdetails.model.LineItems', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'orderTotalQty',
            type: 'int'
        },
        {
            name: 'websiteId',
            type: 'int'
        },
        {
            name: 'orderId',
            type: 'int'
        },
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'orderStatusId',
            type: 'int'
        },
        {
            name: 'seqNo',
            type: 'int'
        },
        {
            name: 'price',
            type: 'string'
        },
        {
            name: 'qty',
            type: 'int'
        },
        {
            name: 'amount',
            type: 'string'
        },
        {
            name: 'priceStr',
            type: 'string'
        },
        {
            name: 'amountStr',
            type: 'string'
        },
        {
            name: 'completedQty',
            type: 'int'
        },
        {
            name: 'productAttributeValues',
            type: 'array'
        },
        {
            name: 'workStatusId',
            type: 'int'
        },
        {
            name: 'workId',
            type: 'int'
        },
        {
            name: 'workStatusName',
            type: 'string'
        },
        {
            name: 'printedQty',
            type: 'int'
        },
        {
            name: 'producedQty',
            type: 'int'
        },
        {
            name: 'productCostingStr',
            type: 'string'
        },
        {
            name: 'deliveriedQty',
            type: 'int'
        },
        {
            name: 'workOrderLineItemId',
            type: 'int'
        },
        {
            name: 'lastModifiedDate',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        'lastModifiedOperator',
        'productName',
        'productModel',
        'productSku',
        'projectId',
        'projectThumbnail',
        'productImageurl',
        'shippingMethodCode',
        {
            name: 'storageInfo',
            type: 'array'
        }
    ]

})