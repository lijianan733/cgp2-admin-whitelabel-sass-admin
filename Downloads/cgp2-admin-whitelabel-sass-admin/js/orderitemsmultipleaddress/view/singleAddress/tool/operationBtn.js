/**
 * @author xiu
 * @date 2023/8/24
 */

Ext.define('CGP.orderitemsmultipleaddress.view.singleAddress.tool.operationBtn', {
    extend: 'Ext.button.Button',
    alias: 'widget.operationBtn',
    isMain: true,
    page: null,
    record: null,
    permissions: null,
    controller: Ext.create('CGP.order.controller.Order'),
    initComponent: function () {
        var me = this,
            {page, record, controller, permissions, adb} = me,
            //supplierIsEmpty = Ext.isEmpty(record.get('producePartner')),//是否已经分配供应商，若已经分配，则禁用部分功能
            statusId = record.get('statusId'),
            orderId = record.get('id'),
            orderNumber = record.get('orderNumber'),
            // 生产中及之后的状态
            paiBanIngState = [9358697, 120, 121, 122, 106, 107, 108, 109],
            deliveryOrderShow = [120, 121, 122, 106, 107, 108, 109].includes(statusId),
            shipmentRequirementShow = [40, 100, 101, 300, 116, 44, 113, 118, 42, 37681428, 9358697].includes(statusId),
            isSuccessPay = record.get('isSuccessPay'),
            partnerType = record.get('partnerType'),
            currency = record.get('currency'),
            type = record.get('type'),//订单类型
            isAllowModifyPrice = true;//是否允许修改价格

        //外部partner的订单只能在已付款之前修改，
        //partnerType: "EXTERNAL"外部 'INTERNAL': '内部',内部partner的可以随时改，待处理和待付款两个状态下
        isAllowModifyPrice = isAllowModifyPrice === 'INTERNAL' ? true : Ext.Array.contains([300, 100], statusId);

        me.menu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: i18n.getKey('修改状态'),
                    menu: [
                        //修改状态
                        {
                            text: i18n.getKey('modifyStatus'),
                            hidden: !permissions.checkPermission('modifyStatus') /*|| !supplierIsEmpty*/,
                            handler: function () {
                                JSOpen({
                                    id: 'modifyOrderStatus',
                                    url: path + 'partials/order/status.html' +
                                        '?id=' + record.get('id') +
                                        '&isRedo=' + record.get('isRedo') +
                                        '&statusId=' + statusId +
                                        '&orderNumber=' + orderNumber,
                                    title: i18n.getKey('order') + ' ' + i18n.getKey('modifyStatus'),
                                    refresh: true
                                })
                            }
                        },
                        //生产详细
                        {
                            text: i18n.getKey('生产详细'),
                            handler: function () {
                                JSOpen({
                                    id: 'modifyStatusV2',
                                    url: path + 'partials/orderstatusmodify/main.html' +
                                        '?id=' + record.get("id") +
                                        '&orderNumber=' + record.get("orderNumber"),
                                    title: i18n.getKey('生产详细'),
                                    refresh: true
                                })

                            }
                        },
                    ]
                },
                {
                    text: i18n.getKey('修改订单信息'),
                    menu: [
                        //修改客户
                        {
                            text: i18n.getKey('modifyCustomer'),
                            hidden: !permissions.checkPermission("modifyCustomer") /*|| !supplierIsEmpty*/ || !(Ext.Array.contains([100], Number(record.get('statusId')))),
                            handler: function () {
                                JSOpen({
                                    id: 'modifyCustomer',
                                    url: path + 'partials/order/modifycustomer.html?id=' + record.get("id"),
                                    title: i18n.getKey('modifyCustomer'),
                                    refresh: true
                                });
                            }
                        },
                        /*   //修改订单金额
                           {
                               text: i18n.getKey('modifyOrderPrice'),
                               hidden: !permissions.checkPermission("modifyOrderTotal") /!*|| !supplierIsEmpty*!/ || (Ext.Array.contains([100, 300], record.get('statusId'))),
                               handler: function () {
                                   controller.showModifyOrderTotalWindow(record.get('id'))
                               }
                           },*/
                        //修改地址 (注释原因: 现已设计为只能在发货要求修改地址)
                        /* {
                             text: i18n.getKey('modifyAddress'),
                             hidden: !permissions.checkPermission('modifyAddress')/!* || !supplierIsEmpty *!/ || (Ext.Array.contains([41, 42, 107, 108, 109], (record.get('statusId')))) || record.get('orderType') == 'RM',
                             handler: function () {
                                 JSOpen({
                                     id: 'modifyAddressStatus',
                                     url: path + 'partials/order/address.html?orderId=' + record.get('id'),
                                     title: i18n.getKey('modifyAddress'),
                                     refresh: true
                                 })
                             }
                         },*/
                        /*   //修改支付方式
                           {
                               text: i18n.getKey('modifyPaymentMethod'),
                               hidden: !permissions.checkPermission('modifyPaymentMethod') /!*|| !supplierIsEmpty*!/ || !(Ext.Array.contains([100, 40], (record.get('statusId')))),
                               handler: function () {
                                   JSOpen({
                                       id: 'modifyPaymentMethod',
                                       url: path + 'partials/order/payment.html?orderId=' + record.get('id'),
                                       title: i18n.getKey('modifyPaymentMethod'),
                                       refresh: true
                                   })
                               }
                           },*/
                        //修改订单备注
                        {
                            text: i18n.getKey('modifyOrderRemark'),
                            /*
                                                        hidden: !supplierIsEmpty,
                            */
                            handler: function () {
                                controller.modifyOrderRemark(record);
                            }
                        },
                        //修改订单项价格和数量

                        {
                            text: i18n.getKey('修改订单价格'),
                            hidden: !isAllowModifyPrice,
                            menu: [
                                {
                                    text: '修改发货项价格与数量',
                                    handler: function () {
                                        JSOpen({
                                            id: 'modifyPrice',
                                            url: path + 'partials/orderpricemodify/Main.html' +
                                                '?orderId=' + record.get('id') +
                                                '&type=item' +
                                                '&orderType=' + type +
                                                '&currencySymbol=' + currency.symbolLeft,
                                            title: i18n.getKey('修改发货项价格与数量'),
                                            refresh: true
                                        });
                                    }
                                },
                                {
                                    text: '修改订单总价',
                                    handler: function () {
                                        JSOpen({
                                            id: 'modifyPrice',
                                            url: path + 'partials/orderpricemodify/Main.html' +
                                                '?orderId=' + record.get('id') +
                                                '&type=total' +
                                                '&orderType=' + type +
                                                '&currencySymbol=' + currency.symbolLeft,
                                            title: i18n.getKey('修改订单总价'),
                                            refresh: true
                                        });
                                    }
                                },
                                {
                                    text: '价格修改历史记录',
                                    handler: function () {
                                        me.showModifyPriceHistory(orderId, currency, type);
                                    }
                                }
                            ]
                        },
                        /*    //订单重做
                            {
                                text: i18n.getKey('orderRedo'),
                                hidden: /!*!supplierIsEmpty ||*!/ record.get('statusId') !== 240710,
                                handler: function () {
                                    Ext.create('CGP.order.view.order.OrderRedo', {
                                        order: record,
                                        page: page
                                    });
                                }
                            },*/
                        //订单重做
                        {
                            text: i18n.getKey('orderRedo'),
                            hidden: 108 !== record.get('statusId'),
                            handler: function () {
                                JSOpen({
                                    id: 'redoetails',
                                    url: path + 'partials/orderredo/edit.html' +
                                        '?id=' + record.get("id") +
                                        '&status=' + record.get('statusId'),
                                    title: i18n.getKey('order') + i18n.getKey('redo') + '(' + i18n.getKey('orderNumber') + ':' + record.get("orderNumber") + ')',
                                    refresh: true
                                });
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('发货'),
                    hidden: !shipmentRequirementShow && !deliveryOrderShow,
                    menu: [
                        //查看发货要求
                        {
                            text: i18n.getKey('check') + i18n.getKey('shipmentRequirement'),
                            hidden: !shipmentRequirementShow,
                            handler: function () {
                                JSOpen({
                                    id: 'shipmentrequirementpage',
                                    url: path + 'partials/shipmentrequirement/main.html?orderNumber=' + record.get('orderNumber'),
                                    title: i18n.getKey('shipmentRequirement'),
                                    refresh: true
                                })
                            }
                        },
                        //查看发货订单
                        {
                            text: i18n.getKey('check') + i18n.getKey('deliveryOrder'),
                            hidden: !deliveryOrderShow,
                            handler: function () {
                                JSOpen({
                                    id: 'deliveryorderpage',
                                    url: path + 'partials/deliveryorder/main.html?orderNumber=' + record.get('orderNumber'),
                                    title: i18n.getKey('deliveryOrder'),
                                    refresh: true
                                })
                            }
                        },
                        {
                            text: i18n.getKey('导出发货信息(4px)'),
                            hidden: !deliveryOrderShow,
                            handler: function () {
                                var me = this;
                                Ext.Msg.confirm(i18n.getKey('prompt'), '确认导出', function (id) {
                                    if (id === 'yes') {
                                        var mask = new Ext.LoadMask(page, {
                                            msg: "加载中..."
                                        });
                                        mask.show();
                                        var url = adminPath + 'api/orders/exportExcel/shipment?orderNumber=' + record.get('orderNumber');
                                        var x = new XMLHttpRequest();
                                        x.open("POST", url, true);
                                        x.setRequestHeader('Content-Type', 'application/json');
                                        x.setRequestHeader('Access-Control-Allow-Origin', '*');
                                        x.setRequestHeader('Authorization', 'Bearer ' + Ext.util.Cookies.get('token'));
                                        x.responseType = 'blob';
                                        x.onload = function (e) {
                                            if (x.status == 200) {
                                                console.log(x.response.type);
                                                const blob = new Blob([x.response], {type: x.response.type});
                                                var url = window.URL.createObjectURL(blob)
                                                var a = document.createElement('a');
                                                mask.hide();
                                                a.href = url
                                                a.download = 'shipmentInfo(' + record.get('orderNumber') + ')'
                                                a.click()
                                            } else {
                                                mask.hide();
                                                Ext.Msg.alert(i18n.getKey('prompt'), '网络请求错误')
                                            }
                                        }
                                        x.send(Ext.encode({}));
                                    }
                                });
                            }
                        }
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            comp.setVisible(shipmentRequirementShow || deliveryOrderShow);
                        }
                    }
                },
                //退款申请
                {
                    text: i18n.getKey('创建退款申请'),
                    disabledCls: 'menu-item-display-none',
                    disabled: !permissions.checkPermission('refundApply') || !isSuccessPay,
                    /*|| !supplierIsEmpty*/
                    menu: [
                        //WhiteLabelOrder  partnerType : "EXTERNAL" 外部订单
                        {
                            text: '创建WhiteLabelOrder退款申请',
                            hidden: partnerType != 'EXTERNAL',
                            handler: function () {
                                var orderId = record.getId();
                                JSOpen({
                                    id: 'orderrefund_edit',
                                    url: path + 'partials/orderrefund/edit.html' +
                                        '?orderId=' + orderId +
                                        '&refundOrderType=WhiteLabelOrder',
                                    title: i18n.getKey('创建WhiteLabelOrder退款申请'),
                                    refresh: true
                                });
                            }
                        },
                        //SalesOrder,内部partner下的单
                        //partnerType : "INTERNAL" 内部订单
                        //不给创建WhiteLabelOrder退款申请
                        {
                            text: '创建SalesOrder退款申请',
                            hidden: partnerType != 'INTERNAL',
                            handler: function () {
                                var orderId = record.getId();
                                JSOpen({
                                    id: 'orderrefund_edit',
                                    url: path + 'partials/orderrefund/edit.html' +
                                        '?orderId=' + orderId +
                                        '&refundOrderType=SalesOrder',
                                    title: i18n.getKey('创建SalesOrder退款申请'),
                                    refresh: true
                                });
                            }
                        }
                    ],
                },
                {
                    text: i18n.getKey('查看退款申请'),
                    disabledCls: 'menu-item-display-none',
                    disabled: !permissions.checkPermission('refundApply')
                        /*|| !supplierIsEmpty*/
                        || !isSuccessPay
                        || (Ext.Array.contains([40, 41, 100], (record.get('statusId')))),
                    handler: function () {
                        var orderNumber = record.get('orderNumber');
                        JSOpen({
                            id: 'orderrefundpage',
                            url: path + 'partials/orderrefund/main.html' +
                                '?orderNumber=' + orderNumber,
                            title: i18n.getKey('退款申请'),
                            refresh: true
                        })
                    }
                },
                {
                    text: i18n.getKey('其他操作'),
                    hidden: (statusId !== 107) && (!Ext.Array.contains([105, 122, 121], record.get('statusId'))) && (paiBanIngState.includes(statusId)),
                    menu: [
                        /*        //打印发票
                                {
                                    text: i18n.getKey('printInvoice'),
                                    hidden: !permissions.checkPermission('printInvoice') || (Ext.Array.contains([41, 42, 43, 300], (record.get('statusId')))),
                                    handler: function () {
                                        /!*  var url = adminPath + 'api/order/reports/pdf/Invoice?orderId=' + record.get('id') + '&access_token=' + Ext.util.Cookies.get('token');
                                         window.open(url);*!/
                                        var url = adminPath + 'api/order/reports/pdf?orderId=' + record.get('id');
                                        JSAjaxRequest(url, 'POST', true, {
                                            reportName: 'Invoice'
                                        }, '', function (require, success, response) {
                                            var resp = Ext.JSON.decode(response.responseText);
                                            if (resp.success) {
                                                window.open(resp.data);
                                            } else {
                                            }
                                        });
                                    }
                                },
                                //单据打印
                                {
                                    text: i18n.getKey('voacherPrint'),
                                    handler: function () {
                                        var shippingCode = record.get('shippingModuleCode');
                                        if (shippingCode === 'Standard' || shippingCode === 'Express') {
                                            Ext.Msg.alert(i18n.getKey('prompt'), '不支持' + record.get('shippingMethod') + '的邮递标签打印！');
                                            return;
                                        }
                                        if (!shippingCode) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), '订单未配置运输方式！');
                                            return;
                                        }
                                        var ids = [record.get('id')];
                                        var url = adminPath + 'api/order/reports/pdf?ids=' + ids.join(',');
                                        var jsonData = {
                                            reportName: 'Shipping-' + shippingCode,
                                            isNeedOrderItems: false
                                        };
                                        JSAjaxRequest(url, 'POST', true, jsonData, false, function (require, success, response) {
                                            if (success) {
                                                var resp = Ext.JSON.decode(response.responseText);
                                                if (resp.success) {
                                                    var url = '';
                                                    url = path + 'js/common/pdfpreview/web/viewer.html?file=' + encodeURIComponent(resp.data);
                                                    JSOpenWin({
                                                        title: i18n.getKey('addressLabel'),
                                                        url: url,
                                                        height: 350,
                                                        width: 700,
                                                        modal: true
                                                    });
                                                }
                                            }
                                        }, true)

                                    }
                                },*/
                        //订单签收
                        {
                            text: i18n.getKey('signOrder'),
                            hidden: statusId !== 107,
                            handler: function () {
                                JSOpen({
                                    id: 'orderSign',
                                    url: path + 'partials/ordersign/OrderSign.html' +
                                        '?id=' + record.get("id") +
                                        '&orderNumber=' + record.get("orderNumber") +
                                        '&bindOrderNumber=' + record.get("orderNumber"),
                                    title: i18n.getKey('订单签收') + `(订单号:${record.get("orderNumber")})`,
                                    refresh: true
                                })
                            }
                        },
                        //查看地址标签
                        {
                            text: i18n.getKey('printAddressLabel'),
                            hidden: !Ext.Array.contains([105, 122, 121], record.get('statusId')),
                            handler: function () {
                                var mask = new Ext.LoadMask(page, {
                                    msg: "加载订单数据中，请等待..."
                                });
                                mask.show();
                                var partnerId = record.get('partnerId');
                                if (partnerId === 200784) {
                                    mask.hide();
                                    var url = path + 'js/common/pdfpreview/web/viewer.html' +
                                        '?file=' + encodeURIComponent(adminPath + 'api/plugin/chinapost/orders/reports/pdf/AddressLabel?id=' + record.get('id') + '&access_token=' + Ext.util.Cookies.get('token'));
                                    JSOpenWin({
                                        title: i18n.getKey('addressLabel'),
                                        url: url,
                                        height: 350,
                                        width: 700,
                                        modal: true
                                    });
                                } else {
                                    Ext.Ajax.request({
                                        method: 'POST',
                                        url: adminPath + 'api/order/reports/pdf?id=' + record.get('id'),
                                        timeout: 300000,
                                        headers: {
                                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                        },
                                        jsonData: {
                                            reportName: 'AddressLabel',
                                            isNeedOrderItems: false
                                        },
                                        success: function (response) {
                                            mask.hide();
                                            var resp = Ext.JSON.decode(response.responseText);
                                            if (resp.success) {
                                                var url = '';
                                                url = path + 'js/common/pdfpreview/web/viewer.html?file=' + encodeURIComponent(resp.data);
                                                JSOpenWin({
                                                    title: i18n.getKey('addressLabel'),
                                                    url: url,
                                                    height: 350,
                                                    width: 700,
                                                    modal: true
                                                });
                                            } else {

                                            }
                                        },
                                        failure: function (response) {
                                            mask.hide();
                                            var resp = Ext.JSON.decode(response.responseText);
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                        }
                                    })
                                }

                            }
                        },
                        //重排订单 仅在生产中状态前生效
                        {
                            text: i18n.getKey('重排订单'),
                            hidden: paiBanIngState.includes(statusId),
                            handler: function () {
                                var orderItemUrl = composingPath + 'api/composing/lastProgresses?' +
                                        'page=1' +
                                        '&limit=100000' +
                                        `&filter=[{"name":"orderNumber","value":"${orderNumber}","type":"string"}]`,
                                    queryData = JSGetQuery(orderItemUrl),
                                    orderItemIds = [];

                                queryData?.forEach(item => {
                                    var {status} = item;
                                    if (status === 'FAILURE'){
                                        orderItemIds.push(item['_id']);
                                    }
                                })

                                controller.createRetryOrderWindow(record, orderItemIds);

                            }
                        }
                    ]
                },
                //查看订单项
                {
                    text: i18n.getKey('checkOrderLineItem'),
                    handler: function () {
                        JSOpen({
                            id: 'orderlineitempage',
                            url: path + 'partials/orderlineitem/orderlineitem.html' +
                                '?orderNumber=' + record.get('orderNumber') +
                                '&isTest2=' + record.get('isTest'),
                            title: '订单项管理 所有状态',
                            refresh: true
                        })
                    }
                },
                //订单销售SKU统计
                {
                    text: i18n.getKey('订单销售SKU统计'),
                    handler: function (btn) {
                        var controller = Ext.create('CGP.orderitemsmultipleaddress.controller.Controller');
                        controller.createOrderSellSKUStatisticsGridWindow(orderId);
                    }
                },
                //订单详情
                {
                    text: i18n.getKey('订单项排版详情'),
                    handler: function () {
                        JSOpen({
                            id: 'shipmentItemTypeSetting',
                            url: path + "partials/orderstatusmodify/ShipmentItemTypeSetting.html" +
                                "?configId=" + orderId +
                                "&pageType=" + 'orderId',
                            title: '订单项排版详情',
                            refresh: true
                        });
                    }
                },
                //订单详情
                {
                    text: i18n.getKey('orderDetails'),
                    hidden: !permissions.checkPermission('orderDetails'),
                    handler: function () {
                        var status = 1;
                        var website = record.get('website')?.code;
                        JSOpen({
                            id: 'orderDetails',
                            url: path + 'partials/orderitemsmultipleaddress/main.html?id=' + record.get('id') + '&status=' + status + '&website=' + website + '&orderNumber=' + orderNumber,
                            title: i18n.getKey('orderDetails') + '(' + i18n.getKey('orderNumber') + ':' + record.get('orderNumber') + ')',
                            refresh: true
                        });
                    }
                },
                // 多订单详情
                {
                    text: i18n.getKey('多订单详情'),
                    disabledCls: 'menu-item-display-none',
                    hidden: !me.isMain,
                    // disabled: !permissions.checkPermission('orderDetails'),
                    handler: function () {
                        var status = 1;
                        var website = record.get('website')?.code;
                        JSOpen({
                            id: 'orderDetails',
                            url: path + 'partials/orderitemsmultipleaddress/main.html?id=' + record.get('id') + '&status=' + status + '&website=' + website + '&orderNumber=' + orderNumber,
                            title: i18n.getKey('orderDetails') + '(' + i18n.getKey('orderNumber') + ':' + record.get('orderNumber') + ')',
                            refresh: true
                        });
                    }
                },

                //绑定订单
                {
                    text: i18n.getKey('bindOrder'),
                    // hidden: !supplierIsEmpty || !record.get('partnerId'),
                    hidden: true,
                    handler: function () {
                        Ext.create('CGP.order.view.order.BindOrder', {
                            orderId: record.get('id')
                        }).show();
                    }
                },

                /*       //查看成品项
                       {
                           text: i18n.getKey('checkFinalProduct'),
                           // hidden: !(Ext.Array.contains([103, 104, 105, 106, 400, 401, 402], (record.get('status').id))),
                           hidden: true,
                           handler: function () {
                               JSOpen({
                                   id: 'finishedproductitempage',
                                   url: path + "partials/finishedproductitem/finishedproductitem.html" +
                                       "?excludeStatusIds=241635" +
                                       "&orderNumber=" + record.get('orderNumber'),
                                   title: '成品项管理 生产中',
                                   refresh: true
                               });
                           }
                       },*/

                //分配订单的供应商
                {
                    text: i18n.getKey('selectSupplier'),
                    // hidden: !supplierIsEmpty || !(Ext.Array.contains([103, 300, 100, 101, 40, 301, 102, 113], (record.get('status').id))),
                    hidden: true,
                    handler: function () {
                        controller.showSelectProducerWindow(record.get('id'), record.get('id'), store);
                    }
                },
            ]
        });
        me.callParent();
    },
    /**
     * 显示订单价格修改历史
     */
    showModifyPriceHistory: function (orderId, currency, orderType) {
        var me = this,
            store = Ext.create('Ext.data.Store', {
                fields: ['time', 'createdBy', 'user', 'remark', '_id'],
                pageSize: 25,
                autoLoad: true,
                remoteSort: false,
                sorters: [{
                    property: 'createdDate',
                    direction: 'DESC'
                }],
                proxy: {
                    type: 'uxrest',
                    url: adminPath + 'api/orderPriceAndQtyModifiedHistories',
                    reader: {
                        type: 'json',
                        root: 'data.content'
                    },
                    extraParams: {
                        filter: Ext.JSON.encode([{name: "order._id", value: orderId, type: "string"}])
                    }
                },
            }),
            win = Ext.create('Ext.window.Window', {
                title: '订单价格修改记录',
                modal: true,
                constrain: true,
                layout: 'fit',
                width: 600,
                height: 350,
                items: [{
                    xtype: 'grid',
                    emptyText: '无修改记录',
                    itemId: 'grid',
                    autoScroll: true,
                    store: store,
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            xtype: 'atagcolumn',
                            text: '编号',
                            dataIndex: '_id',
                            clickHandler: function (value) {
                                JSOpen({
                                    id: 'modifyPriceHistory',
                                    url: path + 'partials/orderpricemodify/History.html' +
                                        '?orderId=' + orderId +
                                        '&type=history' +
                                        '&orderType=' + orderType +
                                        '&id=' + value +
                                        '&currencySymbol=' + currency.symbolLeft,
                                    title: i18n.getKey('订单价格修改记录'),
                                    refresh: true
                                });
                            }
                        },
                        {
                            text: '修改人',
                            dataIndex: 'user',
                            width: 250,
                            renderer: function (value) {
                                return value.emailAddress + '(' + value.id + ')';
                            }
                        },
                        {
                            text: '修改时间',
                            dataIndex: 'time',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                var date = new Date(value);
                                metadata.style = "color: gray";
                                value = Ext.Date.format(date, 'Y/m/d H:i');
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return '<div style="white-space:normal;">' + value + '</div>';
                            }
                        }
                    ]
                }]
            });
        win.show();
    }
})
