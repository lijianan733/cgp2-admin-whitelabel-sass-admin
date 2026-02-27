/**
 * Created by nan on 2021/4/16
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.store.SimplifyPMVTStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.model.ProductMaterialViewTypeVersionFiveModel',
    proxy: {
        type: 'treerest',
        url: adminPath + 'api/simplifyBomConfigs/{bomConfigId}/displayProductMaterialTypes',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    nodeId: null,
    bomConfigId: null,
    constructor: function (config) {
        var me = this;
        if (config) {
            if (config.bomConfigId) {
                me.proxy.url = me.proxy.url.replace('{bomConfigId}', config.bomConfigId);
            }
        }
        this.callParent(arguments);
    }
})
