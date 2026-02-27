/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.Loader.setPath({
    enabled: true,
    "CGP.orderdetails": path + "partials/order/details/app"
});
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.ShipmentInfoItem',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.splitBarTitle',
])
//审核信息
Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.auditOrderItem.createAuditOrderItemComp', {
    extend: 'Ext.form.Panel',
    alias: 'widget.audit_order_item',
    bodyStyle: 'border-top:0;border-color:white;',
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
    },
    margin: '5 0 50 0',
    isValid: function () {
        var me = this,
            container = me.getComponent('container'),
            isValid = container.isValid();

        if (!isValid) {
            JSShowNotification({
                type: 'info',
                title: '请完善审核信息!',
            });
        }

        return container.isValid();
    },
    diyGetValue: function () {
        var me = this,
            container = me.getComponent('container'),
            getValue = container.diyGetValue();

        return getValue;
    },
    initComponent: function () {
        const me = this,
            {orderId, isSanction} = me,
            controller = Ext.create('CGP.orderstatusmodify.view.orderitemsmultipleaddress.controller.Controller');

        me.items = [
            {
                xtype: 'splitBarTitle',
                title: '审核信息'
            },
            {
                xtype: 'container',
                width: '100%',
                margin: '5 0 5 20',
                layout: 'vbox',
                defaultType: 'displayfield',
                itemId: 'container',
                isValid: function () {
                    var me = this,
                        items = me.items.items,
                        result = []

                    items.forEach(item => {
                        result.push(item.isValid());
                    })

                    return result.every(Boolean); //全是true时返回true
                },
                diyGetValue: function () {
                    var me = this,
                        items = me.items.items,
                        result = {};

                    items.forEach(item => {
                        var {isFilterItem, name} = item;
                        if (!isFilterItem) {
                            result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                        }
                    })

                    return result;
                },
                defaults: {
                    width: '50%',
                    margin: '5 0 5 20',
                },
                items: [
                    {
                        xtype: 'checkbox',
                        name: 'statusAudit',
                        itemId: 'statusAudit',
                        width: 700,
                        allowBlank: false,
                        readOnly: false,
                        boxLabel: i18n.getKey('审核通过'),
                        fieldLabel: i18n.getKey('审核状态'),
                        isValid: function () {
                            var me = this;
                            var value = me.getValue();
                            return value
                        },
                        getErrors: function () {
                            var me = this;
                            return '请勾选审核状态'
                        }
                    },
                    {
                        xtype: 'checkbox',
                        name: 'auditConfirm',
                        itemId: 'auditConfirm',
                        width: 700,
                        allowBlank: false,
                        readOnly: false,
                        boxLabel: '<font color="red">已完成对订单项信息,订单项图片以及订单项设计文档的检查</font>',
                        fieldLabel: i18n.getKey('审核确认'),
                        isValid: function () {
                            var me = this;
                            var value = me.getValue();
                            return value
                        },
                        getErrors: function () {
                            var me = this;
                            return '请勾选审核确认'
                        }
                    },
                    {
                        xtype: 'checkbox',
                        name: 'manufactureCenter',
                        itemId: 'manufactureCenter',
                        width: 700,
                        allowBlank: false,
                        readOnly: false,
                        boxLabel: JSCreateFont('red', false, '已完成对订单项生产基地信息确认'),
                        fieldLabel: i18n.getKey('生产基地确认'),
                        isValid: function () {
                            var me = this;
                            var value = me.getValue();
                            return value
                        },
                        getErrors: function () {
                            var me = this;
                            return '请勾选审核确认'
                        }
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('审核备注'),
                        name: 'comment',
                        itemId: 'comment',
                        height: 60,
                        width: 450,
                    },
                    {
                        xtype: 'sanction',
                        name: 'sanction',
                        itemId: 'sanction',
                        isFilterItem: true,
                        fieldLabel: i18n.getKey('制裁'),
                        height: 100,
                        hidden: !isSanction,
                        isValid: function () {
                            return true;
                        },
                        width: 700,
                    },
                ]
            },
        ];
        me.callParent();
    },
})