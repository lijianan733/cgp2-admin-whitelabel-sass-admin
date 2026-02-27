Ext.define('CGP.bommaterial.view.SelectMaterialCopyWin',{
    extend: 'Ext.window.Window',
    modal: true,
    width: 850,
    height: 500,
    layout: 'fit',
    initComponent: function(){
        var me =this;
        me.title = i18n.getKey('selectMaterial');
        me.items = [Ext.create('CGP.bommaterial.view.MaterialGrid')];
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('confirm'),
            handler: function(){
                var record = me.grid.getSelectionModel().getSelection()[0];
                me.controller.copyBomMaterial(record.data);
                me.close();
            }
        },{
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function(){
                me.close();
            }
        }];
        me.callParent(arguments);
        me.grid = me.down('grid');
    }
})