Ext.define('CGP.common.typesettingschedule.store.PageFieldSet', {
    extend: 'Ext.data.Store',
    require: ['CGP.common.typesettingschedule.model.Page'],
    model: 'CGP.common.typesettingschedule.model.Page',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: composingPath + 'composing/result/pages/output',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    remoteSort: true,
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
})