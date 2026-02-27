Ext.define('CGP.buildercommonresource.store.CommonResourceStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.buildercommonresource.model.CommonResourceModel'],
    model: 'CGP.buildercommonresource.model.CommonResourceModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/commonbuilderresourceconfigs',
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
    autoLoad: true
});
