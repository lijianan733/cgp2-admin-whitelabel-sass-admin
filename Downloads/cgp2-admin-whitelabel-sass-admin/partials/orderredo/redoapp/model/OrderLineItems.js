/**
 * Created by admin on 2019/9/26.
 */
Ext.define('CGP.redodetails.model.OrderLineItems', {
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
        },
        {
            name: 'productInstance',
            type: 'object'
        },
        {
            name: 'builderPreviewUrls',
            type: 'array'
        },
        {
            name: 'product',
            type: 'object'
        },
        {
            name: 'order',
            type: 'object'
        },
        'orderStatusName',
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
            type: 'int'
        },
        'orderNumber',
        {
            name: '_id',
            type: 'int'
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
        {
            name: 'status',
            type: 'object'
        },
        'orderItemStatusName',
        {
            name: 'qty',
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
        //product info
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
            name: 'builderType',
            type: 'string'
        },
        {
            name: 'uploadFiles',
            type: 'array'
        },
        'builderEditUrl',
        'builderEditUrl',
        'comment',
        'customsCategoryId',
        {
            name: 'customsCategoryDTOList',
            type: 'array'
        },
    ]
});