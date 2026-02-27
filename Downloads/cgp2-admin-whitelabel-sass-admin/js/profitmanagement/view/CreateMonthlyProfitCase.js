/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.Loader.syncRequire([
    'CGP.profitmanagement.view.CreateYearMonthComp',
    'CGP.profitmanagement.view.CreateDescriptionInfoComp'
])
Ext.define('CGP.profitmanagement.view.CreateMonthlyProfitCase', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.monthly_profit_case',
    layout: 'fit',
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.profitmanagement.controller.Controller'),
            {config, test} = Ext.create('CGP.profitmanagement.defaults.OnlineshopmanagementDefaults'),
            {monthly_profit_case} = config,
            {columnsText, filtersText} = monthly_profit_case,
            {nowYear, nowMonth} = controller.getCurrentYearAndMonth(),
            columns = controller.getColumnsType(columnsText),
            filters = controller.getFiltersType(filtersText),
            newYear = +JSGetQueryString('year') || +nowYear,
            getMonth = +JSGetQueryString('month') || +nowMonth - 1,
            newMonth = getMonth;

        if (newMonth === 0){
            newYear = newYear - 1;
            newMonth = 12;
        }

        me.store = Ext.create('CGP.profitmanagement.store.CreateMonthlyProfitCaseStore', {
            year: newYear,
            month: newMonth,
        });

        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                defaults: {
                    margin: '20 25 5 25',
                    allowBlank: false,
                },
                items: [
                    {
                        xtype: 'create_year_month_comp',
                        name: 'settleDate',
                        itemId: 'settleDate',
                        width: 500,
                        labelWidth: 40,
                        year: newYear,
                        month: newMonth,
                    },
                    {
                        xtype: 'create_description_info_comp',
                        name: 'descriptionInfo',
                        itemId: 'descriptionInfo',
                        width: 500,
                    },
                    {
                        xtype: 'searchcontainer',
                        itemId: 'grid',
                        width: '100%',
                        // margin: '20 0 5 0',
                        diySetNewStoreUrl: function (params, comp) {
                            var {year, month} = params,
                                store = comp.grid.store;

                            store.proxy.url = adminPath + `api/${year}/${month}/balance`;
                            store.load();
                        },
                        gridCfg: {
                            store: me.store,
                            selModel: {
                                selType: 'rowmodel',
                            },
                            customPaging: [
                                {value: 25},
                                {value: 50},
                                {value: 75},
                                {value: 150},
                            ],
                            deleteAction: false,
                            editAction: false,
                            tbar: {
                                items: [
                                    {
                                        xtype: 'button',
                                        text: i18n.getKey('导出报表'),
                                        width: 100,
                                        iconCls: 'icon_import',
                                        handler: function (btn) {
                                            var tools = btn.ownerCt,
                                                grid = tools.ownerCt,
                                                form = grid.ownerCt.ownerCt,
                                                settleDate = form.getComponent('settleDate'),
                                                {year, month} = settleDate.diyGetValue(),
                                                url = adminPath + `api/partner/balance/report` +
                                                    `?reportYear=${year}&reportMonth=${month}`;

                                            JSDownload(url, `${year}年${month}月_盈余报表`);
                                        }
                                    }
                                ]
                            },
                            columns: columns,
                        },
                        filterCfg: {
                            header: false,
                            layout: {
                                type: 'table',
                                columns: 4
                            },
                            getQuery: function () {
                                var querys = [],
                                    f = 0,
                                    fields,
                                    field, val, name, sp;

                                fields = this.form.getFields().items;
                                for (; f < fields.length; f++) {

                                    field = fields[f];
                                    name = field.name;
                                    val = field.value;
                                    if (field.xtype == 'gridcombo') {
                                        val = field.getSubmitValue()[0];
                                    }
                                    if (!Ext.isEmpty(val)) {
                                        var query = {};
                                        query.name = name;

                                        if (field.operator) {  //添加操作入口
                                            query.operator = field.operator;
                                        }

                                        if (Ext.isDate(val)) {
                                            var values = Ext.Date.format(val, 'Y-m-d H:i:s');
                                            query.value = values;
                                            query.type = 'date';
                                        } else if (Ext.isString(val)) {
                                            var values;
                                            if (Ext.isEmpty(field.isLike) || field.isLike == true) {
                                                values = "%" + val.replace("'", "''") + "%";

                                            } else if (!Ext.isEmpty(field.isLike) && field.isLike === false) {
                                                values = val.replace("'", "''");

                                            }
                                            query.value = values;
                                            query.type = 'string';
                                        } else if (Ext.isNumber(val)) {
                                            query.value = val;
                                            query.type = "number";
                                        } else if (Ext.isBoolean(val)) {
                                            query.value = val + '';
                                            query.type = 'boolean';
                                        } else if (Ext.isArray(val)) {
                                            Ext.Array.remove(val, null);
                                            if (!val.length > 0) {
                                                continue;
                                            }
                                            query.value = val.join(',');
                                            query.type = 'string';
                                        }
                                        querys.push(query);
                                    }
                                }
                                for (var i = 0; i < querys.length; i++) {
                                    if (Ext.isEmpty(querys[i].value)) {
                                        querys.remove(i);
                                    }
                                }

                                return querys;
                            },
                            items: Ext.Array.merge(filters, [
                                {
                                    xtype: 'numberfield',
                                    name: 'amount',
                                    itemId: 'amount',
                                    hideTrigger: true,
                                    isLike: false,
                                    hidden: true,
                                    operator: 'ne',
                                    fieldLabel: i18n.getKey('amount'),
                                    value: 0
                                },
                                {
                                    xtype: 'displayfield',
                                    labelWidth: 140,
                                    width: 130,
                                    fieldLabel: i18n.getKey('隐藏盈余为0的数据')
                                },
                                {
                                    xtype: 'togglebutton',
                                    itemId: 'isFilterZero',
                                    value: true,
                                    tooltip: '隐藏盈余为0的数据',
                                    height: 30,
                                    margin: '0 10 0 0',
                                    handler: function (btn) {
                                        var value = btn.getValue(),
                                            form = btn.ownerCt,
                                            searchcontainer = btn.ownerCt.ownerCt,
                                            grid = searchcontainer.grid,
                                            amount = form.getComponent('amount');

                                        amount.setValue(value ? 0 : null);
                                        grid.store.load();
                                    },
                                },
                            ])
                        },
                        listeners: {
                            afterrender: function (comp) {
                                var form = comp.ownerCt,
                                    settleDate = form.getComponent('settleDate'),
                                    descriptionInfo = form.getComponent('descriptionInfo'),
                                    grid = comp.grid,
                                    store = grid.store;

                                // 同步更新数据
                                store.on('load', function () {
                                    var {year, month} = settleDate.diyGetValue(),
                                        params = {
                                            year: year || newYear,
                                            month: month || newMonth - 1,
                                        }
                                    descriptionInfo.getMonthlyProfitInfo(params, descriptionInfo);
                                })
                            }
                        }
                    }
                ]
            }
        ];
        me.callParent();
    },
})