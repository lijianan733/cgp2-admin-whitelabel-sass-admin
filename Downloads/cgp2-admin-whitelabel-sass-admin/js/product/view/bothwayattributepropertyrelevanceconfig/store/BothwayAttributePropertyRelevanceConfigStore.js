/**
 * Created by nan on 2019/1/15.
 */
Ext.define('CGP.product.view.bothwayattributepropertyrelevanceconfig.store.BothwayAttributePropertyRelevanceConfigStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.bothwayattributepropertyrelevanceconfig.model.BothwayAttributePropertyRelevanceConfigModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/multiAttributeTwoWayPropertyConfig',
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
    }
})