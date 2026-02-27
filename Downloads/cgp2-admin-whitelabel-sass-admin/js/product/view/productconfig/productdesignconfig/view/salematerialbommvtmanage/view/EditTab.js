Ext.Loader.syncRequire([]);
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.view.EditTab", {
    extend: "Ext.tab.Panel",
    alias: 'widget.simplifybompage',
    componentInit: false,
    region: 'center',
    itemId: 'infoTab',
    layout: 'fit',
    header: false,
    bomTreeRecord: null,//记录在bomTreePanel中选择的节点
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey("smvt");
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.controller.Controller');
        me.callParent(arguments);
    },
    refreshData: function (data) {
        var me = this;
        var type = data.type;
        me.data = data;
        if (!me.componentInit)
            me.addItem(data);
        var editPmvt = me.getComponent('editPmvt');
        me.remove(editPmvt);
        //me.setTitle(i18n.getKey('sell') + i18n.getKey('material') + ':' + data.name);
        Ext.Array.each(me.items.items, function (item) {
            item.refreshData(data);
        });
        me.setActive(me.items.items[0]);

    },
    addItem: function (data) {
        var me = this;
        /*var saveButton = me.child("toolbar").getComponent("btnSave");
        saveButton.setDisabled(false);*/

        var smvtGrid = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.view.PmvtGrid', {
            data: data,
            topTab: me,
            productConfigDesignId: me.productConfigDesignId,
            productBomConfigId: me.productBomConfigId,
            simplifyBomConfigId: me.simplifyBomConfigId,
            materialId: me.materialId,
            builderConfigTab: me.builderConfigTab
        });
        /*var spuRtType = Ext.create('CGP.material.view.information.RtTypeDetail', {
         itemId: 'spuRtType'
         });*/
        me.add([smvtGrid]);

        me.componentInit = true;
    }
});
