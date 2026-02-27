/**
 *详细页
 **/
Ext.Loader.syncRequire([
    'CGP.orderdetails.view.details.OutSendOrderItem',
    'CGP.order.view.order.OrderTotal'
])
Ext.define('CGP.orderdetails.view.Details', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.details',
    mixins: ['Ext.ux.util.ResourceInit'],


    layout: {
        type: 'vbox',
        align: 'left'
    },

    autoScroll: true,

    defaults: {
        width: '100%'
    },
    /*overflowX: 'hidden',
     overflowY: 'auto',*/

    /*bodyStyle: {
     padding: '10px'
     },*/
    bodyPadding: '0 10 20 10',
    /*bodyStyle :'overflow: hidden;',*/
    //padding: '0 10 0 10',
    initComponent: function () {

        var me = this;
        var orderId = JSGetQueryString('id');

        /*me.tbar = [{
         xtype: 'displayfield',
         fieldLabel: false,
         value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('linkman') + '</font>'
         },{
         xtype: 'button',
         text: i18n.getKey('edit'),
         action: 'edit'
         }];*/
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                style: 'background-color:white;',
                color: 'black',
                bodyStyle: 'border-color:white;',
                border: '0 0 0 0',
                items: [
                    {
                        margin: '0 0 0 12',
                        xtype: 'displayfield',
                        labelStyle: 'font-weight: bold',
                        labelWidth: 50,
                        fieldLabel: i18n.getKey('orderNo'),
                        name: 'orderNo',
                        itemId: 'orderNo',
                        fieldStyle: 'color:red;font-weight: bold'
                    },
                    {
                        margin: '0 0 0 12',
                        labelStyle: 'font-weight: bold',
                        fieldStyle: 'color:red;font-weight: bold',
                        labelWidth: 50,
                        fieldLabel: i18n.getKey('sourceOrderNo'),
                        name: 'sourceOrderNo',
                        itemId: 'sourceOrderNo',
                        hidden: true
                    },
                    {
                        margin: '0 0 0 12',
                        xtype: 'displayfield',
                        labelStyle: 'font-weight: bold',
                        labelWidth: 70,
                        fieldLabel: i18n.getKey('datePurchased'),
                        name: 'datePurchased',
                        itemId: 'datePurchased',
                        fieldStyle: 'color:red;font-weight: bold',
                        renderer: function (value) {
                            return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
                        }
                    },
                    {
                        margin: '0 0 0 12',
                        xtype: 'displayfield',
                        labelStyle: 'font-weight: bold',
                        labelWidth: 90,
                        fieldLabel: i18n.getKey('预计交收日期'),
                        name: 'estimatedDeliveryDate',
                        itemId: 'estimatedDeliveryDate',
                        fieldStyle: 'color:red;font-weight: bold',
                        renderer: function (value) {
                            if (value) {
                                this.show();
                                return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
                            } else {
                                this.hide();
                            }
                        },
                    },
                    {
                        margin: '0 0 0 12',
                        xtype: 'displayfield',
                        labelStyle: 'font-weight: bold',
                        labelWidth: 40,
                        itemId: 'status',
                        fieldLabel: i18n.getKey('status'),
                        fieldStyle: 'color:red;font-weight: bold'
                    },
                    {
                        margin: '0 0 0 12',
                        xtype: 'displayfield',
                        labelStyle: 'font-weight: bold',
                        labelWidth: 60,
                        itemId: 'supplier',
                        fieldLabel: i18n.getKey('supplier'),
                        value: i18n.getKey('undistributed'),
                        fieldStyle: 'color:red;font-weight: bold'
                    },
                    {
                        xtype: 'button',
                        margin: '0 0 0 10',
                        itemId: 'button',
                        iconCls: 'icon_edit',
                        text: i18n.getKey('modifyStatus'),
                        hidden: (JSGetQueryString('editable') === 'false'),
                        handler: function () {
                            JSOpen({
                                id: 'modifyOrderStatus',
                                url: path + 'partials/order/status.html?id=' + me.order.get('id'),
                                title: i18n.getKey('order') + ' ' + i18n.getKey('modifyStatus'),
                                refresh: true
                            })
                        }
                    },
                    {
                        xtype: 'button',
                        margin: '0 0 0 10',
                        text: i18n.getKey('refresh'),
                        itemId: 'refresh',
                        iconCls: 'icon_reset',
                        handler: function (button) {
                            var grid = button.ownerCt.ownerCt,
                                statusId = grid.order.get('status').id,
                                orderNumber = grid.order.get('orderNumber');
                            
                            JSOpen({
                                id: 'orderDetails',
                                url: path + 'partials/orderitemsmultipleaddress/main.html' +
                                    '?id=' + me.order.get('id') +
                                    '&status=' + statusId +
                                    '&orderNumber=' + orderNumber +
                                    '&website=' + me.order.get('website').code +
                                    '&editable=' + JSGetQueryString('editable'),
                                title: i18n.getKey('orderDetails'),
                                refresh: true
                            })
                        }
                    }
                ]

            }
        ];
        var commentPanel = Ext.create('CGP.orderdetails.view.details.Comment', {
            colspan: 2,
            border: 5,
            style: {
                borderColor: 'red',
                borderStyle: 'solid',
                fontSize: '20px'
            }
        });
        if (me.status == 1) {
            me.items = [
                commentPanel,
                {//订单总览
                    xtype: 'detailsorder'
                },
                {//收件人信息
                    xtype: 'detailsdelivery',
                    height: 220
                },

                {//联系人
                    xtype: 'detailscontact'
                },
                {//付费方式
                    xtype: 'detailspayment'
                },
                {//配送方式
                    xtype: 'detailsshipping'
                },
                {//发票信息
                    xtype: 'detailsinvoice',
                    hidden: true
                },

                {//订单项信息
                    xtype: 'detailsorderlineitem',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    maxHeight: 500
                },
                {//订单总数
                    xtype: 'ordertotal',
                    orderId: orderId,
                    header: false,
                    viewConfig: {
                        style: {
                            'display': 'flex',
                            'flex-direction': 'row-reverse'
                        }
                    },
                },
                {//订单状态历史信息
                    xtype: 'detailsstatus'
                },
                //外派订单项信息

            ];
        } else {
            if (me.status == 2) {
                me.defaults.width = 1300;
                me.layout = {
                    type: 'vbox',
                    align: 'center'
                };
                me.items = [
                    commentPanel,
                    {
                        xtype: 'detailsorder'
                    },
                    {
                        xtype: 'detailsshipping',
                        editable: false

                    },
                    {
                        xtype: 'detailsdelivery',
                        editable: false
                    },
                    {
                        xtype: 'detailseditlineitems',
                        listeners: {
                            afterrender: function () {
                                var grid = this;
                                var store = this.getStore();
                                store.on('load', function () {
                                    grid.getSelectionModel().selectAll();
                                })
                            }
                        }
                    },
                    {
                        xtype: 'detailsstatus'
                    }
                ];
            }
        }

        me.callParent(arguments);


    },
    setValue: function (order) {
        var me = this;
        me.order = order;
        me.showReplenishmentOrder(order);
        me.items.each(function (item) {
            if (item.setValue) {
                item.setValue(order);
            }
        });
        var toolbar = me.down('toolbar');
        var status = order.get("status");
        var statusName = i18n.getKey(status.name);
        var statusId = status.id;
        var isRedo = order.get('isRedo');
        if (Ext.Array.contains([103, 104, 105, 106, 107], statusId)) {
            if (isRedo == true) {
                if (statusId == 103) {
                    statusName = i18n.getKey('redo-confirmed(waitting print)');
                } else {
                    statusName = i18n.getKey('redo') + '-' + i18n.getKey(status.name);
                }
            }
        }
        toolbar.items.each(function (item) {
            if (item.xtype != 'button') {
                if (order.get('orderType') !== 'RM') {
                    toolbar.getComponent('orderNo').setValue(order.get("orderNumber"));
                    toolbar.getComponent('datePurchased').setValue(order.get("datePurchased"));
                    toolbar.getComponent('status').setValue(statusName);
                    toolbar.getComponent('estimatedDeliveryDate').setValue(order.get("estimatedDeliveryDate"));
                } else {
                    toolbar.getComponent('orderNo').setValue(order.get("orderNumber"));
                    toolbar.getComponent('orderNo').setFieldLabel(i18n.getKey('replenishmentNo'));
                    toolbar.getComponent('sourceOrderNo').setValue(order.get("sourceOrderNumber"));
                    toolbar.getComponent('sourceOrderNo').setFieldLabel(i18n.getKey('orderNo'));
                    toolbar.getComponent('sourceOrderNo').setVisible(true);
                    toolbar.getComponent('datePurchased').setValue(order.get("datePurchased"));
                    toolbar.getComponent('status').setValue(statusName);

                }
            }
        })
        toolbar.getComponent('button').setDisabled(order.get('hasProducer') == true);
        /*
                toolbar.getComponent('refresh').setDisabled(order.get('hasProducer') == true);
        */
        if (order.get('hasProducer') == true) {
            toolbar.getComponent('supplier').setValue(order.get('producePartner').name);
        }

    },


    showReplenishmentOrder: function (order) {
        if (order.get('orderType') != 'RM')
            return;
        var me = this;

        me.setTitle(i18n.getKey('replenishmentOrder'));
        me.items.each(function (item) {
            if (!Ext.Array.contains(['detailsorder', 'detailspayment', 'ordertotal'], item.xtype)) {
                item.setVisible(false);
            }
        });
    }
});