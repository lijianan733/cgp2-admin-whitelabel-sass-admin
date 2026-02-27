/**
 * Created by nan on 2021/6/5
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.store.GridPCSPreProcessStore", {
    extend: 'Ext.data.Store',
    require:['CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.model.GridPCSPreProcessModel'],
    model: 'CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.model.GridPCSPreProcessModel',
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
