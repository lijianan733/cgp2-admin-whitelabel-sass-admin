/**
 * @Description: 指定内置配置,和自定义配置
 * @author nan
 * @date 2023/2/1
 *
 *                             {
 *                                 xtype: 'combovalueexfield',
 *                                 fieldLabel: i18n.getKey('是否为混排的大版'),
 *                                 name: 'condition',
 *                                 itemId: 'condition',
 *                                 resultType: 'Boolean',
 *                                 tipInfo: '该条件先于选版表达式执行,执行结果为true的大版才能到下一步选版表达式处进一步筛选。',
 *                                 exampleData: [
 *                                     {
 *                                         display: 'true',
 *                                         expression: "function expression(args) { return args.context.mixRange == 'ORDERITEM' || args.context.mixRange == 'ORDER'; }",
 *                                         tag: 'true'
 *                                     },
 *                                     {
 *                                         display: 'false',
 *                                         expression: "function expression(args) { return args.context.mixRange == 'NONE' || args.context.mixRange == 'UNKNOWN'; }",
 *                                         tag: 'false'
 *                                     },
 *                                 ]
 *                             }
 *
 */
Ext.Loader.syncRequire([
    'CGP.common.valueExV3.model.ExpressionModel'
])
Ext.define("CGP.common.valueExV3.ComboValueExField", {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.combovalueexfield',
    defaults: {},
    labelAlign: 'left',
    layout: {
        type: 'hbox',
    },
    defaultResultType: null,//确定了的值类型
    resultType: 'String',//表达式返回值类型,大写开头的数据类型
    returnType: 'expression',//返回的数据结构类型,expression||valueEx
    allowBlank: true,
    defaultValue: '',//默认选中的配置
    exampleData: null,//内置数据数组 [display:'',expression:'expression function(){},tag:'xxx']
    errorInfo: '',
    value: null,
    comboConfig: null,
    initComponent: function () {
        var me = this;
        me.exampleData = me.exampleData || [];
        me.exampleData.push({expression: null, display: '自定义', tag: 'custom'});
        me.expressionStore = Ext.create('Ext.data.Store', {
            autoLoad: true,
            model: 'CGP.common.valueExV3.model.ExpressionModel',
            data: [{
                "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": me.resultType,
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": '',
                "multilingualKey": "com.qpp.cgp.expression.Expression"
            }],
            proxy: {
                type: 'memory'
            }
        });
        me.expressionStore.load();
        me.items = [
            Ext.Object.merge({
                xtype: 'combo',
                itemId: 'comboExpression',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'display',
                        'expression',
                        'tag'//标识
                    ],
                    data: me.exampleData
                }),
                displayField: 'display',
                valueField: 'tag',
                editable: false,
                haveReset: true,
                allowBlank: me.allowBlank,
                flex: 1,
                value: me.defaultValue,
                margin: '0px 5px 0px 0px',
            }, me.comboConfig),
            {
                xtype: 'button',
                text: i18n.getKey('查看'),
                iconCls: 'icon_check',
                width: 60,
                handler: function () {
                    me.expressionWind();
                }
            },
        ];
        me.callParent();
        const comboExpression = me.getComponent('comboExpression');
        comboExpression.on('select', function (comp, selection) {
            var me = this;
            var comboValueExField = me.ownerCt;
            var tag = selection[0].raw.tag;
            if (tag != 'custom') {
            } else if (tag == 'custom') {
                comboValueExField.expressionWind();
            }
        })

        if (me.value) {
            me.on('afterrender', function () {
                me.setValue(me.value);
            })
        }
    },
    expressionWind: function () {
        var me = this;
        var comboVal = me.getComponent('comboExpression').getValue();
        if (comboVal) {
            var expression = '';
            me.exampleData.map(function (item) {
                if (comboVal == item.tag) {
                    expression = item.expression;
                }
            });
            var readOnly = (comboVal != 'custom');
            me.expressionStore.getAt(0).set('expression', expression);
            var win = Ext.create('CGP.common.valueExV3.view.SetExpressionValueWindow', {
                readOnly: readOnly,
                defaultResultType: me.defaultResultType,//确定了的值类型
                expressionValueStore: me.expressionStore,//记录expressionValue的store
                uxTextareaContextData: me.uxTextareaContextData,//表达式中使用的上下文
                saveHandler: function (btn) {
                    //只有自定义的，才有保存
                    var form = btn.ownerCt.ownerCt;
                    var win = form.ownerCt;
                    var validExpressionContainer = form.items.items[0];
                    if (form.isValid()) {
                        var data = validExpressionContainer.getValidExpressionContainerValue();
                        if (data) {
                            win.expressionValueStore.removeAll();
                            win.expressionValueStore.add(data);
                            //保留自定义的表达式,更新store
                            me.exampleData[me.exampleData.length - 1].expression = data.expression;
                            me.getComponent('comboExpression').store.load();
                            win.close();
                        }
                    }
                }
            });
            win.show();
        }
    },
    isValid: function () {
        var me = this;
        if (me.allowBlank == false) {
            var isValid = me.getComponent('comboExpression').isValid();
            if (isValid == false) {
                me.errorInfo = '不允许为空';
            } else {
                var tag = me.getComponent('comboExpression').getValue();
                var expression = '';
                me.exampleData.map(function (item) {
                    if (item.tag == tag) {
                        expression = item.expression;
                    }
                });
                isValid = !Ext.isEmpty(expression);
                if (isValid == false) {
                    me.errorInfo = '自定义表达式不允许为空';
                }
            }
            return isValid;
        } else {
            return true;
        }
    },
    getErrors: function () {
        var me = this;
        return me.errorInfo;
    },
    getValue: function () {
        var me = this;
        if (me.rendered) {
            var tag = me.getComponent('comboExpression').getValue();
            var expression = '';
            me.exampleData.map(function (item) {
                if (item.tag == tag) {
                    expression = item.expression;
                }
            });
            if (expression) {
                var result = {
                    "clazz": "com.qpp.cgp.expression.Expression",
                    "resultType": me.resultType,
                    "expressionEngine": "JavaScript",
                    "inputs": [],
                    "expression": expression,
                    "multilingualKey": "com.qpp.cgp.expression.Expression"
                };
                if (me.returnType == 'expression') {
                    return result;
                } else if (me.returnType == 'valueEx') {
                    return {
                        "clazz": "com.qpp.cgp.value.ExpressionValueEx",
                        "type": me.resultType,
                        "defaultValue": "",
                        "expression": result,
                        "constraints": []
                    }
                }
            } else {
                return null;
            }
        } else {
            return me.value;
        }
    },
    setValue: function (data) {
        var me = this;
        var expression = '';
        if (data) {
            if (me.returnType == 'expression') {
                expression = data.expression;
            } else if (me.returnType == 'valueEx') {
                expression = data.expression.expression;
            }
            var tag = '';
            if (expression) {
                me.exampleData.map(function (item) {
                    if (item.expression == expression) {
                        tag = item.tag;
                    }
                });
            }
            if (Ext.isEmpty(tag)) {
                tag = 'custom';
                me.exampleData.map(function (item) {
                    if (item.tag == 'custom') {
                        item.expression = expression;
                    }
                });
                me.getComponent('comboExpression').store.load();
            }
            me.getComponent('comboExpression').setValue(tag);
        }
    }
})