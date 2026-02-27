/**
 * Created by nan on 2020/11/5
 */

Ext.define('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.store.BuilderConfigV2Store', {
    extend: 'Ext.data.Store',
    requires: ['CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.model.BuilderConfigV2Model'],
    model: 'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.model.BuilderConfigV2Model',
    remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/builderconfigs/v2',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})