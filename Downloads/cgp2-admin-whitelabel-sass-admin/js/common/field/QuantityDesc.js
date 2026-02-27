/**
 * Created by nan on 2021/11/22
 * QuantityDesc
 * 数量值组件
 */

Ext.define('CGP.common.field.QuantityDesc', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.quantitydesc',
    allowBlank: true,
    getErrors: function () {
        return '该配置必须完备'
    },
    defaults: {
        labelWidth: 80,
        margin: '5 25 5 25',
        width: 350,
        allowBlank: true,
    },
    items: [
        {
            xtype: 'combo',
            editable: false,
            disabled: false,
            hidden: false,
            name: 'clazz',
            hideTrigger: false,
            itemId: 'clazz',
            value: 'com.qpp.cgp.domain.bom.quantity.FillQuantityDesc',
            fieldLabel: i18n.getKey('type'),
            store: {
                xtype: 'store',
                fields: ['name', 'value'],
                data: [
                    {
                        name: i18n.getKey('FillQuantityDesc'),
                        value: 'com.qpp.cgp.domain.bom.quantity.FillQuantityDesc'
                    },
                    {
                        name: i18n.getKey('LiteralQuantityDesc'),
                        value: 'com.qpp.cgp.domain.bom.quantity.LiteralQuantityDesc'
                    },
                    {
                        name: i18n.getKey('RatioQuantityDesc'),
                        value: 'com.qpp.cgp.domain.bom.quantity.RatioQuantityDesc'
                    }
                ]
            },
            displayField: 'name',
            valueField: 'value',
            queryMode: 'local',
            mapping: {
                'common': ['clazz'],
                'com.qpp.cgp.domain.bom.quantity.FillQuantityDesc': ['total'],
                'com.qpp.cgp.domain.bom.quantity.RatioQuantityDesc': ['numerator', 'denominator'],
                'com.qpp.cgp.domain.bom.quantity.LiteralQuantityDesc': ['quantity'],
            },
            listeners: {
                change: function (field, newValue, oldValue) {
                    var fieldContainer = field.ownerCt;
                    for (var i = 0; i < fieldContainer.items.items.length; i++) {
                        var item = fieldContainer.items.items[i];
                        if (Ext.Array.contains(field.mapping['common'], item.itemId)) {
                            //不处理
                        } else if (Ext.Array.contains(field.mapping[newValue], item.itemId)) {
                            item.show();
                            item.setDisabled(false);
                        } else {
                            item.hide();
                            item.setDisabled(true);
                        }
                    }
                }
            }
        },
        {
            xtype: 'valueexfield',
            itemId: 'numerator',
            name: 'numerator',
            hidden: true,
            disabled: true,
            fieldLabel: i18n.getKey('numerator'),
            commonPartFieldConfig: {
                defaultValueConfig: {
                    type: 'Number',
                    clazz: 'com.qpp.cgp.value.ConstantValue',
                    typeSetReadOnly: true,
                    clazzSetReadOnly: false
                }
            }
        },
        {
            xtype: 'valueexfield',
            itemId: 'denominator',
            name: 'denominator',
            hidden: true,
            disabled: true,
            fieldLabel: i18n.getKey('denominator'),
            commonPartFieldConfig: {
                defaultValueConfig: {
                    type: 'Number',
                    clazz: 'com.qpp.cgp.value.ConstantValue',
                    typeSetReadOnly: true,
                    clazzSetReadOnly: false
                }
            }
        },
        {
            xtype: 'valueexfield',
            itemId: 'total',
            name: 'total',
            fieldLabel: i18n.getKey('total'),
            commonPartFieldConfig: {
                defaultValueConfig: {
                    type: 'Number',
                    clazz: 'com.qpp.cgp.value.ConstantValue',
                    typeSetReadOnly: true,
                    clazzSetReadOnly: false
                }
            }
        },
        {
            xtype: 'valueexfield',
            itemId: 'quantity',
            name: 'quantity',
            hidden: true,
            disabled: true,
            fieldLabel: i18n.getKey('quantity'),
            commonPartFieldConfig: {
                defaultValueConfig: {
                    type: 'Number',
                    clazz: 'com.qpp.cgp.value.ConstantValue',
                    typeSetReadOnly: true,
                    clazzSetReadOnly: false
                }
            }
        }
    ]
})
