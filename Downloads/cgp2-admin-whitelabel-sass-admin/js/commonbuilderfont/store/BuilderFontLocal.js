Ext.define("CGP.commonbuilderfont.store.BuilderFontLocal",{
    extend : 'Ext.data.Store',
    model : "CGP.commonbuilderfont.model.BuilderFont",
    remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/commonbuilderfont/findRemainFonts',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});