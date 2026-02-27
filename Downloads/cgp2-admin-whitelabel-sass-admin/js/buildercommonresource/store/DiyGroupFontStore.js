/**
 * Created by nan on 2020/11/12
 */

Ext.define("CGP.buildercommonresource.store.DiyGroupFontStore", {
    extend: 'Ext.data.Store',
    model: "CGP.commonbuilderfont.model.BuilderFont",
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/commonbuilderresourceconfigs/V2/fonts',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    remoteSort: false,
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
