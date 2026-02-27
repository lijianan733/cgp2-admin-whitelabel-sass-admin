/**
 * @author xiu
 * @date 2025/2/25
 */
Ext.define('CGP.profitmanagement.view.CreateYearMonthComp', {
    extend: 'Ext.container.Container',
    alias: 'widget.create_year_month_comp',
    layout: 'hbox',
    width: 500,
    labelWidth: 30,
    year: 0,
    month: 0,
    initComponent: function () {
        var me = this,
            {year,month} = me;

        me.items = [
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('年月'),
                itemId: 'year',
                name: 'year',
                editable: false,
                width: 200,
                margin: '0 10 0 0',
                labelWidth: me.labelWidth,
                store: Ext.create('Ext.data.Store', {
                    fields: ['key', "value"],
                    data: (function () {
                        var years = [];
                        for (var i = 2000; i <= new Date().getFullYear(); i++) {
                            years.push({
                                key: i + ' 年',
                                value: i
                            });
                        }
                        return years;
                    })()
                }),
                displayField: 'key',
                valueField: 'value',
                queryMode: 'local',
                listeners: {
                    afterrender: function (comp) {
                        JSSetLoading(true);
                        setTimeout(item => {
                            JSSetLoading(false);
                            comp.setValue(+year);
                        }, 1000)
                    },
                    change: function (comp, value) {
                        var container = comp.ownerCt,
                            panel = container.ownerCt,
                            monthComp = container.getComponent('month'),
                            month = monthComp.getValue(),
                            descriptionInfo = panel.getComponent('descriptionInfo'),
                            grid = panel.getComponent('grid'),
                            params = {
                                year: value,
                                month: month,
                            }

                        if (value && month) {
                            // 更新grid
                            grid.diySetNewStoreUrl(params, grid);
                            // 更新信息
                            descriptionInfo.getMonthlyProfitInfo(params, descriptionInfo);
                        }
                    }
                }
            },
            {
                xtype: 'combo',
                itemId: 'month',
                name: 'month',
                editable: false,
                width: 100,
                store: Ext.create('Ext.data.Store', {
                    fields: ['key', "value"],
                    data: [
                        {
                            key: '1 月',
                            value: 1
                        },
                        {
                            key: '2 月',
                            value: 2
                        },
                        {
                            key: '3 月',
                            value: 3
                        },
                        {
                            key: '4 月',
                            value: 4
                        },
                        {
                            key: '5 月',
                            value: 5
                        },
                        {
                            key: '6 月',
                            value: 6
                        },
                        {
                            key: '7 月',
                            value: 7
                        },
                        {
                            key: '8 月',
                            value: 8
                        },
                        {
                            key: '9 月',
                            value: 9
                        },
                        {
                            key: '10 月',
                            value: 10
                        },
                        {
                            key: '11 月',
                            value: 11
                        },
                        {
                            key: '12 月',
                            value: 12
                        }
                    ]
                }),
                displayField: 'key',
                valueField: 'value',
                queryMode: 'local',
                listeners: {
                    afterrender: function (comp) {
                        JSSetLoading(true);
                        setTimeout(item => {
                            JSSetLoading(false);
                            comp.setValue(+month);
                        }, 1000)
                    },
                    change: function (comp, value) {
                        var container = comp.ownerCt,
                            panel = container.ownerCt,
                            yearComp = container.getComponent('year'),
                            year = yearComp.getValue(),
                            descriptionInfo = panel.getComponent('descriptionInfo'),
                            grid = panel.getComponent('grid'),
                            params = {
                                year: year,
                                month: value,
                            }

                        if (value && year) {
                            // 更新grid
                            grid.diySetNewStoreUrl(params, grid);
                            
                            // 更新信息
                            descriptionInfo.getMonthlyProfitInfo(params, descriptionInfo)
                        }
                    }
                }
            }
        ];
        me.callParent();
    },
    diyGetValue: function () {
        var me = this,
            yearComp = me.getComponent('year'),
            monthComp = me.getComponent('month');
        
        return {
            year: yearComp.getValue(),
            month: monthComp.getValue(),
        }
    }
})