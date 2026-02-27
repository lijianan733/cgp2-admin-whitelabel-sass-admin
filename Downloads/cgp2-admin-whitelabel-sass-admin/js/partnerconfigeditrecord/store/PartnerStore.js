/**
 * @author xiu
 * @date 2024/5/31
 */
Ext.define('CGP.partnerconfigeditrecord.store.PartnerStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.partnerconfigeditrecord.model.PartnerModel',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters : [{
        property : 'startDate',
        direction : 'ASC'
    }],
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})

Ext.define('CGP.order.store.PartnerStore', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'name',
            type: 'string',
            convert: function (value, record) {
                return value + '<' + record.getId() + '>'
            }
        },
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'partnerType',
            type: 'string'
        },
        {
            name: 'email',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})