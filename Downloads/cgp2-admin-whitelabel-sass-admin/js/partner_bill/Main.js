/**
 * @author nan
 * {"name":"statusId","value":224098,"type":"number"}
 * 订单状态为已签收待结算，可以进行 结算
 * @date 2026/1/26
 * @description TODO
 */
Ext.Loader.syncRequire([
    'CGP.partner_bill.view.AddTransactionVoucherWin',
    'CGP.partner.view.PartnerGridCombo'
])
Ext.onReady(function () {
    var controller = Ext.create("CGP.partner_bill.controller.Controller");
    var orderStatus = JSGetQueryString('orderStatus');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('Partner账单(待结算)'),
        block: 'partner_bill',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                text: '导出',
                iconCls: 'icon_import',
                disabled: false,
                handler: function (btn) {
                    var grid = btn.ownerCt.ownerCt;
                    var store = grid.store;
                    var url = adminPath + 'api/partnerBills/exportExcel';
                    var emailUrl = adminPath + 'api/partnerBills/exportExcel/email';
                    var filter = grid.filter;
                    var filterArray = filter.getQuery();
                    JSExportExcelV2(url, emailUrl, filterArray, store);
                }
            },
            btnDelete: {
                disabled: true,
            },
            btnHelp: {
                disabled: false,
                handler: function (btn) {
                    controller.showConfigHelp();
                }
            }
        },
        gridCfg: {
            store: Ext.create("CGP.partner_bill.store.PartnerBillStore", {}),
            deleteAction: false,
            editAction: false,
            columnDefaults: {
                sortable: false,
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    width: 90,
                    dataIndex: '_id',
                },
                {
                    xtype: "componentcolumn",
                    text: i18n.getKey('operator'),
                    hidden: !(JSGetQueryString('paid') == 'false' && JSGetQueryString('posted') == 'true'),
                    renderer: function (value, metadata, record, row, col, store, gridView) {
                        var grid = gridView.ownerCt;
                        return {
                            xtype: 'button',
                            text: '结算',
                            iconCls: 'icon_config',
                            handler: function () {
                                var totalPriceString = record.get('billAmountStr');
                                var billAmount = record.get('billAmount');
                                var billCurrencyCode = record.get('billCurrencyCode');
                                //post /api/partnerBills/payment
                                var win = Ext.create('CGP.partner_bill.view.AddTransactionVoucherWin', {
                                    totalPriceString: totalPriceString,
                                    billAmount: billAmount,
                                    billCurrencyCode: billCurrencyCode,
                                    billId: record.get('_id'),
                                    outGrid: grid,
                                    bill: record,
                                });
                                win.show();
                            }
                        };
                    }
                },
                {
                    text: i18n.getKey('账单金额'),
                    dataIndex: 'billAmountStr',
                    width: 100,
                    renderer: function (value) {
                        return JSCreateFont('red', true, value);
                    }
                },
                {
                    text: i18n.getKey('实际已支付金额'),
                    dataIndex: 'paidAmountStr',
                    width: 130,
                    hidden: (JSGetQueryString('paid') == 'false' && JSGetQueryString('posted') == 'true'),
                    sortable: true,
                },
                {
                    text: i18n.getKey('是否逾期'),
                    dataIndex: 'overdue',
                    width: 100,
                    sortable: true,
                    tipInfo: '订单签收之后，超过付款期+宽限期后,标记为逾期',
                    renderer: function (value) {
                        if (value) {
                            return JSCreateFont('red', true, value);
                        } else {
                            return JSCreateFont('green', true, value);
                        }
                    }
                }, {
                    text: i18n.getKey('是否已经付款'),
                    dataIndex: 'paid',
                    width: 100,
                    sortable: true,
                    renderer: function (value) {
                        if (value) {
                            return JSCreateFont('black', true, value);
                        } else {
                            return JSCreateFont('black', true, value);
                        }
                    }
                },
                {
                    text: i18n.getKey('是否已经出账'),
                    dataIndex: 'posted',
                    width: 130,
                    sortable: true,
                    tipInfo: '订单进行生产后，标记为已出账',
                    renderer: function (value) {
                        if (value) {
                            return JSCreateFont('black', true, value);
                        } else {
                            return JSCreateFont('black', true, value);
                        }
                    }
                },
                {
                    text: i18n.getKey('是否已取消'),
                    dataIndex: 'isCancel',
                    width: 130,
                    sortable: true,
                    tipInfo: '订单取消后，标记为已取消',
                    renderer: function (value) {
                        if (value) {
                            return JSCreateFont('red', true, value);
                        } else {
                            return JSCreateFont('black', true, value);
                        }
                    }
                },
                {
                    xtype: 'diy_date_column',
                    text: i18n.getKey('账单创建时间'),
                    dataIndex: 'billCreatedDate',
                    width: 165,
                    sortable: true,
                },
                {
                    text: i18n.getKey('付款期(天)'),
                    dataIndex: 'paymentTermDays',
                    width: 100,
                },
                {
                    xtype: 'diy_date_column',
                    text: i18n.getKey('最晚付款日期'),
                    dataIndex: 'dueDate',
                    width: 150,
                    sortable: true,
                },
                {
                    text: i18n.getKey('宽限期(天)'),
                    dataIndex: 'gracePeriodDays',
                    width: 100,
                }, {
                    xtype: 'diy_date_column',
                    text: i18n.getKey('最晚宽限日期'),
                    dataIndex: 'gracePeriodEndDate',
                    width: 150,
                    sortable: true,
                },
                {
                    xtype: 'diy_date_column',
                    text: i18n.getKey('订单签收日期'),
                    dataIndex: 'signDate',
                    width: 150,
                },
                {
                    xtype: 'diy_date_column',
                    text: i18n.getKey('实际付款日期'),
                    dataIndex: 'paidDate',
                    width: 150,
                    hidden: (JSGetQueryString('paid') == 'false' && JSGetQueryString('posted') == 'true'),
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('订单号'),
                    dataIndex: 'orderNumber',
                    width: 150,
                    clickHandler: function (value) {
                        JSOpen({
                            id: 'page',
                            url: path + "partials/order/order.html?orderNumber=" + value,
                            title: '订单 所有订单',
                            refresh: true
                        });
                    }
                }, {
                    text: i18n.getKey('订单状态'),
                    dataIndex: 'statusName',
                    width: 150,
                    sortable: true,
                    renderer: function (value) {
                        return i18n.getKey(value)
                    }
                }, {
                    text: i18n.getKey('订单金额'),
                    dataIndex: 'orderAmountStr',
                    width: 150,
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('Partner'),
                    dataIndex: 'partnerId',
                    width: 200,
                    getDisplayName: function (value, metaData, record) {
                        return `${record.get('partnerName')}(<a class="atag_display">${record.get('partnerId')}</a>)`
                    },
                    clickHandler: function (value, metaData, record) {
                        JSOpen({
                            id: 'partnerpage',
                            url: path + 'partials/partner/main.html?id=' +record.get('partnerId'),
                            title: i18n.getKey('partner'),
                            refresh: true
                        });
                    }
                }
            ]
        },
        filterCfg: {
            items: [
                {
                    xtype: 'numberfield',
                    name: '_id',
                    hideTrigger: true,
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    xtype: 'textfield',
                    name: 'source.orderNumber',
                    fieldLabel: i18n.getKey('订单号'),
                    itemId: 'source.orderNumber'
                },
                {
                    xtype: 'combobox',
                    fieldLabel: i18n.getKey('订单状态'),
                    name: 'source.statusId',
                    itemId: 'source.statusId',
                    editable: false,
                    displayField: 'name',
                    valueField: 'id',
                    titleField: 'tipInfo',
                    store: Ext.create('CGP.common.store.OrderStatuses', {
                        autoLoad: false
                    }),
                    listeners: {
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            store.on('load', function () {
                                if (!combo.getValue())
                                    combo.select(store.getAt(0));
                            });
                        }
                    }
                },
                {
                    xtype: 'partner_grid_combo',
                    itemId: 'partner.id',
                    name: 'partner.id',
                    fieldLabel: 'Partner',
                    gridCfg: {
                        selType: 'rowmodel',
                    }
                },
                {
                    xtype: 'booleancombo',
                    name: 'isOverdue',
                    fieldLabel: i18n.getKey('是否逾期'),
                    itemId: 'isOverdue'
                },
                {
                    xtype: 'booleancombo',
                    fieldLabel: i18n.getKey('是否已经付款'),
                    name: 'isPaid',
                    itemId: 'isPaid',
                    //hidden: JSGetQueryString('paid') == 'false',
                    value: JSGetQueryString('paid') == 'false' ? false : null

                },
                {
                    xtype: 'booleancombo',
                    fieldLabel: i18n.getKey('是否已经出账'),
                    name: 'isPosted',
                    itemId: 'isPosted',
                    //hidden: JSGetQueryString('posted') == 'true',
                    value: JSGetQueryString('posted') == 'true' ? true : null
                },

                {
                    xtype: 'booleancombo',
                    fieldLabel: i18n.getKey('是否已取消'),
                    name: 'isCancel',
                    itemId: 'isCancel',
                    hidden: true,
                    value: JSGetQueryString('isCancel') == 'true' ? true : null,
                    diyGetValue: function () {
                        var me = this;
                        if (me.getValue() == 'true') {
                            return true;
                        } else if (me.getValue() == 'false') {
                            return false;
                        } else {
                            return null;
                        }
                    }
                },
            ]
        }
    });
});
