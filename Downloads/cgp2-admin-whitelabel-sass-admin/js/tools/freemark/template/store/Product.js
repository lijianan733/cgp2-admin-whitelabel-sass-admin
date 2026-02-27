/**
 * Created by miao on 2021/1/14.
 */

Ext.define('CGP.tools.freemark.template.store.Product', {
    extend: 'Ext.data.Store',
    require: ['CGP.tools.freemark.template.model.Product'],
    model: 'CGP.tools.freemark.template.model.Product',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + "api/products/list",
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent();
    },
    autoLoad: true

});