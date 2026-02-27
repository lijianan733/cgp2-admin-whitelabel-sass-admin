Ext.define('CGP.language.store.LanguageStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.language.model.LanguageModel'],
    model: 'CGP.language.model.LanguageModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/languages',
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
