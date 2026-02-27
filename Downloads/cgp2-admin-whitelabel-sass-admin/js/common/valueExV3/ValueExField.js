/**
 * Created by nan on 2019/4/22.
 * 由于是动态加载common包的
 * create关键字会提前加载，widget不会，
 * 故必须提前静态引入
 * valueEx的输入组件，form的getValues是无法获取到该组件的值
 * 以下样式用于模仿输入框
 例子：{
                        xtype: 'valueexfield',
                        name: 'material',
                        itemId: 'material',
                        width: 300,
                        fieldLabel: i18n.getKey('material'),
                        allowBlank: false,
                        commonPartFieldConfig: {
                           expressionConfig:{//配置最里层的表达式编写组件配置
                                    value:'sdfasssssss'
                                },
                            uxTextareaContextData: true,
                            defaultValueConfig: {
                                type: 'String',
                                clazz: 'com.qpp.cgp.value.JsonPathValue',
                                typeSetReadOnly: true,
                                clazzSetReadOnly: false

                            }
                        }
                    },
 例子2自定义输入组件： {
                    xtype: 'valueexfield',
                    msgTarget: 'side',
                    width: 450,
                    itemId: 'valueexfieldgridcombo',
                    name: 'valueexfieldgridcombo',
                    tipInfo: 'sdfas',
                    autoFitErrors: true,
                    combineErrors: true,
                    fieldLabel: i18n.getKey('valueexfieldgridcombo'),
                    diyValueExInputConfig: {
                        name: 'materialId',
                        xtype: 'gridcombo',
                        multiSelect: false,
                        displayField: 'name',
                        valueField: '_id',
                        labelAlign: 'right',
                        isComboQuery: true,
                        store: materialStore,
                        queryMode: 'remote',
                        editable: false,
                        matchFieldWidth: false,
                        pickerAlign: 'bl',
                        diySetValue: function (data) {
                            var me = this;
                            var data = data.toString();
                            me.setInitialValue(data.split(','));
                        },
                        diyGetValue: function () {
                            var me = this;
                            return me.getSubmitValue();
                        },
                        gridCfg: {
                            store: materialStore,
                            height: 300,
                            width: 600,
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    width: 80,
                                    dataIndex: '_id'
                                },
                                {
                                    text: i18n.getKey('name'),
                                    width: 150,
                                    dataIndex: 'name'
                                },
                                {
                                    text: i18n.getKey('type'),
                                    width: 150,
                                    dataIndex: 'type'
                                }
                            ],
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: materialStore,
                                displayInfo: true, // 是否 ? 示， 分 ? 信息
                                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                emptyMsg: i18n.getKey('noData')
                            })
                        }
                    }
                },
 //设置显示上下文弹窗的配置
 commonPartFieldConfig: {
                                                setExpressionValueWindowConfig: {
                                                    validExpressionContainerConfig: {
                                                        treePanelConfig: {
                                                            columns: {
                                                                items: [
                                                                    {
                                                                        xtype: 'treecolumn',
                                                                        text: 'key',
                                                                        flex: 1,
                                                                        dataIndex: 'text',
                                                                        sortable: true
                                                                    },
                                                                    {
                                                                        text: 'value',
                                                                        flex: 1,
                                                                        dataIndex: 'value',
                                                                        sortable: true
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                },
                                                uxTextareaContextData: {
                                                    context: {
                                                        'index': '可变尺寸导航项的位置',
                                                        '产品属性Id(A)': '属性值',
                                                        '产品属性Id(B)': '属性值',
                                                        "产品属性Id(C)": {
                                                            'length': '属性值',
                                                            'width': '属性值'
                                                        },
                                                        "产品属性Id(D)": [
                                                            '属性值1', '属性值2'
                                                        ]
                                                    }
                                                },
                                                defaultValueConfig: {
                                                    type: 'Boolean',
                                                    clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                                                    typeSetReadOnly: true,
                                                    clazzSetReadOnly: true
                                                }
                                            }
 //配置上下文
 commonPartFieldConfig: {
                    expressionConfig: {//配置最里层的表达式编写组件配置
                        contentAttributeStore: contextStore
                    },
                }
 clazz有3种
 'com.qpp.cgp.value.ConstantValue'
 'com.qpp.cgp.value.JsonPathValue'
 'com.qpp.cgp.value.ExpressionValueEx'
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.view.customexpression.CustomConditionWindow'
])
Ext.define('CGP.common.valueExV3.ValueExField', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.valueexfield',
    layout: 'hbox',
    labelAlign: 'left',
    defaults: {},
    allowBlank: false,
    msgTarget: 'side',
    readOnly: false,//默认为非只读
    value: null,//配置值,会在渲染后有该设置时，进行setValue
    saveHandler: null,
    deleteHandler: null,//点击了删除按钮时的自定义操作
    deleteSrc: path + 'ClientLibs/extjs/resources//themes/images/shared/fam/clear.png',
    commonPartFieldConfig: null,
    diyValueExInputConfig: null, /*{ {//自定义输入方式
        //不要配置itemId,listeners
        //diySetValue: null,//指定设置值的方法
        //diyGetValue: null,//指定获取值的方法
    },*/
    isOnlyUseConstantValue: false,//是否只使用具体值，为true时隐藏编辑按钮，使用户只能输入具体的数据
    clearError: function () {
        var me = this;
        me.unsetActiveError();
        if (me.errorEl) {
            //隐藏错误提示信息的dom
            me.errorEl.dom.setAttribute('style', 'display: none');
        }

    },
    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.disabled) {
            return true;
        }
        if (me.allowBlank) {
            return true;
        }
        var data = me.getValue();
        for (var i = 0; i < me.items.items[0].items.items.length; i++) {
            var item = me.items.items[0].items.items[i];
            if (item.hidden == false && item.disabled == false) {
                item.isValid();
                break;
            }
        }

        if (data) {//修改
            if (data.clazz == 'com.qpp.cgp.value.ConstantValue') {
                isValid = !Ext.isEmpty(data.value);
            } else if (data.clazz == 'com.qpp.cgp.value.JsonPathValue') {
                isValid = !Ext.isEmpty(data.path);
            } else if (data.clazz == 'com.qpp.cgp.value.ExpressionValueEx') {
                isValid = !Ext.Object.isEmpty(data.expression);
            }
        } else {//新建
            isValid = false;
        }
        //渲染出错误提示
        if (isValid) {
            me.clearError();
        } else {
            me.setActiveError('不允许为空');
            me.renderActiveError();
        }
        me.doComponentLayout();
        return isValid;
    },
    getErrors: function () {
        var me = this;
        var name = me.getFieldLabel();
        var result = {};
        /*
                result[name] = ['不允许为空'];
        */
        return ['不允许为空'];
    },
    getValue: function () {
        var me = this;
        var data = Ext.clone(me.getComponent('diyConditionExpression').getValue());//返回新的object对象;
        return data;

    },
    setValue: function (value) {
        var value = Ext.clone(value);
        var me = this;
        var diyConditionExpression = me.getComponent('diyConditionExpression');
        if (Ext.isEmpty(value) || Ext.Object.isEmpty(value)) {
            me.reset();
            if (value && value.value) {
                diyConditionExpression.setText(i18n.getKey('compile'));
            }
        } else {
            diyConditionExpression.setValue(value);
            diyConditionExpression.setText(me.readOnly ? i18n.getKey('check') : i18n.getKey('edit'));
            var showValueField = me.getComponent('showValueField');
            if (showValueField.rendered) {
                showValueField.setValue(value);
            } else {
                showValueField.on('afterrender', function () {
                    showValueField.setValue(value);
                })
            }
        }
    },
    reset: function () {
        var me = this;
        var showValueField = me.getComponent('showValueField');
        var diyConditionExpression = me.getComponent('diyConditionExpression');
        for (var i = 0; i < showValueField.items.items.length; i++) {
            var item = showValueField.items.items[i];
            if (item.hidden == false) {
                item.setValue();
            }
        }
        diyConditionExpression.setValue();
    },
    /**
     * 设置只读状态
     * @param readOnly
     */
    setReadOnly: function (readOnly) {
        var me = this;
        var showValueField = me.getComponent('showValueField');
        var deleteBtn = me.getComponent('deleteBtn');
        me.readOnly = readOnly;
        for (var i = 0; i < showValueField.items.items.length; i++) {
            var item = showValueField.items.items[i];
            item.setReadOnly(readOnly)
        }
        if (readOnly) {
            deleteBtn.hide();
        } else {
            deleteBtn.show();
        }
    },
    constructor: function () {
        var me = this;
        me.commonPartFieldConfig = {};
        //注册事件
        me.addEvents({"eventName": true})
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        var isExpressionType = false;
        var defaultType = 'String';
        try {
            isExpressionType = me.commonPartFieldConfig.defaultValueConfig.clazz == 'com.qpp.cgp.value.ExpressionValueEx';
        } catch (e) {
        }
        try {
            defaultType = me.commonPartFieldConfig.defaultValueConfig.type;
        } catch (e) {
        }
        Ext.apply(Ext.form.VTypes, {
            valid2: function (v) {
                return true
            },
            valid2Text: '',
            arrayValue: function (v) {
                var isarrayValue = /^\[.*\]$/;//校验以[开头，以]结尾的数据
                return isarrayValue.test(v);
            },
            arrayValueText: '不是array格式数据'
        });
        me.items = [
            {
                xtype: 'fieldcontainer',
                itemId: 'showValueField',
                layout: 'fit',
                flex: 2,
                hidden: isExpressionType,
                combineErrors: true,
                /**
                 * 改变数据时的监听
                 */
                valueChange: function (field, newValue, oldValue) {
                    var me = this;
                    var valueButton = me.ownerCt.getComponent('diyConditionExpression');
                    if (valueButton.value) {
                        if (valueButton.value.clazz == 'com.qpp.cgp.value.ConstantValue') {
                            valueButton.value.value = newValue;
                        } else if (valueButton.value.clazz == 'com.qpp.cgp.value.JsonPathValue') {
                            valueButton.value.path = newValue;
                        } else {
                            valueButton.value.expression.expression = newValue;
                        }
                        valueButton.setText(me.ownerCt.readOnly ? i18n.getKey('check') : i18n.getKey('edit'));
                    } else {
                        var data = {};
                        if (me.ownerCt.commonPartFieldConfig && me.ownerCt.commonPartFieldConfig.defaultValueConfig) {
                            var defaultValueConfig = me.ownerCt.commonPartFieldConfig.defaultValueConfig;
                            data = {
                                clazz: defaultValueConfig.clazz || "com.qpp.cgp.value.ConstantValue",
                                constraints: [],
                                type: defaultValueConfig.type || "String"
                            };
                            if (data.clazz == 'com.qpp.cgp.value.JsonPathValue') {
                                data.path = newValue;
                            } else {
                                data.value = newValue;
                            }
                        } else {
                            data = {
                                clazz: "com.qpp.cgp.value.ConstantValue",
                                constraints: [],
                                type: "String",
                                value: newValue
                            };
                        }
                        valueButton.value = data;
                    }
                    me.fireEvent('change');
                },
                setValue: function (value) {
                    var me = this;
                    var booleanValueField = me.getComponent('booleanValueField');
                    var textValueField = me.getComponent('textValueField');
                    var numberValueField = me.getComponent('numberValueField');
                    var expressionValueField = me.getComponent('expressionValueField');
                    var arrayValueField = me.getComponent('arrayValueField');
                    var jsonPathValueField = me.getComponent('jsonPathValueField');
                    var data = Ext.isEmpty(value.value) ? value.path : value.value;
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        item.hide();
                        item.setDisabled(true);
                    }
                    if (value.clazz == 'com.qpp.cgp.value.ExpressionValueEx') {
                        me.hide();
                        // expressionValueField.setValue(value.expression.expression);
                        //expressionValueField.show();
                        //expressionValueField.setDisabled(false);
                    } else {
                        if (me.ownerCt.diyValueExInputConfig) {
                            if (me.ownerCt.diyValueExInputConfig && me.ownerCt.diyValueExInputConfig.diySetValue) {//有自定义的设置值方法
                                textValueField.diySetValue(data);
                            } else {
                                textValueField.setValue(data);
                            }
                            textValueField.show();
                            textValueField.setDisabled(false);
                        } else if (value.clazz == 'com.qpp.cgp.value.JsonPathValue') {
                            jsonPathValueField.show();
                            jsonPathValueField.setValue(data);
                            jsonPathValueField.setDisabled(false);
                        } else {
                            if (value.type == 'Boolean') {
                                booleanValueField.setValue(data);
                                booleanValueField.show();
                                booleanValueField.setDisabled(false);
                            } else if (value.type == 'Number') {
                                numberValueField.setValue(data);
                                numberValueField.show();
                                numberValueField.setDisabled(false);
                            } else if (value.type == 'Array') {
                                arrayValueField.setValue(data);
                                arrayValueField.show();
                                arrayValueField.setDisabled(false);
                            } else {
                                textValueField.show();
                                textValueField.setDisabled(false);
                                textValueField.setValue(data);
                            }
                        }
                        me.show();
                    }
                },
                defaults: {
                    allowBlank: me.allowBlank,
                    readOnly: me.readOnly
                },
                items: [
                    Ext.Object.merge({
                        vtype: 'valid2',
                        xtype: 'textfield',
                        //maskRe: /[a-zA-Z]/,//只能输入符合表达式的按键
                        itemId: 'textValueField',
                        hidden: isExpressionType != false || (me.diyValueExInputConfig ? false : defaultType != 'String'),
                        disabled: isExpressionType != false || (me.diyValueExInputConfig ? false : defaultType != 'String'),
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                if (me.diyValueExInputConfig && me.diyValueExInputConfig.diyGetValue) {
                                    newValue = field.diyGetValue();
                                }
                                field.ownerCt.valueChange(field, newValue, oldValue);
                            }
                        }
                    }, me.diyValueExInputConfig),
                    {
                        xtype: 'numberfield',
                        itemId: 'numberValueField',
                        decimalPrecision: 8,//8位小数
                        allowExponential: false,//设置为false禁止使用指数数字表示法
                        hidden: isExpressionType != false || (me.diyValueExInputConfig ? true : defaultType != 'Number'),
                        disabled: isExpressionType != false || (me.diyValueExInputConfig ? true : defaultType != 'Number'),
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                console.log(newValue)
                                field.ownerCt.valueChange(field, newValue, oldValue);

                            },
                        },
                    },
                    {
                        xtype: 'textfield',
                        name: 'value',
                        hidden: isExpressionType != false || (me.diyValueExInputConfig ? true : defaultType != 'Array'),
                        disabled: isExpressionType != false || (me.diyValueExInputConfig ? true : defaultType != 'Array'),
                        itemId: 'arrayValueField',
                        vtype: 'arrayValue',
                        emptyText: '数据格式必须如:[123,1234]',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                field.ownerCt.valueChange(field, newValue, oldValue);

                            }
                        }
                    },
                    {
                        xtype: 'combo',
                        name: 'value',
                        hidden: isExpressionType != false || (me.diyValueExInputConfig ? true : defaultType != 'Boolean'),
                        disabled: isExpressionType != false || (me.diyValueExInputConfig ? true : defaultType != 'Boolean'),
                        itemId: 'booleanValueField',
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
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                field.ownerCt.valueChange(field, newValue, oldValue);

                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        name: 'value',
                        readOnly: true,
                        hidden: true,
                        disabled: !isExpressionType,
                        itemId: 'expressionValueField',
                        value: '条件表达式',
                        fieldStyle: 'background-color: silver'
                    },
                    {
                        xtype: 'textarea',
                        name: 'value',
                        hidden: true,
                        disabled: true,
                        itemId: 'jsonPathValueField',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                field.ownerCt.valueChange(field, newValue, oldValue);
                            }
                        }
                    },
                    {
                        xtype: 'textarea',
                        name: 'value',
                        hidden: true,
                        disabled: true,
                        itemId: 'jsonPathValueField',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                field.ownerCt.valueChange(field, newValue, oldValue);
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'button',
                value: null,
                margin: '0 0 0 5',
                itemId: 'diyConditionExpression',
                tooltip: me.readOnly ? i18n.getKey('check') : '点击进行编辑',
                text: me.readOnly ? i18n.getKey('check') : i18n.getKey('compile'),
                flex: 1,
                hidden: me.isOnlyUseConstantValue,
                iconCls: 'icon_edit',
                getValue: function () {
                    var me = this;
                    return me.value;
                },
                setValue: function (value) {
                    var me = this;
                    me.value = value;
                    if (value && value.value) {
                        me.setText(i18n.getKey('edit'));
                    } else {
                        me.setText(me.ownerCt.readOnly ? i18n.getKey('check') : i18n.getKey('compile'));
                    }
                },
                isValid: function () {
                    var me = this;
                    if (me.disabled) {
                        //禁用了的组件无需校验
                    } else {
                        var result = me.getValue();
                        if (result) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                handler: function (button) {
                    var showValueField = button.ownerCt.getComponent('showValueField');
                    var valueEx = Ext.create('CGP.common.valueExV3.GroupGridTab', {
                        itemId: 'diyConditionExpressionWindow',
                        readOnly: me.readOnly,
                        commonPartFieldConfig: Ext.Object.merge({
                            // isCanUseTemplate: true,

                        }, button.ownerCt.commonPartFieldConfig),
                        listeners: {
                            'afterrender': function (view) {
                                if (button.value) {
                                    view.getGridPanel().setValue(button.value.constraints);
                                    view.getFormPanel().setValue(button.value);
                                } else {
                                    view.getGridPanel().setValue({});
                                }
                            }
                        }
                    });
                    var win = Ext.create('Ext.window.Window', {
                        modal: true,
                        constrain: true,
                        maximizable: true,
                        diyConditionExpressionBtn: button,
                        layout: 'fit',
                        width: 450,
                        height: 350,
                        title: me.readOnly ? i18n.getKey('check') : i18n.getKey('compile'),
                        items: [valueEx],
                        bbar: [
                            '->',
                            {
                                xtype: 'button',
                                text: i18n.getKey('confirm'),
                                iconCls: 'icon_agree',
                                disabled: me.readOnly,
                                handler: me.saveHandler || function (btn) {
                                    var formPanel = btn.ownerCt.ownerCt.getComponent('diyConditionExpressionWindow').getFormPanel();
                                    var gridPanelValue = btn.ownerCt.ownerCt.getComponent('diyConditionExpressionWindow').getGridPanelValue();
                                    var formPanelValue = btn.ownerCt.ownerCt.getComponent('diyConditionExpressionWindow').getFormPanelValue();
                                    formPanelValue.constraints = gridPanelValue;
                                    if (!formPanel.isValid()) {
                                        return;
                                    } else {
                                        if (formPanelValue.clazz == 'com.qpp.cgp.value.ExpressionValueEx' && Ext.isEmpty(formPanelValue.expression)) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), '基本信息中的表达式不能为空！')
                                        } else {
                                            button.value = formPanelValue;
                                            showValueField.setValue(formPanelValue);
                                            button.setText(i18n.getKey('edit'));
                                            win.close();
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('cancel'),
                                iconCls: 'icon_cancel',
                                handler: function (btn) {
                                    win.close();
                                }
                            }
                        ]
                    });
                    win.show();
                }
            },
            Ext.Object.merge({
                xtype: 'displayfield',
                width: 16,
                padding: '0 0 0 5 ',
                height: 16,
                itemId: 'deleteBtn',
                hidden: me.readOnly || me.isOnlyUseConstantValue,
                value: '<img class="tag" title="点击进行清除数据" style="height: 100%;width: 100%;cursor: pointer" src="' + me.deleteSrc + '">',
                listeners: {
                    render: function (display) {
                        var a = display.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                        ela.on("click", function () {
                            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否清除已填写的数据'), function (selector) {
                                if (selector == 'yes') {
                                    me.deleteHandler ? me.deleteHandler(display) : display.ownerCt.reset();
                                }
                            })
                        });
                    }
                }
            },me.deleteBtn)
        ];
        me.callParent();
        me.on('afterrender', function (field) {
            if (me.value) {
                field.setValue(me.value);
            }
            var showValueField = me.getComponent('showValueField');
            me.relayEvents(showValueField, ['change']);
        })
    }
})
