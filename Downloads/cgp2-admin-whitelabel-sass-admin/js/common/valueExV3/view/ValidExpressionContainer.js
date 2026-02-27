/**
 * Created by nan on 2018/3/14.
 */
Ext.syncRequire([
    'CGP.common.valueExV3.view.DiyComponent',
    'CGP.common.valueExV3.view.ConditionExpressionContainer',
    'CGP.common.valueExV3.config.Config2',
    'CGP.common.condition.view.UseTemplateBtn'
]);
Ext.define('CGP.common.valueExV3.view.ValidExpressionContainer', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.validexpressioncontainer',
    defaults: {
        allowBlank: false,
        width: 650,
        margin: '10 0 20 50 ',
        msgTarget: 'side'
    },
    msgTarget: 'none',
    layout: 'anchor',
    readOnly: false,
    isCanUseTemplate: false,//是否可以使用便捷模板生成expression
    showJsonDataWindowConfig: null,//展示上下文弹窗的配置
    uxTextareaContextData: null,//自定义的展示上下文弹窗中上下文信息，json格式数据
    defaultResultType: null,//默认或者已经确定了的结果类型
    expressionConfig: null,//自定义的expression的配置
    /**
     * 自定义校验
     */
    isValid: function () {
        var me = this;
        var result = 0;
        me.Errors = {};
        var type = me.getComponent('clazz').getValue();
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];

            if (item.isValid()) {
                result++;
            } else {
                me.Errors[item.getFieldLabel()] = item.getErrors();
            }
        }
        if (type == 'com.qpp.cgp.expression.RangeExpression') {
            var minIsUse = me.getComponent('min').getComponent('otherOperation').getComponent('allowUse').getValue();
            var maxIsUse = me.getComponent('max').getComponent('otherOperation').getComponent('allowUse').getValue();
            if (minIsUse == false && maxIsUse == false) {
                me.Errors['提示'] = '最大最小值必须有一项启用';
                return false;
            }
        }
        return result == me.items.items.length;
    },
    //编辑的弹窗
    handlerEdit: function (view, rowIndex) {
        var store = view.getStore();
        var record = store.getAt(rowIndex);
        var alertwindow = Ext.create('Ext.window.Window', {
            title: i18n.getKey('edit'),
            height: 350,
            modal: true,
            constrain: true,
            width: 450,
            layout: 'fit',
            items: {
                xtype: 'form',
                fieldDefaults: {
                    allowBlank: false
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'name',
                        itemId: 'name',
                        width: 350,
                        padding: '10 10 5 10',
                        fieldLabel: i18n.getKey('name')
                    },
                    {
                        xtype: 'textfield',
                        name: 'clazz',
                        itemId: 'clazz',
                        hidden: true,
                        fieldLabel: i18n.getKey('type'),
                        value: 'com.qpp.cgp.expression.ExpressionInput'
                    },
                    Ext.create('CGP.common.valueExV3.view.CommonPartField', {
                        name: 'value',
                        itemId: 'value',
                        padding: '10 10 5 10',
                        fieldLabel: i18n.getKey('value'),
                        defaults: {
                            width: 350,
                            padding: '10 10 5 30'

                        }
                    })
                ],
                bbar: ['->', {
                    xtype: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function () {
                        if (this.ownerCt.ownerCt.form.isValid()) {
                            for (var i = 0; i < this.ownerCt.ownerCt.items.items.length; i++) {
                                record.set(this.ownerCt.ownerCt.items.items[i].getName(), this.ownerCt.ownerCt.items.items[i].getValue());
                                record.set('clazz', 'com.qpp.cgp.expression.ExpressionInput');
                            }
                            this.ownerCt.ownerCt.ownerCt.close();
                        }
                    }
                },
                    {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        iconCls: "icon_cancel",
                        handler: function () {
                            this.ownerCt.ownerCt.ownerCt.close();
                        }
                    }
                ]
            }
        });
        alertwindow.show();
        alertwindow.items.items[0].getComponent('name').setValue(record.get('name'));
        alertwindow.items.items[0].getComponent('clazz').setValue(record.get('clazz'));
        alertwindow.items.items[0].getComponent('value').setValue(record.get('value'));
    },
    //创建的弹窗
    handlerCreate: function (view, store) {
        var record = Ext.create(store.model);
        var alertwindow = Ext.create('Ext.window.Window', {
            title: i18n.getKey('create'),
            height: 350,
            modal: true,
            width: 450,
            constrain: true,
            layout: 'fit',
            items: {
                xtype: 'form',
                fieldDefaults: {
                    allowBlank: false
                },
                items: [{
                    xtype: 'textfield',
                    name: 'name',
                    itemId: 'name',
                    width: 350,
                    padding: '10 10 5 10',
                    fieldLabel: i18n.getKey('name')
                },
                    {
                        xtype: 'textfield',
                        name: 'clazz',
                        itemId: 'clazz',
                        hidden: true,
                        fieldLabel: i18n.getKey('type'),
                        value: 'com.qpp.cgp.expression.ExpressionInput'
                    }, Ext.create('CGP.common.valueExV3.view.CommonPartField', {
                        name: 'value',
                        itemId: 'value',
                        padding: '10 10 5 10',
                        fieldLabel: i18n.getKey('value'),
                        defaults: {
                            width: 350,
                            padding: '10 10 5 30'

                        }
                    })],
                bbar: ['->',
                    {
                        xtype: 'button',
                        text: i18n.getKey('ok'),
                        iconCls: 'icon_save',
                        handler: function () {
                            if (this.ownerCt.ownerCt.form.isValid()) {
                                var clazz = this.ownerCt.ownerCt.getComponent('value').getComponent('clazz').getValue();
                                if (clazz == 'com.qpp.cgp.value.ExpressionValueEx') {
                                    var expression = this.ownerCt.ownerCt.getComponent('value').getComponent('expression').getValue();
                                    if (Ext.isEmpty(expression)) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), '表达式不能为空');
                                        return;
                                    }
                                }
                                for (var i = 0; i < this.ownerCt.ownerCt.items.items.length; i++) {
                                    record.set(this.ownerCt.ownerCt.items.items[i].getName(), this.ownerCt.ownerCt.items.items[i].getValue());
                                }
                                store.add(record);
                                this.ownerCt.ownerCt.ownerCt.close();
                            }

                        }
                    }, {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        iconCls: "icon_cancel",
                        handler: function () {
                            this.ownerCt.ownerCt.ownerCt.close();
                        }
                    }
                ]
            }
        });
        //   alertwindow.items.items[0].getComponent('value').getComponent('expression').items.items[0].storeData.removeAll();
        alertwindow.show();
    },
    /**
     * input中value的值类型为expression类型时，查看值的方法
     * @param value
     */
    showExpression: function (value) {
        var me = this;
        var items = [];
        var conditions = JSON.parse(JSON.stringify(value));
        var countItems = [];
        var count = 0;
        for (var i in conditions) {
            var item = null;
            if (i == 'clazz') {
                conditions[i] = conditions[i].substring(conditions[i].lastIndexOf('.') + 1, (conditions[i].length));
            }
            if (i == 'inputs') {
                var inputFieldSet = [];
                for (var k = 0; k < conditions[i].length; k++) {
                    var config = conditions[i][k];
                    var nextItem = [];
                    for (var j in config) {
                        if (j == 'clazz') {
                            config[j] = config[j].substring(config[j].lastIndexOf('.') + 1, (config[j].length));
                        }
                        var configItem = {
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey(j),
                            value: config[j]
                        };
                        if (j == 'value') {
                            var items2 = [];
                            for (var h in config[j]) {
                                if (h == 'clazz') {
                                    config[j][h] = config[j][h].substring(config[j][h].lastIndexOf('.') + 1, (config[j][h].length));
                                }
                                if (h == 'expression') {
                                    var id = JSGetUUID();
                                    var value = config[j][h];
                                    var item2 = {
                                        xtype: 'displayfield',
                                        fieldLabel: i18n.getKey(h),
                                        value: '<a href="#" id=' + id + '>' + '查看表达式' + '</a>',
                                        listeners: {
                                            render: function (display) {
                                                var clickElement = document.getElementById(id);
                                                if (!Ext.isEmpty(clickElement)) {
                                                    clickElement.addEventListener('click', function () {
                                                        me.showExpression(value)
                                                    }, false);
                                                }
                                            }
                                        }
                                    };
                                } else {
                                    var item2 = {
                                        xtype: 'displayfield',
                                        fieldLabel: i18n.getKey(h),
                                        value: config[j][h]
                                    };
                                }

                                items2.push(item2)
                            }
                            configItem = {
                                xtype: 'fieldcontainer',
                                padding: false,
                                labelAlign: 'top',
                                border: false,
                                title: i18n.getKey(j),
                                fieldLabel: i18n.getKey(j),
                                defaults: {
                                    margin: '0 0 10 30'
                                },
                                items: items2
                            };
                        }
                        nextItem.push(configItem);
                    }

                    inputFieldSet.push({
                        xtype: 'fieldset',
                        labelAlign: 'top',
                        collapsed: true,
                        title: i18n.getKey('input') + (k + 1),
                        fieldLabel: i18n.getKey('input') + (k + 1),
                        collapsible: true,
                        items: nextItem,
                        defaults: {
                            margin: '0 0 10 30'
                        }
                    });

                }
                var inputContainer = {
                    xtype: 'fieldcontainer',
                    items: inputFieldSet,
                    fieldLabel: i18n.getKey('input'),
                    labelAlign: 'top'
                }
                items.push(inputContainer);
            } else {
                item = {
                    xtype: 'displayfield',
                    fieldLabel: i18n.getKey(i),
                    value: conditions[i]
                }
                items.push(item)
            }
        }
        var form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            autoScroll: true,
            border: false,
            items: items
        });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('check') + i18n.getKey('expression'),
            height: '70%',
            width: '50%',
            maximizable: true,
            modal: true,
            constrain: true,
            layout: 'fit',
            items: form
        }).show();
    },
    /**
     * 获取该组件的值，并校验
     * @returns {*|{}}
     */
    getValidExpressionContainerValue: function () {
        var me = this;
        var itemsClassValue = me.getComponent('clazz').getValue();
        if (itemsClassValue == 'com.qpp.cgp.expression.RangeExpression') {
            var inputs = me.getComponent('inputs');
            var inputStore = inputs.gridConfig.store;
            inputStore.removeAll();
            var minIsUse = me.getComponent('min').getComponent('otherOperation').getComponent('allowUse').getValue();
            var minIsEqual = me.getComponent('min').getComponent('otherOperation').getComponent('allowEqual').getValue();
            if (minIsUse == true) {
                var min = me.getComponent('min').getValue();
                var newrecord = Ext.create(inputStore.model);
                newrecord.set('clazz', 'com.qpp.cgp.expression.ExpressionInput');
                newrecord.set('name', 'min');
                newrecord.set('value', min.uxfieldcontainer);
                inputStore.add(newrecord);
            }
            var maxIsUse = me.getComponent('max').getComponent('otherOperation').getComponent('allowUse').getValue();
            var maxIsEqual = me.getComponent('max').getComponent('otherOperation').getComponent('allowEqual').getValue();
            if (maxIsUse == true) {
                var max = me.getComponent('max').getValue();
                var newrecord = Ext.create(inputStore.model);
                newrecord.set('clazz', 'com.qpp.cgp.expression.ExpressionInput');
                newrecord.set('name', 'max');
                newrecord.set('value', max.uxfieldcontainer);
                inputStore.add(newrecord);
            }
            if (minIsUse == false && maxIsUse == false) {
                Ext.Msg.alert(i18n.getKey('prompt'), '最大最小值必须有一项启用');
                return false;
            }
            var expression = me.getComponent('expression');
            var expressionString = 'function expression(context) { return ';
            if (minIsUse == false) {//max启用
                expressionString += (maxIsEqual ? 'context.context.currentAttributeValue<=context.inputs.max;}' : 'context.context.currentAttributeValue<context.inputs.max;}');
            } else if (maxIsUse == false) {//min启用
                expressionString += (minIsEqual ? 'context.inputs.min<=context.context.currentAttributeValue;}' : 'context.inputs.min<runtime.currentAttributeValue.value;}');

            } else {//都启用
                expressionString += (minIsEqual ? 'context.inputs.min<=context.context.currentAttributeValue' : 'context.inputs.min<runtime.currentAttributeValue.value');
                expressionString += (maxIsEqual ? ' && context.context.currentAttributeValue<=context.inputs.max;}' : ' && context.context.currentAttributeValue<context.inputs.max;}');
            }
            expression.setValue(expressionString);
        }
        if (me.isValid()) {
            var data = me.getValue();
            var expression = data.expression;
            /*     me.getComponent('expression').getValue();*/
            for (var i in data) {
                if (i == 'inputs') {
                    for (var j = 0; j < data[i].length; j++) {
                        delete data[i][j].value.otherOperation;
                    }

                } else if (i == 'min' || i == 'max') {
                    data[i] = data[i].uxfieldcontainer;
                } else {
                }
            }

            data.expression = expression;
            return data;
        }
    },
    setValidExpressionContainerValue: function (data) {
        var me = this;
        var form = me;
        var setData = function (data) {
            if (data.clazz == 'com.qpp.cgp.expression.RangeExpression') {
                for (var i = 0; i < data.inputs.length; i++) {
                    data[data.inputs[i].name] = {};
                    var maxOrmin = data.inputs[i].name == 'min' ? 'min' : 'max';
                    if (maxOrmin == 'min') {
                        data.min.otherOperation = {};
                        data.min.otherOperation.allowUse = data.expression.indexOf('context.inputs.min') >= 0 ? true : false;
                        data.min.otherOperation.allowEqual = data.expression.indexOf('context.inputs.min<=') >= 0 ? true : false;
                        data.min.uxfieldcontainer = data.inputs[i].value;
                    }
                    if (maxOrmin == 'max') {
                        data.max.otherOperation = {};
                        data.max.otherOperation.allowUse = data.expression.indexOf('context.inputs.max') >= 0 ? true : false;
                        data.max.otherOperation.allowEqual = data.expression.indexOf('<=context.inputs.max') >= 0 ? true : false;
                        data.max.uxfieldcontainer = data.inputs[i].value;
                    }
                }
            }
            data['expressionEngine'] = 'JavaScript';
            for (var i = 0; i < form.items.items.length; i++) {
                var item = form.items.items[i];
                if (item.diySetValue) {
                    item.diySetValue(data[item.getName()]);
                } else {
                    if (item.xtype == 'gridfield') {
                        item.setSubmitValue(data[item.getName()]);
                    } else {
                        item.setValue(data[item.getName()]);
                    }
                }
            }
        }
        if (me.rendered) {
            setData(data);
        } else {
            me.on('afterrender', function (view) {
                setData(data);
            }, this, {
                single: true
            })
        }

    },
    initComponent: function () {
        var me = this;
        /*     Ext.apply(Ext.form.VTypes, {
                 valid2: function (v) {
                     var isnumber = /^(\-|\+)?\d+(\.\d+)?$/;
                     return isnumber.test(v);
                 },
                 valid2Text: '输入值必须为数值！'
             });*/
        me.defaults.readOnly = me.readOnly;
        me.items = [
            {
                name: 'clazz',
                xtype: 'combo',
                editable: false,
                itemId: 'clazz',
                value: 'com.qpp.cgp.expression.Expression',
                readOnly: me.readOnly || !Ext.isEmpty(me.defaultClazz),
                fieldLabel: i18n.getKey('type'),
                store: Ext.create('Ext.data.Store', {
                    autoSync: true,
                    fields: [
                        {name: 'name', type: 'string'},
                        {name: 'class', type: 'string'}
                    ],
                    data: [
                        {class: 'com.qpp.cgp.expression.Expression', name: '自定义表达式'},
                        {class: 'com.qpp.cgp.expression.RegexExpression', name: '正则校验表达式'},
                        //去除范围约束的选项
                        {class: 'com.qpp.cgp.expression.RangeExpression', name: '范围值表达式'}
                    ]
                }),
                valueField: 'class',
                displayField: 'name',
                listeners: {
                    'change': function (view, newValue, oldValue) {
                        Ext.suspendLayouts();//挂起布局
                        if (this.ownerCt.getComponent('inputs').rendered) {
                            this.ownerCt.getComponent('inputs').reset();

                        }
                        this.ownerCt.remove(this.ownerCt.getComponent('min'));
                        this.ownerCt.remove(this.ownerCt.getComponent('max'));
                        this.ownerCt.remove(this.ownerCt.getComponent('regexTemplate'));
                        if (newValue == 'com.qpp.cgp.expression.RangeExpression') {
                            this.ownerCt.add([Ext.create('CGP.common.valueExV3.view.DiyComponent', {
                                name: 'min',
                                itemId: 'min',
                                configurableId: me.configurableId,
                                fieldLabel: i18n.getKey('min'),
                                defaults: {
                                    allowBlank: false,
                                    width: 600,
                                    msgTarget: 'side'
                                }
                            }),
                                Ext.create('CGP.common.valueExV3.view.DiyComponent', {
                                    name: 'max',
                                    itemId: 'max',
                                    configurableId: me.configurableId,
                                    fieldLabel: i18n.getKey('max'),
                                    defaults: {
                                        allowBlank: false,
                                        width: 600,
                                        msgTarget: 'side'

                                    }
                                })]);
                            this.ownerCt.getComponent('inputs').hide();
                            this.ownerCt.getComponent('expression').hide();
                            this.ownerCt.getComponent('expression').setDisabled(true);
                            this.ownerCt.getComponent('resultType').setValue('Boolean');
                        }
                        if (newValue == 'com.qpp.cgp.expression.RegexExpression') {
                            this.ownerCt.add([Ext.create('Ext.form.field.Text', {
                                name: 'regexTemplate',
                                itemId: 'regexTemplate',
                                fieldLabel: i18n.getKey('regexTemplate')
                            })]);
                            this.ownerCt.getComponent('inputs').show();
                            this.ownerCt.getComponent('expression').show();
                            this.ownerCt.getComponent('expression').setDisabled(false);
                            /*
                                                        this.ownerCt.getComponent('resultType').setValue(null);
                            */

                        }
                        if (newValue == 'com.qpp.cgp.expression.Expression') {
                            this.ownerCt.getComponent('inputs').show();
                            this.ownerCt.getComponent('expression').show();
                            this.ownerCt.getComponent('expression').setDisabled(false);
                            /*
                                                        this.ownerCt.getComponent('resultType').setValue(null);
                            */
                        }
                        Ext.resumeLayouts();//停止布局
                        this.ownerCt.doLayout();
                    },
                    afterrender: function (combo) {
                        if (me.defaultClazz) {
                            combo.setValue(me.defaultClazz);
                        }
                    }
                }
            },
            {
                xtype: 'combo',
                itemId: 'expressionEngine',
                name: 'expressionEngine',
                editable: false,
                autoSelect: true,
                hidden: true,
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'enginName', type: 'string'}
                    ],
                    data: [
                        {enginName: 'JavaScript'}
                    ]
                }),
                displayField: 'enginName',
                valueField: 'enginName',
                value: 'JavaScript',
                fieldLabel: i18n.getKey('expressionEngine')
            },
            {
                xtype: 'gridfield',
                name: 'inputs',
                itemId: 'inputs',
                allowBlank: true,
                fieldLabel: i18n.getKey('input'),
                width: 665,
                autoScroll: true,
                minHeight: 70,
                maxHeight: 200,
                msgTarget: 'none',
                gridConfig: {
                    minHeight: 100,
                    width: 545,
                    autoScroll: true,
                    renderTo: me.gridConfigRenderTo,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        fields: [
                            {name: 'name', type: 'string'},
                            {name: 'clazz', type: 'string', defaultValue: 'com.qpp.cgp.expression.ExpressionInput'},
                            {name: 'value', type: 'object'}
                        ],
                        data: []
                    }),
                    columns: [
                        {
                            xtype: 'actioncolumn',
                            tdCls: 'vertical-middle',
                            itemId: 'actioncolumn',
                            width: 60,
                            sortable: false,
                            resizable: false,
                            menuDisabled: true,
                            items: [
                                {
                                    iconCls: 'icon_edit icon_margin',
                                    itemId: 'actionedit',
                                    tooltip: 'Edit',
                                    handler: function (view, rowIndex, colIndex) {
                                        me.handlerEdit(view, rowIndex);
                                    }
                                },
                                {
                                    iconCls: 'icon_remove icon_margin',
                                    itemId: 'actionremove',
                                    tooltip: 'Remove',
                                    hidden: me.readOnly,
                                    handler: function (view, rowIndex, colIndex) {
                                        var store = view.getStore();
                                        store.removeAt(rowIndex);
                                    }
                                }
                            ]
                        },
                        /*  {
                              text: i18n.getKey('type'),
                              dataIndex: 'clazz',
                              width: 150,
                              tdCls: 'vertical-middle',
                              renderer: function (value, metadata) {
                                  metadata.tdAttr = 'data-qtip="' + value.substring(value.lastIndexOf('.') + 1, (value.length)) + '"';//显示的文本
                                  return value.substring(value.lastIndexOf('.') + 1, (value.length));
                              }
                          },*/
                        {
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                            tdCls: 'vertical-middle'

                        },
                        {
                            text: i18n.getKey('value'),
                            dataIndex: 'value',
                            tdCls: 'vertical-middle',
                            flex: 1,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata) {
                                var id = JSGetUUID();
                                var expression = null;
                                var returnstr = '';
                                var noShowProperty = ['_id', 'clazz', 'createdDate', 'multilingualKey', 'constraints', 'idReference', 'createdBy', 'modifiedDate', 'modifiedBy']
                                for (var i in value) {
                                    if (i == 'clazz') {
                                        returnstr += i + ' :  ' + value[i].substring(value[i].lastIndexOf('.') + 1, value[i].length) + '<br>';
                                    } else if (i == 'expression') {
                                        returnstr += i + ' : <a href="#" id=' + id + '>' + '查看表达式' + '</a>';
                                        expression = value[i];
                                    } else if (Ext.Array.contains(noShowProperty, i)) {

                                    } else {
                                        returnstr += i + ' :  ' + value[i] + '<br>';
                                    }
                                }
                                return {
                                    xtype: 'displayfield',
                                    value: '<div style="white-space:normal;">' + returnstr + '</div>',
                                    listeners: {
                                        render: function (display) {
                                            var clickElement = document.getElementById(id);
                                            if (!Ext.isEmpty(clickElement)) {
                                                clickElement.addEventListener('click', function () {
                                                    me.showExpression(expression);
                                                }, false);
                                            }
                                        }
                                    }
                                };
                            }
                        }
                    ],
                    tbar: [
                        {
                            text: i18n.getKey('create'),
                            iconCls: 'icon_create',
                            disabled: me.readOnly,
                            handler: function (view) {
                                me.handlerCreate(view, this.ownerCt.ownerCt.store);
                            }
                        }
                    ]

                }
            },
            Ext.Object.merge({
                xtype: 'uxtextarea',
                name: 'expression',
                height: 200,
                itemId: 'expression',
                fieldLabel: i18n.getKey('expression'),
                allowBlank: false,
                textareaConfig: {
                    height: 160,
                },
                contentAttributeStore: null,//上下文store
                toolbarConfig: {
                    items: [
                        {
                            xtype: 'button',
                            text: '编辑表达式',
                            itemId: 'edit',
                            iconCls: 'icon_edit',
                            handler: function (btn) {
                                var expressionTextarea = btn.ownerCt.ownerCt;
                                var str = expressionTextarea.getValue();
                                var contentAttributeStore = expressionTextarea.contentAttributeStore
                                    || Ext.data.StoreManager.get('contentAttributeStore');
                                var win = Ext.create('CGP.common.condition.view.customexpression.CustomConditionWindow', {
                                    animateTarget: btn.el,//动画的起点
                                    initData: str,
                                    contentAttributeStore: contentAttributeStore,
                                    saveHandler: function (str) {
                                        expressionTextarea.setValue(str);
                                    }
                                });
                                win.show()
                            }
                        }
                    ]
                },
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
            }, me.expressionConfig),
            {
                xtype: 'combo',
                name: 'resultType',
                itemId: 'resultType',
                value: me.defaultResultType,
                readOnly: me.readOnly || !Ext.isEmpty(me.defaultResultType),
                fieldLabel: i18n.getKey('resultType'),
                editable: false,
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'type', type: 'string'}
                    ],
                    data: [
                        {type: 'Boolean'},
                        {type: 'String'},
                        {type: 'Array'},
                        {type: 'Date'},
                        {type: 'Number'},
                        {type: 'Map'}
                    ]
                }),
                displayField: 'type',
                valueField: 'type'
            },
            {
                xtype: 'textfield',
                name: 'promptTemplate',
                allowBlank: true,
                itemId: 'promptTemplate',
                fieldLabel: i18n.getKey('promptTemplate')
            }
        ];
        me.callParent(arguments);
    }
})
