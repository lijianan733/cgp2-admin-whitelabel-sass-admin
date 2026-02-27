/**
 * Created by nan on 2021/1/13
 */

Ext.define("CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.AllTypePCSPreprocessStore", {
    extend: 'Ext.data.Store',
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        me.proxy= {
            type: 'uxrest',
                url: adminPath + 'api/pagecontentpreprocess',
                reader: {
                type: 'json',
                    root: 'data.content'
            }
        };
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
