Ext.define('CGP.commonbuilderfont.view.AddFontWindow',{
    extend: 'Ext.window.Window',

    modal : true,
    layout: 'fit',
    initComponent: function(){
        var me= this;
        me.title = i18n.getKey('add')+i18n.getKey('font');
        me.controller = Ext.create('CGP.commonbuilderfont.controller.Controller');
        me.listeners = {
            'close':function(){
                me.getComponent('allFont').collection.clear();
            }
        };
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('confirm'),
            iconCls: 'icon_agree',
            handler: function(){
                var selectRecords = me.getComponent('allFont').grid.getSelectionModel().getSelection();
                var selectRecordIds = [];
                Ext.Array.each(selectRecords,function (item) {
                    selectRecordIds.push(item.getId());
                });
                if(!Ext.isEmpty(selectRecordIds)){
                    me.controller.addRecords(selectRecordIds,me.grid,me);
                }
            }
        },{
            xtype: 'button',
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function () {
                me.close();
            }
        }];
        me.items = [Ext.create('CGP.commonbuilderfont.view.FontList',{
            itemId: 'allFont'
        })];
        me.callParent(arguments);
    }
})