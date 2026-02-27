/**
 * Created by nan on 2020/8/27.
 */
Ext.define("CGP.pagecontentschema.view.pagecontentitemplaceholders.store.PageContentItemPlaceholder", {
    extend: 'Ext.data.Store',
    model: 'CGP.pagecontentschema.view.pagecontentitemplaceholders.model.PageContentItemPlaceholder',
    autoSync: false,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pageContentSchemas/{pageContentSchemaId}/pageContentItemPlaceholders',
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
    }
});
