/**
 * Created by nan on 2020/4/27.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcresource.store.PCResourceLibraryStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.product.view.productconfig.productdesignconfig.view.pcresource.model.PCResourceLibraryModel'],
    model: 'CGP.product.view.productconfig.productdesignconfig.view.pcresource.model.PCResourceLibraryModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/businessLibraryOfProductConfigDesigns',
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
