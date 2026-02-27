Ext.define('CGP.order.view.ordertotal.Edit', {
    extend: 'Ext.window.Window',
    alias: 'widget.ordetotaledit',


    modal: true,
    layout: 'fit',
    bodyStyle: 'padding:10px',

    initComponent: function() {
        var me = this;

        me.title = i18n.getKey('modifyPrice');

        var form = {
            xtype: 'form',
            border: false,
            items: [{
                xtype: 'textfield',
                fieldLabel: i18n.getKey('title'),
                allowBlank: false,
                name: 'title'
            },{
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('money'),
                allowBlank: false,
                allowExponential:false,
                name: 'value'
            },{
                xtype: 'textarea',
                fieldLabel: i18n.getKey('reason'),
                allowBlank: false,
                name: 'reason'
            }]
        };


        me.items = [form];

        me.bbar = ['->',{
            xtype:'button',
            text: i18n.getKey('save'),
            iconCls: 'icon_save',
            handler: function() {
                if(me.form.isValid()) {
                    var data = {};
                    me.form.items.each(function(item){
                        data[item.name] =  item.getValue();
                    });
                    me.controller.modifyOrderTotal(me.orderId,data,me);
                }

            }
        }, {
            xtype: 'button',
            iconCls: 'icon_cancel',
            text: i18n.getKey('cancel'),
            handler: function() {
                me.close();
            }
        }];

        me.callParent(arguments);

        me.form = me.down('form');
    }


})