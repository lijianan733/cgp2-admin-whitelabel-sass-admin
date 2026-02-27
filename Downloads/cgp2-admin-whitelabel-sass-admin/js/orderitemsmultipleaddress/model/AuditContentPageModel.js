/**
 * @author xiu
 * @date 2026/1/30
 */
Ext.define('CGP.orderitemsmultipleaddress.model.AuditContentPageModel', {
    extend: 'Ext.data.Model',
    // idProperty: 'designId',
    fields: [
        {
            name: 'designId',
            type: 'string',
        },
        {
            name: 'id',
            type: 'string',
            convert: function (value, record) {
                return record.get('designId');
            }
        },
        {
            name: 'productSku',
            type: 'string',
        },
        {
            name: 'itemCountInDesignId',
            type: 'number'
        },
        {
            name: 'totalItemQtyInDesignId',
            type: 'number'
        },
        {
            name: 'designMethod',
            type: 'string'
        },
        {
            name: 'storeProductId',
            type: 'string',
        },
        {
            name: 'itemGenerateStatus',
            type: 'string',
        },
        {
            name: 'isFinishedProduct',
            type: 'boolean',
        },
        {
            name: 'storeName',
            type: 'string',
        },
        {
            name: 'storeId',
            type: 'string',
        },
        {
            name: 'productModel',
            type: 'string',
        },
        {
            name: 'randomDesignReview',
            type: 'boolean',
        },
        {
            name: 'fixDesignReview',
            type: 'boolean',
        },
        {
            name: 'isFinishedProduct',
            type: 'boolean'
        },
        {
            name: 'productName',
            type: 'string',
        },
        {
            name: 'previewImage',
            type: 'object',
        },
        {
            name: 'productDescription',
            type: 'string',
        },
    ],
})