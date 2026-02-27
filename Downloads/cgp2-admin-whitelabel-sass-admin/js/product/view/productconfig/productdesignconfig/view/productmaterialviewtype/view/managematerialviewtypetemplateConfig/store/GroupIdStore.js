/**
 * Created by nan on 2020/9/8.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.store.GroupIdStore', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'groupId',
            type: 'string',
            convert: function (value, record) {
                return record.raw;
            }
        }

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/templateConfigController/groups?mvtId',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.mvtId) {
            me.proxy.url = adminPath + 'api/templateConfigController/groups?mvtId=' + config.mvtId;
        }
        me.callParent(arguments);
    },
    autoLoad: true
});
