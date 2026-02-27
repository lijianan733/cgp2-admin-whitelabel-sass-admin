/**
 * @Description:
 * @author nan
 * @date 2022/9/5
 */
Ext.define('CGP.cost.view.SummaryPanel', {
    extend: 'Ext.form.Panel',
    border: false,
    alias: 'widget.summarypanel',
    region: 'west',
    store: null,
    split: true,
    minWidth: 600,
    splitterResize: true,
    header: false,
    layout: {
        type: 'table',
        columns: 4
    },
    defaults: {
        labelAlign: 'right',
        width: 220,
        margin: '5 0 0 0'
    },
    bbar: {
        hidden: true,
        defaults: {
            labelAlign: 'right'
        },
        layout: {
            type: 'hbox',
            pack: 'end'
        },
        items: [
            {
                xtype: 'displayfield',
                value: 'xxxxx',
                itemId: 'productAverageCost',
                name: 'productAverageCost',
                fieldLabel: i18n.getKey('productAverageCost')
            },
            {
                xtype: 'displayfield',
                value: 'xxxxx',
                itemId: 'totalQty',
                name: 'totalQty',
                fieldLabel: i18n.getKey('totalQty')
            },
            {
                xtype: 'displayfield',
                value: 'xxxxx',
                name: 'materialCost',
                itemId: 'materialCost',
                fieldLabel: i18n.getKey('materialCost')
            }
        ],
        setValue: function (data) {
            var me = this;
            me.items.each(function (item) {
                var cost = data[item.getName()];
                item.setValue(cost?.toFixed(2));

            })
        }
    },
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        var commonRender = Ext.create('CGP.cost.controller.Controller').commonRender;
        me.items = [
            {
                xtype: 'displayfield',
                value: 'xxxxx',
                itemId: 'materialCost',
                name: 'materialCost',
                fieldLabel: i18n.getKey('materialCost') + window.currencyStr,
            },
            {
                xtype: 'displayfield',
                value: 'xxxxx',
                itemId: 'laborCost',
                name: 'laborCost',
                fieldLabel: i18n.getKey('laborCost') + window.currencyStr,
            },
            {
                xtype: 'displayfield',
                value: 'xxxxx',
                itemId: 'overhead',
                name: 'overhead',
                fieldLabel: i18n.getKey('overhead') + window.currencyStr,
            },
            {
                xtype: 'displayfield',
                value: 'xxxxx',
                itemId: 'dpctOfMcn',
                name: 'dpctOfMcn',
                labelWidth: 150,
                fieldLabel: i18n.getKey('dpctOfMcn') + window.currencyStr,
            },
            {
                xtype: 'displayfield',
                value: 'xxxxx',
                itemId: 'productAverageCost',
                name: 'productAverageCost',
                fieldLabel: i18n.getKey('productAverageCost') + window.currencyStr
            },
            {
                xtype: 'displayfield',
                value: 'xxxxx',
                itemId: 'totalQty',
                name: 'totalQty',
                fieldLabel: i18n.getKey('totalQty')
            },
            {
                xtype: 'displayfield',
                value: 'xxxxx',
                name: 'totalCost',
                itemId: 'totalCost',
                fieldLabel: i18n.getKey('totalCost') + window.currencyStr
            }
        ];
        me.callParent();
        me.store.on('load', function (store, records, operation) {
            //工具栏设置统计
            if (records.length > 0) {
                var data = records[0]?.getData() || {};
                me.items.each(function (item) {
                    var cost = data[item.getName()];
                    item.setValue(cost?.toFixed(2));
                })
            }
        });
    },
    refreshData: function (filter) {
        var me = this;
        me.store.load();
    }
})
/*

bbar: {
    defaults: {
        labelAlign: 'right'
    },
    layout: {
        type: 'hbox',
            pack: 'end'
    },
    items: [
        {
            xtype: 'displayfield',
            value: 'xxxxx',
            itemId: 'productAverageCost',
            name: 'productAverageCost',
            fieldLabel: i18n.getKey('productAverageCost')
        },
        {
            xtype: 'displayfield',
            value: 'xxxxx',
            itemId: 'totalQty',
            name: 'totalQty',
            fieldLabel: i18n.getKey('totalQty')
        },
        {
            xtype: 'displayfield',
            value: 'xxxxx',
            name: 'materialCost',
            itemId: 'materialCost',
            fieldLabel: i18n.getKey('materialCost')
        }
    ],
        setValue: function (data) {
        var me = this;
        me.items.each(function (item) {
            var cost = data[item.getName()];
            item.setValue(cost?.toFixed(2));

        })
    }
},
constructor: function (config) {
    var me = this;
    me.callParent(arguments);
},
initComponent: function () {
    var me = this;
    var commonRender = Ext.create('CGP.cost.controller.Controller').commonRender;
    me.columns = {
        defaults: {
            sortable: false,
            menuDisabled: true,
        },
        items: [
            {
                xtype: 'numbercolumn',
                format: '0.00',
                dataIndex: 'materialCost',
                text: i18n.getKey('materialCost'),
                summaryType: 'sum',
                
                flex: 1,
                maxWidth: 150,
            },
            {
                xtype: 'numbercolumn',
                format: '0.00',
                dataIndex: 'laborCost',
                text: i18n.getKey('laborCost'),
                summaryType: 'sum',
                
                flex: 1,
                maxWidth: 150,
            },
            {
                xtype: 'numbercolumn',
                format: '0.00',
                dataIndex: 'overhead',
                text: i18n.getKey('overhead'),
                summaryType: 'sum',
                
                flex: 1,
                maxWidth: 150,
            },
            {
                xtype: 'numbercolumn',
                format: '0.00',
                dataIndex: 'dpctOfMcn',
                text: i18n.getKey('dpctOfMcn'),
                summaryType: 'average',
                
                flex: 1,
            }
        ]
    };
    me.callParent();
    me.store.on('load', function (store, records, operation) {
        //工具栏设置统计
        if (records.length > 0) {
            var data = records[0]?.getData() || {};
            var bbar = me.getDockedItems('toolbar[dock="bottom"]')[0];
            bbar.setValue(data);
        }
    });
},
refreshData: function (filter) {
    var me = this;
    me.store.load();
}*/
