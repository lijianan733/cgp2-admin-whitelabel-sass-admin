/**
 * @Description:
 * @author nan
 * @date 2022/1/11
 */
Ext.define('CGP.orderstatusmodify.config.Config', {
    statics: {
        /*     后台各个状态拥有的action列表,即按钮配置
              nextStatus: 116,
             actionKey: ''
             */
        statusActionMapping: {
            '40': {
                saveBtnCfg: {}
            },
            '41': {
                saveBtnCfg: {
                    hidden: true,
                }
            },
            '42': {//不可生产,取消
                saveBtnCfg: {
                    hidden: true,
                }
            },
            '43': {
                saveBtnCfg: {}
            },
            '44': {
                saveBtnCfg: {}
            },
            '100': {
                saveBtnCfg: {
                    hidden: false,
                    text: '提交审核结果',
                    width: 120,
                    nextStatus: 102,//已审核（待排版）
                    actionKey: '',//根据数据决定actionKey
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        var order = form.record.raw;
                        var offlinePaymentStatus = order.offlinePaymentStatus
                        if (offlinePaymentStatus && offlinePaymentStatus.code == 'WAITING_CONFIRM_STATUS') {
                            //待审核状态
                            var win = Ext.create('Ext.window.Window', {
                                title: '确认付款信息',
                                modal: true,
                                constrain: true,
                                layout: 'fit',
                                items: [
                                    {
                                        xtype: 'errorstrickform',
                                        defaults: {
                                            width: 450,
                                            margin: '5 25'
                                        },
                                        itemId: 'form',
                                        items: [
                                            {
                                                xtype: 'hiddenfield',
                                                fieldLabel: 'orderId',
                                                itemId: 'orderId',
                                                name: 'orderId',
                                                value: JSGetQueryString('id')

                                            },
                                            {
                                                xtype: 'textarea',
                                                fieldLabel: '付款确认备注',
                                                itemId: 'remark',
                                                height: 80,
                                                name: 'remark',
                                                tipInfo: '该备注是只记录到付款时间线中，记录审核通过的确认信息<br>不会记录到订单状态历史里面'
                                            }
                                        ]
                                    }
                                ],
                                bbar: {
                                    xtype: 'bottomtoolbar',
                                    saveBtnCfg: {
                                        handler: function (btn) {
                                            var win = btn.ownerCt.ownerCt;
                                            var form = win.getComponent('form');
                                            var url = adminPath + `api/orders/${JSGetQueryString('id')}/payment/audit`;
                                            var jsonData = form.getValue();
                                            JSAjaxRequest(url, 'POST', true, jsonData, '审核完成', function (require, success, response) {
                                                if (success) {
                                                    var responseText = Ext.JSON.decode(response.responseText);
                                                    if (responseText.success) {
                                                        Ext.Msg.alert('提醒', '审核完成', function () {
                                                            win.close();
                                                            location.reload();
                                                        });
                                                    }
                                                }
                                            }, true);
                                        }
                                    }
                                }
                            });
                            win.show();


                        } else {
                            //待录入付款信息
                            if (form.isValid()) {
                                var orderId = JSGetQueryString('id');
                                var jsonData = form.getValue();
                                jsonData = jsonData.transaction_voucher_form;
                                console.log(jsonData);
                                var url = adminPath + `api/orders/${orderId}/payment/info`;
                                JSAjaxRequest(url, 'POST', true, jsonData, '上传完成', function (require, success, response) {
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        var controller = Ext.create('CGP.orderstatusmodify.controller.Controller');
                                        if (responseText.success) {
                                            Ext.Msg.alert('提醒', '录入凭证完成,且审核已通过.', function () {
                                                controller.loadOrderData(orderId, form);
                                            });

                                        }
                                    }
                                }, true);
                            }
                        }
                    }

                }
            },
            '101': {
                saveBtnCfg: {
                    hidden: false,
                    text: '提交审核结果',
                    width: 120,
                    nextStatus: 102,//已审核（待排版）
                    actionKey: '',//根据数据决定actionKey
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        if (form.isValid()) {
                            var formData = form.getValue();
                            var controller = Ext.create('CGP.orderstatusmodify.controller.Controller');
                            formData.statusId = formData.statusAudit ? 102 : 42;
                            var data = {
                                actionKey: formData.statusAudit ? 'Order_Review_Pass' : 'Order_Review_Reject',
                                data: formData,
                            };
                            JSClearNullValue(data);
                            //提交审核之前，校验订单项是否都选定报关分类
                            var isComplete = true;
                            var localCheck = true;
                            if (formData.statusAudit) {
                                var orderId = JSGetQueryString('id');
                                isComplete = controller.checkCustomElementComplete(orderId);
                                localCheck = controller.checkCustomInfo(form);
                            }
                            isComplete && localCheck ? controller.updateConfig(data, form) : Ext.Msg.alert('提示', `当前订单中有未选定报关分类的订单项，请检查配置。`, function () {
                                form.body.el.dom.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: 'smooth' // 可选，平滑滚动效果
                                });
                            });
                        }
                    }
                }
            },
            '102': {
                saveBtnCfg: {}
            },
            '103': {
                saveBtnCfg: {}
            },
            /*   已废弃
              '104': {//打印,待生产
                     saveBtnCfg: {
                         hidden: true,//这个状态由程序修改
                         nextStatus: 120,
                         actionKey: 'PRODUCTED_ASSEMBL_STATUS',
                         text: i18n.getKey('完成生产')
                     }
                 },*/
            '105': {
                saveBtnCfg: {}
            },
            '106': {
                //已交收（待发货）
                saveBtnCfg: {
                    nextStatus: 107,
                    actionKey: 'DELIVERED_STATUS',
                    hidden: false,
                    text: i18n.getKey('完成发货')
                },
                //打印标签
                printLabelBtnCfg: {
                    hidden: false,
                }
            },
            '107': {
                //发货（待签收）

                saveBtnCfg: {
                    nextStatus: 108,
                    actionKey: 'RECEIVED_STATUS',
                    hidden: false,
                    text: i18n.getKey('完成签收')
                },
                //打印标签
                printLabelBtnCfg: {
                    hidden: false,
                }
            },
            '108': {
                saveBtnCfg: {
                    nextStatus: 109,
                    actionKey: 'COMPLETED_STATUS',
                    hidden: false,
                    text: i18n.getKey('交易完成')
                },
                //打印标签
                printLabelBtnCfg: {
                    hidden: false,
                }
            },
            '109': {
                saveBtnCfg: {}
            },
            '110': {
                saveBtnCfg: {
                    hidden: false,
                    text: '提交审核结果',
                    width: 120,
                    nextStatus: 102,//已审核（待排版）
                    actionKey: '',//根据数据决定actionKey
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        if (form.isValid()) {
                            var formData = form.getValue();
                            var controller = Ext.create('CGP.orderstatusmodify.controller.Controller');
                            formData.statusId = formData.statusAudit ? 102 : 42;
                            var data = {
                                actionKey: formData.statusAudit ? 'Order_Review_Pass' : 'Order_Review_Reject',
                                data: formData,
                            };
                            JSClearNullValue(data);
                            //提交审核之前，校验订单项是否都选定报关分类
                            var isComplete = true;
                            var localCheck = true;
                            if (formData.statusAudit) {
                                var orderId = JSGetQueryString('id');
                                isComplete = controller.checkCustomElementComplete(orderId);
                                localCheck = controller.checkCustomInfo(form);
                            }
                            isComplete && localCheck ? controller.updateConfig(data, form) : Ext.Msg.alert('提示', `当前订单中有未选定报关分类的订单项，请检查配置。`, function () {
                                form.body.el.dom.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: 'smooth' // 可选，平滑滚动效果
                                });
                            });
                        }

                    }
                }
            },
            '111': {
                saveBtnCfg: {}
            },
            '112': {
                saveBtnCfg: {}
            },
            '113': {
                saveBtnCfg: {}
            },
            '114': {
                saveBtnCfg: {}
            },
            '115': {
                saveBtnCfg: {}
            },

            '224098': {
                saveBtnCfg: {}
            },
            '224101': {
                saveBtnCfg: {}
            },
            '240710': {
                saveBtnCfg: {}
            },
            '9358697': {
                saveBtnCfg: {}
            },
            '300': {//待确认订单
                saveBtnCfg: {
                    hidden: false,
                    nextStatus: 110,
                    actionKey: 'CONFIRMED_CHECK_STATUS',
                    text: i18n.getKey('完成确认')
                }
            },
            '301': {
                saveBtnCfg: {}
            },
            '116': {
                saveBtnCfg: {}
            },
            '117': {
                saveBtnCfg: {}
            },
            '118': {
                //已排版,待审核
                saveBtnCfg: {
                    hidden: false,
                    text: '提交审核结果',
                    width: 120,
                    nextStatus: 37681428,
                    actionKey: '',//根据数据决定actionKey
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        if (form.isValid()) {
                            var formData = form.getValue();
                            var controller = Ext.create('CGP.orderstatusmodify.controller.Controller');
                            formData.statusId = formData.statusAudit ? 37681428 : 42;
                            var data = {
                                actionKey: formData.statusAudit ? 'Order_Review_Pass' : 'Order_Review_Reject',
                                data: formData,
                            };
                            JSClearNullValue(data);
                            //提交审核之前，校验订单项是否都选定报关分类
                            var isComplete = true;
                            var localCheck = true;
                            if (formData.statusAudit) {
                                var orderId = JSGetQueryString('id');
                                isComplete = controller.checkCustomElementComplete(orderId);
                                localCheck = controller.checkCustomInfo(form);
                            }
                            isComplete && localCheck ? controller.updateConfig(data, form) : Ext.Msg.alert('提示', `当前订单中有未选定报关分类的订单项，请检查配置。`, function () {
                                form.body.el.dom.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: 'smooth' // 可选，平滑滚动效果
                                });
                            });
                        }

                    }
                }
            },
            //废弃
            /*    '119': {
                    //审核（待打印）
                    saveBtnCfg: {
                        hidden: false,
                        nextStatus: 104,//已打印,待生产
                        actionKey: 'PRINTED_STATUS',//根据数据决定actionKey
                        text: i18n.getKey('完成打印')
                    }
                },*/
            '120': {//已生产，待组装
                saveBtnCfg: {
                    hidden: false,
                    nextStatus: 121,//已组装，待装箱
                    actionKey: 'ASSEMBLED_BOX_STATUS',//根据数据决定actionKey
                    text: i18n.getKey('完成组装'),
                }
            },
            '121': {//已组装（待装箱）
                saveBtnCfg: {
                    hidden: false,
                    nextStatus: 122,
                    actionKey: 'BOXED_DELIVERY_STATUS',
                    text: i18n.getKey('完成装箱'),
                },
            },
            '122': {//已装箱,待交收
                saveBtnCfg: {
                    hidden: false,
                    nextStatus: 106,
                    actionKey: 'WAITING_DELIVERY_STATUS',
                    text: i18n.getKey('完成交收')
                },
            },
            '36585000': {}
        },
        //各个状态拥有的组件列表
        componentMapping: {
            common: [
                'orderLineInfo',
                'orderTotal',
                'orderNumber',
                'customerEmail',
                'datePurchased',
                'estimatedDeliveryDate',
                'shippingMethod',
                'deliveryNo',
                'deliveryAddress',
                'status',
                'statusHistories',
                'clazz',
                'outSendOrderItem',
                'deliverItem'
            ],
            '40': [],
            '41': [],
            '42': [
                'statusAudit',
                'auditConfirm',
                'manufactureCenter',
                'reviewCategory',
                'reviewAdvise',
                'shippedDate',
                'typeSetting'
            ],
            '43': [],
            '44': [
                'typeSetting'
            ],
            '100': [
                'splitbar',
                'transaction_voucher_form'
            ],
            '101': [
                'statusAudit',
                'auditConfirm',
                'manufactureCenter',
                'reviewCategory',
                'reviewAdvise',
                'shippedDate',
                'typeSetting',
                'comment',
                'sanction'
            ],
            '102': [],
            '103': [
                'typeSetting'
            ],
            '104': [
                'typeSetting'
            ],
            '105': [],
            '106': [
                'shipmentInfo',
                'shipmentBoxes',
                'typeSetting'
            ],
            '107': [
                'shipmentInfo',
                'shipmentBoxes',
                'typeSetting',
                'signRemark',
                'signDate'
            ],
            '108': [
                'typeSetting',
                'signRemark',
                'signDate'
            ],
            '109': [
                'typeSetting',
                'signRemark',
                'signDate'
            ],
            '110': [
                'statusAudit',
                'auditConfirm',
                'manufactureCenter',
                'reviewCategory',
                'reviewAdvise',
                'shippedDate',
                'typeSetting',
                'comment',
                'sanction'
            ],
            '111': [],
            '112': [],
            '113': [
                'typeSetting'
            ],
            '114': [],
            '115': [],
            '300': [],
            '224098': [],
            '224101': [],
            '240710': [],
            '9358697': [],
            '301': [],
            '116': [],
            '117': [],
            '118': [
                'statusAudit',
                'auditConfirm',
                'manufactureCenter',
                'reviewCategory',
                'reviewAdvise',
                'shippedDate',
                'typeSetting',
                'comment',
                'sanction'
            ],//排版（待审核）
            '119': [
                'typeSetting'
            ],
            '120': [
                'typeSetting'
            ],
            '121': [
                'shipmentBoxes',
                'typeSetting'
            ],
            '122': [
                'shipmentInfo',
                'shipmentBoxes',
                'typeSetting'
            ],
            '37681428': [
                'typeSetting'
            ],
            //已退款
            '36585000': []
        }
    }
})