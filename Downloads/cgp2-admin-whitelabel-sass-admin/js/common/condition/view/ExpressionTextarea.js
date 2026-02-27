/**
 * @Description:条件表达式中的表达式输入组件
 * @author nan
 * @date 2023/11/2
 */
Ext.Loader.syncRequire([
    'CGP.common.field.TextareCodemirror'
])
Ext.define('CGP.common.condition.view.ExpressionTextarea', {
    extend: 'Ext.ux.form.field.UxTextAreaV2',
    alias: 'widget.expression_textarea',
    contentAttributeStore: null,
    controller: null,
    hideToolbar: {
        hideEdit: false,
        hideConfig: false,
        hideExpression: false,
        hideTest: false,
    },
    /**
     * DTO数据
     * var result = {
     *             clazz: 'com.qpp.cgp.domain.executecondition.InputCondition',
     *             conditionType: 'custom',
     *             operation: {
     *                 operations: [],
     *                 clazz: 'com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation',
     *                 expression: data
     *             }
     *         };
     * @param data
     */
    valueType: 'Boolean',//默认都是使用为条件表达式
    contextType: 'normal',//上下文的形式 是normal还是profile
    profileStore: null,//产品profile信息
    customConditionWindowCfg: null,
    textareaCfg: null,
    setDTO: function (data) {
        var me = this;
        var expression = data?.operation?.expression || '';
        expression = me.controller.splitFunctionBody(expression);
        me.setValue(expression)
    },
    getDTO: function () {
        var me = this;
        var data = me.getValue();
        data = me.controller.buildCompleteFunction(data);
        var result = {
            clazz: 'com.qpp.cgp.domain.executecondition.InputCondition',
            conditionType: 'custom',
            operation: {
                operations: [],
                clazz: 'com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation',
                expression: data
            }
        };
        return result;
    },
    diySetValue: function (data) {
        this.setDTO(data);
    },
    diyGetValue: function () {
        return this.getDTO();
    },
    /**
     * 获取条件表达式
     * @param resultType
     * @returns
     */
    getExpression: function (resultType = 'expression') {
        var me = this;
        var DTO = me.getDTO();
        var controller = Ext.create('CGP.common.condition.controller.Controller');
        console.warn(me.valueType ? '' : '未配置valueType');
        var data = controller.conditionDTOToDomain(resultType, DTO, me.valueType);
        return data;
    },
    initComponent: function () {
        var me = this;
        var contentAttributeStore = me.contentAttributeStore;
        me.controller = Ext.create('CGP.common.condition.controller.Controller', {
            contentAttributeStore: contentAttributeStore
        });
        var contextType = me.contextType;
        var profileStore = me.profileStore;
        me.toolbarConfig = Ext.Object.merge({
            enableOverflow: true,
            items: [
                {
                    xtype: 'button',
                    text: '编辑表达式',
                    count: 0,
                    itemId: 'edit',
                    hidden: me.hideToolbar.hideEdit,
                    iconCls: 'icon_edit',
                    handler: function (btn) {
                        var description = btn.up('[xtype=expression_textarea]');
                        var controller = Ext.create('CGP.common.condition.controller.Controller');
                        var str = description.getValue();
                        var expression = controller.splitFunctionBody(str);
                        var win = Ext.create('CGP.common.condition.view.customexpression.CustomConditionWindow', Ext.Object.merge({
                            animateTarget: btn.el,//动画的起点
                            initData: expression,
                            contextType: contextType,
                            profileStore: profileStore,
                            contentAttributeStore: contentAttributeStore,
                            saveHandler: function (str) {
                                var expression = controller.splitFunctionBody(str);
                                description.setValue(expression);
                            }
                        }, me.customConditionWindowCfg));
                        win.show()
                    }
                },
                {
                    xtype: 'button',
                    text: '格式化',
                    hidden: me.hideToolbar.hideConfig,
                    iconCls: 'icon_config',
                    handler: function (btn) {
                        var description = btn.up('[xtype=expression_textarea]');
                        var str = description.getValue();
                        var tabchar = ' ';
                        var tabsize = '4';
                        description.setValue(window.js_beautify(str, tabsize, tabchar));
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'icon_test',
                    itemId: 'validExpression',
                    hidden: me.hideToolbar.hideExpression,
                    text: '<font color="red">校验语法</font>',
                    handler: function (btn) {
                        var description = btn.up('[xtype=expression_textarea]');
                        var str = description.getValue();
                        var controller = Ext.create('CGP.common.condition.controller.Controller');
                        str = controller.buildCompleteFunction(str);
                        var isValid = JSValidExpression(str, contentAttributeStore);
                        if (isValid == true) {
                            Ext.Msg.alert(i18n.getKey('prompt'), '校验通过');
                        }
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'icon_test',
                    hidden: me.hideToolbar.hideTest,
                    text: '<font color="red">测试运行</font>',
                    handler: function (btn) {
                        var description = btn.up('[xtype=expression_textarea]');
                        var expression = description.getExpression();
                        var isValid = JSValidExpression(expression?.expression, contentAttributeStore);
                        if (isValid) {
                            JSValidValueEx(expression);
                        }
                    }
                }
            ]
        }, me.toolbarCfg);
        me.textareaConfig = Ext.Object.merge({
            xtype: 'textarea_codemirror',
            grow: true,
            itemId: 'expression',
            name: 'expression',
            anchor: '100%',
        }, me.textareaCfg);
        me.callParent();
    },
})