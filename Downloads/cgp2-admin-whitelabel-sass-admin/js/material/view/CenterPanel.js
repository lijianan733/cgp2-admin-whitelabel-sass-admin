Ext.define("CGP.material.view.CenterPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.centerpanel',
    componentInit: false,
    region: 'center',
    layout: 'fit',
    itemId: 'centerPanel',

    initComponent: function () {
        var me = this;
        me.title = ' ';
        var controller = Ext.create('CGP.material.controller.Controller');
        me.callParent(arguments);
    },
    refreshData: function (data, isLeaf, parentId, searchMaterialId) {
        var me = this;
        var type = data.get('type');
        var grid = Ext.create('CGP.material.view.information.views.MaterialGrid');
        //data.isLeaf = isLeaf;
        data.parentId = parentId;
        data.searchMaterialId= searchMaterialId;
        if (!me.componentInit) {
            me.add(grid);
            me.componentInit = true;
        }
        //me.setTitle(i18n.getKey('material') + ':' + data.name);
        me.items.items[0].refreshData(data);


    }
});