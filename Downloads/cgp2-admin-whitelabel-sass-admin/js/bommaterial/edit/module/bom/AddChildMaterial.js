Ext.define("CGP.bommaterial.edit.module.bom.AddChildMaterial",{
    extend: 'Ext.window.Window',
    modal: true,
    width: 700,
    height: 500,
    layout: 'fit',
    initComponent: function(){
        var me = this;
        var parentMaterialId = me.parentMaterialId || CGP.bommaterial.edit.controller.Controller.parentMaterialId;
        me.title = i18n.getKey('addChildMaterial');
        var form = Ext.create('CGP.bommaterial.edit.module.bom.ChildMaterialForm',{
            parentMaterialId: parentMaterialId,
            showWindow: me,
            tree: me.tree
        });
        me.items= [form];
        me.callParent(arguments);
        //me.toolbar.setVisible(false);
    }
})