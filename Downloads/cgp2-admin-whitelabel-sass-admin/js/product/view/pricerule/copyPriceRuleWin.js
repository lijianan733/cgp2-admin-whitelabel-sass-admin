Ext.define('CGP.product.view.pricerule.copyPriceRuleWin',{
    extend: 'Ext.window.Window',

    modal : true,
    layout: 'fit',
    autoShow: true,
    initComponent: function(){
        var me = this;

        var controller = Ext.create('CGP.product.controller.Controller');
        me.title = i18n.getKey('product');

            me.items = [Ext.create('CGP.common.productgrid.ProductGrid',{
                    hiddenCreateBtn: true,
                    hiddenAction: true

                }
            )];

        me.bbar =  [
            '->',{
                xtype : 'button',
                text : i18n.getKey('copyPriceRule'),
                handler : function() {
                    var recordId = me.grid.getSelectionModel().getSelection()[0].get('id');
                    controller.copyProductPriceRule(recordId,me.productId,me)
                }
            },{
                xtype : 'button',
                text : i18n.getKey('cancel'),
                handler : function(btn){
                    me.close();
                }
            }
        ];

        me.callParent(arguments);
        me.grid = me.down('grid');
    }
})