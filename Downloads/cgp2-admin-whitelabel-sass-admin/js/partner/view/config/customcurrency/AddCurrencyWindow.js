Ext.define('CGP.partner.view.config.customcurrency.AddCurrencyWindow',{
    extend: 'Ext.window.Window',

    modal : true,
    layout: 'fit',
    initComponent: function(){
        var me= this;
        me.title = i18n.getKey('add')+i18n.getKey('currency');
        //me.controller = Ext.create('CGP.product.view.productconfig.productviewconfig.controller.Controller');
        me.listeners = {
            'close':function(){
                me.getComponent('allCurrency').collection.clear();
            }
        };
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('confirm'),
            iconCls: 'icon_agree',
            handler: function(){
                var selectRecords = me.getComponent('allCurrency').grid.getSelectionModel().getSelection();
                if(!Ext.isEmpty(selectRecords)){
                    me.addCurrency(selectRecords,me.grid,me);
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
        me.items = [Ext.create('CGP.partner.view.config.customcurrency.CurrencyList',{
            itemId: 'allCurrency',
            filterData: me.filterData
        })];
        me.callParent(arguments);
    },
    addCurrency: function (records, grid, win) {
        var me = this;
        var datas = [];
        Ext.each(records, function (item) {
            datas.push(item.data)
        });
        grid.getStore().add(datas);
        win.close();
    }
})