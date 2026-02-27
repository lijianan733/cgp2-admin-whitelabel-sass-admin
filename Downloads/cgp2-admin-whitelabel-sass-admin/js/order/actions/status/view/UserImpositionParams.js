Ext.define('Order.status.view.UserImpositionParams', {
    extend: 'Ext.window.Window',
    requires: ['Order.status.view.DiyFieldSet'],
    layout: 'fit',
    modal: true,
    data: null,
    orderId: '',
    initComponent: function () {
        var me = this;
        var controller=Ext.create('Order.status.controller.Status');
        me.items = [];
        me.bbar = [
            '->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                handler: function (btn) {
                    controller.saveUserParams(btn);
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function () {
                    this.ownerCt.ownerCt.close();
                }
            }
        ]
        me.callParent(arguments);
        if (me.orderId) {
            // controller.getUserParams(me);
            me.reflashData();
        }
    },
    isValid:function (){
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if(!item.isValid()){
                return false;
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = [];
        if (me.rendered == false) {
            result = me.data;
        } else {
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                var orderItemParams = item.getValue();
                if (orderItemParams) {
                    result.push(orderItemParams);
                }
            }
        }
        return result;
    },
    reflashData:function (){
        var me=this;
        var userParamsStore=Ext.data.StoreManager.lookup('userParamsStore'),i=0;
        userParamsStore.each(function (recd){
            var orderItemParams = recd.data;
            if(orderItemParams.userParams){
                var paramsValueSet = me.addItemParams(orderItemParams);
                if (i == 0) {
                    Ext.Function.defer(function(){paramsValueSet.expand()}, 500);//避免组件未渲染调用展开事件
                }
                i++;
            }
        })
    },
    setValue: function (data) {
        var me = this;
        if (Ext.isEmpty(data)) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var orderItemParams = data[i];
            if(orderItemParams.userParams){
                var paramsValueSet = me.addItemParams(orderItemParams);
                if (i == 0) {
                    paramsValueSet.expand();
                }
            }
        }
    },
    addItemParams: function (data) {
        var me = this;
        var paramsFieldSet = me.add(Ext.create('Order.status.view.DiyFieldSet', {
                hadHelpCmp: true,
                title: i18n.getKey('orderlineitem') + '<' + data.orderItemId + '>',
                allowBlank: false,
                minHeight: 150,
                maxHeight: 600,
                width: 800,
                data: data,
                collapsed: true,//初始时收缩状态
                innerComps: [
                    {
                        xtype: 'treefield',
                        // fieldLabel: i18n.getKey('userParams'),
                        name: 'userImpositionParams',
                        itemId: 'userImpositionParams',
                        isSetValue: true
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'orderItemId',
                        itemId: 'orderItemId'
                    }
                ]
            })
        );
        return paramsFieldSet;
    },
})