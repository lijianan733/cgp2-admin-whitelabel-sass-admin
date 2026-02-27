/**
 * @Description:
 * @author nan
 * @date 2022/1/12
 */
Ext.Loader.setPath('CGP.orderdetails', path + 'partials/order/details/app');
Ext.Loader.setPath('Order.status', path + 'js/order/actions/status');
Ext.Loader.syncRequire([
    'CGP.orderdetails.view.details.OrderLineItem',
    'CGP.orderdetails.view.details.OrderTotal',
    'CGP.orderstatusmodify.config.Config',
    'Order.status.view.shipment.ShipmentBox',
    'Order.status.view.shipment.ShipmentInfo',
    'CGP.orderstatus.store.OrderStatusStore',
    'CGP.orderstatusmodify.view.PackageGridField',
    'CGP.orderstatus.model.OrderStatusModel',
    'CGP.common.typesettingschedule.TypeSettingBtn',
    'Order.status.view.outsendorderitem.OutSendOrderItemGridField',
    'CGP.order.view.order.OrderTotal',
    'CGP.orderstatusmodify.view.Sanction',
    'CGP.orderstatusmodify.view.DeliverItem',
    'CGP.order.view.transactionvoucher.TransactionVoucherForm',
    'CGP.orderitemsmultipleaddress.view.PayInfo',
])
Ext.define('CGP.orderstatusmodify.view.EditForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.editform',
    isValidForItems: true,
    defaults: {
        xtype: 'textfield',
        margin: '5 25 5 25',
        width: 350,
        readOnly: true,
    },
    items: [],
    autoScroll: true,
    bbar: {
        xtype: 'toolbar',
        layout: {
            type: 'hbox',
        },
    },
    isValid: function () {
        this.msgPanel.hide();
        var isValid = true,
            errors = {};
        this.items.items.forEach(function (f) {
            if (f.isValid && !f.isValid()) {
                var errorInfo = f.getErrors();
                if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                    errors = Ext.Object.merge(errors, errorInfo);
                } else {
                    errors[f.getFieldLabel()] = errorInfo;
                }
                isValid = false;

            }
        });
        isValid ? null : this.showErrors(errors);
        return isValid;
    },
    initComponent: function () {
        var me = this;
        me.callParent();
        me.on('afterrender', function () {
            var me = this;
            var controller = Ext.create('CGP.orderstatusmodify.controller.Controller');
            controller.loadOrderData(JSGetQueryString('id'), me);
        })
    },
    refreshData: function (record) {
        var me = this;
        me.setLoading(true);
        me.removeAll();
        me.record = record;
        var statusId = record.get('status').id;

        console.log(record);
        //根据订单状态生成对于的表单
        var items = me.builderItems(statusId, record);
        //不同状态的按钮控制
        me.toolbarControl(statusId, record);
        //一些特殊的订单状态或者情况需要对工具栏进行特殊处理
        me.toolbarSpecialControl(statusId, record);
        me.suspendLayouts();
        //某些状态的表单特殊处理
        me.statusSpecialControl(statusId, items, record);
        me.add(items);
        me.resumeLayouts();
        me.doLayout();
        setTimeout(function () {
            me.setValue(record.getData());
            //特殊处理判断是否需要显示装箱和快递信息
            var shipmentInfo = me.getComponent('shipmentInfo');
            var shipmentBoxes = me.getComponent('shipmentBoxes');
            if (me.record.get('needPackingQty') === 0) {
                shipmentInfo?.setVisible(true);
                shipmentBoxes?.setVisible(true);
            }
            me.setLoading(false);
        }, 500)
    },
    /**
     *初步构建items
     */
    builderItems: function (statusId, record) {
        var me = this,
            id = JSGetQueryString('id'),
            userName = record.get('deliveryName'),
            suspectedSanction = record.get('suspectedSanction'),
            isMultiAddressDelivery = record.get('isMultiAddressDelivery'),
            remark = record.get('remark'),
            status = record.get('status'),
            orderId = record.get('_id'),
            orderStatusId = record.get('status').id,
            isOutboundOrder = record.get('isOutboundOrder'),
            orderDeliveryMethod = record.get('orderDeliveryMethod'),
            orderLineItemStore = Ext.create('CGP.orderlineitemv2.store.OrderLineItemByOrderStore', {
                orderId: id,
                params: {}
            });

        var getPayInfoCmp = function () {
            var offlinePaymentStatus = record.get('offlinePaymentStatus')
            if (offlinePaymentStatus && offlinePaymentStatus.code == 'WAITING_CONFIRM_STATUS') {//待审核状态
                //isSuccessPay为true的订单才显示
                return {
                    xtype: 'pay_info',
                    itemId: 'transaction_voucher_form',
                    name: 'transaction_voucher_form',
                    margin: 0,
                    width: '100%',
                    getName: function () {

                    },
                    listeners: {
                        afterrender: function () {
                            var me = this;
                            me.diySetValue(record.raw);
                        }
                    }
                }
            } else {
                //100 待付款 且 paymentModuleCode = BankTransfer
                return {
                    xtype: 'transaction_voucher_form',
                    itemId: 'transaction_voucher_form',
                    name: 'transaction_voucher_form',
                    width: '100%',
                    header: {
                        style: 'background-color:white;',
                        color: 'black',
                        title: '<font color=green>' + i18n.getKey('订单付款信息') + '</font>',
                        border: '0 0 0 0'
                    },
                    labelAlign: 'left',
                    border: false,
                    currency: record.get('currency'),//货币信息
                    totalPriceString: record.get('totalPriceString'),//需付款金额
                    orderId: orderId,//订单号
                    order: record,
                    isConfirmed: true,
                    paymentModuleCode: record.get('paymentModuleCode'),
                    defaults: {
                        width: 450,
                        allowBlank: true,
                    },
                };
            }

        };

        var components = [
            {//订单项信息
                xtype: 'detailsorderlineitem',
                width: '100%',
                maxHeight: 500,
                itemId: 'orderLineInfo',
                diySetValue: Ext.emptyFn,
                diyGetValue: Ext.emptyFn,
                getName: Ext.emptyFn,
                dockedItems: [],
                order: record,
                remark: remark,
                orderId: orderId,
                store: orderLineItemStore,
                orderStatusId: orderStatusId,
                pageType: 'orderStatusModify',
                margin: '10 25 0 25',
                getGrid: function () {
                    var me = this;
                    return me.grid;
                },
                getFieldLabel: function () {
                    var me = this;
                    return '订单项列表'
                },
                getDeliverItemGrid: function (me) {
                    var form = me.ownerCt,
                        deliverItem = form.getComponent('deliverItem'),
                        grid = deliverItem.getComponent('grid');

                    return grid.grid;
                },
            },
            {//订单总数
                xtype: 'ordertotal',
                width: '100%',
                order: record,
                margin: '0 25',
                itemId: 'orderTotal',
                border: false,
                header: false,
                viewConfig: {
                    style: {
                        'display': 'flex',
                        'flex-direction': 'row-reverse'
                    }
                },
                getName: function () {
                    return 'orderNumber'
                },
                diySetValue: function () {

                },
                diyGetValue: function () {
                    return null;
                }
            },
            {
                fieldLabel: i18n.getKey('orderNumber'),
                name: 'orderNumber',
                itemId: 'orderNumber',
                diyGetValue: Ext.emptyFn,
            },
            {
                fieldLabel: i18n.getKey('customerEmail'),
                name: 'userName',
                itemId: 'userName',
                diyGetValue: Ext.emptyFn,

            },
            {
                fieldLabel: i18n.getKey('datePurchased'),
                name: 'datePurchased',
                itemId: 'datePurchased',
                diyGetValue: Ext.emptyFn,
                diySetValue: function (value) {
                    this.setValue(Ext.Date.format(value, 'Y-m-d H:i:s'));
                }
            },
            {
                fieldLabel: i18n.getKey('预计交收日期'),
                name: 'estimatedDeliveryDate',
                itemId: 'estimatedDeliveryDate',
                diyGetValue: Ext.emptyFn,
                diySetValue: function (value) {
                    if (value) {
                        this.show();
                        this.setValue(Ext.Date.format(value, 'Y-m-d H:i:s'));
                    } else {
                        this.hide();
                    }
                }
            },
            {
                fieldLabel: i18n.getKey('shippingMethod'),
                name: 'shippingMethod',
                itemId: 'shippingMethod',
                diyGetValue: Ext.emptyFn,
            },
            {
                fieldLabel: i18n.getKey('deliveryNo'),
                hidden: true,
                itemId: 'deliveryNo',
                name: 'deliveryNo',
                diyGetValue: Ext.emptyFn,
            },
            {
                fieldLabel: i18n.getKey('orderStatus'),
                name: 'status',
                itemId: 'status',
                diyGetValue: Ext.emptyFn,
                diySetValue: function (status) {
                    var me = this;
                    var form = me.ownerCt;
                    var isRedo = form.record.get('isRedo');
                    var statusId = status.id;
                    var statusName = i18n.getKey(status.name);
                    if (Ext.Array.contains([103, 104, 105, 106, 107], statusId)) {
                        if (isRedo == true) {
                            if (statusId == 103) {
                                statusName = i18n.getKey('redo-confirmed(waitting print)');
                            } else {
                                statusName = i18n.getKey('redo') + '-' + i18n.getKey(status.name);
                            }
                        }
                    }
                    me.setValue(statusName);
                }
            },
            {
                xtype: 'datetimefield',
                name: 'signDate',
                itemId: 'signDate',
                format: 'Y-m-d H:i:s',
                fieldLabel: i18n.getKey('signDate'),
                editable: false,
                hidden: true,
                diySetValue: function (data) {
                    var me = this;
                    me.setValue(data ? new Date(data) : null);
                },
                diyGetValue: function () {
                    var me = this;
                    var data = me.getValue();
                    return new Date(data).getTime();
                }
            },
            {
                xtype: 'combobox',
                fieldLabel: i18n.getKey('signRemark'),
                name: 'signRemark',
                itemId: 'signRemark',
                editable: false,
                hidden: true,
                store: {
                    fields: ['name', 'value'],
                    data: [
                        {
                            name: '本人签收',
                            value: '本人签收'
                        },
                        {
                            name: '他人代收',
                            value: '他人代收'
                        },
                    ]
                },
                displayField: 'name',
                valueField: 'value',
            },
            {
                xtype: 'textarea',
                fieldLabel: i18n.getKey('deliveryAddress'),
                name: 'deliveryAddress',
                itemId: 'deliveryAddress',
                height: 80,
                width: 700,
                hidden: true,
                diyGetValue: Ext.emptyFn,
            },
            {
                xtype: 'deliverItem',
                name: 'deliverItem',
                itemId: 'deliverItem',
                fieldLabel: i18n.getKey('发货项'),
                width: '100%',
                orderId: id,
                remark: remark,
                statusId: status?.id,
                userName: userName,
                pageType: 'orderStatusModify',
                hiddenSanction: !suspectedSanction,
                orderDeliveryMethod: orderDeliveryMethod,
                isMultiAddressDelivery: isMultiAddressDelivery
            },
            {
                xtype: 'radiogroup',
                name: 'statusAudit',
                itemId: 'statusAudit',
                fieldLabel: i18n.getKey('audit') + i18n.getKey('status'),
                columns: 1,
                allowBlank: false,
                vertical: true,
                items: [
                    {
                        boxLabel: i18n.getKey('audit') + i18n.getKey('approve'),
                        name: 'statusAudit',
                        inputValue: true,
                        checked: true,
                    },
                    {
                        boxLabel: i18n.getKey('audit') + i18n.getKey('disapprove'),
                        name: 'statusAudit',
                        inputValue: false
                    }
                ],
                listeners: {
                    change: function (radio, newValue, oldValue) {
                        var reviewCategory = radio.ownerCt.getComponent('reviewCategory');
                        var reviewAdvise = radio.ownerCt.getComponent('reviewAdvise');
                        var shippedDate = radio.ownerCt.getComponent('shippedDate');
                        reviewCategory.setVisible(!newValue.statusAudit);
                        reviewCategory.setDisabled(newValue.statusAudit);
                        reviewAdvise.setVisible(!newValue.statusAudit);
                        reviewAdvise.setDisabled(newValue.statusAudit);
                        shippedDate.setVisible(newValue.statusAudit);
                        shippedDate.setDisabled(!newValue.statusAudit);
                    }
                }
            },
            {
                xtype: 'combo',
                name: 'reviewCategory',
                hidden: true,
                disabled: true,
                editable: false,
                readOnly: false,
                allowBlank: false,
                itemId: 'reviewCategory',
                fieldLabel: i18n.getKey('audit') + i18n.getKey('category'),
                valueField: 'value',
                displayField: 'display',
                store: {
                    xtype: 'store',
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            display: i18n.getKey('Violent'),
                            value: 'Violent'
                        },
                        {
                            display: i18n.getKey('Political'),
                            value: 'Political'
                        },
                        {
                            display: i18n.getKey('Religious'),
                            value: 'Religious'
                        },
                        {
                            display: i18n.getKey('Trademark'),
                            value: 'Trademark'
                        },
                        {
                            display: i18n.getKey('Nude'),
                            value: 'Nude'
                        },
                        {
                            display: i18n.getKey('CancelOrder'),
                            value: 'CancelOrder'
                        },
                        {
                            display: i18n.getKey('Sanction'),
                            value: 'Sanction'
                        },
                        {
                            display: i18n.getKey('Other Sensitive content'),
                            value: 'Other Sensitive content'
                        }
                    ]
                }
            },
            {
                xtype: 'textarea',
                name: 'reviewAdvise',
                itemId: 'reviewAdvise',
                width: 700,
                hidden: true,
                readOnly: false,
                fieldLabel: i18n.getKey('auditComment'),
            },
            {
                xtype: 'checkbox',
                name: 'auditConfirm',
                itemId: 'auditConfirm',
                width: 700,
                allowBlank: false,
                readOnly: false,
                boxLabel: '<font color="red">已完成对订单信息,订单图片以及订单设计文档的检查</font>',
                fieldLabel: i18n.getKey('auditConfirm'),
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
                checked: me.record,
                boxLabel: JSCreateFont('red', false, '已完成对订单生产基地信息确认'),
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
                xtype: 'datefield',
                name: 'shippedDate',
                itemId: 'shippedDate',
                readOnly: false,
                editable: false,
                fieldLabel: i18n.getKey('限制出货日期'),
                diyGetValue: function () {
                    var date = this.getValue();
                    if (date) {
                        return date.getTime()
                    }
                }
            },
            {
                xtype: 'sanction',
                name: 'sanction',
                itemId: 'sanction',
                fieldLabel: i18n.getKey('制裁'),
                height: 100,
                width: 700,
                orderId: id,
                userName: userName,
                hidden: !suspectedSanction,
                suspectedSanction: suspectedSanction,
                isMultiAddressDelivery: isMultiAddressDelivery,
            },
            {
                xtype: 'textarea',
                name: 'comment',
                itemId: 'comment',
                width: 700,
                height: 80,
                readOnly: false,
                fieldLabel: i18n.getKey('订单状态修改备注'),
                tipInfo: '描述这次修改订单状态相关信息,信息会在订单历史中显示',
            },
            {
                xtype: 'shipmentinfo',
                record: record,
                width: 1000,
                name: 'shipmentInfo',
                margin: '10 25 5 25',
                fieldLabel: i18n.getKey('shipmentInfo'),
                itemId: 'shipmentInfo',
                readOnly: false,
                getName: function () {
                    return this.name;
                },
                diySetValue: Ext.emptyFn,
                getErrors: function () {
                    return i18n.getKey('shipmentInfo') + '必须完备';
                },
                isValid: function () {
                    return true;
                },
            },
            {
                xtype: 'packagegridfield',
                itemId: 'shipmentBoxes',
                name: 'shipmentBoxes',
                readOnly: false,
                record: record,
                width: 1000,
                isValid: function () {
                    var me = this;
                    me.clearError();
                    return true;
                },
            },
            {
                xtype: 'textfield',
                itemId: 'clazz',
                name: 'clazz',
                hidden: true,
                clazz: 'com.qpp.cgp.domain.entity.data.OrderStatusUpdateData',
                setValue: Ext.emptyFn,
                getValue: function () {
                    return 'com.qpp.cgp.domain.entity.data.OrderStatusUpdateData';
                }
            },
            {
                xtype: 'gridfield',
                fieldLabel: i18n.getKey('orderHistories'),
                itemId: 'statusHistories',
                name: 'statusHistories',
                width: 1000,
                gridConfig: {
                    maxHeight: 200,
                    store: {
                        xtype: 'store',
                        fields: [
                            {name: 'history', type: 'string'},
                        ],
                        data: []
                    },
                    columns: [
                        {
                            text: i18n.getKey('detail'),
                            dataIndex: 'history',
                            menuDisabled: true,
                            sortable: false,
                            flex: 1,
                            renderer: function (value, mateData, record) {
                                return JSAutoWordWrapStr(value);
                            }
                        }
                    ]
                },
                diyGetValue: Ext.emptyFn,
                diySetValue: function (histories) {
                    var me = this;
                    var form = me.ownerCt;
                    var wrapHis = [];
                    var needRedoNo = 0;
                    var isRedo = form.record.get('isRedo');
                    Ext.Array.each(histories, function (history, index) {
                        var hisStr;
                        var modifiedUser = history.modifiedUser;
                        if (Ext.isEmpty(modifiedUser)) {
                            modifiedUser = {};
                            modifiedUser.emailAddress = 'system';
                        }
                        var statusName = history.status.name;
                        var statusId = history.status.id;
                        if (statusId == 240710) {
                            needRedoNo = index;
                        }
                        if (isRedo == true) {
                            if (index > needRedoNo && needRedoNo > 0) {
                                if (Ext.Array.contains([103, 104, 105, 106, 107], statusId)) {
                                    statusName = i18n.getKey('redo') + '-' + i18n.getKey(statusName);
                                    if (statusId == 103) {
                                        statusName = i18n.getKey('redo-confirmed(waitting print)');
                                    }
                                } else {
                                    statusName = i18n.getKey(statusName);
                                }
                            } else {
                                statusName = i18n.getKey(statusName);
                            }
                        } else {
                            statusName = i18n.getKey(statusName);
                        }
                        var historyDate = Ext.isEmpty(history.createdDate) ? history.modifiedDate : history.createdDate;
                        hisStr = '(' + (index + 1) + ')&nbsp;&nbsp;<font color=red>' + modifiedUser.emailAddress + '</font>' + '于' + '<font color=red>' + Ext.Date.format(new Date(historyDate), 'Y/m/d H:i') + '</font>' + '将此订单状态修改为' + '<font color=red>' + statusName + '</font>';
                        if (!Ext.isEmpty(history.comment)) {
                            hisStr += '<br>' + i18n.getKey('comment') + ':<spand style="color:red">' + history.comment + '<font/>'
                        }
                        hisStr = '<p>' + hisStr + '</p>'
                        wrapHis.push({
                            history: hisStr
                        });
                    })
                    me._grid.store.loadData(wrapHis);
                }
            },
            {
                xtype: 'typesettingbtn',
                itemId: 'typeSetting',
                name: 'typeSetting',
                fieldLabel: i18n.getKey('typesettingschedule'),
                labelAlign: 'left',
                getName: Ext.emptyFn,
                diySetValue: Ext.emptyFn,
                diyGetValue: Ext.emptyFn,
                defaults: {
                    allowBlank: true,
                    margin: '5 0 10 5',
                },
                storeId: id,
                record: record,
                statusId: statusId
            },
            {
                xtype: 'outsendorderitemgridfield',
                itemId: 'outSendOrderItem',
                name: 'outSendOrderItem',
                width: 1000,
                labelAlign: 'left',
                orderId: JSGetQueryString('id'),
                hidden: !isOutboundOrder,
                isOutboundOrder: isOutboundOrder
            },
            getPayInfoCmp(),

        ];
        var componentMapping = CGP.orderstatusmodify.config.Config.componentMapping;
        var componentArr = componentMapping[statusId] || [];
        var items = [];

        //判断每个状态有啥组件
        for (var i = 0; i < components.length; i++) {
            var item = components[i];
            if (Ext.Array.contains(componentMapping['common'], item.itemId)) {
                items.push(item);
            }
            if (Ext.Array.contains(componentArr, item.itemId)) {
                items.push(item);
            }
        }
        return items;
    },
    /**
     * 各个状态的表达组件特殊控制 //当前还未生成渲染
     */
    statusSpecialControl: function (statusId, items, record) {
        var me = this;
        if (statusId == 120) {//已生产,待组装
            var orderLineInfo = items.filter(item => {
                return item['itemId'] === 'orderLineInfo';
            })[0]

            orderLineInfo.selModel = Ext.create("Ext.selection.CheckboxModel", {
                injectCheckbox: 7,//checkbox位于哪一列，默认值为0
                checkOnly: true,//如果值为true，则只用点击checkbox列才能选中此条记录
                allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
                showHeaderCheckbox: true,//如果此项为false在复选框列头将不显示.
                listeners: {
                    selectionchange: function () {
                        console.log(arguments)
                    }
                }
            });

            // 订单项中添加一列来选定已经组装的列
            orderLineInfo.diySetConfig = function () {
                var grid = this,
                    columns = grid.gridCfg.columns;

                //把备注列换为记录是否组装的列
                columns.forEach((item, index) => {
                    if (index === (columns.length - 1)) {
                        columns[index] = {
                            text: '已完核对和组装',
                            dataIndex: 'isCompletePackage',
                            flex: 1,
                        };
                    }
                })
            };


            //校验所有记录都勾选
            orderLineInfo.isValid = function () {
                var me = this,
                    grid = me.getGrid()
                return (grid.selectedRecords.length == me.store.getTotalCount());
            };
            orderLineInfo.getErrors = function () {
                var me = this;
                return '所有订单项的必须勾选已完核对和组装(注意其他分页内容)'
            }
        } else if (statusId == 121) {//已组装,待装箱

        } else if (statusId == 122) {//已装箱，待交收
            //显示装箱信息，不允许编辑
            items.forEach(function (item, index, arr) {
                if (item.itemId == 'shipmentBoxes') {
                    item.readOnly = true;
                }
            })
        } else if (statusId == 42) {//取消订单
            //下只能查看,手动设置值
            items.forEach(function (item, index, arr) {
                arr[index].readOnly = true;
                arr[index].editable = false;
                if (item.itemId == 'statusAudit') {
                    arr[index].items[0].readOnly = true;
                    arr[index].items[1].readOnly = true;
                    arr[index].listeners.afterrender = function () {
                        var me = this;
                        me.setValue({
                            statusAudit: false
                        });
                    }
                }
                if (['auditConfirm', 'manufactureCenter'].includes(item.itemId)) {
                    item.checked = true;
                    item.diySetValue = Ext.emptyFn;
                }
            })
        } else if (statusId == 106) {//已交收,待发货
            //显示发货日期
            items.forEach(function (item, index, arr) {
                if (item.itemId == 'shipmentInfo') {
                    item.listeners = {
                        afterrender: function (field) {
                            var deliverDate = field.getComponent('deliveryDate');
                            deliverDate.show();
                            deliverDate.setDisabled(false);
                        }
                    }
                }
            })
        } else if (statusId == 107) {//已发货,待签收
            //显示发货信息,和装箱信息，不允许编辑
            /**
             * @author xiu
             * @date 2022/9/19
             */
            // 显示签收日期与备注
            items.forEach(function (item, index, arr) {
                if (item.itemId == 'shipmentBoxes') {
                    item.readOnly = true;
                }
                if (item.itemId == 'shipmentInfo') {
                    item.defaults = {
                        labelAlign: 'right',
                        labelWidth: 60,
                        msgTarget: 'under',
                        readOnly: true,
                        width: 200
                    };
                }
                if (['signDate', 'signRemark'].includes(item.itemId)) {
                    item.readOnly = false;
                    item.hidden = false;
                }
            })
        } else if (statusId === 108) {//已签收,待完成
            items.forEach(function (item, index, arr) {
                if (['signDate', 'signRemark'].includes(item.itemId)) {
                    item.readOnly = true;
                    item.hidden = false;
                }
            })
        } else if (statusId === 109) {//完成交易
            items.forEach(function (item, index, arr) {
                if (['signDate', 'signRemark'].includes(item.itemId)) {
                    item.readOnly = true;
                    item.hidden = false;
                }
            })
        } else if (statusId === 100) {//100待付款，只有paymentModuleCode = BankTransfer才有审核和填写数据的需要
            items.forEach(function (item, index, arr) {
                if (['transaction_voucher_form'].includes(item.itemId)) {
                    if (record.get('paymentModuleCode') === 'BankTransfer') {
                        item.disabled = false;
                        item.hidden = false;
                    } else {
                        item.disabled = true;
                        item.hidden = true;
                    }
                }
            })
        }
    }
    ,
    /**
     * 根据statusId决定工具栏内容
     */
    toolbarControl: function (statusId, record) {
        var me = this;
        var bbar = me.getDockedItems('toolbar[dock="bottom"]')[0];
        bbar.removeAll();
        var config = CGP.orderstatusmodify.config.Config.statusActionMapping[statusId];
        var itemsConfig = {
            lastStepBtnCfg: {
                hidden: true,
            },
            nextStepBtnCfg: {
                xtype: 'button',
                text: i18n.getKey('nextStep'),
                iconCls: 'icon_next_step',
                itemId: 'nextBtn',
                hidden: true,
                handler: function (btn) {

                }
            },
            saveBtnCfg: {
                xtype: 'button',
                text: i18n.getKey('submit'),
                itemId: 'saveBtn',
                iconCls: 'icon_agree',
                width: 80,
                hidden: true,
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    if (form.isValid()) {
                        var formData = form.getValue();
                        var toolbar = btn.ownerCt;
                        var controller = Ext.create('CGP.orderstatusmodify.controller.Controller');
                        formData.statusId = btn.nextStatus;
                        var data = {
                            actionKey: btn.actionKey,
                            data: formData,
                        };
                        JSClearNullValue(data);
                        controller.updateConfig(data, form, toolbar);
                    }
                }
            },
            cancelBtnCfg: {
                xtype: 'button',
                text: i18n.getKey('return') + i18n.getKey('orderList'),
                iconCls: 'icon_arrow_undo',
                handler: function (btn) {
                    var orderPage = top.Ext.getCmp('tabs').getComponent("orderpage");
                    if (orderPage) {
                        parent.frames['tabs_iframe_orderpage'].contentWindow.refreshGrid();
                        top.Ext.getCmp('tabs').setActiveTab(orderPage)

                    }
                    //关闭当前页
                    window.parent.Ext.getCmp('tabs').remove('modifyStatusV2');
                }
            },
            //打印标签
            printLabelBtnCfg: {
                hidden: true,
                text: i18n.getKey('打印label'),
                itemId: 'iconAudit',
                iconCls: 'icon_audit',
                handler: function (btn) {
                    var record = btn.ownerCt.ownerCt.record;
                    var controller = Ext.create('CGP.order.controller.Order');
                    controller.printLabel(record.get('orderNumber'));
                }
            },
            refreshBtnCfg: {
                xtype: 'button',
                text: i18n.getKey('refresh'),
                iconCls: 'icon_refresh',
                handler: function (btn) {
                    location.reload();
                }
            },
            //额外提示信息
            tipInfo: {
                xtype: 'displayfield',
                itemId: 'prompt',
                hidden: true,
                fieldStyle: {
                    color: 'red',
                    fontWeight: 'bold',
                    fontSize: '12px'
                }
            }

        };
        itemsConfig = Ext.Object.merge(itemsConfig, config);
        var items = [];
        for (var i in itemsConfig) {
            items.push(itemsConfig[i]);
        }
        bbar.add(items);


    }
    ,
    /**
     * 某些特殊的点状态，需要对工具栏杆进行特殊处理
     */
    toolbarSpecialControl: function (statusId, record) {
        var me = this;
        var toolbar = me.down("toolbar[@dock='bottom']");
        var saveBtn = toolbar.getComponent('saveBtn');
        var promptField = toolbar.getComponent('prompt');

        var offlinePaymentStatus = record.get('offlinePaymentStatus');
        //100 待付款订单，如果是线上付款，不需要审核
        if (statusId === 100 && record.get('paymentModuleCode') !== 'BankTransfer') {
            saveBtn?.hide();
        }
        //待付款订单，银行转账 且凭证状态为待审核
        if (statusId === 100 && record.get('paymentModuleCode') == 'BankTransfer' && offlinePaymentStatus?.code == 'WAITING_CONFIRM_STATUS') {
            var tipInfo = '已完成付款凭证信息上传,仅需要提交审核';
            promptField.setValue(`提示: ${tipInfo}`);
            promptField.show();
        }
        if (statusId === 100) {//待付款订单不需要对按钮做控制

        } else {
            //统一订单状态
            //订单随机定制内容生成状态
            var orderDeliveryMethod = me.record.get('orderDeliveryMethod');
            var itemGenerateStatus = me.record.get('itemGenerateStatus');
            var isSuccessGenerateStatus = (!itemGenerateStatus) || (itemGenerateStatus === 'SUCCESS');//老订单没这字段 为空都算成功
            // 工具栏添加提示文本
            me.createPromptButtonText();
            // 根据统一订单状态与订单随机定制内容生成状态禁用保存按钮
            //禁用或解禁保存
            if ([120, 121, 122, 106, 107, 108, 109].includes(statusId)) {
                saveBtn?.setDisabled(orderDeliveryMethod === 'ULGS')
            }
            saveBtn?.setDisabled(!isSuccessGenerateStatus);
        }


        //如果订单的isLockOrder为true，表示该订单已经因为信贷额度而被锁定
        var isLockOrder = record.get('isLockOrder');
        //isLockOrder = true;
        if (isLockOrder == true) {
            var lockedCode = record.get('lockedCode');
            var map = {
                50260201: `订单金额超过信贷额`,
                50260202: `存在逾期账单`,
            };
            promptField.setValue(`${promptField.getValue()}; ${map[lockedCode]}`);
            promptField.show();
            //禁止状态流转
            saveBtn?.setDisabled(true);
            //添加一个解锁的按钮
            toolbar.add({
                text: '订单解锁',
                iconCls: 'icon_unlock',
                tipInfo: '解除因为信贷额度限制而产生的订单锁定',
                handler: function (btn) {
                    var controller = Ext.create('CGP.orderstatusmodify.controller.Controller');
                    controller.unLockOrder(record.get('id'));

                }
            });
        }
    },


    // 统一处理提示文本
    createPromptButtonText: function () {
        var me = this,
            orderDeliveryMethod = me.record.get('orderDeliveryMethod'),//统一订单状态
            itemGenerateStatus = me.record.get('itemGenerateStatus'),//订单随机定制内容生成状态
            promptParams = [{
                isShow: orderDeliveryMethod === 'ULGS',
                tooltip: '统一配送状态,不允许直接修改订单',
                text: '统一配送订单',
            }],
            itemGenerateStatusGather = {
                Wait: function () {
                    promptParams.push({
                        isShow: true,
                        text: '随机定制内容正在生成中',
                    })
                },
                GENERATING: function () {
                    promptParams.push({
                        isShow: true,
                        text: '随机定制内容正在生成中',
                    })
                },
                SUCCESS: function () {

                },
                FAILED: function () {
                    promptParams.push({
                        isShow: true,
                        text: '随机定制内容生成失败,请联系后台管理人员!',
                    })
                },
                PARTIAL_FAILED: function () {
                    promptParams.push({
                        isShow: true,
                        text: '部分订单项随机定制内容生成失败,请联系后台管理人员!',
                    })
                },
            };

        itemGenerateStatusGather[itemGenerateStatus || 'SUCCESS']();

        var hidden = true,
            totalTooltip = '',
            totalText = '';


        promptParams?.forEach(item => {
            var {isShow, tooltip, text, callBack} = item;

            if (isShow) {
                hidden = false;
                totalTooltip += `${tooltip || ''} `;
                totalText += `${text || ''} `;
                callBack && callBack();
            }
        });
        var toolbar = me.down("toolbar[@dock='bottom']");
        var promptBtn = toolbar.getComponent('prompt');
        promptBtn.setValue(`提示: ${totalText}`);
        promptBtn.setVisible(!hidden);
    }
})
