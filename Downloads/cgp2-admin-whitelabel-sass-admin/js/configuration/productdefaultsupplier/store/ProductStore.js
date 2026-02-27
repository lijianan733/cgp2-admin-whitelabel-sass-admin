/**
 * Created by nan on 2018/4/20.
 */
Ext.syncRequire(['CGP.configuration.productdefaultsupplier.model.ProductModel'])
Ext.define('CGP.configuration.productdefaultsupplier.store.ProductStore', {
    extend:'Ext.data.Store',
    model: 'CGP.configuration.productdefaultsupplier.model.ProductModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + "api/products/list",
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params : null,
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments)
    }
})