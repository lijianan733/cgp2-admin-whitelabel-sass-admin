Ext.define('Order.status.view.Status', {
    extend: 'Ext.form.Panel',
    alias: 'widget.orderstatus',
    requires: [
        'CGP.order.actions.address.view.BillingAddress',
        'CGP.orderlineitemv2.store.OrderLineItemByOrderStore',
        'Order.status.model.OrderDetail',
        'Order.status.view.shipment.ShipmentInfo',
        'Order.status.view.shipment.ShipmentBox',
        //'Order.status.view.deliveritems.DeliverItemManage',
        'Order.status.view.shipment.ShipmentBoxView',
        'Order.status.view.productmaterialbomgrid.OrderProduceComponentList',
        'CGP.order.actions.status.model.DeliveryInfoModel',
        'CGP.order.actions.status.view.OptionalConfigContainer',
        'CGP.common.typesettingschedule.TypeSettingBtn',
        'Order.status.view.outsendorderitem.OutSendOrderItemGridField',
        'CGP.orderstatusmodify.view.Sanction',
        'CGP.orderstatusmodify.view.DeliverItem'

    ],
    region: 'center',
    autoScroll: true,
    defaults: {
        labelWidth: 120,
        width: 500,
        msgTarget: 'under',
        labelAlign: 'right'
    },
    deliveryInfoVisible: null,//是否显示发货相关信息
    initComponent: function () {
        var me = this,
            {orderId} = me,
            isRedo = JSGetQueryString('isRedo'),
            statusId = parseInt(JSGetQueryString('statusId')),
            orderNumber = JSGetQueryString('orderNumber'),
            controller = Ext.create('Order.status.controller.Status'),
            url = adminPath + 'api/orders/' + orderId + '/v2',
            data = controller.getQuery(url),
            orderStatusUrl = adminPath + 'api/whitelabelOrderStatuses?page=1&start=0&limit=1000&sort=[{"property":"fontSort","direction":"ASC"}]',
            orderStatus = controller.getQuery(orderStatusUrl);


        var {
            deliveryName,
            suspectedSanction,
            isMultiAddressDelivery,
            status,
            remark,
            orderDeliveryMethod,
            isOutboundOrder
        } = data;
        // 是否显示发货信息和装箱信息
        // 然后判断当 orderDeliveryMethod =ULGS ||isMultiAddressDelivery =true ，不显示
        var deliveryInfoVisible = me.deliveryInfoVisible = !(orderDeliveryMethod == 'ULGS' || isMultiAddressDelivery == true);


        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                itemId: 'save',
                handler: function () {
                    //已审核,待排版状态，用户参数必须不为空
                    var targetStatus = me.getComponent('orderStatus').getValue();
                    if (targetStatus == 102 && (!Ext.isEmpty(me.nullUserParams) && me.nullUserParams.length > 0)) {
                        Ext.Msg.alert(i18n.getKey('infor'), i18n.getKey('null') + i18n.getKey('userParams') + JSON.stringify(me.nullUserParams));
                    } else {
                        var machineContainer = me.getComponent('machine');
                        if (!machineContainer.hidden && machineContainer.isValid()) {
                            controller.saveMachineConfig(machineContainer, me.orderId);
                        }
                        if (!machineContainer.hidden && !machineContainer.isValid()) {
                            return false;
                        }
                        //修改状态为 已审核,待生产 37681428  CHECKED_PRODUCING_STATUS
                        var isComplete = true;
                        if (targetStatus == 37681428) {
                            isComplete = controller.checkCustomElementComplete(me.orderId);
                            if (isComplete == false) {
                                Ext.Msg.confirm('提示', '当前订单中有未选定报关分类的订单项，是否前往生产详细补全配置?', function (selector) {
                                    if (selector == 'yes') {
                                        var form = me.getForm();
                                        var record = form.getRecord();
                                        JSOpen({
                                            id: 'modifyStatusV2',
                                            url: path + 'partials/orderstatusmodify/main.html?id=' + record.get('_id') + '&orderNumber=' + record.get("orderNumber"),
                                            title: i18n.getKey('生产详细'),
                                            refresh: true
                                        })
                                    }
                                })
                                return false;
                            }
                        }

                        controller.saveStatus();
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('grid'),
                iconCls: 'icon_grid',
                handler: function () {
                    JSOpen({
                        id: 'page',
                        url: path + 'partials/order/order.html'
                    });
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('refresh'),
                iconCls: 'icon_refresh',
                handler: function () {
                    location.reload();
                }
            },
            {
                xtype: 'button',
                hidden: true,
                itemId: 'printLabel',
                text: i18n.getKey('打印label'),
                iconCls: 'icon_audit',
                handler: function (btn) {
                    var record = btn.ownerCt.ownerCt.record;
                    var controller = Ext.create('CGP.order.controller.Order');
                    controller.printLabel(record.get('orderNumber'));
                }
            },
            {
                xtype: 'button',
                itemId: 'prompt',
                componentCls: "btnOnlyIcon",
                tooltip: '统一配送状态,不允许直接修改订单',
                text: JSCreateFont('red', true, '提示: ' + '统一配送'),
            }
        ];

        me.items = [
            {
                fieldLabel: i18n.getKey('orderNumber'),
                name: 'orderNumber',
                xtype: 'displayfield',
                renderer: function (value) {
                    return '<div class="status-field">' + value + '</div>';
                }
            },
            {
                fieldLabel: i18n.getKey('customerEmail'),
                name: 'customerEmail',
                xtype: 'displayfield',
                renderer: function (value) {
                    return '<div class="status-field">' + value + '</div>';
                }
            },
            {
                fieldLabel: i18n.getKey('datePurchased'),
                name: 'datePurchased',
                xtype: 'displayfield',
                renderer: function (value) {
                    return '<div class="status-field">' + Ext.Date.format(new Date(parseInt(value)), 'Y-m-d H:i:s') + '</div>';
                }
            },
            {
                fieldLabel: i18n.getKey('shippingMethod'),
                name: 'shippingMethod',
                xtype: 'displayfield',
                renderer: function (value) {
                    return '<div class="status-field">' + value + '</div>';
                }
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('deliveryNo'),
                hidden: true,
                itemId: 'deliveryNo',
                name: 'deliveryNo',
                renderer: function (value) {
                    return '<div class="status-field">' + value + '</div>';
                }
            },
            {
                fieldLabel: i18n.getKey('deliveryAddress'),
                name: 'deliveryAddress',
                xtype: 'displayfield',
                itemId: 'deliveryAddress',
                hidden: false
            },
            {
                fieldLabel: i18n.getKey('orderStatus'),
                name: 'status',
                xtype: 'displayfield',
                itemId: 'currentStatus',
            },
            {
                fieldLabel: i18n.getKey('modifyStatus'),
                itemId: 'orderStatus',
                name: 'status',
                xtype: 'combobox',
                editable: false,
                displayField: 'name',
                valueField: 'id',
                allowBlank: false,
                titleField: 'tipInfo',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {
                            name: 'id',
                            type: 'int'
                        },
                        {
                            name: 'name',
                            type: 'string',
                            convert: function (value, record) {
                                var resultName = i18n.getKey(value);
                                var statusId = record.get('id');
                                if (Ext.Array.contains([103, 104, 105, 106, 107], statusId)) {
                                    if (isRedo == 'true') {
                                        if (statusId == 103) {
                                            resultName = i18n.getKey('redo-confirmed(waitting print)');
                                        } else {
                                            resultName = i18n.getKey('redo') + '-' + i18n.getKey(value);
                                        }
                                    }
                                }
                                return resultName;
                            }
                        },
                        {
                            name: 'tipInfo',
                            type: 'string',
                            convert: function (value, record) {
                                var name = i18n.getKey(record.get('name'));
                                return name + '(' + record.get('id') + ')';
                            }
                        }
                    ],
                    model: null,
                    orderId: controller.id,
                    proxy: {
                        type: 'memory',
                        data: (function () {
                            //特殊处理
                            var resultStatus = [];
                            if ([121, 122, 106, 107, 108].includes(statusId) && orderDeliveryMethod === 'ULGS') {
                                orderStatus.forEach(item => {
                                    const {id} = item;
                                    if (![121, 122, 106, 107, 108].includes(id)) {
                                        resultStatus.push(item);
                                    }
                                })
                            } else {
                                resultStatus = orderStatus;
                            }
                            return resultStatus;
                        })()
                    }
                }),
                listeners: {
                    expand: function () {
                        var me = this;
                        var currentStatus = JSGetQueryString('statusId');
                        if (currentStatus == 100) {//待付款
                            //过滤出已付款待审核状态
                            me.store.filter(function (item) {
                                return item.getId() == '101' || item.getId() == '120';//已付款（待审核）
                            });
                        } else if (currentStatus == 300) {//待确认订单
                            me.store.filter(function (item) {
                                return item.getId() == '110' || item.getId() == '120';//已确认（待审核）
                            });
                        }
                        console.log(arguments)
                    },
                    select: function (combo, records) {
                        var record = records[0];
                        me.addContentBySelectedStatus(record.get('id'));
                        var currentStatus = me.record.get('status').id;
                        var nextStatus = record.get('id');
                        if (currentStatus == 106 && nextStatus == 107) {
                            me.getComponent('customerNotify').setValue(true);
                        } else {
                            me.getComponent('customerNotify').setValue(false);
                        }
                    },
                    change: function (comp, newValue, oldValue) {
                        var machine = me.getComponent('machine')

                        //已排版（待打印）
                        if ([118, 110, 101].includes(newValue)) {
                            if (machine) {
                                var userParamsStore = Ext.data.StoreManager.lookup('userParamsStore'), show = false;
                                var existsUserImpositionParams = data['existsUserImpositionParams'];
                                if (existsUserImpositionParams) {
                                    userParamsStore.load({
                                        callback: function () {
                                            userParamsStore.each(function (recd) {
                                                if (recd.get('userParams') && JSON.stringify(recd.get('userParams')) != '{}') {
                                                    show = true;
                                                }
                                            })
                                            if (show) {
                                                machine.enable();
                                                machine.show();
                                            }
                                        }
                                    })

                                }
                            }
                        } else {
                            // userParams.disable();
                            // userParams.hide();
                            machine.disable();
                            machine.hide();
                        }
                    }
                }
            },
            {
                xtype: 'fieldset',
                itemId: 'machine',
                title: i18n.getKey('print') + i18n.getKey('machine'),
                hidden: true,
                collapsed: false,//初始状态时展开
                collapsible: true,
                width: 450,
                margin: '0 0 0 50',
                style: {
                    borderRadius: '5px'
                },
                defaults: {
                    labelWidth: 115,
                    width: 415,
                    msgTarget: 'under',
                    labelAlign: 'right'
                },
                items: [],
                isValid: function () {
                    var me = this, isValid = true;
                    var items = me.items.items;
                    for (var item of items) {
                        if (!item.isValid()) {
                            isValid = false;
                        }
                    }
                    return isValid;
                }
            },
            {
                fieldLabel: i18n.getKey('userParams'),
                xtype: 'displayfield',
                itemId: 'userParams',
                hidden: true,
                value: '<a href="#" id="click-userParams" style="color: blue">' + i18n.getKey('setValue') + '</a>',
                listeners: {
                    render: function (display) {
                        var clickElement = document.getElementById('click-userParams');
                        clickElement.addEventListener('click', function () {
                            Ext.create('Order.status.view.UserImpositionParams', {
                                title: i18n.getKey('order') + i18n.getKey('userParams'),
                                orderId: me.orderId,
                            }).show();
                        });
                    }
                }
            },
            {
                fieldLabel: i18n.getKey('customerNotify'),
                xtype: 'checkboxfield',
                inputValue: true,
                name: 'customerNotify',
                itemId: 'customerNotify'
            },
            {
                fieldLabel: i18n.getKey('订单状态修改备注'),
                name: 'comment',
                xtype: 'textarea',
                itemId: 'comment',
                tipInfo: '描述这次修改订单状态相关信息',
            },
            {
                fieldLabel: i18n.getKey('paidDate'),
                xtype: 'datefield',
                name: 'paidDate',
                itemId: 'paidDate',
                hidden: true,
                format: system.config.dateFormat,
                value: new Date(),
                allowBlank: false
            },
            {
                xtype: 'deliverItem',
                name: 'deliverItem',
                itemId: 'deliverItem',
                fieldLabel: i18n.getKey('发货项'),
                width: 1200,
                remark: remark,
                orderId: orderId,
                userName: deliveryName,
                statusId: status?.id,
                hiddenSanction: !suspectedSanction,
                orderDeliveryMethod: orderDeliveryMethod,
            },
            {
                xtype: 'sanction',
                name: 'sanction',
                itemId: 'sanction',
                fieldLabel: i18n.getKey('制裁'),
                height: 100,
                width: 700,
                hidden: true,
                orderId: orderId,
                status: status?.id,
                userName: deliveryName,
                suspectedSanction: suspectedSanction,
                isMultiAddressDelivery: isMultiAddressDelivery,
            },
            //该项重做订单以往发货历史
            {
                xtype: 'gridfield',
                name: 'deliveryHistory',
                itemId: 'deliveryHistory',
                width: 700,
                disabled: true,
                hidden: true,
                fieldLabel: i18n.getKey('deliveryHistory'),
                gridConfig: {
                    renderTo: JSGetUUID(),
                    viewConfig: {
                        enableTextSelection: true
                    },
                    width: '100%',
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        proxy: {
                            type: 'memory',
                            reader: {
                                type: 'array'
                            }
                        },
                        model: 'CGP.order.actions.status.model.DeliveryInfoModel',
                        data: []
                    }),
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            dataIndex: 'deliveryNo',
                            text: i18n.getKey('deliveryNo')
                        },
                        {
                            dataIndex: 'deliveryDate',
                            width: 150,
                            text: i18n.getKey('deliveryDate'),
                            renderer: function (value, metadata, record) {
                                metadata.style = "color: gray";
                                value = Ext.Date.format(value, 'Y/m/d H:i');
                                return '<div style="white-space:normal;">' + value + '</div>';
                            }
                        },
                        {
                            dataIndex: 'shippingMethodName',
                            text: i18n.getKey('shippingMethod')
                        },
                        {
                            dataIndex: 'weight',
                            text: i18n.getKey('weight') + '(g)'
                        },
                        {
                            dataIndex: 'cost',
                            text: i18n.getKey('shippingCost')
                        }
                    ]
                }
            },
            /**
             * @author xiu
             * @date 2023/9/18
             */
            {
                xtype: 'datetimefield',
                name: 'signDate',
                itemId: 'signDate',
                format: 'Y-m-d H:i:s',
                hidden: true,
                editable: false,
                allowBlank: false,
                fieldLabel: i18n.getKey('signDate'),
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
                hidden: true,
                editable: false,
                store: {
                    xtype: 'store',
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
                xtype: "fieldcontainer",
                border: false,
                fieldLabel: i18n.getKey('orderHistories'),
                itemId: 'orderHistoriesContainer',
                autoScroll: true,
                maxHeight: 300,
                width: 1000,
                items: [
                    {
                        fieldLabel: false,
                        name: 'statusHistories',
                        xtype: 'displayfield',
                        width: '100%',
                        itemId: 'orderHistories'
                    }
                ]
            },
            {
                xtype: 'outsendorderitemgridfield',
                itemId: 'outSendOrderItem',
                name: 'outSendOrderItem',
                margin: '5 5 5 40',
                labelWidth: 80,
                width: 1000,
                labelAlign: 'left',
                orderId: JSGetQueryString('id'),
                hidden: !isOutboundOrder,
                isOutboundOrder: isOutboundOrder
            }
        ];

        me.callParent(arguments);
        me.orderHistoriesField = me.getComponent('orderHistoriesContainer').getComponent("orderHistories");
        me.deliveryAddressField = me.getComponent('deliveryAddress');
        me.currentStatusField = me.getComponent('currentStatus');
        me.signDate = me.getComponent('signDate');
        me.signRemark = me.getComponent('signRemark');
        me.deliveryNo = me.getComponent('deliveryNo');
        me.deliveryHistory = me.getComponent('deliveryHistory');
        me.sanction = me.getComponent('sanction');
        me.shipmentBox = me.getComponent('shipmentBox');
        me.deliverItem = me.getComponent('deliverItem')
        me.shipmentInfo = me.getComponent('shipmentInfo');

        var userParamsStore = Ext.create('Order.status.store.UserParams', {
            storeId: 'userParamsStore',
            orderId: me.orderId,
            listeners: {
                load: function (records, operation, success) {
                    if (success) {
                        me.nullUserParams = [];
                        records.each(function (item) {
                            var userImpositionParams = item.get('userImpositionParams')
                            var userParamDefaultValues = item.get('userParamDefaultValues');
                            if (!Ext.isEmpty(userImpositionParams) && JSON.stringify(userImpositionParams) != '{}' && (userParamDefaultValues && userParamDefaultValues.objectJSON)) {
                                for (var i in userImpositionParams) {
                                    if (Ext.isEmpty(userImpositionParams[i]) && Ext.isEmpty(userParamDefaultValues.objectJSON[i]))
                                        me.nullUserParams.push(i);
                                }
                            } else if (userParamDefaultValues && userParamDefaultValues.objectJSON) {
                                for (var i in userParamDefaultValues.objectJSON) {
                                    if (Ext.isEmpty(userParamDefaultValues.objectJSON[i]))
                                        me.nullUserParams.push(i);
                                }
                            }
                            var OrderitemMachineComb = controller.addOrderitemMachine(item.data, me.getComponent('machine'))
                            // me.getComponent('machine').add(OrderitemMachineComb);
                        });

                    }
                }
            }
        });
        // userParamsStore.load();
        me.on('afterrender', function (comp) {
            var record = Ext.create('Order.status.model.OrderDetail', data);
            comp.setData(record);
            controller.record = record;
            controller.orderNumber = record.get('orderNumber');

            var toolbar = me.getDockedItems('toolbar[dock="top"]')[0],
                save = toolbar.getComponent('save'),
                prompt = toolbar.getComponent('prompt'),
                compGather = [
                    {
                        comp: me.shipmentBox,
                        disabled: isMultiAddressDelivery,
                        visible: !isMultiAddressDelivery
                    }
                ]

            compGather.forEach(function (item) {
                const {comp, disabled, visible} = item;
                if (comp) {
                    comp.setDisabled(disabled);
                    comp.setVisible(visible);
                }
            })


            //统一配送禁用保存 展示提示
            if (orderDeliveryMethod === 'ULGS') {
                // save.setDisabled(orderDeliveryMethod === 'ULGS');
                prompt.setVisible(orderDeliveryMethod === 'ULGS');
            }

            //如果是100 且为线下付款
            //跳转到生产详细进行凭证上传
            if (status.id == '100' && record.get('paymentModuleCode') == 'BankTransfer') {
                var msg = Ext.Msg.alert('提醒', '当前订单为待付款状态,且为线下付订单,\n不允许修改，将跳转到录入凭证界面');
                msg.on('close', function () {
                    location.href = path + `/partials/orderstatusmodify/main.html?id=${record.get('id')}&orderNumber=${record.get('orderNumber')}`;
                })
            }

            //因超信贷额度，订单锁定
            if (record.get('isLockOrder') == true) {
                var lockedCode = record.get('lockedCode');
                var map = {
                    50260201: '订单金额超过信贷额',
                    50260202: '存在逾期账单',
                };

                save.setDisabled(true);
                var str = `<font color="red">${map[lockedCode]}</font>`;
                if (prompt.text) {
                    str = `${prompt.text}; ${str}`;
                }
                prompt.setText(`${str}`);
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

        });
    },
    /**
     * 获取整个表单的数据
     * @returns {{statusId: *, paidDate: null, comment: *, shipmentBoxes: null, customerNotify: *, shipmentInfo: null}}
     */
    getData: function () {
        var me = this;
        var data = {};
        var status = me.getComponent('orderStatus').getValue();
        var customerNotify = me.getComponent('customerNotify').getValue();
        var comment = me.getComponent('comment').getValue();

        //paid date
        var paidDateField = me.getComponent('paidDate');
        var paidDate = null;
        if (paidDateField.isVisible()) {
            var paidDate = paidDateField.getValue().getTime();
        }

        //shipment info
        var shipmentInfoField = me.getComponent('shipmentInfo');
        var shipmentInfo = null;
        if (shipmentInfoField && shipmentInfoField.isVisible()) {
            if (!shipmentInfoField.isValid()) {
                throw new Error('not valid');
            }
            shipmentInfo = shipmentInfoField.getValue();
            shipmentInfo.clazz = 'com.qpp.cgp.domain.order.ShipmentInfo';
        }


        //shipment box var
        var shipmentBoxField = me.getComponent('shipmentBox');
        var shipmentBox = null;
        if (shipmentBoxField && shipmentBoxField.isVisible()) {
            if (!shipmentBoxField.isValid()) {
                throw new Error('not valid');
            }
            shipmentBox = shipmentBoxField.getValue();
            Ext.Array.each(shipmentBox, function (shipmentBoxItem) {
                shipmentBoxItem.clazz = 'com.qpp.cgp.domain.order.ShipmentBox';
                Ext.Array.each(shipmentBoxItem.boxProductItems, function (boxProductItem) {
                    boxProductItem.clazz = 'com.qpp.cgp.domain.order.BoxProductItem';
                })
            });
        }
        var produceComponentInfocontainer = me.getComponent('produceComponentInfos');
        if (produceComponentInfocontainer) {
            var produceComponentInfos = produceComponentInfocontainer.down('grid');
            if (produceComponentInfocontainer && produceComponentInfocontainer.isVisible()) {
                if (!produceComponentInfos.isValid()) {
                    Ext.Msg.alert('提示', '请给需排版的物料配置机器号！');
                    throw new Error('not valid');
                }
            }
        }

        var statusAudit = me.getComponent('statusAudit')?.getValue();
        var reviewCategory = me.getComponent('reviewCategory')?.getValue();
        var reviewAdvise = me.getComponent('reviewAdvise')?.getValue();

        data = {
            statusAudit: statusAudit?.statusAudit,
            statusId: status,
            customerNotify: customerNotify,
            comment: comment,
            paidDate: paidDate,
            shipmentInfo: shipmentInfo,
            shipmentBoxes: shipmentBox,
            shippedDate: null,
            reviewAdvise: reviewAdvise,
            reviewCategory: reviewCategory
        };

        //取消订单
        var orderReject = me.getComponent('orderReject');
        if (orderReject && orderReject.isValid() == false) {
            var errors = orderReject.getErrors();
            var str = '';
            for (var i in errors) {
                str += i + ':' + errors[i] + '<br>'
            }
            Ext.Msg.alert('提示', str);
            throw new Error('not valid');
        } else if (orderReject) {
            var orderRejectData = orderReject.getValue();
            data.reviewAdvise = orderRejectData?.reviewAdvise;
            data.reviewCategory = orderRejectData?.reviewCategory;
        }

        //已审核（待打印）
        var shippedDate = me.getComponent('shippedDate'),
            auditConfirm = me.getComponent('auditConfirm'),
            manufactureCenter = me.getComponent('manufactureCenter');

        data.shippedDate = shippedDate?.getValue();
        if (auditConfirm && auditConfirm.isValid() == false) {
            var errors = auditConfirm.getErrors();
            Ext.Msg.alert('提示', errors);
            throw new Error('not valid');
        }
        if (manufactureCenter && manufactureCenter.isValid() == false) {
            var errors = manufactureCenter.getErrors();
            Ext.Msg.alert('提示', errors);
            throw new Error('not valid');
        }

        //签收日期 ,签收描述
        if (Ext.Array.contains([108, 109], status)) {
            var signDate = me.getComponent('signDate');
            if (signDate.isValid() == false) {
                var errors = signDate.getErrors();
                Ext.Msg.alert('提示', errors);
                throw new Error('not valid');
            }
            var signDateData = signDate.diyGetValue();
            var signRemarkData = me.getComponent('signRemark').getValue();
            data['signDate'] = signDateData;
            data['signRemark'] = signRemarkData;
        }
        return data;
    },
    setData: function (record) {
        var me = this;
        me.record = record;
        me.orderNumber = record.get('orderNumber');
        me.loadRecord(record);
        me.setDeliveryAddress(record);
        me.setOrderHistories(record.get('statusHistories'));
        me.setDeliveryHistory(record);
        me.setOrderStatus(record);
        me.setDeliveryHistory(record);
        me.initPrintLabel(record);
        var statusId = record.get('status').id;
        var signDate = record.get('signDate');
        var signRemark = record.get('signRemark');
        if (Ext.Array.contains([106, 107, 108, 109, 224098, 224101], statusId)) {
            var shipmentInfo = record.get('shipmentInfo');
            if (shipmentInfo.deliveryNo) {
                me.deliveryNo.setVisible(true);
            }
            if (!Ext.isEmpty(shipmentInfo)) {
                me.deliveryNo.setValue(shipmentInfo.deliveryNo);
            }
        }
        if ([107, 108, 109].includes(statusId)) {
            me.signDate.diySetValue(signDate);
            me.signRemark.setValue(signRemark);
        }

        me.setContentByStatusId(statusId);

        //检查是是否处于已交收状态 显示运费信息和装箱信息
    },
    //设置以往发货历史
    setDeliveryHistory: function (record) {
        var me = this;
        var shipmentInfoHistories = record.get('shipmentInfoHistories');
        if (!shipmentInfoHistories || shipmentInfoHistories.length == 0) {
            return;
        }
        if (me.deliveryHistory._grid.rendered) {
            me.deliveryHistory.show();
            me.deliveryHistory._grid.store.loadData(record.get('shipmentInfoHistories'));
            me.deliveryHistory.setDisabled(false);

        } else {
            me.deliveryHistory._grid.on('afterrender', function (view) {
                me.deliveryHistory.show();
                me.deliveryHistory._grid.store.loadData(record.get('shipmentInfoHistories'));
                me.deliveryHistory.setDisabled(false);
            })
        }
    },
    /**
     * 根据状态选择性展示部分组件
     * @param statusId
     */
    setContentByStatusId: function (statusId) {
        var me = this,
            record = this.record, shipmentInfo,
            orderDeliveryMethod = record.get('orderDeliveryMethod');
        if (statusId == 106) {
            shipmentInfo = me.initShipmentInfo();
            shipmentInfo.setVisible(me.deliveryInfoVisible);
            //me.initShipmentBoxView();
        }

        if (statusId == 107) {
            shipmentInfo = me.initShipmentInfo();
            shipmentInfo.setVisible(me.deliveryInfoVisible);
        }

        //订单取消
        if (statusId == 42) {
            me.initRejectAudit();
        }
        //已审核,待打印
        if ([37681428, 119].includes(statusId)) {
            me.initAudit();
        }
    },
    setDeliveryAddress: function (record) {
        var me = this;
        var address = [];
        address.push(record.get('deliveryName'));
        address.push(record.get('deliveryStreetAddress1'));
        record.get('deliveryStreetAddress2') && address.push(record.get('deliveryStreetAddress2'));
        var postcode = record.get('deliveryPostcode') ? ('(' + record.get('deliveryPostcode') + ') ') : ' ';
        var state = record.get('deliveryState') ? (record.get('deliveryState') + ' ') : ' ';
        var zone = record.get('deliveryCity') + postcode + state + record.get('deliveryCountry');
        address.push(zone);
        //address.push(record.get('deliveryEmail'));
        address.push(record.get('deliveryTelephone'));
        var addStr = address.join('<br/>').replace(/undefined/g, '');
        var addStr = addStr.replace(/null/g, '');
        me.deliveryAddressField.setValue('<div class="status-field">' + addStr + '</div>');
    },
    setOrderHistories: function (histories) {
        var me = this;
        var wrapHis = [];
        var isRedo = JSGetQueryString('isRedo');
        var needRedoNo = 0;
        Ext.Array.each(histories, function (history, index) {
            var his;
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
            if (isRedo == 'true') {
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
            his = '(' + (index + 1) + ')&nbsp;&nbsp;<font color=red>' + modifiedUser.emailAddress + '</font>' + '于' + '<font color=red>' + Ext.Date.format(new Date(historyDate), 'Y/m/d H:i') + '</font>' + '将此订单状态修改为' + '<font color=red>' + statusName + '</font>';
            //添加备注
            if (!Ext.isEmpty(history.comment)) {
                his += '<br>' + i18n.getKey('comment') + ': <spand style="color:red">[' + history.comment + ']<font/>'
            }
            //添加审核意见
            if ([37681428, 119].includes(statusId) && me.record.get('reviewAdvise')) {
                his += '<br>' + i18n.getKey('auditComment') + ': <spand style="color:red">[' + me.record.get('reviewAdvise') + ']<font/>'
            }


            if (index == (histories.length - 1)) {
                his = '<p>' + his + '</p>'
            } else {
                his = '<p style="border-bottom:1px solid rgba(0,0,0,0.3)">' + his + '</p>';
            }

            wrapHis.push(his);
        });
        if (histories.length != 0) {
            me.orderHistoriesField.setValue('<div class="status-field">' + wrapHis.join('') + '</div>');
        }
    },
    setOrderStatus: function (record) {
        var me = this;
        var status = record.get('status');
        var orderNumber = record.get('orderNumber');
        var isRedo = me.record.get('isRedo');
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
        if (Ext.Array.contains([106, 122], statusId)) {
            me.addContentBySelectedStatus(statusId);
        }

        if ([42, 44, 103, 104, 113, 118, 110, 101, 119, 120, 121, 122, 106, 107, 108, 109, 37681428].includes(statusId)) {
            me.add({
                xtype: 'typesettingbtn',
                itemId: 'typeSetting',
                name: 'typeSetting',
                fieldLabel: i18n.getKey('typesettingschedule'),
                defaults: {
                    allowBlank: true,
                    margin: '5 0 5 5',
                },
                record: record,
                storeId: me.orderId,
                orderNumber: orderNumber,
                statusId: statusId
            });
        }

        if ([118, 110, 101].includes(statusId)) {
            me.sanction.suspectedSanction && me.sanction.setVisible(true);
        }

        [me.signDate, me.signRemark].forEach(item => {
            if ([108, 109].includes(statusId)) {
                item.setReadOnly(true);
                item.setDisabled(!me.deliveryInfoVisible);
                item.setVisible(me.deliveryInfoVisible);
            }
        })
        me.currentStatusField.setValue('<div class="status-field">' + statusName + '</div>');
    },
    //根据用户选择到不同的状态来进行不同内容的展示
    addContentBySelectedStatus: function (statusId) {
        var me = this,
            record = this.record;
        var shipmentInfo = me.getComponent('shipmentInfo');
        var shipmentBox = me.getComponent('shipmentBox');
        //var initDeliverItemComp = me.getComponent('initDeliverItemComp');
        var shipmentBoxView = me.getComponent('shipmentBoxView');
        var produceComponentInfos = me.getComponent('produceComponentInfos');
        var signDate = me.getComponent('signDate');
        var signRemark = me.getComponent('signRemark');

        if (Ext.Array.contains([106], statusId)) { //已装箱（待交收）
            if (shipmentInfo == null) {
                shipmentInfo = me.initShipmentInfo();
            }

            if (shipmentBox == null) {
                shipmentBox = me.initShipmentBox();
            }
            shipmentInfo.setVisible(me.orderDeliveryMethod !== 'ULGS');
            shipmentBox.setVisible(me.orderDeliveryMethod !== 'ULGS');

        } else {
            if (shipmentInfo && shipmentInfo.isVisible())
                shipmentInfo.setVisible(false);
            if (shipmentBox && shipmentBox.isVisible())
                shipmentBox.setVisible(false);
            shipmentBoxView && shipmentBoxView.setVisible(false);
        }


        if (Ext.Array.contains([106, 107], statusId)) {
            if (statusId == 107) {//设在107即已发货时，才显示发货日期
                var shipmentBoxView = me.getComponent('shipmentBoxView');
                shipmentBoxView && shipmentBoxView.setVisible(false);
            }
            if (shipmentInfo == null) {
                shipmentInfo = me.initShipmentInfo();
            }
            shipmentInfo.setVisible(me.deliveryInfoVisible);
            if (me.deliveryInfoVisible) {
                shipmentInfo.hideDeliveryDate(statusId)
            }
        } else {
            if (shipmentInfo && shipmentInfo.isVisible())
                shipmentInfo.setVisible(false);
        }

        if (statusId == 101) {
            me.getComponent('paidDate').setVisible(true);
            me.getComponent('paidDate').setValue(new Date());
        } else {
            me.getComponent('paidDate').setVisible(false);
        }
        if (statusId == 103) {
            if (produceComponentInfos == null) {
                produceComponentInfos = me.initProduceComponentInfos();
            }
            produceComponentInfos.setVisible(true);
        } else {
            if (produceComponentInfos && produceComponentInfos.isVisible())
                produceComponentInfos.setVisible(false);
        }

        //118 已排版,待审核
        var sanction = me.getComponent('sanction'),
            statusAudit = me.getComponent('statusAudit'),
            deliverItem = me.getComponent('deliverItem'),
            shippedDate = me.getComponent('shippedDate'),
            auditConfirm = me.getComponent('auditConfirm'),
            manufactureCenter = me.getComponent('manufactureCenter');
        if ([37681428, 119].includes(statusId)) {
            sanction.show();
            // deliverItem.isShowSanctionText(true);
            if (shippedDate) {
                shippedDate.show();
                auditConfirm.show();
                statusAudit.show();
                manufactureCenter.show();
            } else {
                me.initAudit();
            }
        } else {
            sanction.hide();
            // deliverItem.isShowSanctionText(false);
            if (shippedDate) {
                auditConfirm.hide();
                shippedDate.hide();
                statusAudit.hide();
                manufactureCenter.show();
            }
        }

        //42 订单取消
        var orderReject = me.getComponent('orderReject');
        if (statusId == 42) {
            if (orderReject) {
                orderReject.show()
                orderReject.setDisabled(false);
            } else {
                me.initRejectAudit();
            }
        } else {
            if (orderReject) {
                orderReject.hide()
                orderReject.setDisabled(true);
            }
        }

        //107 108 109 订单日期与备注
        [signDate, signRemark].forEach(item => {
            if ([108, 109].includes(statusId)) {
                signDate.diySetValue(new Date().getTime());
                item.show();
                item.setDisabled(false);
                item.setReadOnly(false);
                if ([109].includes(statusId)) {
                    item.setReadOnly(true);
                }
            } else {
                item.hide();
                item.setDisabled(true);
                item.setReadOnly(false);
            }
        })


        if (Ext.Array.contains([122], statusId)) {// 已交收（待发货）
            // 根据发货项判断 是否显示
            if (me.deliverItem.isVisible()) {
                shipmentInfo?.setVisible(false);
                shipmentBox?.setVisible(false);
            } else {
                if (shipmentInfo == null) {
                    shipmentInfo = me.initShipmentInfo();
                }

                if (shipmentBox == null) {
                    shipmentBox = me.initShipmentBox();
                }
                shipmentInfo.setVisible(false);
                shipmentBox.setVisible(me.deliveryInfoVisible);
            }
        }
    },
    initShipmentInfo: function () {
        var me = this,
            record = this.record,
            shipmentInfo = me.getComponent('shipmentInfo');
        if (Ext.isEmpty(shipmentInfo)) {
            shipmentInfo = Ext.widget({
                xtype: 'shipmentinfo',
                itemId: 'shipmentInfo',
                record: record,
                hidden: true,
                fieldLabel: i18n.getKey('shipmentInfo'),
                labelWidth: 120,
                width: 700,
                labelAlign: 'right'
            });
            me.insert(me.getHistoryIndex() + 1, shipmentInfo);
        }
        return shipmentInfo;
    },
    initShipmentBox: function () {
        var me = this,
            record = this.record;
        var shipmentBox = Ext.widget({
            xtype: 'shipmentbox',
            itemId: 'shipmentBox',
            width: 860,
            labelWidth: 120,
            record: me.record,
            labelAlign: 'right'
        });
        me.insert(me.getHistoryIndex() + 1, shipmentBox);
        return shipmentBox;
    },
    initDeliverItemComp: function () {
        var me = this,
            record = this.record;
        var shipmentBox = Ext.widget({
            xtype: 'deliveritemcomp',
            itemId: 'deliveritemcomp',
            width: 860,
            record: me.record,
            labelAlign: 'right'
        });
        me.insert(me.getHistoryIndex() + 1, shipmentBox);
        return shipmentBox;
    },
    initProduceComponentInfos: function () {
        var me = this,
            record = this.record;

        var initProduceComponentInfo = Ext.widget({
            xtype: 'fieldcontainer',
            itemId: 'produceComponentInfos',
            fieldLabel: i18n.getKey('排版待确认'),
            items: [{
                xtype: 'orderproducecomp',
                itemId: 'orderproducecomp',
                record: record
            }],
            hidden: true,
            //labelWidth: 120,
            width: 860,
            record: record,
            labelAlign: 'right'
        });
        me.insert(me.getHistoryIndex() + 1, initProduceComponentInfo);
        return initProduceComponentInfo;
    },
    initShipmentBoxView: function () {
        var me = this,
            record = this.record;

        var shipmentBox = Ext.widget({
            xtype: 'fieldcontainer',
            labelAlign: 'right',
            itemId: 'shipmentBoxView',
            fieldLabel: i18n.getKey('packageInfo'),
            items: [
                {
                    xtype: 'shipmentboxview',
                    itemId: 'shipmentBoxView',
                    width: 630,
                    record: me.record
                }
            ]
        });
        me.insert(me.getHistoryIndex() + 1, shipmentBox);
        return shipmentBox;
    },
    /**
     * 获取订单历史组件的位置，用于插入其他组件
     */
    getHistoryIndex: function () {
        var me = this;
        var index = 0;
        for (var i = 0; i < me.items.items.length; i++) {
            if (me.items.items[i].itemId = 'orderHistoriesContainer') {
                index = i;
            }
        }
        return index;
    },
    /**
     * 初始化订单审核通过的相关配置
     */
    initAudit: function () {
        var me = this,
            record = this.record,
            shippedDate = record?.get('shippedDate'),
            auditStatus = {
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
                    hide: function (comp) {
                        var reviewCategory = me.getComponent('reviewCategory');
                        var reviewAdvise = me.getComponent('reviewAdvise');
                        reviewCategory?.setVisible(false);
                        reviewAdvise?.setVisible(false);
                    },
                    show: function (comp) {
                        var isStatusAudit = comp?.getValue();

                        if (!isStatusAudit['statusAudit']) {
                            var reviewCategory = me.getComponent('reviewCategory');
                            var reviewAdvise = me.getComponent('reviewAdvise');
                            reviewCategory?.setVisible(true);
                            reviewAdvise?.setVisible(true);
                        }
                    },
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
                    },
                }
            },
            reviewCategory = {
                xtype: 'combo',
                name: 'reviewCategory',
                editable: false,
                readOnly: false,
                allowBlank: false,
                hidden: true,
                itemId: 'reviewCategory',
                fieldLabel: i18n.getKey('audit') + i18n.getKey('category'),
                valueField: 'value',
                displayField: 'display',
                value: record?.get('reviewCategory'),
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
            reviewAdvise = {
                xtype: 'textarea',
                name: 'reviewAdvise',
                itemId: 'reviewAdvise',
                hidden: true,
                width: 700,
                value: record?.get('reviewAdvise'),
                fieldLabel: i18n.getKey('auditComment'),
            },
            components = Ext.widget({
                xtype: 'datefield',
                name: 'shippedDate',
                itemId: 'shippedDate',
                readOnly: false,
                labelAlign: 'right',
                labelWidth: 125,
                tipInfo: '最晚发货日期',
                value: shippedDate ? new Date(shippedDate) : null,
                fieldLabel: i18n.getKey('限制出货日期'),
                diyGetValue: function () {
                    var date = this.getValue();
                    return date.getTime()

                }
            }),
            checkbox = {
                xtype: 'checkbox',
                name: 'auditConfirm',
                itemId: 'auditConfirm',
                width: 700,
                allowBlank: false,
                readOnly: false,
                checked: me.record,
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
            manufactureCenter = {
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
            };

        me.insert(14, [components, auditStatus, reviewCategory, reviewAdvise, checkbox, manufactureCenter]);
    },
    /**
     * 订单取消
     * 初始化订单审核不通过的相关配置
     */
    initRejectAudit: function () {
        var me = this;
        var record = this.record;
        var components = Ext.widget({
            xtype: 'uxfieldcontainer',
            itemId: 'orderReject',
            width: 800,
            name: 'orderReject',
            allowBlank: false,
            defaults: {
                margin: '5 0 10 0',
                labelWidth: 125,
                labelAlign: 'right',
                width: 500,
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'combo',
                    name: 'reviewCategory',
                    editable: false,
                    readOnly: false,
                    allowBlank: false,
                    itemId: 'reviewCategory',
                    fieldLabel: i18n.getKey('audit') + i18n.getKey('category'),
                    valueField: 'value',
                    displayField: 'display',
                    value: record?.get('reviewCategory'),
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
                    value: record?.get('reviewAdvise'),
                    fieldLabel: i18n.getKey('auditComment'),
                },
            ]
        });
        me.add(components);
    },
    /**
     * 打印标签
     */
    initPrintLabel: function (record) {
        var me = this;
        var status = record.get('status')
        var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var printLabel = toolbar.getComponent('printLabel');
        printLabel.setVisible(status.id == '106');
    }
});
