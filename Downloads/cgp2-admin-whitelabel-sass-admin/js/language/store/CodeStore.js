/**
 * Created by nan on 2020/4/27.
 */
Ext.define('CGP.language.store.CodeStore', {
    requires: ['CGP.language.model.CodeModel'],
    model: 'CGP.language.model.CodeModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/languageCodes',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});
