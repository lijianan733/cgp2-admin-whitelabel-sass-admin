/**
 * ProductManager
 * @Author: miao
 * @Date: 2022/2/21
 */
Ext.syncRequire(['CGP.product.view.procductManage.view.UserComponent']);
Ext.define("CGP.product.view.procductManage.view.ProductManager", {
    extend: "Ext.form.Panel",
    alias: 'widget.productmanager',

    productId: null,
    data: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.procductManage.controller.Controller');
        me.items = [
            {
                xtype: 'numberfield',
                itemId: 'id',
                name: '_id',
                fieldLabel: i18n.getKey('id'),
                hidden: true,
            },
            {
                xtype: 'numberfield',
                itemId: 'productId',
                name: 'productId',
                fieldLabel: i18n.getKey('productId'),
                hidden: true,
                value: me.productId
            },
            {
                xtype: 'textfield',
                itemId: 'clazz',
                name: 'clazz',
                fieldLabel: i18n.getKey('clazz'),
                hidden: true,
                value:'com.qpp.cgp.domain.product.admin.ProductAdministratorConfig'
            },
            // {
            //     name: 'productAdministratorInfos',
            //     itemId: 'productManager',
            //     xtype: 'diyemailsfieldcomponent',
            //     fieldLabel: i18n.getKey('productManager'),
            //     panelConfig: {
            //         width: 600,
            //         minHeight: 50,
            //         id: 'panel1',
            //         renderTo: 'panel1',
            //         itemId: 'panel1',
            //         allowBlank: false,
            //         dockedItems: [
            //             {
            //                 xtype: 'toolbar',
            //                 dock: 'right',
            //                 width: 80,
            //                 layout: {
            //                     type: 'vbox',
            //                     align: 'center'
            //                 },
            //                 items: [
            //                     {
            //                         xtype: 'button',
            //                         dock: 'right',
            //                         iconCls: 'icon_add',
            //                         width: 60,
            //                         margin: '5 0 0 5',
            //                         margin: '5 0 0 5',
            //                         text: i18n.getKey('add'),
            //                         handler: function (button) {
            //                             var controller = Ext.create('CGP.product.view.procductManage.controller.Controller');
            //                             controller.addProductManager(me);
            //                         }
            //                     }
            //                 ]
            //             }
            //         ],
            //     }
            // },
            {
                name: 'productAdministratorInfos',
                itemId: 'productManager',
                xtype: 'usercomp',
                fieldLabel: i18n.getKey('productManager'),
                panelConfig: {
                    width: 600,
                    minHeight: 50,
                    id: 'panel1',
                    renderTo: 'panel1',
                    itemId: 'panel1',
                    allowBlank: false
                }
            },
        ];
        me.callParent(arguments);
        me.on('afterrender', function (comp) {
            if(comp.data){
                comp.setValue(comp.data);
            }
        });
    },

    getValue: function () {
        var me = this;
        var data = me.data||{};
        var items = me.items.items;
        for (var item of items) {
            if (item.getDiyValue) {
                data[item.name] = item.getDiyValue();
            } else {
                data[item.name] = item.getValue();
            }
        }
        return data;
    },

    setValue:function (data){
        var me=this;
        if(Ext.isEmpty(data)&&Ext.Object.isEmpty(data)){
            return false;
        }
        me.data=data;
        var items = me.items.items;
        for (var item of items) {
            if(item.setDiyValue){
                item.setDiyValue(data[item.name]);
            }
            else{
                item.setValue(data[item.name])
            }
        }
    }
});