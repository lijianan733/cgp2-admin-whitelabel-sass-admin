/**
 * @Description: 各种值的选择组件
 * @author nan
 * @date 2022/9/26
 */
Ext.Loader.syncRequire([
    'CGP.common.store.ProductAttributeStore',
    'CGP.common.conditionv2.view.JsonPathTreeCombo',
    'CGP.attribute.model.AttributeOption',
    'CGP.common.conditionv2.view.ContextTree',
    'CGP.common.conditionv2.view.AttributeGridCombo'
])
Ext.define("CGP.common.conditionv2.view.ValueFieldV2", {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.valuefieldv2',
    labelAlign: 'top',
    msgTarget: 'none',
    readOnly: false,
    border: false,
    contextStore: null,//必填
    layout: {
        type: 'vbox',
    },
    defaults: {
        hidden: true,
        width: '100%',
        margin: '5 0 5 25',
        disabled: true,
    },
    itemsConfig: {},//{itemId:{}}的格式配置
    /**
     * 格式如下：
     * initBaseConfig:{
     *         clazzReadOnly: false,
     *         defaultClass: 'ProductAttributeValue',//ConstantValue,ProductAttributeValue,ContextPathValue,CalculationValue，
     *         defaultValueType:'String',
     *         valueTypeReadOnly:false,
     *         selectType: 'NON',//NON, SINGLE, MULTI
     *         attrOptions: []//值
     * }
     */
    initBaseConfig: null,//组件的默认值
    selectType: 'NON',//由initBaseConfig中取出来
    attrOptions: [],//由initBaseConfig中取出来
    setValueType: function (valueType, valueTypeReadOnly) {
        var me = this;
        var valueTypeField = me.getComponent('valueType');
        valueTypeField.setValue(valueType);
        valueTypeField.setReadOnly(valueTypeReadOnly);
        valueTypeField.fireEvent('change', valueTypeField, valueType, valueType);
    },
    /**
     *
     * @param option
     * @param selectType
     */
    setOptionData: function (option = [], selectType, valueType) {
        var me = this;
        me.selectType = selectType;
        var optionValue = me.getComponent('optionValue');
        optionValue.store.proxy.data = option;
        if (selectType == 'SINGLE') {
            optionValue.multiSelect = false;
            optionValue.getPicker().getSelectionModel().setSelectionMode('SINGLE');
            me.setValueType(valueType, true);
        } else if (selectType == 'MULTI') {
            optionValue.multiSelect = true;
            optionValue.getPicker().getSelectionModel().setSelectionMode('SIMPLE');
            me.setValueType('Array', true);
        } else {
            me.setValueType(valueType, true);
        }
        optionValue.store.load();

    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.disabled == false) {
                if (item.diyGetValue) {
                    result[item.getName()] = item.diyGetValue();
                } else {
                    result[item.getName()] = item.getValue();
                }
            }
        }
        return result;
    },
    /**
     * 取出来是都是String
     * @param data
     */
    setValue: function (data) {
        var me = this;
        if (data) {
            if (me.rendered == true) {
                for (var i = 0; i < me.items.items.length; i++) {
                    var item = me.items.items[i];
                    if (item.diySetValue) {
                        item.diySetValue(data[item.getName()]);
                    } else {
                        item.setValue(data[item.getName()]);
                    }
                }
            } else {
                me.on('afterrender', function () {
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (item.diySetValue) {
                            item.diySetValue(data[item.getName()]);
                        } else {
                            item.setValue(data[item.getName()]);
                        }
                    }
                });
            }
        }
    },
    /**
     * 合并自定义配置
     */
    mergeConfig: function (components, itemsConfig) {
        var me = this;
        //根据itemId进行对应
        if (itemsConfig) {
            Ext.Object.merge(components, itemsConfig);
        }
        return Object.values(components);
    },
    initComponent: function () {
        var me = this;
        var clazzId = JSGetUUID();
        var contextStore = me.contextStore;
        var mainController = Ext.create('CGP.common.conditionv2.controller.MainController', {
            contextStore: me.contextStore,//必填有全局的storeId contextStore
        });
        var treeStore = mainController.buildTreeStore(me.title);
        me.initBaseConfig = Ext.Object.merge({
            clazzReadOnly: false,
            defaultClass: 'ProductAttributeValue',
            defaultsValueType: 'String',
            valueTypeReadOnly: false,
            selectType: 'NON',
            attrOptions: []
        }, me.initBaseConfig);
        me.selectType = me.initBaseConfig.selectType;
        me.attrOptions = me.initBaseConfig.attrOptions;
        me.components = {
            clazz: {
                xtype: 'radiogroup',
                columns: 4,
                id: JSGetUUID(),
                itemId: 'clazz',
                name: 'clazz',
                hidden: false,
                disabled: false,
                fieldLabel: i18n.getKey('取值方式'),
                vertical: true,
                clazz: 'clazz_' + clazzId,
                items: [
                    {boxLabel: '固定值', name: 'clazz_' + clazzId, inputValue: 'ConstantValue', checked: true,},
                    {boxLabel: '属性值', name: 'clazz_' + clazzId, inputValue: 'ProductAttributeValue'},
                    {boxLabel: '上下文', name: 'clazz_' + clazzId, inputValue: 'ContextPathValue'},
                    {boxLabel: '表达式', name: 'clazz_' + clazzId, inputValue: 'CalculationValue'},
                ],
                mapping: {
                    common: ['clazz'],
                    ContextPathValue: ['path'],
                    ProductAttributeValue: ['attributeId'],
                    ConstantValue: ['stringValue', 'numberValue', 'booleanValue', 'arrayValue', 'valueType'],
                    CalculationValue: ['expression', 'parameter']
                },
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var form = combo.ownerCt;
                        var clazz = newValue[combo.clazz];
                        if (newValue && clazz) {
                            form.suspendLayouts();//挂起布局
                            form.items.items.map(function (item) {
                                if (Ext.Array.contains(combo.mapping.common, item.itemId)) {
                                    //不做处理
                                } else if (item.name == 'value' && clazz == 'ConstantValue') {
                                    //不做处理，ConstantValue的组件由valueType来控制
                                } else {
                                    if (Ext.Array.contains(combo.mapping[clazz], item.itemId)) {
                                        item.show();
                                        item.setDisabled(false);
                                    } else {
                                        item.hide();
                                        item.setDisabled(true);
                                    }
                                }
                            });
                            form.resumeLayouts();//恢复布局
                            form.doLayout();
                        }
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    return me.getValue()[me.clazz];
                },
                diySetValue: function (data) {
                    var me = this;
                    var object = {};
                    object[me.clazz] = data;
                    me.setValue(object);
                }
            },
            nullable: {
                xtype: 'checkbox',
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('是否允许为空'),
                name: 'nullable',
                checked: true,
                itemId: 'nullable'
            },
            valueType: {
                xtype: 'combo',
                hidden: false,
                disabled: false,
                itemId: 'valueType',
                name: 'valueType',
                valueField: 'value',
                displayField: 'display',
                editable: false,
                value: 'String',
                fieldLabel: i18n.getKey('值类型'),
                store: {
                    xtype: 'store',
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: 'String',
                            display: 'String'
                        }, {
                            value: 'Number',
                            display: 'Number'
                        }, {
                            value: 'Boolean',
                            display: 'Boolean'
                        }, {
                            value: 'Array',
                            display: 'Array'
                        }, {
                            value: 'Null',
                            display: 'Null'
                        }
                    ]
                },
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var stringValue = combo.ownerCt.getComponent('stringValue');
                        var numberValue = combo.ownerCt.getComponent('numberValue');
                        var booleanValue = combo.ownerCt.getComponent('booleanValue');
                        var arrayValue = combo.ownerCt.getComponent('arrayValue');
                        var optionValue = combo.ownerCt.getComponent('optionValue');
                        var arr = [stringValue, numberValue, booleanValue, arrayValue];
                        var aimField = null;
                        if (me.selectType == 'NON') {
                            if (newValue == 'String') {
                                aimField = stringValue;
                            } else if (newValue == 'Number') {
                                aimField = numberValue;
                            } else if (newValue == 'Boolean') {
                                aimField = booleanValue;
                            } else if (newValue == 'Array') {
                                aimField = arrayValue;
                            } else if (newValue == 'Null') {
                            }
                            arr.map(function (item) {
                                if (aimField == item) {
                                    aimField.show();
                                    aimField.setDisabled(false);
                                } else {
                                    item.hide();
                                    item.setDisabled(true);
                                }
                            });
                            optionValue.hide();
                            optionValue.setDisabled(true);
                        } else if (me.selectType == 'SINGLE' || me.selectType == 'MULTI') {
                            var optionValue = combo.ownerCt.getComponent('optionValue');
                            optionValue.show();
                            optionValue.setDisabled(false);
                            arr.map(function (item) {
                                item.hide();
                                item.setDisabled(true);
                            });
                        }
                    },
                    show: function () {
                        var me = this;
                        if (me.value) {
                            me.fireEvent('change', me, me.value, me.value);
                        }
                    },
                    afterrender: function () {
                        var me = this;
                        if (me.value) {
                            me.fireEvent('change', me, me.value, me.value);
                        }
                    }
                },
                diySetValue: function (value) {
                    if (value) {
                        this.setValue(value);
                    }
                }
            },
            stringValue: {
                xtype: 'textfield',
                name: 'value',
                itemId: 'stringValue',
                allowBlank: false,
                fieldLabel: i18n.getKey('固定值')
            },
            numberValue: {
                xtype: 'numberfield',
                name: 'value',
                hidden: true,
                disabled: true,
                itemId: 'numberValue',
                allowBlank: false,
                fieldLabel: i18n.getKey('固定值')
            },
            booleanValue: {
                xtype: 'combo',
                name: 'value',
                hidden: true,
                disabled: true,
                itemId: 'booleanValue',
                haveReset: true,
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'display', 'value'
                    ],
                    data: [
                        {
                            value: true,
                            display: 'true'
                        }, {
                            value: false,
                            display: 'false'
                        }
                    ]
                }),
                editable: false,
                displayField: 'display',
                valueField: 'value',
                allowBlank: false,
                fieldLabel: i18n.getKey('固定值')
            },
            optionValue: {
                xtype: 'multicombobox',
                name: 'value',
                hidden: true,
                disabled: true,
                itemId: 'optionValue',
                haveReset: true,
                multiSelect: me.selectType == 'MULTI' ? true : false,
                store: {
                    xtype: 'store',
                    model: 'CGP.attribute.model.AttributeOption',
                    proxy: {
                        type: 'memory'
                    },
                    data: me.attrOptions
                },
                editable: false,
                displayField: 'name',
                valueField: 'id',
                allowBlank: false,
                fieldLabel: i18n.getKey('固定值'),
                /**
                 * ConstantValue中的value都是string类型，Array现在为‘"123456","654321"’
                 */
                diyGetValue: function () {
                    var me = this;
                    if (me.multiSelect) {
                        return Ext.JSON.encode(me.getValue());
                    } else {
                        return me.getValue();
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
            },
            arrayValue: {
                xtype: 'arraydatafield',
                name: 'value',
                hidden: true,
                disabled: true,
                itemId: 'arrayValue',
                allowBlank: false,
                resultType: 'String',
                fieldLabel: i18n.getKey('固定值'),
                diyGetValue: function () {
                    var me = this;
                    return '[' + me.getValue() + ']';
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data && /\[.*\]/.test(data)) {
                        var str = data.replace(/(\[|\])/g, '');
                        me.setValue(str);
                    }
                }
            },
            JsonPath: {
                xtype: 'jsonpathtreecombo',
                fieldLabel: i18n.getKey('JsonPath'),
                padding: 0,
                allowBlank: false,
                multiselect: false,
                matchFieldWidth: false,
                store: treeStore,
            },
            attributeId: {
                xtype: 'attribute_grid_combo',
                fieldLabel: i18n.getKey('属性值'),
                name: 'attributeId',
                itemId: 'attributeId',
                allowBlank: false,
                hidden: true,
                disabled: true,
                store: me.contextStore,
                diyGetValue: function () {
                    var me = this;
                    return me.getSubmitValue()[0];
                },
                diySetValue: function (data) {
                    var me = this;
                    return me.setSubmitValue(data + '');
                }
            },
            parameter: {
                xtype: 'gridfieldwithcrudv2',
                hideLabel: true,
                itemId: 'parameter',
                allowBlank: true,
                name: 'parameter',
                fieldLabel: i18n.getKey('自定义参数'),
                winConfig: {
                    formConfig: {
                        width: 500,
                        defaults: {
                            width: 450
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'key',
                                allowBlank: false,
                                itemId: 'key',
                                fieldLabel: i18n.getKey('key')
                            },
                            {
                                name: 'value',
                                fieldLabel: i18n.getKey('value'),
                                xtype: 'valuefieldv2',
                                allowBlank: false,
                                contextStore: contextStore,
                                itemId: 'value'
                            }
                        ]
                    },
                },
                gridConfig: {
                    tbar: {
                        hiddenButtons: ['read', 'clear', 'config', 'help', 'export', 'import'],
                        btnDelete: {
                            hidden: false,
                            xtype: 'displayfield',
                            flex: 1,
                            value: '<font color="green">双击添加变量到表达式</font>',
                            handler: function (btn) {

                            }
                        }
                    },
                    store: {
                        xtype: 'store',
                        fields: [
                            'key',
                            {
                                name: 'value',
                                type: 'object'
                            }
                        ],
                        data: []
                    },
                    columns: [
                        {
                            text: i18n.getKey('key'),
                            dataIndex: 'key',
                            tdCls: 'vertical-middle'
                        },
                        {
                            xtype: 'componentcolumn',
                            text: i18n.getKey('value'),
                            dataIndex: 'value',
                            readOnly: true,
                            canChangeValue: false,//是否可以通过编辑改变record的
                            flex: 1,
                            renderer: function (value, metaData, record) {
                                if (value.clazz == 'ContextPathValue') {
                                    metaData.tdAttr = 'data-qtip="' + JSUbbToHtml(value.path) + '"';
                                    return '上下文路径：' + value.path;

                                } else if (value.clazz == 'ProductAttributeValue') {
                                    metaData.tdAttr = 'data-qtip="' + JSUbbToHtml(value.attributeId + '') + '"';
                                    return '产品属性：' + value.attributeId;

                                } else if (value.clazz == 'ConstantValue') {
                                    return '固定值：' + value.value;

                                } else if (value.clazz == 'CalculationValue') {
                                    return {
                                        xtype: 'displayfield',
                                        value: "<a href='#'>查看</a>",
                                        listeners: {
                                            render: function (display) {
                                                display.getEl().on("click", function () {
                                                    JSShowJsonData(null, '表达式', {
                                                        xtype: 'valuefieldv2',
                                                        margin: '25 25 25 0',
                                                        contextStore: contextStore,
                                                    }, {
                                                        layout: 'fit',
                                                        autoScroll: true,
                                                        width: 600,
                                                        height: null,
                                                        listeners: {
                                                            afterrender: function () {
                                                                var me = this;
                                                                this.items.items[0].setValue(value)
                                                            }
                                                        }
                                                    });
                                                });
                                            }
                                        }
                                    }
                                }
                            },
                        }
                    ],
                    listeners: {
                        itemdblclick: function (view, record, item, index, e, eOpts) {
                            var expression = arguments[0].ownerCt.ownerCt.ownerCt.getComponent('expression');
                            var str = expression.getValue() || '';
                            var key = record.get('key');
                            str = str + '${' + key + '}';
                            expression.setValue(str);
                        }
                    }
                },
            },
            expression: {
                xtype: 'uxtextarea_v2',
                fieldLabel: i18n.getKey('expression'),
                name: 'expression',
                itemId: 'expression',
                allowBlank: false,
                flex: 1,
                diySetValue: function (data) {
                    var me = this;
                    var controller = Ext.create('CGP.common.condition.controller.Controller');
                    data = controller.splitFunctionBody(data);
                    me.setValue(data);
                },
                diyGetValue: function () {
                    var me = this;
                    var data = me.getValue();
                    var controller = Ext.create('CGP.common.condition.controller.Controller');
                    data = controller.buildCompleteFunction(data);
                    return data;
                },
                toolbarConfig: {
                    items: [
                        {
                            xtype: 'button',
                            text: '编辑表达式',
                            itemId: 'edit',
                            iconCls: 'icon_edit',
                            handler: function (btn) {
                                var uxtextarea = btn.up('[xtype=uxtextarea_v2]');
                                var str = uxtextarea.down('textarea').getValue()
                                var win = Ext.create('CGP.common.condition.view.customexpression.CustomConditionWindow', {
                                    animateTarget: btn.el,//动画的起点
                                    initData: str,
                                    contentAttributeStore: me.contextStore,
                                    saveHandler: function (str) {
                                        uxtextarea.diySetValue(str);
                                    }
                                });
                                win.show()
                            }
                        },
                    ]
                },
            },
        };
        me.items = me.mergeConfig(me.components, me.itemsConfig);
        //对指定组件进行配置
        me.callParent();
        me.on('afterrender', function () {
            var me = this;
            var clazz = me.getComponent('clazz');
            clazz.setReadOnly(me.initBaseConfig.clazzReadOnly);
            clazz.setVisible(!me.initBaseConfig.clazzReadOnly);
            clazz.diySetValue(me.initBaseConfig.defaultClass);
            me.setValueType(me.initBaseConfig.defaultValueType, me.initBaseConfig.valueTypeReadOnly);
        });
    }
})

;