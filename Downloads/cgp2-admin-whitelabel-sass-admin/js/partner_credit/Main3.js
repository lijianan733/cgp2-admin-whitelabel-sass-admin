/**
 * @author nan 信贷流水
 * @date 2026/1/26
 * @description TODO
 */
Ext.Loader.syncRequire([
    "CGP.partner_credit.store.PartnerCreditTransactionStore"
])
Ext.onReady(function () {
    var controller = Ext.create(`CGP.partner_credit.controller.Controller`);
    var partnerId = JSGetQueryString('partnerId');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: 'partner信贷流水',
        block: 'partner_credit_transaction',
        tbarCfg: {
            btnCreate: {
                disabled: true,
            },
            btnDelete: {
                disabled: true,
            }
        },
        gridCfg: {
            deleteAction: false,
            editAction: false,
            store: Ext.create("CGP.partner_credit.store.PartnerCreditTransactionStore", {
                partnerId: partnerId
            }),
            hiddenButtons: ['delete', 'read', 'clear', 'sepQuery'],
            columns: [
                {
                    dataIndex: '_id',
                    text: i18n.getKey('id'),
                    width: 120,
                },
                {
                    text: '变化的额度',
                    width: 120,
                    dataIndex: 'amount',
                    renderer: function (value, metaData, record) {
                        var changeType = record.get('changeType');
                        var currency = record.get('currency');
                        var result = '';
                        if (changeType == 'INCREASE') {//增加代表使用
                            result = JSCreateFont('green', true, `使用 ${currency.symbolLeft}  ${value}`);
                        } else if (changeType == 'DECREASE') {
                            result = JSCreateFont('red', true, `退还 ${currency.symbolLeft}  ${value}`);
                        }

                        return result;
                    }
                },
                {
                    text: '信贷额度类型',
                    dataIndex: 'creditType',
                    width: 120,
                    renderer: function (value, metaData, record) {
                        var map = {
                            MANAGEMENT_CREDIT: '管理信贷额',
                            RISK_CREDIT: '风险信贷额'
                        };
                        return map[value];

                    }
                },
                {
                    xtype: 'diy_date_column',
                    text: '流水日期',
                    dataIndex: 'date',
                    width: 150,
                },
                {
                    xtype: 'atagcolumn',
                    text: '流水来源',
                    dataIndex: 'sourceId',
                    width: 120,
                    flex: 1,
                    getDisplayName: function (value, metaData, record) {
                        var sourceType = record.get('sourceType');
                        if (sourceType == 'order') {
                            var items = [
                                {
                                    title: '来源',
                                    value: '订单'
                                },
                                {
                                    title: '订单编号',
                                    value: `<a class="atag_display">${value}</a>`
                                }
                            ]
                        } else {
                            var items = [
                                {
                                    title: '来源',
                                    value: sourceType
                                },
                                {
                                    title: '记录标识',
                                    value: value
                                }
                            ]
                        }
                        return JSCreateHTMLTable(items);
                    },
                    clickHandler: function (value, metaData, record) {
                        var me = this;
                        JSOpen({
                            id: 'orderpage',
                            url: path + "partials/order/order.html?_id=" + value,
                            title: '订单 所有订单',
                            refresh: true
                        })
                    }
                },

            ]
        },
        filterCfg: {
            items: [
                {
                    xtype: 'textfield',
                    name: '_id',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                },
                {
                    xtype: 'combo',
                    name: 'creditType',
                    fieldLabel: '信贷额度类型',
                    itemId: 'creditType',
                    editable: false,
                    valueField: 'value',
                    displayField: 'display',
                    store: {
                        xtype: 'store',
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                display: '管理信贷额',
                                value: 'MANAGEMENT_CREDIT'
                            },
                            {
                                display: '风险信贷额',
                                value: 'RISK_CREDIT'
                            }
                        ]
                    }
                },
                {
                    xtype: 'combo',
                    name: 'changeType',
                    fieldLabel: '额度增减',
                    itemId: 'changeType',
                    editable: false,
                    valueField: 'value',
                    displayField: 'display',
                    store: {
                        xtype: 'store',
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                display: '使用',
                                value: 'INCREASE'
                            },
                            {
                                display: '退还',
                                value: 'DECREASE'
                            }
                        ]
                    }
                }
            ]
        }
    });
});
