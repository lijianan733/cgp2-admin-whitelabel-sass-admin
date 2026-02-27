Ext.define('CGP.systembuilderconfig.store.SystemBuilderConfigStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.systembuilderconfig.model.SystemBuilderConfigModel'],
    model: 'CGP.systembuilderconfig.model.SystemBuilderConfigModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/systembuilderconfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});
