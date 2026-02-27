Ext.define('CGP.order.view.order.OrderRedo', {
    extend: 'Ext.window.Window',
    width: 420,
    modal: true,
    title: i18n.getKey('orderRedo'),
    bodyPadding: '20px',
    height: 250,
    layout: 'fit',
    autoShow: true,

    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.order.controller.Order');
        me.items = [
            {
                xtype: 'form',
                border: false,
                header: false,
                items: [
                    {
                        fieldLabel: i18n.getKey('printAgain'),
                        xtype: 'checkboxfield',
                        name: 'needReComposing',
                        labelWidth: 60,
                        inputValue: true,
                        itemId: 'needReComposing'
                    },
                    {
                        fieldLabel: i18n.getKey('comment'),
                        name: 'comment',
                        labelWidth: 60,
                        width: 350,
                        height: 100,
                        xtype: 'textarea',
                        itemId: 'comment'
                    }
                ]
            }
        ];

        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('confirmModify'),
            iconCls: 'icon_agree',
            handler: function () {
                var data = me.form.getValues();
                controller.orderRedo(me.order.getId(),data,me,me.page);
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function () {
                this.ownerCt.ownerCt.close();
            }
        }];
        me.callParent(arguments);
        me.form = me.down('form');
    }
});