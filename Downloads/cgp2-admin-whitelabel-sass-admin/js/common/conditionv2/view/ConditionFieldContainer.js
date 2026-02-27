/**
 * Created by nan on 2021/10/16
 * 最外层组件，实现整个新的conditionV2
 * 单独组件,没和其他组件有关联，优先使用
 */
Ext.Loader.syncRequire([
    'CGP.common.conditionv2.view.ConditionGrid',
    'CGP.common.conditionv2.view.ConditionTreeV2',
    'CGP.common.conditionv2.view.DiyExpressionContainer'
])
Ext.define('CGP.common.conditionv2.view.ConditionFieldContainer', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.condition_field_container',
    layout: {
        type: 'vbox'
    },
    checkOnly: false,//是否只能查看
    rawData: null, //初始值
    resultClazz: 'ValueExDto',//'ValueExDto' || 'ExpressionDto'
    contextStore: null,//自己按照指定格式生成的上下文store
    simpleConditionGridConfig: null,
    complexConditionTreeConfig: null,
    diyExpressionContainerConfig: null,
    defaults: {
        labelAlign: 'left',
        labelWidth: 100,
        msgTarget: 'side',
        width: '100%',
        validateOnChange: false,
        allowBlank: false
    },
    listeners: {
        afterrender: function () {
            var me = this;
            if (me.rawData) {
                me.setValue(me.rawData);
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.contextStore = me.contextStore ||
            Ext.StoreManager.get('contextStore');
        var simpleConditionGrid = Ext.Object.merge({
            xtype: 'conditiongrid_v2',
            hideConditionModel: false,
            collapsed: false,
            width: '100%',
            flex: 1,
            checkOnly: me.checkOnly,
            itemId: 'simpleConditionGrid',
            contextStore: me.contextStore,
        }, me.simpleConditionGridConfig);
        var complexConditionTree = Ext.Object.merge({
            hidden: true,
            xtype: 'condition_tree_v2',
            itemId: 'complexConditionTree',
            width: '100%',
            flex: 1,
            checkOnly: me.checkOnly,
            contextStore: me.contextStore,
        }, me.complexConditionTreeConfig);
        var diyExpression = Ext.Object.merge({
            xtype: 'diy_expression_container',
            hidden: true,
            title: i18n.getKey('自定义执行条件'),
            itemId: 'diyExpression',
            width: '100%',
            flex: 1,
            checkOnly: me.checkOnly,
            contextStore: me.contextStore,
        }, me.diyExpressionContainerConfig);
        me.componentUUId = JSGetUUID();
        me.items = [
            {
                xtype: 'radiogroup',
                itemId: 'radioGroup',
                margin: '0 25 0 15',
                componentUUId: me.componentUUId,
                defaults: {
                    width: 250,
                },
                layout: {
                    type: 'hbox',
                    align: 'left'
                },
                items: [
                    {
                        boxLabel: '简单配置',
                        readOnly: me.checkOnly,
                        name: me.componentUUId + '_conditionType',
                        inputValue: 'simple',
                        checked: true,
                    },
                    {
                        boxLabel: '复杂配置',
                        readOnly: me.checkOnly,
                        name: me.componentUUId + '_conditionType',
                        inputValue: 'complex'
                    },
                    {
                        boxLabel: '自定义',
                        readOnly: me.checkOnly,
                        name: me.componentUUId + '_conditionType',
                        inputValue: 'diyExpression'
                    },
                ],
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var panel = field.ownerCt;
                        var complexConditionTree = panel.getComponent('complexConditionTree');
                        var simpleConditionGrid = panel.getComponent('simpleConditionGrid');
                        var diyExpression = panel.getComponent('diyExpression');
                        var height = panel.getHeight();
                        Ext.suspendLayouts();
                        complexConditionTree.setVisible(newValue[field.componentUUId + '_conditionType'] == 'complex');
                        simpleConditionGrid.setVisible(newValue[field.componentUUId + '_conditionType'] == 'simple');
                        diyExpression.setVisible(newValue[field.componentUUId + '_conditionType'] == 'diyExpression');
                        diyExpression.setHeight(height > 300 ? height : 300);
                        Ext.resumeLayouts();
                        panel.doLayout();
                    }
                }
            },
            simpleConditionGrid,
            complexConditionTree,
            diyExpression
        ];
        me.callParent();
    },
    /**
     * 获取到组件最基本的数据结构
     */
    getBaseBom: function () {
        var me = this;
        var result = '';
        var radioGroupValue = me.getComponent('radioGroup').getValue();
        if (radioGroupValue[me.componentUUId + '_conditionType'] == 'simple') {
            //简单条件
            var simpleConditionGrid = me.getComponent('simpleConditionGrid');
            result = simpleConditionGrid.diyGetValue();
            result ? result['conditionType'] = 'simple' : null;
        } else if (radioGroupValue[me.componentUUId + '_conditionType'] == 'complex') {
            //复杂条件
            var complexConditionTree = me.getComponent('complexConditionTree');
            result = complexConditionTree.diyGetValue();
            result ? result['conditionType'] = 'complex' : null;
        } else if (radioGroupValue[me.componentUUId + '_conditionType'] == 'diyExpression') {
            //自定义
            var diyExpression = me.getComponent('diyExpression');
            result = diyExpression.getValue();
        }

        return result;
    },
    getValue: function () {
        var me = this;
        var result = me.getBaseBom();
        if (result) {
            //对简单和复杂进行封装
            if (result.clazz == 'LogicalOperation') {
                result = {
                    clazz: 'TemplateFunction',
                    template: 'function expression(args) { ${isContained} ${P1}};',
                    paragraph: {
                        //条件结构
                        "P1": {
                            clazz: "ReturnStructure",
                            value: result
                        }
                    }
                }

            } else if (result.clazz == 'CustomizeFunction') {

            }
            return {
                clazz: me.resultClazz,
                resultType: 'Boolean',
                function: result
            };
        } else {
            return null;
        }
    },
    /**
     * 设置最基础的数据结构
     */
    setBaseBom: function (data) {
        var me = this;
        var conditionType = me.getComponent('radioGroup');
        //设置具体数据
        if (data.clazz == 'LogicalOperation') {
            //逻辑操作
            var logicalOperation = data;
            if (logicalOperation.conditionType == 'simple') {
                //简单条件
                conditionType.setValue({
                    [me.componentUUId + '_conditionType']: 'simple'
                });
                var simpleConditionGrid = me.getComponent('simpleConditionGrid');
                simpleConditionGrid.diySetValue(logicalOperation);
            } else if (logicalOperation.conditionType == 'complex') {
                //复杂条件
                conditionType.setValue({
                    [me.componentUUId + '_conditionType']: 'complex'
                });
                var complexConditionTree = me.getComponent('complexConditionTree');
                complexConditionTree.diySetValue(logicalOperation);
            }
        } else if (data.clazz == 'CustomizeFunction') {
            //自定义表达式，这东西的层级结构特殊
            conditionType.setValue({
                [me.componentUUId + '_conditionType']: 'diyExpression'
            });
            var expression = data;
            var diyExpression = me.getComponent('diyExpression');
            diyExpression.setValue(expression);
        }
    },
    /**
     *
     * @param data ={
     *         clazz: "ValueExDto",//类型有valueExDto和ExpressionDto
     *         function: {
     *              clazz: "TemplateFunction",
     *              template: "function expression(args) { ${isContained} ${P1}};"
     *         },
     *         resultType: "Boolean"
     *     }
     * 目前function的类型只支持
     * TemplateFunction
     * {
     *              clazz: "TemplateFunction",
     *              template: "function expression(args) { ${isContained} ${P1}};"
     *}
     * CustomizeFunction
     * {
     *              clazz: "CustomizeFunction",
     *              expression: "function expression(args) { return xxxx;};"
     * }
     */
    setValue: function (data) {
        var me = this;
        if (data) {
            var rawData = data.function;
            if (rawData.clazz == 'TemplateFunction') {
                rawData = rawData.paragraph.P1.value;

            } else if (rawData.clazz == 'CustomizeFunction') {
            }
            me.setBaseBom(rawData);
            setTimeout(function () {
                me.doLayout();
            }, 500);
        }
    },
    getErrors: function () {
        var me = this;
        return me.Errors;
    },
    getName: function () {
        return this.name;
    },
    isValid: function () {
        var me = this;
        var valid = true;
        if (me.disabled == true || me.allowBlank == true) {
            valid = true;
        } else {
            me.items.items.map(function (item) {
                if (item.hidden == false) {
                    if (item.isValid() == false) {
                        valid = false;
                    }
                }
            })
        }
        me.renderActiveError(valid);
        return valid;
    },
    renderActiveError: function (valid) {
        var me = this;
        if (me.items.items[1].hidden == false) {
            me.items.items[1].el.dom.style.borderColor = (valid ? 'silver' : 'red');
        }
        if (me.items.items[2].hidden == false) {
            me.items.items[2].el.dom.style.borderColor = (valid ? 'silver' : 'red');
        }
    },
})