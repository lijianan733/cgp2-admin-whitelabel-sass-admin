/**
 * @author xiu
 * @date 2025/7/30
 */
Ext.define('CGP.websiteproductlist.model.StoreConfigMode', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'number'
        },
        {
            name: 'defaultDetailSetting',
            type: 'object'
        },
        {
            name: 'platform',
            type: 'string'
        },
        {
            name: 'value',
            type: 'object'
        },
    ],
})