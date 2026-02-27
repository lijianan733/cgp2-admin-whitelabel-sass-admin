/**
 * Created by nan on 2018/4/20.
 */
Ext.syncRequire(['CGP.configuration.productdefaultsupplier.model.ProductDefaultSupplierConfigModel'])
Ext.define('CGP.configuration.productdefaultsupplier.store.ProductDefaultSupplierConfigStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.configuration.productdefaultsupplier.model.ProductDefaultSupplierConfigModel',
    autoLoad: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/websites/{websiteId}/productDefaultProducerConfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor: function (config) {
        var me = this;
        me.proxy.url=adminPath+ 'api/websites/'+config.websiteId+'/productDefaultProducerConfigs',
        me.callParent(arguments)
    }
})