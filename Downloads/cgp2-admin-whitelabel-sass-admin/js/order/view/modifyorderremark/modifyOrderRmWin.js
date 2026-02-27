Ext.define('CGP.order.view.modifyorderremark.modifyOrderRmWin',{
    extend: 'Ext.window.Window',
    modal: true,

    width: 450,
    height: 350,
    initComponent: function(){
        var me = this;

        me.title = i18n.getKey('modifyOrderRemark');
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('modify'),
            iconCls: 'icon_edit',
            handler: function(){
                if(me.form.isValid()){
                    var data = {};
                    me.form.items.each(function(item){
                        data[item.name] =  item.getValue();
                    });
                    data['orderId'] = me.orderId;
                    data['statusId'] = me.statusId;
                    me.controller.confirmModifyOrderRemark(data,me);
                }
            }
        },{
            xtype: 'button',
            iconCls: 'icon_cancel',
            text: i18n.getKey('cancel'),
            handler: function(){
                me.close();
            }
        }];
        var form = {
            xtype: 'form',
            border: false,
            padding: 10,
            items: [{
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('orderNumber'),
                name: 'orderNumber',
                value: me.orderNumber,
                itemId: 'orderNumber'
            },{
                xtype: 'textarea',
                fieldLabel: i18n.getKey('orderRemark'),
                value: me.remark,
                width: 400,
                height: 200,
                name: 'orderRemark',
                itemId: 'orderRemark'
            }]
        };
        me.items = [form];
        me.callParent(arguments);
        me.form = me.down('form');
    }
})