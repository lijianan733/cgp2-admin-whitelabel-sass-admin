Ext.define('CGP.orderdetails.model.WorkOrderLineItem', {

    extend: 'Ext.data.Model',

    fields: [{
            name: 'id',
            type: 'int'
    }, {
            name: 'seqNo',
            type: 'int'
    }, {
            name: 'orderId',
            type: 'int'
    }, {
            name: 'projectId',
            type: 'int'
    }, {
            name: 'orderStatusId',
            type: 'int'
    }, {
            name: 'datePurchased',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
    }, {
            name: 'confirmedDate',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
    }, {
            name: 'lastModifiedDate',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
    }, {
            name: 'qty',
            type: 'int'
    }, {
            name: 'productAttributeValues',
            type: 'array'
    }, {
            name: 'printedQty',
            type: 'int'
    }, {
            name: 'producedQty',
            type: 'int'
    }, {
            name: 'deliveriedQty',
            type: 'int'
    }, {
            name: 'orderTotalQty',
            type: 'int'
        }, {
            name: 'statusId',
            type: 'int'
    }, {
            name: 'isProject',
            type: 'boolean'
    }, {
            name: 'storageInfo',
            type: 'array'
    }, 'orderStatusName', 'lastModifiedOperator', 'orderNumber', 'productSku', 'productName', 'productModel', 'productImageUrl',
            'statusName', 'projectThumbnail', 'websiteCode', 'websiteName', 'reprintNo', 'shippingMethodCode',
             //package info
        {
            name: 'isPackage',
            type: 'boolean'
        },
            'packageName',
            'packageImageUrl',
        {
            name: 'packageNeedPrint',
            type: 'boolean'
        },
        {
            name: 'productHavePackage',
            type: 'boolean'
        },
        {
            name: 'isReprint',
            type: 'boolean'
        },
              'reprintNo',
        {
            name: 'reprintQty',
            type: 'int'
        },
        {
            name: 'orderItemId',
            type: 'int'
        }, 'builderType', {
            name: 'partnerId',
            type: 'int'
        }, {
            name: 'uploadFiles',
            type: 'array'
        },'builderPreviewUrl','builderEditUrl'
            ]

});