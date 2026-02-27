Ext.define("CGP.multilingualconfig.store.LanguageResource",{
    extend : 'Ext.data.Store',
    model : "CGP.multilingualconfig.model.LanguageResource",
    remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/entityMultilingualConfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});