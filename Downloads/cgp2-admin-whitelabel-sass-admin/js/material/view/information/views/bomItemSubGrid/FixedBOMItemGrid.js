Ext.define("CGP.material.view.information.views.bomItemSubGrid.FixedBOMItemGrid", {
    extend: "CGP.material.view.information.views.bomItemSubGrid.BomItemSupGrid",
    constructor:function(config){
        var me = this;
        me.store=config.gridstore;
        me.setVisible(me.store.getCount());
        var controller = Ext.create('CGP.material.controller.Controller');
        me.callParent(arguments)
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
/*        me.content = me;
        window.controller = controller;*/


    }

})