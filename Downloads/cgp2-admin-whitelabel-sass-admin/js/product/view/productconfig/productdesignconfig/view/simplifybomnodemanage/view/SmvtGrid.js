Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.view.ManageSMVTGrid'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.view.SmvtGrid', {
    extend: 'CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.view.ManageSMVTGrid',
    initComponent: function () {
        var me = this;
        me.createHandler = function (btn) {
            var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.controller.Controller');
            controller.editSmvt(me.topTab, 'create', null, me.productBomConfigId, me.productConfigDesignId, me.sbomNodeId, me.sbomNode, me.simplifyBomConfigId, me.grid.store);
        };
        me.editActionHandler = function (view, rowIndex, colIndex, a, b, record) {
            var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.controller.Controller');
            var recordId = record.getId();
            controller.editSmvt(me.topTab, 'edit', recordId, me.productConfigDesignId, me.productBomConfigId, me.sbomNodeId, me.sbomNode, me.simplifyBomConfigId, me.grid.store);
        };
        me.deleteActionHandler = function (view, rowIndex, colIndex, a, b, record) {
            var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.controller.Controller');
            controller.deleteSMVT(record.getId(), me.grid.store, null, null);
        };
        me.callParent(arguments);
    }
});