/**
 * @Description: 成本统计总览，查看指定周期内的成本
 * @author nan
 * @date 2022/9/6
 */
Ext.Loader.syncRequire([
    'CGP.cost.store.CostStore',
    'CGP.cost.view.EffectiveDurationColumn'
])
Ext.Loader.syncRequire([]);
Ext.onReady(function () {
    window.currencyStr = ' (HK$)';
    var CostStore = Ext.create('CGP.cost.store.CostStore', {
        autoLoad: true,
    });
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('costAudit'),
        block: 'cost',
        tbarCfg: {
            hidden: true
        },
        gridCfg: {
            store: CostStore,
            frame: false,
            deleteAction: false,
            editAction: false,
            columnDefaults: {
                tdCls: 'vertical-middle',
                autoSizeColumn: true,
                menuDisabled: false,
                width: 170,
            },
            columns: [
                {
                    text: i18n.getKey('operation'),
                    sortable: false,
                    width: 105,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var effectiveDuration = record.get('effectiveDuration');
                        return {
                            xtype: 'button',
                            ui: 'default-toolbar-small',
                            text: i18n.getKey('options'),
                            width: '100%',
                            flex: 1,
                            height: 26,
                            menu: [
                                {
                                    text: i18n.getKey('总成本明细'),
                                    handler: function (btn) {
                                        var str = Ext.Date.format(new Date(effectiveDuration.startTime), 'Y-m-d') + ' ~ ' + Ext.Date.format(new Date(effectiveDuration.endTime), 'Y-m-d');
                                        JSOpen({
                                            id: 'viewOfCatalog',
                                            url: path + 'partials/cost/viewofcatelog.html' +
                                                '?startTime=' + effectiveDuration.startTime + '&endTime=' + effectiveDuration.endTime,
                                            title: '总成本明细(周期：' + str + ')',
                                            refresh: true
                                        })
                                    }
                                }, {
                                    text: i18n.getKey('本期成本图表'),
                                    handler: function () {
                                        var controller = Ext.create('CGP.cost.controller.Controller');
                                        controller.showCostChart(effectiveDuration.startTime, effectiveDuration.endTime);
                                    }
                                }, {
                                    text: i18n.getKey('重新核算'),
                                    handler: function () {
                                    }
                                }, {
                                    text: i18n.getKey('核算历史'),
                                    handler: function () {
                                    }
                                }
                            ]
                        };
                    }
                },
                {
                    xtype: 'effectivedurationcolumn',
                    text: i18n.getKey('effectiveDuration'),
                    dataIndex: 'effectiveDuration',
                },
                {
                    xtype: 'numbercolumn',
                    format: '0.00',
                    text: i18n.getKey('totalCost') + window.currencyStr,
                    dataIndex: 'totalCost',

                },
                {
                    text: i18n.getKey('totalProductQty') + window.currencyStr,
                    dataIndex: 'totalProductQty',
                },
                {
                    xtype: 'numbercolumn',
                    format: '0.00',
                    flex: 1,
                    text: i18n.getKey('productAverageCost') + window.currencyStr,
                    dataIndex: 'productAverageCost',
                }/*,
                {
                    text: i18n.getKey('auditCurrency'),
                    dataIndex: 'currency',
                    flex: 1,
                }*/,
            ]
        },
        filterCfg: {
            minHeight: 125,
            items: [
                {
                    xtype: 'datefield',
                    name: 'startTime',
                    itemId: 'startTime',
                    editable: false,
                    fieldLabel: i18n.getKey('开始时间'),
                    format: 'Y-m-d H:i:s',
                    diyGetValue: function () {
                        var me = this;
                        var data = me.getValue();
                        if (data) {
                            return parseInt(new Date(data).getTime());
                        }
                    },
                },
                {
                    xtype: 'datefield',
                    name: 'endTime',
                    itemId: 'endTime',
                    fieldLabel: i18n.getKey('结束时间'),
                    format: 'Y-m-d H:i:s',
                    editable: false,
                    diyGetValue: function () {
                        var me = this;
                        var data = me.getValue();
                        if (data) {
                            return parseInt(new Date(data).getTime());
                        }
                    },
                },
            ]
        }
    });
});

