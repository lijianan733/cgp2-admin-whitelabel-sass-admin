/**
 * Created by nan on 2019/12/13.
 */
Ext.define('CGP.product.view.mappinglink.store.MappingLinkStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.product.view.mappinglink.model.MappingLinkModel'],
    model: 'CGP.product.view.mappinglink.model.MappingLinkModel',
    remoteSort: false,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/mappingLink',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
