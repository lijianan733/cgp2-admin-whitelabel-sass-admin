/**
 * @author xiu
 * @date 2025/2/25
 */
Ext.define('CGP.profitmanagement.view.CreateQueryAccountInfoComp', {
    extend: 'Ext.container.Container',
    alias: 'widget.create_query_account_info_comp',
    layout: 'hbox',
    width: 1200,
    setDisabledBtn: function (isDisabled) {
        /* var me = this,
             addBtn = me.getComponent('addBtn'),
             isFilterZero = me.getComponent('isFilterZero'),
             queryBtn = me.getComponent('queryBtn');
 
         addBtn.setDisabled(isDisabled);
         isFilterZero.setDisabled(isDisabled);
         queryBtn.setDisabled(isDisabled);*/
    },
    initComponent: function () {
        var me = this,
            partnerId = JSGetQueryString('partnerId'),
            partnerEmail = JSGetQueryString('partnerEmail'),
            controller = Ext.create('CGP.profitmanagement.controller.Controller');

        me.items = [
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('账户收支详细'),
                itemId: 'beforeDays',
                name: 'beforeDays',
                editable: false,
                width: 300,
                margin: '0 10 0 0',
                labelWidth: 100,
                store: Ext.create('Ext.data.Store', {
                    fields: ['key', "value"],
                    data: [
                        {
                            key: '近7天',
                            value: 7
                        },
                        {
                            key: '近14天',
                            value: 14
                        },
                        {
                            key: '近30天',
                            value: 30
                        },
                        {
                            key: '所有',
                            value: 1000000
                        }
                    ]
                }),
                displayField: 'key',
                valueField: 'value',
                queryMode: 'local',
                listeners: {
                    afterrender: function (comp) {
                        comp.setValue(7);
                    },
                    change: function (field, newValue, oldValue) {
                        var container = field.ownerCt,
                            form = container.ownerCt,
                            typeComp = container.getComponent('type'),
                            type = typeComp.getValue(),
                            grid = form.getComponent('grid');

                        if (newValue) {
                            grid.diySetNewStoreUrl({
                                type: type,
                                beforeDays: newValue
                            }, grid);
                        }
                    }
                }
            },
            {
                xtype: 'combo',
                itemId: 'type',
                name: 'type',
                editable: false,
                width: 200,
                margin: '0 10 0 0',
                store: Ext.create('Ext.data.Store', {
                    fields: ['key', "value"],
                    data: [
                        {
                            key: '收入',
                            value: 'IN'
                        },
                        {
                            key: '支出',
                            value: 'OUT'
                        },
                        {
                            key: '平衡',
                            value: 'REBALANCE'
                        },
                        {
                            key: '所有',
                            value: ''
                        },
                    ]
                }),
                displayField: 'key',
                valueField: 'value',
                queryMode: 'local',
                listeners: {
                    afterrender: function (comp) {
                        comp.setValue('');
                    },
                    change: function (field, newValue, oldValue) {
                        var container = field.ownerCt,
                            form = container.ownerCt,
                            beforeDaysComp = container.getComponent('beforeDays'),
                            beforeDays = beforeDaysComp.getValue(),
                            grid = form.getComponent('grid');

                        if (beforeDays) {
                            grid.diySetNewStoreUrl({
                                type: newValue,
                                beforeDays: beforeDays
                            }, grid);
                        }
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('查询'),
                iconCls: 'icon_query',
                width: 80,
                itemId: 'queryBtn',
                margin: '0 10 0 0',
                handler: function (btn) {
                    var container = btn.ownerCt,
                        form = container.ownerCt,
                        isFilterZeroComp = container.getComponent('isFilterZero'),
                        isFilterZero = isFilterZeroComp.getValue(),
                        grid = form.getComponent('grid').grid,
                        typeComp = container.getComponent('type'),
                        beforeDaysComp = container.getComponent('beforeDays'),
                        type = typeComp.getValue(),
                        beforeDays = beforeDaysComp.getValue(),
                        filter = [
                            {
                                name: 'beforeDays',
                                value: beforeDays,
                                type: 'number'
                            }
                        ]

                    if (!!type) {
                        filter.push({
                            name: 'type',
                            value: type,
                            type: 'string'
                        })
                    }

                    if (isFilterZero) {
                        filter.push({
                            name: "amount",
                            value: 0,
                            type: "number",
                            operator: "ne"
                        })
                    }

                    grid.store.load({
                        params: {
                            filter: Ext.JSON.encode(filter)
                        },
                    })
                },
                listeners: {
                    afterrender: function (comp) {
                        comp.handler(comp);
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('添加'),
                iconCls: 'icon_create',
                width: 80,
                itemId: 'addBtn',
                margin: '0 10 0 0',
                handler: function (btn) {
                    var {nowYear, nowMonth} = controller.getCurrentYearAndMonth(),
                        lastMonth = nowMonth - 1,
                        container = btn.ownerCt,
                        panel = container.ownerCt.ownerCt,
                        {amount, symbolLeft, waitTransferBalance} = panel.params;

                    JSOpen({
                        id: "edit_profit_check",
                        url: path + 'partials/profitmanagement/edit_profit_check.html' +
                            '?year=' + nowYear +
                            '&month=' + lastMonth +
                            '&openPage=' + 'partner_profit_info' +
                            '&partnerEmail=' + partnerEmail +
                            '&amount=' + amount +
                            '&symbolLeft=' + symbolLeft +
                            '&partnerEmail=' + partnerEmail +
                            '&waitTransferBalance=' + waitTransferBalance +
                            '&type=' + 'create' +
                            '&partnerId=' + partnerId,
                        title: i18n.getKey('修改盈余'),
                        refresh: true
                    });
                }
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
                margin: '0 10 10 0',
                handler: function (btn) {
                    var container = btn.ownerCt,
                        queryBtn = container.getComponent('queryBtn');

                    queryBtn.handler(queryBtn);
                },
            },
        ];
        me.callParent();
    }
})