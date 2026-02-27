/**
 * StatusForm
 * @Author: miao
 * @Date: 2021/12/29
 */
Ext.define("CGP.returnorder.view.state.StateForm", {
    extend: "Ext.ux.form.ErrorStrickForm",
    alias: 'widget.returnorderedit',
    border: 0,
    padding: '10',
    fieldDefaults: {
        labelAlign: 'right',
        width: '100%',
        labelWidth: 120,
        msgTarget: 'side',
    },
    isValidForItems: true,
    initComponent: function () {
        var me = this;
        var entityId = JSGetQueryString('returnId'),isView=!Ext.isEmpty(JSGetQueryString('isView'));
        var controller = Ext.create('CGP.returnorder.controller.ReturnRequestOrder');
        // me.tbar = [
        //     {
        //         itemId: 'returnorderSave',
        //         text: i18n.getKey('save'),
        //         iconCls: 'icon_save',
        //     },
        // ]
        me.items = [
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                margin: '0 0 10 0',
                width: '100%',
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
                items: [
                    {
                        xtype: 'displayfield',
                        value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('returnOrder') + i18n.getKey('information') + '</font>',
                    }
                ],
                isValid: function () {
                    return true;
                }
            },
            // {
            //     xtype: 'textfield',
            //     itemId: 'clazz',
            //     name: 'clazz',
            //     fieldLabel: i18n.getKey('clazz'),
            //     hidden: true,
            //     value: 'com.qpp.cgp.domain.returnorder'
            // },
            {
                xtype:'returnform',
                itemId:'returnInfor',
                entityId:entityId,
                border:0
            },

            {
                xtype: 'toolbar',
                hidden: isView,
                border: '0 0 1 0',
                margin: 0,
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
                isValid: function () {
                    return true;
                },
                items: [
                    {
                        xtype: 'displayfield',
                        width: 100,
                        value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('operation') + '</font>',
                    }
                ]
            },
            {
                // fieldLabel: i18n.getKey('orderHistories'),
                itemId: 'action',
                xtype: 'fieldcontainer',
                hidden: isView,
                layout: {
                    type: 'table',
                    columns: 5
                },
                width: '100%',
                listeners:{
                    afterRender:function (comp){
                        if(entityId){
                            controller.setActions(entityId,comp);
                        }
                    }
                }
            },
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                margin: 0,
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
                isValid: function () {
                    return true;
                },
                items: [
                    {
                        xtype: 'displayfield',
                        width: 100,
                        value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('statusHistories') + '</font>',
                    }
                ]
            },
            {
                xtype: 'actionlog',
                itemId: 'actionLog',
                hideHeaders:true,
                minHeight:100,
                entityId: entityId
            },

            // {
            //     // fieldLabel: i18n.getKey('stateHistories'),
            //     itemId: 'stateHistories',
            //     xtype: 'displayfield',
            //     width: 700
            // }
        ];
        me.callParent(arguments);

    },
});