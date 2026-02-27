/**
 * Created by nan on 2021/8/12.
 * 返回数量的规则列表
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.view.ConditionFieldContainer'
])
Ext.define("CGP.product.view.productconfig.productviewconfig.view.navigationV3.view.QTYRuleGrid", {
    extend: 'Ext.ux.form.GridFieldWithCRUDV2',
    alias: 'widget.qtyrulegrid',
    viewConfig: {
        markDirty: false//标识修改的字段
    },
    outputValueFieldConfig: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller');
        me.gridConfig = {
            store: Ext.create('Ext.data.Store', {
                proxy: {
                    type: 'memory'
                },
                fields: [
                    {
                        name: 'condition',
                        type: 'object'
                    },
                    {
                        name: 'inputType',
                        type: 'string',
                        convert: function (value, record) {
                            if (value) {
                                return value;
                            } else {
                                var outputValue = record.getData().outputValue;
                                if (outputValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue') {
                                    return 'Attribute';
                                } else if (outputValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
                                    return 'Fix';
                                }
                            }
                        }
                    },
                    {
                        name: 'outputValue',
                        type: 'object',
                    },
                    {
                        name: 'description',
                        type: 'string'
                    },
                    {
                        name: 'qtyValueType',
                        type: 'string'
                    }
                ],
                data: []
            }),
            columns: [
                {
                    xtype: 'rownumberer',
                    tdCls: 'vertical-middle',
                    width: 30
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    tdCls: 'vertical-middle',
                    itemId: 'description',
                    flex: 1
                },
                {
                    text: i18n.getKey('返回值'),
                    dataIndex: 'outputValue',
                    tdCls: 'vertical-middle',
                    itemId: 'outputValue',
                    width: 250,
                    renderer: function (value, mateData, record) {
                        if (value.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
                            return '固定数量:' + value.value;
                        } else {
                            var store = Ext.data.StoreManager.get('skuAttributeStore2');
                            var attributeId = value.attributeId;
                            var record = store.findRecord('attributeId', attributeId);
                            if (!Ext.isEmpty(record)) {
                                var displayField = record.get('comboDisplay');
                                return '用户输入的属性:' + displayField + '的值';
                            }
                        }
                    }
                },
                {
                    text: i18n.getKey('condition'),
                    dataIndex: 'condition',
                    tdCls: 'vertical-middle',
                    itemId: 'condition',
                    flex: 1,
                    minWidth: 150,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        if (value && value.conditionType == 'else') {
                            return {
                                xtype: 'displayfield',
                                value: '<font color="red">其他条件都不成立时执行</font>'
                            };
                        } else if (value && (value.operation.operations.length > 0 || value.conditionType == 'custom')) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>查看执行条件</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            controller.checkCondition(value);
                                        });
                                    }
                                }
                            };
                        } else {
                            return {
                                xtype: 'displayfield',
                                value: '<font color="green">无条件执行</font>'
                            };
                        }
                    }
                },
            ]
        };
        me.winConfig = {
            setValueHandler: function (data) {
                var win = this;
                console.log(data);
                var form = win.getComponent('form');
                form.setValue(data);
            },
            formConfig: {
                items: [
                    {
                        name: 'description',
                        text: i18n.getKey('description'),
                        itemId: 'description',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('description')
                    },
                    {
                        name: 'inputType',
                        itemId: 'inputType',
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('返回值类型'),
                        editable: false,
                        displayField: 'display',
                        valueField: 'value',
                        value: 'Attribute',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                {name: 'display', type: 'string'},
                                {name: 'value', type: 'string'}
                            ],
                            data: [
                                {display: '自定义固定值', value: 'Fix'},
                                {display: '产品属性值', value: 'Attribute'}
                            ]
                        }),
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var FixOutputValue = field.ownerCt.getComponent('FixOutputValue');
                                var DynamicOutputValue = field.ownerCt.getComponent('DynamicOutputValue');
                                FixOutputValue.setVisible(newValue == 'Fix');
                                FixOutputValue.setDisabled(!(newValue == 'Fix'));
                                DynamicOutputValue.setVisible(!(newValue == 'Fix'));
                                DynamicOutputValue.setDisabled(newValue == 'Fix');
                            }
                        }
                    },
                    Ext.Object.merge({
                        xtype: 'numberfield',
                        name: 'outputValue',
                        itemId: 'FixOutputValue',
                        minValue: 0,
                        allowDecimals: false,
                        hidden: true,
                        disabled: true,
                        fieldLabel: i18n.getKey('返回值'),
                        diySetValue: function (value) {
                            var me = this;
                            if (value) {
                                me.setValue(value.value)
                            }
                        },
                        diyGetValue: function () {
                            var me = this;
                            return {
                                value: me.getValue(),
                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue'
                            }
                        }
                    }, me.outputValueFieldConfig),
                    {
                        name: 'outputValue',
                        itemId: 'DynamicOutputValue',
                        fieldLabel: i18n.getKey('返回值'),
                        xtype: 'gridcombo',
                        editable: false,
                        displayField: 'comboDisplay',
                        valueField: 'attributeId',
                        allowBlank: false,
                        valueType: 'id',
                        store: Ext.data.StoreManager.get('skuAttributeStore2'),
                        matchFieldWidth: true,
                        gridCfg: {
                            height: 200,
                            columns: [
                                {
                                    dataIndex: 'displayName',
                                    flex: 1,
                                    tdCls: 'vertical-middle',
                                    text: i18n.getKey('attributeName'),
                                    renderer: function (value, mateData, record) {
                                        return value + '(' + record.getId() + ')';
                                    }
                                }
                            ]
                        },
                        tipInfo: '使用定制界面输入的属性值,来确定导航项数量',
                        diySetValue: function (value) {
                            var me = this;
                            var attributeId = value.attributeId;
                            var store = Ext.data.StoreManager.get('skuAttributeStore2');
                            var record = store.findRecord('attributeId', attributeId);
                            if (!Ext.isEmpty(record)) {
                                me.setValue(record.getData());
                            }
                        },
                        diyGetValue: function () {
                            var me = this;
                            return {
                                attributeId: me.getSubmitValue()[0],
                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue'
                            }
                        },
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var qtyValueType = field.ownerCt.getComponent('qtyValueType');
                                if (Ext.Object.isEmpty(newValue) && Object.values(newValue)[0].attribute.selectType == 'SINGLE') {
                                    qtyValueType.setValue('Dynamic');
                                } else {
                                    qtyValueType.setValue('Fix');
                                }
                            }
                        }
                    },
                    {
                        name: 'qtyValueType',
                        text: i18n.getKey('qtyValueType'),
                        itemId: 'qtyValueType',
                        xtype: 'textfield',
                        hidden: true,
                        value: 'Fix',
                        fieldLabel: i18n.getKey('qtyValueType'),
                    },
                    {
                        xtype: 'conditionfieldcontainer',
                        name: 'condition',
                        itemId: 'condition',
                        maxHeight: 350,
                        width: 900,
                        allowElse: true,
                        minHeight: 80,
                        fieldLabel: i18n.getKey('condition'),
                    },
                ]
            }
        };
        me.callParent();
    },
})
