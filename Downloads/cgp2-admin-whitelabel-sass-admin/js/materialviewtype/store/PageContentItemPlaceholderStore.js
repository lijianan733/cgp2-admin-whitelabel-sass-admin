/**
 * Created by nan on 2019/12/25.
 */
Ext.define("CGP.materialviewtype.store.PageContentItemPlaceholderStore", {
    extend: 'Ext.data.Store',
    model: "CGP.materialviewtype.model.PageContentItemPlaceholderModel",
    requires: ['CGP.materialviewtype.model.PageContentItemPlaceholderModel'],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pageContentSchemas/{id}/pageContentItemPlaceholders',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.pageContentSchemaId) {
            me.proxy.url = adminPath + 'api/pageContentSchemas/' + config.pageContentSchemaId + '/pageContentItemPlaceholders';
        }
        me.callParent(arguments);
    },
    autoLoad: true
});
