Ext.define("CGP.rtoption.view.CenterPanel", {
    extend: "Ext.panel.Panel",
    alias: 'widget.centerpanel',
    componentInit: false,
    region: 'center',
    layout: 'fit',
    itemId: 'centerPanel',

    initComponent: function () {
        var me = this;
        me.title = ' ';
        var controller = Ext.create('CGP.rtoption.controller.Controller');
        me.callParent(arguments);
    },
    refreshData: function (data,seachId) {
        var me = this;

        var grid = Ext.create('CGP.rtoption.view.RtOptionGrid',{
            tagId:data.tagId
        });
        me.add(grid);
        me.items.items[0].refreshData(data,seachId);
    }
});