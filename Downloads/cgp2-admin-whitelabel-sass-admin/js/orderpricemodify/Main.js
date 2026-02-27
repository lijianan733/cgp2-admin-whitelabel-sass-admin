/**
 * @Description: 订单项数量必须大于0,
 * 订单项若需要取消，则手动修改订单项状态
 *
 * 订单类型
 * 'NORMAL': '普通订单',
 * 'PARTNER_SAMPLE': 'SAMPLE订单',
 * 'ONE_DRAGON': '一条龙订单',
 * 'PROOFING': '打样订单'
 * 一条龙订单和打样订单都按照sample订单走
 *
 * @author nan
 * @date 2024/8/21
 */
Ext.Loader.syncRequire([
    'CGP.orderpricemodify.view.AddressFieldSet',
    'CGP.orderpricemodify.config.Config',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.splitBarTitle'
])
Ext.onReady(function () {
    var type = JSGetQueryString('type');//item,total修改订单项还是直接修改总价
    var orderId = JSGetQueryString('orderId');//item,total修改订单项还是直接修改总价
    var currencySymbol = JSGetQueryString('currencySymbol');//item,total修改订单项还是直接修改总价
    var controller = Ext.create('CGP.orderpricemodify.controller.Controller');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                name: 'form',
                type: type,
                defaults: {
                    margin: '5 25',
                    align: 'center',
                    width: '95%'
                },
                layout: {
                    type: 'auto',
                    align: 'center',
                    pack: 'center'
                },
                bodyStyle: {
                    borderColor: 'silver'
                },
                items: [],
                bbar: {
                    xtype: 'errorstrickform',
                    itemId: 'orderSummary',
                    name: 'orderSummary',
                    layout: 'column',
                    defaults: {
                        columnWidth: 0.25,
                        margin: '5 25',
                        allowBlank: false,
                        diySetValue: function (data) {
                            this.setValue(parseFloat(Number(data).toFixed(2)));
                        },
                    },
                    bodyStyle: {
                        borderColor: 'silver'
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: '产品金额' + `(${currencySymbol})`,
                            itemId: 'productsAmount',
                            name: 'productsAmount'
                        },

                        {
                            xtype: 'atag_displayfield',
                            itemId: 'batchModificationPrice',
                            value: type === 'item' ? '批量修改单价' : '',
                            disabled: true,
                            readOnly: true,
                            tooltip: '需等待所有项展开完毕才能使用!',
                            diySetValue: function () {

                            },
                            clickHandler: function (field) {
                                if (!field.disabled) {
                                    var form = field.ownerCt.ownerCt;
                                    Ext.create('CGP.orderpricemodify.view.ModifySkuProductPriceWin', {
                                        type: 'saleOrder',
                                        title: '批量修改所有发货项内Sku产品价格',
                                        outForm: form,
                                        orderId: JSGetQueryString('orderId'),
                                    }).show();
                                }
                            }
                        },
                        {
                            xtype: 'displayfield',
                            columnWidth: 0.5,
                            diySetValue: function () {

                            },
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'importService总额' + `(${currencySymbol})`,
                            itemId: 'importService',
                            name: 'importService',
                            diySetValue: function (data) {
                                console.log(data),
                                    this.setValue(data);
                            }
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: '总折扣' + `(${currencySymbol})`,
                            itemId: 'discountAmount',
                            name: 'discountAmount'
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: '总运费' + `(${currencySymbol})`,
                            itemId: 'shippingPrice',
                            name: 'shippingPrice'
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: '总税费' + `(${currencySymbol})`,
                            itemId: 'tax',
                            name: 'tax'
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: '总附加费用' + `(${currencySymbol})`,
                            itemId: 'paddingPrice',
                            name: 'paddingPrice'
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: '总金额' + `(${currencySymbol})`,
                            itemId: 'totalAmount',
                            name: 'totalAmount'
                        },
                        {
                            xtype: type !== 'item' ? 'numberfield' : 'displayfield',
                            fieldLabel: '总金额折扣' + `(${currencySymbol})`,
                            hidden: type === 'item',
                            itemId: 'totalAmountDiscount',
                            name: 'totalAmountDiscount',
                            vtype: 'nonNegative',
                            msgTarget: 'side',
                            checkChangeBuffer: 500,//0.5秒检查一次改变
                            diySetValue: function (data) {
                                var me = this;
                                if (Ext.isEmpty(data)) {
                                    data = 0;
                                }
                                me.setValue(data);
                            },
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    var totalAmount = field.ownerCt.getComponent('totalAmount').getValue();
                                    field.maxValue = totalAmount;
                                    if (field.isValid()) {
                                        JSSetLoading(true, '处理中...');
                                        setTimeout(function () {
                                            var finalTotalAmount = field.ownerCt.getComponent('finalTotalAmount');
                                            finalTotalAmount.diySetValue(Number(totalAmount) - Number(newValue));
                                            JSSetLoading(false);
                                        }, 500);

                                    }
                                },
                            }
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: `最终应付总金额` + `(${currencySymbol})`,
                            hidden: type === 'item',
                            itemId: 'finalTotalAmount',
                            name: 'finalTotalAmount',
                            diySetValue: function (data) {
                                if (!Ext.isEmpty(data)) {
                                    this.setValue(parseFloat(Number(data).toFixed(2)));
                                } else {

                                }
                            },
                        }
                    ],
                    bbar: {
                        items: [
                            {
                                text: '确定修改',
                                iconCls: 'icon_save',
                                handler: function (btn) {
                                    var bottomForm = btn.ownerCt.ownerCt;
                                    var form = bottomForm.ownerCt;
                                    var totalAmount = '';
                                    if (type === 'item') {
                                        totalAmount = bottomForm.getComponent('totalAmount').getValue();
                                    } else if (type === 'total') {
                                        totalAmount = bottomForm.getComponent('finalTotalAmount').getValue();
                                    }
                                    //遍历当前页面的输入组件
                                    var isValid = form.isValid();
                                    if (isValid === true) {
                                        Ext.Msg.confirm('提醒',
                                            `最终应付总金额为：<font color="red" style="font-weight: bold">${currencySymbol}${totalAmount}</font>;` +
                                            `是否确定修改?`, function (selector) {
                                                if (selector === 'yes') {
                                                    controller.modifyPrice(orderId, type, bottomForm, form);
                                                }
                                            });
                                    } else {
                                        Ext.Msg.alert('提示', '当前表单有非法输入值.');
                                    }
                                }
                            },
                            {
                                text: '返回列表',
                                iconCls: 'icon_grid',
                                handler: function () {
                                    JSOpen({
                                        id: 'page',
                                        url: path + 'partials/order/order.html?statusId=100&paymentModuleCode=PayPal'
                                    });
                                }
                            },
                            {
                                text: '刷新',
                                iconCls: 'icon_refresh',
                                handler: function () {
                                    location.reload();
                                }
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('展开所有'),
                                iconCls: 'icon_expandAll',
                                isExpandAll: true,
                                isSuspendExpand: false,
                                itemId: 'expandAll',
                                externalHandler: function (btn, callBack) {
                                    var form = btn.ownerCt.ownerCt,
                                        page = form.ownerCt,
                                        text = btn.isExpandAll ? '折叠所有' : '展开所有',
                                        executionText = btn.isExpandAll ? '正在展开' : '正在折叠',
                                        iconCls = btn.isExpandAll ? 'icon_collapseAll' : 'icon_expandAll',
                                        items = page.items.items,
                                        result = items.filter((item, index) => {
                                            return item.collapsed === btn.isExpandAll;
                                        }),
                                        completed = 0; // 计数器

                                    btn.setDisabled(true);


                                    if (result.length) {
                                        result.forEach((item, index) => {
                                            var expandLength = items.length - result.length;
                                            setTimeout(() => {
                                                item.setExpanded(btn.isExpandAll);

                                                completed++; // 每次完成一个项，计数加一
                                                btn.setText(`${executionText} ${expandLength + index + 1}/${items.length}`);

                                                // 检查是否所有项都已完成
                                                if (completed === result.length) {
                                                    btn.isExpandAll = !btn.isExpandAll; // 所有项完成后再切换状态
                                                    btn.setIconCls(iconCls); // 设置图标
                                                    btn.setText(text); // 设置文本
                                                    btn.setDisabled(false);
                                                    btn.isSuspendExpand = false;
                                                    callBack && callBack();
                                                }
                                            }, index * 100);
                                        });
                                    } else {
                                        btn.isExpandAll = !btn.isExpandAll; // 所有项完成后再切换状态
                                        btn.setIconCls(iconCls); // 设置图标
                                        btn.setText(text); // 设置文本
                                        btn.setDisabled(false);
                                        callBack && callBack();
                                    }
                                },
                                handler: function (btn) {
                                    var form = btn.ownerCt.ownerCt,
                                        page = form.ownerCt,
                                        text = btn.isExpandAll ? '折叠所有' : '展开所有',
                                        executionText = btn.isExpandAll ? '正在展开' : '正在折叠',
                                        iconCls = btn.isExpandAll ? 'icon_collapseAll' : 'icon_expandAll',
                                        items = page.items.items,
                                        result = [],
                                        completed = 0; // 计数器

                                    btn.setDisabled(true);
                                    items.forEach((item, index) => {
                                        if (item.collapsed === btn.isExpandAll) {
                                            result.push(item);
                                        }
                                    });

                                    if (result.length) {
                                        result.forEach((item, index) => {
                                            var expandLength = items.length - result.length;
                                            setTimeout(() => {
                                                result[index].setExpanded(btn.isExpandAll);

                                                completed++; // 每次完成一个项，计数加一
                                                btn.setText(`${executionText} ${expandLength + index + 1}/${items.length}`);

                                                // 检查是否所有项都已完成
                                                if (completed >= items.length) {
                                                    btn.isExpandAll = !btn.isExpandAll; // 所有项完成后再切换状态
                                                    btn.setIconCls(iconCls); // 设置图标
                                                    btn.setText(text); // 设置文本
                                                    btn.setDisabled(false);
                                                    btn.isSuspendExpand = false;
                                                }
                                            }, index * 100);
                                        });
                                    } else {
                                        btn.isExpandAll = !btn.isExpandAll; // 所有项完成后再切换状态
                                        btn.setIconCls(iconCls); // 设置图标
                                        btn.setText(text); // 设置文本
                                        btn.setDisabled(false);
                                    }
                                }
                            },
                            {
                                xtype: 'textfield',
                                name: 'shipmentRequirementId',
                                itemId: 'shipmentRequirementId',
                                emptyText: '发货要求Id',
                            },
                            {
                                text: '查询',
                                iconCls: 'icon_query',
                                handler: function (btn) {
                                    var form = btn.ownerCt.ownerCt,
                                        page = form.ownerCt,
                                        tools = btn.ownerCt,
                                        items = page.items.items,
                                        shipmentRequirementField = tools.getComponent('shipmentRequirementId'),
                                        shipmentRequirementId = shipmentRequirementField.getValue();

                                    items.forEach(item => {
                                        if (shipmentRequirementId) {
                                            item.setVisible(+shipmentRequirementId === +item.shipmentRequirementId);
                                            item.setExpanded(+shipmentRequirementId === +item.shipmentRequirementId);
                                        } else {
                                            item.setExpanded(false);
                                            item.setVisible(true);
                                        }
                                    })
                                }
                            },
                        ]
                    }
                },
                isExpandAll: true,
                refreshData: function () {
                    var form = this;
                    JSSetLoading(true);
                    setTimeout(function () {
                        var data = controller.getPriceInfo(JSGetQueryString('orderId'));
                        form.diySetValue(data);
                        /**
                         * 接受子组件事件reCalculateProductPrice
                         */
                        form.items.items.map(function (item) {
                            if (item) {
                                //接受子组件的事件
                                form.relayEvents(item, ['reCalculateProductPrice']);
                            }
                        });
                        JSSetLoading(false);
                    });
                },
                diySetValue: function (data) {
                    var form = this,
                        orderSummary = form.getComponent('orderSummary'),
                        batchModificationPrice = orderSummary.getComponent('batchModificationPrice'),
                        orderSummaryTools = orderSummary.getDockedItems('toolbar[dock="bottom"]')[0],
                        expandAllBtn = orderSummaryTools.getComponent('expandAll');

                    var comps = [];
                    //发货项价格信息
                    if (data && data.orderLineItemDetails.length > 0) {
                        data.orderLineItemDetails.map(function (item, index) {
                            comps.push({
                                xtype: 'address_fieldset',
                                rawData: item,
                                type: form.type,
                                shipmentRequirementId: item.shipmentRequirementId,
                                orderType: JSGetQueryString('orderType'),
                                currencySymbol: currencySymbol,
                                collapsed: index !== 0, //默认展开第一个
                                title: `<div style="font-weight: bold;width: 120px;color: green;font-weight: bold" >${'发货要求(' + item.shipmentRequirementId + ')'}</div>`
                            });
                        });
                    }
                    form.add(comps);
                    // 初始化展开
                    expandAllBtn.externalHandler(expandAllBtn, function () {
                        batchModificationPrice.setDisabled(false);
                        batchModificationPrice.setReadOnly(false);
                        batchModificationPrice.el.dom.setAttribute('data-qtip', '');
                    });
                    //整个订单统计汇总信息
                    orderSummary.setValue(data.priceInfo);
                },
                isValid: function () {
                    var isValid = true;
                    var firstComp = null;
                    Ext.ComponentMgr.all.each(function (name) {
                        var item = Ext.ComponentMgr.all.map[name]
                        if (item.isFormField === true && item.isValid) {
                            if (item.isValid() === false) {
                                isValid = false;
                                firstComp = item;
                            }
                        }
                    });
                    if (isValid === false) {
                        firstComp.focus();
                    }
                    return isValid;
                },
                listeners: {
                    afterrender: function () {
                        var form = this;
                        form.refreshData();
                    },
                    /**
                     * 重新计算统计所有发货项的价格信息
                     */
                    reCalculateProductPrice: function () {
                        var form = this;
                        JSSetLoading(true, '处理中...');
                        setTimeout(function () {
                            var result = {
                                importService: 0,
                                productsAmount: 0,
                                shippingPrice: 0,
                                tax: 0,
                                discountAmount: 0,
                                paddingPrice: 0,
                                totalAmount: 0
                            };
                            form.items.items.map(function (fieldset) {
                                var itemSummary = fieldset.getComponent('itemSummary');
                                var data = itemSummary.getValue();
                                result.importService += Number(data.importService);
                                result.productsAmount += Number(data.productsAmount);
                                result.shippingPrice += Number(data.shippingPrice);
                                result.tax += data.tax;
                                result.discountAmount += Number(data.discountAmount);
                                result.paddingPrice += Number(data.paddingPrice);
                                result.totalAmount += Number(data.totalAmount);
                            });
                            //整个订单统计汇总信息
                            var orderSummary = form.getComponent('orderSummary');
                            orderSummary.setValue(result);
                            console.log(result);
                            JSSetLoading(false);
                        }, 100);
                    }
                }
            }
        ]
    });
});