Ext.define('CGP.product.view.pricerule.ListWindow', {
    extend: 'Ext.window.Window',


    layout: 'fit',
    width: 600,
    height: 400,

    bodyStyle: 'padding:10px',
    modal: true,

    initComponent: function() {
         var me = this,
            store = this.store;
        /*if(!Ext.isEmpty(me.productId)){
            store = Ext.create('CGP.product.store.PriceRule', {
                productId: me.productId
            })
        }*/
        me.title = i18n.getKey('priceRule');

        me.items = [Ext.create('CGP.product.view.pricerule.List', {
            store: store,
            itemId: 'grid',
            hiddenAction: me.hiddenAction

        })];
        var isHaveProductId = Ext.isEmpty(me.productId);
        me.tbar = {
            hidden: me.hiddenCreateBtn,
            items: [{
                xtype: 'button',
                text: i18n.getKey('create'),
                handler: function() {
                    Ext.create('CGP.product.view.pricerule.EditWindow', {
                        record: Ext.create('CGP.product.model.PriceRule')
                    }).show();
                }
            },{
                xtype: 'button',
                text: i18n.getKey('copyPriceRule'),
                hidden: isHaveProductId,
                handler: function(){
                    Ext.create('CGP.product.view.pricerule.copyPriceRuleWin',{
                        productId: me.productId,
                        priceRuleStore: store
                    })
                }
            }]
        }

        me.callParent(arguments);
        me.grid = me.getComponent('grid');
    },

    getValue: function() {
        return me.grid.getValue();
    }

});