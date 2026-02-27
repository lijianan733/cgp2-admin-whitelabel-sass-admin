Ext.define("CGP.commonbuilderfont.store.BuilderFont", {
    extend: 'Ext.data.Store',
    model: "CGP.commonbuilderfont.model.BuilderFont",
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/commonbuilderfont/findFonts',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});
