/**
 * Created by nan on 2019/12/26.
 *
 *
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.controller.Controller',
    'CGP.common.condition.store.ContentAttributeStore'
])
Ext.define('CGP.common.condition.ConditionFieldV3', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.conditionfieldv3',
    layout: {type: 'hbox'},
    labelAlign: 'left',
    defaults: {
        //去除原有的样式
    },
    msgTarget: 'side',
    readOnly: false,
    allowBlank: true,
    deleteSrc: path + 'ClientLibs/extjs/resources//themes/images/shared/fam/clear.png',
    /**
     *      示例
     *                conditionWindowConfig: {
     *                     conditionFieldContainerConfig: {
     *                         conditionPanelItems: {
     *                             qtyConditionGridPanel: {
     *                                 hidden: false,
     *                             }
     *                         }
     *                     }
     *                 }
     */
    conditionWindowConfig: null,//弹窗的配置
    extraParams: null,
    checkOnly: false,
    valueType: 'valueEx',//valueEx,和expression两种类型的返回值
    contentData: null,//标准格式的上下文数据
    rtAttribute: null,
    controller: null,
    condition: null,//生成的表达式
    /**
     *样例数据:
     {
                "clazz" : "com.qpp.cgp.domain.executecondition.InputCondition",
                "conditionType" : "custom",
                "operation" : {
                    "operations" : [],
                    "clazz" : "com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation",
                    "expression" : "function expression(args){return true;}"
                }
     }

     */
    conditionDTO: null,//组件的返回数据，初始值也是这里设置
    contentTemplate: null,//原本上下文模板数据
    functionTemplate: null,
    contentAttributeStore: null,
    initComponent: function () {
        var me = this;
        me.listeners = me.listeners || {};
        me.controller = Ext.create('CGP.common.condition.controller.Controller', {});
        me.contentAttributeStore = me.contentAttributeStore ||
            Ext.data.StoreManager.get('contentAttributeStore') ||
            Ext.create('CGP.common.condition.store.ContentAttributeStore', {
                storeId: 'contentAttributeStore',
                data: me.contentData
            });
        me.controller.contentAttributeStore = me.contentAttributeStore;
        me.items = [
            {
                xtype: 'button',
                text: '编辑',
                name: 'expression',
                allowBlank: false,
                flex: 1,
                itemId: 'expression',
                expressionStore: null,
                handler: function (btn) {
                    var conditionFieldV3 = btn.ownerCt;
                    var win = Ext.create('CGP.common.condition.view.ConditionWindow', Ext.Object.merge({
                        width: 800,
                        height: 450,
                        contentAttributeStore: me.contentAttributeStore,
                        // rtAttributeStore:me.rtAttributeStore,
                        conditionFieldV3: conditionFieldV3,
                        contentTemplate: me.contentTemplate,
                        functionTemplate: me.functionTemplate,
                    }, conditionFieldV3.conditionWindowConfig));
                    win.show();
                }
            },
            {
                xtype: 'displayfield',
                width: 16,
                margin: '-2 0 0 5 ',
                height: 16,
                hidden: me.readOnly,
                itemId: 'deleteBtn',
                value: '<img class="tag" title="点击进行清除数据" style="height: 100%;width: 100%;cursor: pointer" src="' + me.deleteSrc + '">',
                listeners: {
                    render: function (display) {
                        var a = display.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                        ela.on("click", function () {
                            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否清除已填写的数据'), function (selector) {
                                if (selector == 'yes') {
                                    var expressionField = display.ownerCt;
                                    expressionField.conditionDTO = null;
                                    expressionField.condition = null;
                                }
                            })
                        });
                    }
                }
            }
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        return me.conditionDTO;
    },
    setValue: function (conditionDTO) {
        var me = this;
        me.conditionDTO = conditionDTO;
        if (Ext.Object.isEmpty(conditionDTO)) {//设置空值，即reset时的处理
            this.clearError();
            this.doComponentLayout();
        }
    },
    clearError: function () {
        var me = this;
        me.unsetActiveError();
        if (me.errorEl) {
            //隐藏错误提示信息的dom
            me.errorEl.dom.setAttribute('style', 'display: none');
        }
    },
    renderActiveError: function () {
        var me = this,
            activeError = me.getActiveError(),
            hasError = !!activeError;

        if (activeError !== me.lastActiveError) {
            me.fireEvent('errorchange', me, activeError);
            me.lastActiveError = activeError;
        }
        if (me.rendered && !me.isDestroyed && !me.preventMark) {
            // Add/remove invalid class
            //me.el[hasError ? 'addCls' : 'removeCls'](me.invalidCls);
            if (me._grid) {
                if (hasError) {
                    me._grid.body.setStyle('borderColor', '#cf4c35')
                } else {
                    me._grid.body.setStyle('borderColor', 'silver #d9d9d9 #d9d9d9')
                }
            }
            // Update the aria-invalid attribute
            me.getActionEl().dom.setAttribute('aria-invalid', hasError);
            // Update the errorEl (There will only be one if msgTarget is 'side' or 'under') with the error message text
            if (me.errorEl) {
                me.errorEl.dom.innerHTML = activeError;
                //改变样式显示错误信息
                me.errorEl.dom.setAttribute('style', '');
            }
            if (me._grid) {
                me.doComponentLayout();
                me._grid.doLayout();
            }
        }
    },
    isValid: function () {
        var me = this;
        if (me.disabled) {
            return true;
        }
        if (me.allowBlank) {
            return true;
        }
        me.Errors = {};
        var valid = true;
        if (Ext.isEmpty(me.conditionDTO)) {
            valid = false
        }
        if (valid) {
            me.clearError();
        } else {
            me.setActiveError('不允许为空');
            me.renderActiveError();
        }
        me.doComponentLayout();
        return valid;
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
    /**
     *
     * @param readOnly
     */
    setReadOnly: function (readOnly) {
        var me = this;
        me.readOnly = readOnly;
        var deleteBtn = me.getComponent('deleteBtn');
        if (readOnly) {
            deleteBtn.hide();
        } else {
            deleteBtn.show();
        }
    },
    getExpression: function () {
        var me = this;
        var conditionDTO = me.getValue();
        //空的条件
        if (Ext.isEmpty(conditionDTO)) {
            return null;
        } else {
            return me.controller.conditionDTOToDomain(me.valueType, conditionDTO);
        }
    },
})
