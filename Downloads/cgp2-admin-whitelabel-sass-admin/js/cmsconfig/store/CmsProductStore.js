/**
 * @Description: 配置了cmsConfig的产品
 * @author nan
 * @date 2023/9/6
 */
Ext.define('CGP.cmsconfig.store.CmsProductStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.cmsconfig.model.CmsProductModel',
    remoteSort: true,
    pageSize: 50,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/products/cmsConfigs',
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