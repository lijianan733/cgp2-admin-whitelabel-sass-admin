Ext.define('CGP.cmspages.store.CMSPageStore', {
    extend: 'Ext.data.Store',
    require: ['CGP.cmspages.model.CMSPageModel'],
    model: 'CGP.cmspages.model.CMSPageModel',
    PageSize: 25,
    proxy: {
        type: 'uxrest',
        url: cmsPagePath + 'api/cms-saas-page',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    remoteSort: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})