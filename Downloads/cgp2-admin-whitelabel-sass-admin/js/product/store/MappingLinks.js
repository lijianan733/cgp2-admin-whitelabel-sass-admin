/**
 * Created by admin on 2019/12/17.
 */
Ext.define('CGP.product.store.MappingLinks', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.model.MappingLinks',
    autoLoad :true,
    pageSize:100,
    //url:adminPath + 'api/mappingLink',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/mappingLink',
        reader: {
            type: 'json',
            root:'data.content'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})