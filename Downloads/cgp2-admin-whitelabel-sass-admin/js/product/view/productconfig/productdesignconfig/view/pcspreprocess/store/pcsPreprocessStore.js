Ext.define("CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.store.pcsPreprocessStore", {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.model.pcsPreprocessModel',
    autoSync: false,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pageContentSchemas/{pageContentSchemaId}/pageContentItemPlaceholders',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.PMVTId) {
            me.proxy.url = adminPath + 'api/pagecontentschemapreprocessconfig/'+config.PMVTId+'/placeholders';
        }
        me.callParent(arguments);
    }
});
