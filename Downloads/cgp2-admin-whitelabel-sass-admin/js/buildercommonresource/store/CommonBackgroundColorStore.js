/**
 * Created by nan on 2020/11/9
 */

Ext.define('CGP.buildercommonresource.store.CommonBackgroundColorStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.buildercommonresource.model.CommonColorModel'],
    model: 'CGP.buildercommonresource.model.CommonColorModel',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/commonbuilderresourceconfigs/V2/backgroundColors',
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
    },
    autoLoad: true
});
