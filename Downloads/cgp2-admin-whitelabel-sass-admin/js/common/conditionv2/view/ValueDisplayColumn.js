/**
 * @Description:展示屬性值的列，用于显示各种类型的值
 * @author nan
 * @date 2022/10/18
 */
Ext.Loader.syncRequire([
    'CGP.common.conditionv2.view.JsonPathTreeCombo'
])
Ext.define('CGP.common.conditionv2.view.ValueDisplayColumn', {
    extend: 'Skirtle.grid.column.Component',
    alias: 'widget.valuedisplaycolumn',
    valueFieldConfig: null,//配置默认值和是否可以编辑clazz,type
    winTitle: null,//编辑弹窗的title
    nullCanEdit: true,//在渲染时，如果valueEx值为null,是否返回null，还是一个编辑的按钮
    canChangeValue: true,//是否可以通过编辑改变record的
    saveHandler: null,//自定义的保存的操作
    contextTemplate: null,
    beforeRenderer: null,
    componentUUId: null,
    contextStore: null,//上下文store
    contextData: null,
    readOnly: true,//返回的组件时只读还是可修改
    constructor: function () {
        var me = this;
        me.callParent(arguments);
    },
    getDisplayComponent: function (value, meta, record, rowIndex, colIndex, store, gridView) {
        var me = this;
        var treeStore = me.treeStore;
        var contextStore = me.contextStore;
        var component = null;
        //最大最小值时,value的数据是没值的
        if (record.raw.clazz == 'IntervalOperation' && Ext.isEmpty(value)) {
            var max = record.raw.max;
            var min = record.raw.min;
            component = {
                xtype: 'fieldcontainer',
                name: 'minAndMax',
                itemId: 'minAndMax',
                layout: {
                    type: 'column',
                },
                defaults: {
                    margin: '2 0'
                },
                setValue: function (data) {
                    var me = this;
                    var min = me.getComponent('min');
                    var max = me.getComponent('max');
                    min.setValue(data);
                    max.setValue(data);
                },
                items: [
                    {
                        xtype: 'displayfield',
                        width: 50,
                        value: 'min:',
                        columnWidth: 0.25
                    },
                    Ext.Object.merge(me.getDisplayComponent(min, meta, record, rowIndex, colIndex, store, gridView), {
                        itemId: 'min',
                        width: '100%',
                        name: 'min',
                        flex: 1,
                        columnWidth: 0.75
                    }),
                    {
                        xtype: 'displayfield',
                        width: 50,
                        value: 'max:',
                        columnWidth: 0.25
                    },
                    Ext.Object.merge(me.getDisplayComponent(max, meta, record, rowIndex, colIndex, store, gridView), {
                        itemId: 'max',
                        width: '100%',
                        name: 'max',
                        flex: 1,
                        columnWidth: 0.75
                    })
                ],
                diyGetValue: function () {
                    var minData = this.items.items[1];
                    var maxData = this.items.items[3];
                    return {
                        min: minData.diyGetValue(),
                        max: maxData.diyGetValue(),
                    }
                }
            };
        } else {
            if (value.clazz == 'ContextPathValue') {
                component = {
                    xtype: 'jsonpathtreecombo',
                    value: value.path,
                    store: treeStore,
                    diyGetValue: function () {
                        var me = this;
                        return {
                            clazz: 'ContextPathValue',
                            path: me.getValue()
                        }
                    }
                };
            } else if (value.clazz == 'ProductAttributeValue') {
                component = {
                    xtype: 'combo',
                    name: 'attributeId',
                    editable: false,
                    value: String(value.attributeId),
                    itemId: 'attributeId',
                    allowBlank: false,
                    tdCls: 'vertical-middle',
                    valueField: 'key',
                    displayField: 'displayName',
                    store: contextStore,
                    diyGetValue: function () {
                        var me = this;
                        return {
                            clazz: 'ProductAttributeValue',
                            attributeId: me.getValue()
                        }
                    }
                };
            } else if (value.clazz == 'ConstantValue') {
                var source = record.get('source');
                var operator = record.get('operator');
                var selectType = 'NON';
                var options = [];
                if (source.clazz == 'ProductAttributeValue') {
                    var id = source.attributeId;
                    var attribute = contextStore.findRecord('key', id);
                    selectType = attribute.get('selectType');
                    options = attribute.get('attrOptions');
                    var valueType = 'String';
                    if (attribute.get('valueType') == 'Boolean') {
                        valueType = 'Boolean';
                    }
                }
                if (selectType == 'SINGLE' || selectType == 'MULTI') {
                    var multiSelect = (Ext.Array.contains(['In', 'NotIn'], operator) ? true : (selectType == 'SINGLE' ? false : true));
                    component = {
                        xtype: 'multicombobox',
                        name: 'value',
                        multiSelect: multiSelect,
                        itemId: 'optionValue',
                        haveReset: true,
                        value: multiSelect ? Ext.JSON.decode(value.value) : Number(value.value),
                        store: {
                            xtype: 'store',
                            model: 'CGP.attribute.model.AttributeOption',
                            data: options,
                            proxy: {
                                type: 'memory'
                            },
                        },
                        editable: false,
                        displayField: 'name',
                        valueField: 'id',
                        allowBlank: false,
                        /**
                         * ConstantValue中的value都是string类型，多选的Array现在为‘"123456","654321"’,
                         * 选项类型为id的字符串
                         * 但是boolean的类型必须准确为Boolean
                         */
                        diyGetValue: function () {
                            var me = this;
                            if (multiSelect) {
                                return {
                                    clazz: 'ConstantValue',
                                    valueType: 'Array',
                                    value: Ext.JSON.encode(me.getValue())
                                }
                            } else {
                                return {
                                    clazz: 'ConstantValue',
                                    valueType: valueType,
                                    value: me.getValue() + ''
                                }
                            }
                        },
                        diySetValue: function (data) {
                            var me = this;
                            if (me.multiSelect) {
                                me.setValue(Ext.JSON.decode(data));
                            } else {
                                me.setValue(Number(data));
                            }
                        }
                    };

                } else {
                    if (value.valueType == 'String') {
                        component = {
                            xtype: 'textfield',
                            name: 'value',
                            itemId: 'stringValue',
                            allowBlank: false,
                            diyGetValue: function () {
                                var me = this;
                                return {
                                    clazz: 'ConstantValue',
                                    valueType: 'String',
                                    value: me.getValue()
                                }
                            }
                        };
                    } else if (value.valueType == 'Number') {
                        component = {
                            xtype: 'numberfield',
                            name: 'value',
                            itemId: 'numberValue',
                            allowBlank: false,
                            diyGetValue: function () {
                                var me = this;
                                return {
                                    clazz: 'ConstantValue',
                                    valueType: 'Number',
                                    value: me.getValue()
                                }
                            }
                        };
                    } else if (value.valueType == 'Boolean') {
                        component = {
                            xtype: 'booleancombo',
                            name: 'value',
                            itemId: 'numberValue',
                            allowBlank: false,
                            diyGetValue: function () {
                                var me = this;
                                return {
                                    clazz: 'ConstantValue',
                                    valueType: 'Boolean',
                                    value: me.getValue()
                                }
                            }
                        };
                    } else if (value.valueType == 'Array') {
                        component = {
                            xtype: 'arraydatafield',
                            name: 'value',
                            itemId: 'arrayValue',
                            allowBlank: false,
                            resultType: 'string',
                            diyGetValue: function () {
                                var me = this;
                                return {
                                    clazz: 'ConstantValue',
                                    valueType: 'Array',
                                    value: '[' + me.getValue() + ']'
                                }
                            },
                            diySetValue: function (data) {
                                var me = this;
                                var arr = [];
                                if (data && /\[.*\]/.test(data)) {
                                    var str = data.replace(/(\[|\])/g, '');
                                    me.setValue(str);
                                }
                            }
                        };
                    }
                    component.value = value.value;
                }
            } else if (value.clazz == 'CalculationValue') {
                var disPlayStr = '表达式';
                component = {
                    xtype: 'button',
                    text: disPlayStr.toString(),
                    value: value,
                    cls: 'a-btn',
                    tooltip: i18n.getKey('点击进行编辑'),
                    itemId: 'diyConditionExpression',
                    border: false,
                    handler: function (btn) {
                        var win = Ext.create('Ext.window.Window', {
                            modal: true,
                            constrain: true,
                            outBtn: btn,
                            value: btn.value,
                            title: 'edit',
                            layout: 'fit',
                            width: 600,
                            items: [
                                {
                                    xtype: 'valuefieldv2',
                                    margin: '0 25 0 0',
                                    itemId: 'valueField',
                                    contextStore: me.contextStore,
                                    contextData: me.contextData,
                                    itemsConfig: {
                                        clazz: {
                                            hidden: true,
                                        },
                                    }
                                }
                            ],
                            bbar: {
                                xtype: 'bottomtoolbar',
                                hidden: me.readOnly,
                                saveBtnCfg: {
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        var valueField = win.getComponent('valueField');
                                        var data = valueField.getValue();
                                        win.outBtn.value = data;
                                        console.log(data);
                                        win.close();
                                    }
                                }
                            },
                            listeners: {
                                afterrender: function () {
                                    var win = this;
                                    var valueField = win.getComponent('valueField');
                                    valueField.setValue(win.value);
                                }
                            }
                        });
                        win.show();
                    },
                    diyGetValue: function () {
                        var me = this;
                        return me.value;
                    },
                    diySetValue: function (data) {
                        //不作处理
                    },
                };
            }
        }
        component.name = this.dataIndex;
        component.recordId = record.id;
        component.readOnly = me.readOnly;
        return component;
    },
    initComponent: function () {
        var me = this;
        me.contextTemplate = JSBuildContentTemplateTreeDate(me.contextStore);
        var treeData = JSJsonToTree(me.contextTemplate, 'root');
        me.treeStore = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            fields: [
                'text', 'value'
            ],
            proxy: {
                type: 'memory'
            },
            root: {
                expanded: true,
                children: treeData.children
            }
        });
        me.renderer = function (value, meta, record, rowIndex, colIndex, store, gridView) {
            me.beforeRenderer ? me.beforeRenderer.apply(me, arguments) : null;
            //逻辑操作时，直接返回
            if (record.raw.clazz == 'LogicalOperation') {
                return null;
            } else {
                return {
                    xtype: 'container',
                    width: '100%',
                    layout: 'fit',
                    diyGetValue: function () {
                        var me = this;
                        var item = me.items.items[0];
                        return item.diyGetValue ? item.diyGetValue() : item.getValue();
                    },
                    diySetValue: function (data) {
                        var me = this;
                        var item = me.items.items[0];
                        item.diySetValue ? item.diySetValue(data) : item.setValue(data);
                    },
                    name: me.dataIndex,
                    itemId: me.componentUUId + '_' + rowIndex + '_' + colIndex + '_value',
                    items: [me.getDisplayComponent.apply(me, arguments)]
                };
            }
        };
        me.callParent();
    }
})
