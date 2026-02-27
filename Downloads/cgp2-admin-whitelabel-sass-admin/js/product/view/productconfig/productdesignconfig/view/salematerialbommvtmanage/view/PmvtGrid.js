Ext.define('CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.view.PmvtGrid', {
    extend: 'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.ManagePMVTGrid',
    itemId: 'smvtGrid',
    initComponent: function () {
        var me = this;
        me.createHandler = function (btn) {
            var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.controller.Controller');
            controller.editPmvt(me.topTab, 'create', null, me.productBomConfigId, me.productConfigDesignId, me.grid.store, me.materialPath, me.schemaVersion);
        };
        me.editActionHandler = function (view, rowIndex, colIndex, a, b, record) {
            var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.controller.Controller');
            controller.editPmvt(me.topTab, 'edit', record.getId(), me.productBomConfigId, me.productConfigDesignId, me.grid.store, me.materialPath, me.schemaVersion);
        };
        me.deleteActionHandler = function (view, rowIndex, colIndex, a, b, record) {
            var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.controller.Controller');
            controller.deleteProductMaterialViewType(record.getId(), me.grid.store,);
        };
        me.callParent(arguments);

    },
});