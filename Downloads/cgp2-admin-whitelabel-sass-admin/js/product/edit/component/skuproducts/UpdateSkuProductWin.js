Ext.define("CGP.product.edit.component.skuproducts.UpdateSkuProductWin",{
    extend: "Ext.window.Window",

    layout: 'fit',
    modal: true,
    bodyStyle: 'padding:10px',
    initComponent: function(){
        var  me = this;
        me.title = i18n.getKey('modifySkuProduct');

        me.items= [
            {
                xtype: 'form',
                border: false,
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'id',
                        itemId: 'id',
                        hidden: true
                    },
                    {
                        fieldLabel: i18n.getKey('sku'),
                        xtype: 'textfield',
                        name: 'sku',
                        itemId: 'sku',
                        allowBlack: false
                    },
                    {
                        fieldLabel: i18n.getKey('weight') + '(g)',
                        xtype: 'numberfield',
                        name: 'weight',
                        itemId: 'weight',
                        allowBlack: false,
                        minValue: 0.1,
                        allowExponential: false
                    },
                    {
                        fieldLabel: i18n.getKey('salePrice'),
                        xtype: 'numberfield',
                        name: 'salePrice',
                        itemId: 'salePrice',
                        allowBlack: false,
                        minValue: 0.1,
                        allowExponential: false
                    }
                ]
            }
        ];
        me.bbar= [
            {
                xtype: 'button',
                text: i18n.getKey('ok'),
                handler: function () {
                    var confirmUpdate = me.confirmUpdate;
                    confirmUpdate(me);
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function () {
                    window.close();
                }
            }
        ];
        me.callParent(arguments);
    }
})