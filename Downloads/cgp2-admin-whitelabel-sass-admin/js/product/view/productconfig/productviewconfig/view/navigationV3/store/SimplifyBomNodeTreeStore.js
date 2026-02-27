/**
 * Created by nan on 2019/7/10.
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.navigationV3.store.SimplifyBomNodeTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'CGP.product.view.productconfig.productviewconfig.view.navigationV3.model.SimplifyBomNodeModel',
    nodeParam: '_id',
    root: {
        _id: 'root',
        name: ''
    },
    productViewConfigId: null,
    proxy: {
        type: 'treerest',
        url: adminPath + 'api/productConfigViews/productViewConfigId/sBomNodes/{id}/children',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function (config) {
        var me = this;
        console.log(config);
        me.proxy.url = me.proxy.url.replace('productViewConfigId', config.productViewConfigId);
        this.callParent(arguments);
    }
})
