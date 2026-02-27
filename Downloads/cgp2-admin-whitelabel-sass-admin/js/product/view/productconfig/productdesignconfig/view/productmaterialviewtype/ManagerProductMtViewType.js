Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.store.MTViewTypeObj',
    'CGP.product.view.productconfig.productbomconfig.model.ProductBomConfigModel',
    'CGP.product.view.productconfig.productdesignconfig.model.MaterialViewType',
    'CGP.common.valueExV3.ValueExComponentColumn'
]);
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.ManagerProductMtViewType', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    modal: true,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('productMaterialViewType');
        me.productMaterialViewTypeId = parseInt(JSGetQueryString('productMaterialViewTypeId'));
        me.productConfigDesignId = parseInt(JSGetQueryString('productConfigDesignId'));
        me.productBomConfigId = parseInt(JSGetQueryString('productBomConfigId'));
        me.productId = parseInt(JSGetQueryString('productId'));
        var grid = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.ManagePMVTGrid', {
            header: false,
            region: 'center',
            productId: me.productId,
            productMaterialViewTypeId: me.productMaterialViewTypeId,
            productConfigDesignId: me.productConfigDesignId,
            productBomConfigId: me.productBomConfigId
        });
        me.items = [grid];
        me.callParent(arguments);
    },
});
