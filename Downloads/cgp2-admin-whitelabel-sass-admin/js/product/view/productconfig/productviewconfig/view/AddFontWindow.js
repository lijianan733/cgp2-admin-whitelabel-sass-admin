Ext.define('CGP.product.view.productconfig.productviewconfig.view.AddFontWindow',{
    extend: 'Ext.window.Window',

    modal : true,
    layout: 'fit',
    initComponent: function(){
        var me= this;
        me.title = i18n.getKey('add')+i18n.getKey('font');
        me.controller = Ext.create('CGP.product.view.productconfig.productviewconfig.controller.Controller');
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
                if(!Ext.isEmpty(selectRecords)){
                    me.controller.addFonts(selectRecords,me.grid,me);
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
        me.items = [Ext.create('CGP.product.view.productconfig.productviewconfig.view.FontList',{
            itemId: 'allFont',
            filterData: me.filterData
        })];
        me.callParent(arguments);
    }
})