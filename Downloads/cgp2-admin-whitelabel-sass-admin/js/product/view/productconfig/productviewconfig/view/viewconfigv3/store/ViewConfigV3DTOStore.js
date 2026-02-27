/**
 * Created by nan on 2020/8/5.
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.store.ViewConfigV3DTOStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.model.ViewConfigV3DTOModel',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/builderViewConfigDtos/v3',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
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
})
