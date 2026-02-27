/**
 * Created by nan on 2020/12/14
 */
Ext.define('CGP.pagecontent.store.PageContentStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    requires: ['CGP.pagecontent.model.PageContentModel'],
    model: 'CGP.pagecontent.model.PageContentModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pageContents',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})