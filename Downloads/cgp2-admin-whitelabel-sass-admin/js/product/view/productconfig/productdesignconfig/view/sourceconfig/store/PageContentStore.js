/**
 * Created by nan on 2020/12/9
 */

Ext.define('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.PageContentStore', {
    extend: 'Ext.data.Store',
    require: ['CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.model.PageContentModel'],
    model: 'CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.model.PageContentModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pageContents',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
});