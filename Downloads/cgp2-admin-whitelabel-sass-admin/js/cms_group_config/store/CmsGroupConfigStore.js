/**
 * @Description
 * @author nan
 * @date 2025/8/1
 */
Ext.define('CGP.cms_group_config.store.CmsGroupConfigStore', {
    extend: 'Ext.data.Store',
    require: ['CGP.cms_group_config.model.CmsGroupConfigModel'],
    model: 'CGP.cms_group_config.model.CmsGroupConfigModel',
    PageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/cms/product/group-configs',
        ready: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: '_id',
        direction: 'DESC'
    }],
    autoLoad: true,
    params: null,
    remoteSort: true,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})