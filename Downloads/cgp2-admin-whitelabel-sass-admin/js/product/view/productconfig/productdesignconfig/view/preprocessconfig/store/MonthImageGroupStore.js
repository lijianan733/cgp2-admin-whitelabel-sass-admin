/**
 * Created by nan on 2021/1/25
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.MonthImageGroupStore", {
    extend: 'Ext.data.Store',
    model:'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.MonthImageGroupModel',
    autoLoad: true,
    params: null,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/monthimagegroups',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
