/**
 * Created by nan on 2019/10/11.
 */
Ext.define('CGP.product.edit.view.EditSkuAttributeWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    requires: ['CGP.product.edit.model.Attribute'],
    constrain: true,
    layout: 'fit',
    record: null,
    title: i18n.getKey('edit') + i18n.getKey('SKU属性'),
    bbar: [
        '->',
        {
            xtype: 'button',
            text: i18n.getKey('confirm'),
            iconCls: 'icon_agree',
            handler: function (btn) {
                var window = btn.ownerCt.ownerCt;
                var record = window.record;
                var form = window.getComponent('form');
                if (form.isValid()) {
                    var data = form.getValue();
                    for (var i in data) {
                        record.set(i, data[i]);
                    }
                    window.close();
                }
            }
        }
    ],
    initComponent: function () {
        var me = this;
        var record = me.record;
        //创建新的属性value,defaultValue
        var model = new CGP.product.edit.model.Attribute(record.getData());
        model.set('id', 1);//代表value
        var valueField = Ext.Object.merge(Qpp.CGP.util.createColumnByAttribute(model), {
            fieldLabel: i18n.getKey('value'),
            name: 'value',
            allowBlank: true,
            itemId: 'value',
            value: record.get('value')
        });
        model.set('value', model.get('defaultValue'));
        model.set('id', 2);//代表defaultValue,因为id必须为数值
        var defaultValueField = Ext.Object.merge(Qpp.CGP.util.createColumnByAttribute(model), {
            fieldLabel: i18n.getKey('defaultValue'),
            name: 'defaultValue',
            itemId: 'defaultValue',
            allowBlank: true,
            value: record.get('defaultValue')
        });
        var width = 0;
        if (valueField.width > defaultValueField.width) {
            width = valueField.width;
        } else {
            width = defaultValueField.width;
        }
        me.items = [
            {
                xtype: 'form',
                itemId: 'form',
                defaults: {
                    allowBlank: false,
                    minWidth: 300,
                    width: width,
                    margin: '5 15 5 15'
                },
                getValue: function () {
                    var me = this;
                    var values = [];
                    me.items.each(function (item) {
                        var value = {};
                        var v = item.getValue();
                        if (item.xtype == 'datefield') {
                            value.value = item.getSubmitValue();
                        } else {
                            if (Ext.isObject(v)) {
                                if (v[item.name] == 'YES' || v[item.name] == 'NO') {
                                    value.value = v[item.name];
                                } else if (item.name == 'value') {
                                    if (Ext.isArray(v[1])) {
                                        value.optionIds = v[1].join(',');
                                    } else {
                                        value.optionIds = v[1] + '';
                                    }
                                } else if (item.name == 'defaultValue') {
                                    if (Ext.isArray(v[2])) {
                                        value.optionIds = v[2].join(',');
                                    } else {
                                        value.optionIds = v[2];
                                    }
                                } else {
                                    if (Ext.isArray(v[item.name])) {
                                        value.optionIds = v[item.name].join(',');
                                    } else {
                                        value.optionIds = v[item.name];
                                    }
                                }
                            } else if (item.xtype == 'combobox') {
                                value.optionIds = v;
                            } else {
                                value.value = v;
                            }
                        }
                        value.attributeId = item.name;
                        value.id = item.itemId == 0 ? null : item.itemId;
                        values.push(value);
                    })
                    var result = {};
                    for (var i = 0; i < values.length; i++) {
                        result[values[i].attributeId] = values[i].optionIds || values[i].value;
                    }
                    return result;
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'name',
                        value: record.get('name'),
                        fieldLabel: i18n.getKey('displayName')
                    },
                    valueField,
                    defaultValueField,
                    {
                        xtype: 'combo',
                        name: 'readOnly',
                        editable: false,
                        fieldLabel: i18n.getKey('readOnly'),
                        store: Ext.create("Ext.data.Store", {
                            fields: [{name: 'name', type: 'string'}, {
                                name: 'value',
                                type: 'boolean'
                            }],
                            data: [
                                {name: 'true', value: true}, {
                                name: 'false',
                                value: false
                            }]
                        }),
                        valueField: 'value',
                        value: record.get('readOnly'),
                        displayField: 'name'
                    },
                    {
                        xtype: 'combo',
                        name: 'required',
                        editable: false,
                        fieldLabel: i18n.getKey('required'),
                        store: Ext.create("Ext.data.Store", {
                            fields: [{name: 'name', type: 'string'}, {
                                name: 'value',
                                type: 'boolean'
                            }],
                            data: [{name: 'true', value: true}, {
                                name: 'false',
                                value: false
                            }]
                        }),
                        valueField: 'value',
                        value: record.get('required'),
                        displayField: 'name'
                    }, {
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('enable'),
                        name: 'enable',
                        editable: false,
                        store: Ext.create("Ext.data.Store", {
                            fields: [{name: 'name', type: 'string'}, {
                                name: 'value',
                                type: 'boolean'
                            }],
                            data: [{name: 'true', value: true}, {
                                name: 'false',
                                value: false
                            }]
                        }),
                        valueField: 'value',
                        value: record.get('enable'),
                        displayField: 'name'
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('是否隐藏'),
                        name: 'hidden',
                        editable: false,
                        store: Ext.create("Ext.data.Store", {
                            fields: [{name: 'name', type: 'string'}, {
                                name: 'value',
                                type: 'boolean'
                            }],
                            data: [{name: 'true', value: true}, {
                                name: 'false',
                                value: false
                            }]
                        }),
                        valueField: 'value',
                        value: record.get('hidden'),
                        displayField: 'name'
                    }, {
                        xtype: 'textfield',
                        name: 'sortOrder',
                        readOnly: true,
                        fieldStyle: 'background-color: silver',
                        value: record.get('sortOrder'),
                        fieldLabel: i18n.getKey('sortOrder')
                    },
                    {
                        name: 'selectType',
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('selectType'),
                        itemId: 'selectType',
                        valueField: 'value',
                        readOnly: true,
                        editable: false,
                        fieldStyle: 'background-color: silver',
                        displayField: 'name',
                        value: record.get('selectType')||'NON',//缺失必填的该属性后自动补充NON
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            data: [
                                {name: '输入型', value: 'NON'},
                                {name: '单选型', value: 'SINGLE'},
                                {name: '多选型', value: 'MULTI'}
                            ]
                        })
                    }
                ]
            }
        ];
        me.callParent();
    }
})
