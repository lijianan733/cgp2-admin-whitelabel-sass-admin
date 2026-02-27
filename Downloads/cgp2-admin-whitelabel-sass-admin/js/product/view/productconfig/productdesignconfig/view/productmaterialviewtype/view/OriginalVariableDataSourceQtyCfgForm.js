/**
 * Created by nan on 2019/12/30.
 * vd上传数量 -固定值是用expression字段
 * 访问值用 rangeQuantity中的minExpressison和maxExpression
 */
Ext.Loader.syncRequire([
    'CGP.common.field.RtTypeSelectField'
])
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.OriginalVariableDataSourceQtyCfgForm", {
    extend: 'Ext.form.Panel',
    readOnly: false,
    border: false,
    setValue: function (data) {
        var me = this;
        if (data.expression) {
            data.quantityRange = {
                rangeType: 'FIX',
                expression: data.expression,
                clazz: "com.qpp.cgp.domain.bom.QuantityRange"
            }
        }
        if (me.rendered == false) {
            me.on('afterrender', function () {
                for (var i = 0; i < me.items.items.length; i++) {
                    var item = me.items.items[i];
                    if (item.xtype == 'uxtreecombohaspaging') {
                        if (data[item.getName()]) {
                            item.setInitialValue([data[item.getName()]._id]);
                        }
                    } else {
                        if (item.diySetValue) {
                            item.diySetValue(data[item.getName()]);
                        } else {
                            item.setValue(data[item.getName()]);
                        }
                    }
                }
            }, this, {
                single: true
            })
        } else {
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (item.xtype == 'uxtreecombohaspaging') {
                    item.setInitialValue([data[item.getName()]._id]);
                } else {
                    item.setValue(data[item.getName()]);
                }
            }
        }
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.disabled != true) {
                result[item.getName()] = item.getValue();
            }
        }
        if (result.quantityRange && result.quantityRange.rangeType == 'FIX') {
            result.expression = result.quantityRange.expression;
            delete result.quantityRange;
        }
        return result;
    },
    initComponent: function () {
        var me = this;
        me.defaults = {
            width: 550,
            readOnly: me.readOnly,
            margin: '5 15 5 15'

        };
        me.items = [
            {
                name: '_id',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('id'),
                itemId: '_id'
            },
            {
                name: 'clazz',
                fieldLabel: i18n.getKey('type'),
                itemId: 'clazz',
                editable: false,
                valueField: 'value',
                displayField: 'display',
                value: 'com.qpp.cgp.domain.bom.datasource.LocalDataSource',
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value',
                        'display'
                    ],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.bom.datasource.ImageGroupDataSource',
                            display: 'ImageGroupDataSource'
                        },
                        {
                            value: 'com.qpp.cgp.domain.bom.datasource.LocalDataSource',
                            display: 'LocalDataSource'
                        }
                    ]
                }),
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var name = combo.ownerCt.getComponent('name');
                        var rtType = combo.ownerCt.getComponent('rtType');
                        if (newValue != 'com.qpp.cgp.domain.bom.datasource.ImageGroupDataSource') {
                            name.hide();
                            name.setDisabled(true);
                            rtType.show();
                            rtType.setDisabled(false);
                        } else {
                            rtType.hide();
                            rtType.setDisabled(true);
                            name.show();
                            name.setDisabled(false);
                        }
                    }
                }
            },
            {
                name: 'name',
                hidden: true,
                disabled: true,
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            },
            {
                xtype: 'uxtreecombohaspaging',
                fieldLabel: i18n.getKey('rtType'),
                itemId: 'rtType',
                name: 'rtType',
                useRawValue: true,
                allowBlank: true,
            },
            {
                name: 'selector',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('selector'),
                itemId: 'selector'
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'quantityRange',
                fieldLabel: i18n.getKey('vd上传元素') + i18n.getKey('qty'),
                defaults: {
                    margin: '10 0 10 50',
                    allowBlank: true,
                    width: '100%',
                    readOnly: true,
                },
                items: [
                    {
                        fieldLabel: i18n.getKey('value') + i18n.getKey('type'),
                        xtype: 'combo',
                        valueField: 'value',
                        itemId: 'rangeType',
                        editable: false,
                        displayField: 'name',
                        queryMode: 'local',
                        value: 'FIX',
                        name: 'rangeType',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'name', 'value'
                            ],
                            data: [
                                {name: '固定值', value: 'FIX'},
                                {name: '范围值', value: 'RANGE'}
                            ]
                        }),
                        mapping: {
                            common: ['rangeType', 'clazz'],
                            FIX: ['expression'],
                            RANGE: ['minExpression', 'maxExpression']
                        },
                        listeners: {
                            change: function (comp, newValue, oldValue) {
                                var fieldContainer = comp.ownerCt;
                                for (var i = 1; i < fieldContainer.items.items.length; i++) {
                                    var item = fieldContainer.items.items[i];
                                    if (Ext.Array.contains(comp.mapping['common'], item.itemId)) {
                                    } else if (Ext.Array.contains(comp.mapping[newValue], item.itemId)) {
                                        item.show();
                                        item.setDisabled(false);
                                    } else {
                                        item.hide();
                                        item.setDisabled(true);
                                    }
                                }
                            }
                        },
                    },
                    {
                        fieldLabel: i18n.getKey('clazz'),
                        hidden: true,
                        itemId: 'clazz',
                        value: 'com.qpp.cgp.domain.bom.QuantityRange',
                        xtype: 'textfield',
                        name: 'clazz'
                    },
                    {
                        fieldLabel: i18n.getKey('minValue') + i18n.getKey('expression'),
                        xtype: 'textarea',
                        hidden: true,
                        disabled: true,
                        grow: true,
                        itemId: 'minExpression',
                        name: 'minExpression'
                    },
                    {
                        fieldLabel: i18n.getKey('maxValue') + i18n.getKey('expression'),
                        xtype: 'textarea',
                        hidden: true,
                        disabled: true,
                        grow: true,
                        itemId: 'maxExpression',
                        name: 'maxExpression'
                    },
                    {
                        name: 'expression',
                        itemId: 'expression',
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('固定值'),
                        grow: true
                    }
                ],
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setValue(data);
                    } else {
                        me.hide();
                    }
                }
            }
        ];
        me.callParent();
    }
})
