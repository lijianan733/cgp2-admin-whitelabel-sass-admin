/**
 * Created by nan on 2019/7/10.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.store.SimplifyBomNodeTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.model.SimplifyBomNodeModel',
    nodeParam: '_id',
    root: {
        _id: 'root',
        name: ''
    },
    productConfigDesignId: null,
    proxy: {
        type: 'treerest',
        url: adminPath + 'api/SBNodeController/designId/SBNOdeTree/{id}/children',
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
        console.log(config)
        me.proxy.url = me.proxy.url.replace('designId', config.productConfigDesignId);
        this.callParent(arguments);
    }
})
