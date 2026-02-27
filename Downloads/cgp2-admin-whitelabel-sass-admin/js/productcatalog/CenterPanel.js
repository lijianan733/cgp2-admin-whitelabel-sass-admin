Ext.define("CGP.productcatalog.CenterPanel", {
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

    refreshData: function (data, isLeaf, parentId, searchProductId) {
        var me = this;
        var type = data['type'];
        //data.isLeaf = isLeaf;
        data.parentId = parentId;
        data.searchProductId= searchProductId;

        if (!me.componentInit) {
            var grid = Ext.create('CGP.productcatalog.view.ProductList',{
                data:data
            });
            me.add(grid);
            me.componentInit = true;
        }
        me.items.items[0].refreshData(data);
    }
});
