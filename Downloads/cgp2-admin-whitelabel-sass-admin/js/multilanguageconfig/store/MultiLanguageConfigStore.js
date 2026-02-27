Ext.define('CGP.multilanguageconfig.store.MultiLanguageConfigStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.multilanguageconfig.model.MultiLanguageConfigModel'],
    model: 'CGP.multilanguageconfig.model.MultiLanguageConfigModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/resources',
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
