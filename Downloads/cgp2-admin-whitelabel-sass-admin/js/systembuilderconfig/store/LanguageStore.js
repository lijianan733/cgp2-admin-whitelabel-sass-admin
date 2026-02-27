/**
 * Created by nan on 2020/11/18
 */
Ext.define('CGP.systembuilderconfig.store.LanguageStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.systembuilderconfig.model.Language',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/languages',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});