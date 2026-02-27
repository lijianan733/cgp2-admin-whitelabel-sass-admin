Ext.Loader.syncRequire([
    'Ext.ux.form.GridField',
    'CGP.product.view.pricingStrategyv2.view.conditionV2.ConditionFieldSet'
]);
Ext.define("CGP.product.view.pricingStrategyv2.view.additionTable.AdditionTableItem", {
    extend: 'Ext.ux.form.ErrorStrickForm',
    bodyPadding: 5,
    minHeight: 240,
    border: 0,
    /*fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 60,
        width: 380,
        msgTarget: 'side'
    },*/
    additionItemData: null,

    initComponent: function () {
        var me = this;
        var pricingTable = Ext.create("CGP.product.view.pricingStrategyv2.view.PricingTable", {
            store: Ext.create("CGP.product.view.pricingStrategyv2.store.LocalPricingTable"),
            // fieldLabel: i18n.getKey('price') + i18n.getKey('table'),
            hideLabel: true,
            allowBlank: false,
            itemId: me.gridContainer + 'pricingTable',
            name: 'table',
            width: 1000,
            labelAlign: 'right',
            margin: '10 10 10 10',
            //width: 380,
            msgTarget: 'side',
            gridContainer: me.gridContainer
        });
        var condition = {
            xtype: 'pricing_condition_fieldset',
            title: i18n.getKey('执行规则的前提条件'),
            itemId: 'attributeMappingRuleFieldSet',
            productId: me.productId,
            margin: '10 10 10 10',
            name: 'condition',
            width: 1000,
            checkOnly: false,
            listeners: {
                afterrender: function (form) {
                    console.log(form.id);
                    //condition.setValue(conditionData);
                }
            }
        };
        /*var condition=Ext.create('CGP.product.view.pricingStrategyv2.view.ConditionComp',{
            data:me.additionItemData,
            name:'condition',
            parameterTypes: [
                {
                    boxLabel: i18n.getKey('attribute'),
                    name: 'parameterType',
                    inputValue: 'productAttribute',
                    checked: true
                },
                {
                    boxLabel: 'Qty',
                    name: 'parameterType',
                    inputValue: 'qty'
                }
            ]
        });*/

        me.items = [
            {
                xtype: 'numberfield',
                name: 'index',
                fieldLabel: i18n.getKey('index'),
                itemId: 'index',
                labelAlign: 'right',
                labelWidth: 60,
                width: 380,
                msgTarget: 'side',
                readOnly: true,
                readOnlyCls: 'x-item-disabled',
                allowBlank: false
            },
            {
                xtype: 'textfield',
                name: 'description',
                labelAlign: 'right',
                labelWidth: 60,
                width: 380,
                msgTarget: 'side',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            },
            condition,
            pricingTable
        ];

        me.callParent(arguments);


    },
    listeners: {
        afterrender: function (comp) {
            if (comp.additionItemData) {
                comp.setValue(comp.additionItemData);
            }
        }
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.disabled) {
            isValid = true;
        }
        for (var item of me.items.items) {
            if (!Ext.isEmpty(item.allowBlank) && !item.allowBlank && !item.isValid()) {
                item.setActiveError('该输入项为必输项');
                item.renderActiveError();
                isValid = false;
            }
        }
        return isValid;
    },

    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'gridfield') {
                item.setSubmitValue(data[item.name])
//                var store = item.gridConfig.store;
//                if (Ext.isArray(data[item.name])) {
//                    store.loadData(data[item.name]);
//                }
            } else {
                item.setValue(item.name ? data[item.name] : data);
            }
        })
    },
    getValue: function () {
        var me = this;
        var items = me.items.items;
        var data = me.additionItemData;
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'gridfield') {
                item.store.sort('to', 'ASC');
                var gridData = [];
                item.store.each(function (record) {
                    record.data.index = record.index;
                    if (record.index == item.store.count() - 1) {
                        record.set('to', 2147483647);
                        record.data.to = 2147483647;

                    }
                    gridData.push(record.data);

                });
                data[item.name] = gridData;
            } else if (Ext.isEmpty(item.name)) {
                item.getValue(data);
            } else {
                data[item.name] = item.getValue();
            }
        });
        return data;
    }
})
