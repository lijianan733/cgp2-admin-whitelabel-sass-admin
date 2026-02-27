/**
 * Created by nan on 2021/06/04.
 */
Ext.define('CGP.multilanguageconfig.store.LanguageCodeStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.multilanguageconfig.model.LanguageCodeModel'],
    model: 'CGP.multilanguageconfig.model.LanguageCodeModel',
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

