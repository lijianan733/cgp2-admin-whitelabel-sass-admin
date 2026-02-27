Ext.define("CGP.pagecontentschema.view.canvas.store.Canvas", {
    extend: 'Ext.data.Store',
    model: 'CGP.pagecontentschema.view.canvas.model.Canvas',
    autoSync: false,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pageContentSchemas/{pageContentSchemaId}/canvases',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.pageContentSchemaId) {
            me.proxy.url = adminPath + 'api/pageContentSchemas/' + config.pageContentSchemaId + '/canvases';
        }
        me.callParent(arguments);
    }
});
