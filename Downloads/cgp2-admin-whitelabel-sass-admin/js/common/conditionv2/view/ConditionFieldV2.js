/**
 * @Description:
 * @author nan
 * @date 2023/6/7
 */

/**
 * Created by nan on 2021/10/16
 * 最外层组件，实现整个新的conditionV2
 * 单独组件,没和其他组件有关联，优先使用
 */
Ext.Loader.syncRequire([
    'CGP.common.conditionv2.view.ConditionFieldContainer'
])
Ext.define('CGP.common.conditionv2.view.ConditionFieldV2', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.condition_field_v2',
    layout: {
        type: 'hbox'
    },
    labelAlign: 'left',
    defaults: {
        //去除原有的样式
    },
    msgTarget: 'side',
    readOnly: false,
    allowBlank: true,
    deleteSrc: path + 'ClientLibs/extjs/resources//themes/images/shared/fam/clear.png',
    condition_field_container_config: null,//弹窗显示的组件的配置
    conditionDTO: null,//存放的具体数据
    initComponent: function () {
        var me = this;
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
                    var expressionField = btn.ownerCt;
                    var win = Ext.create('Ext.window.Window', Ext.Object.merge({
                        modal: true,
                        constrain: true,
                        title: i18n.getKey('condition'),
                        layout: 'fit',
                        items: [Ext.Object.merge({
                            xtype: 'condition_field_container',
                            name: 'condition_field_container',
                            itemId: 'condition_field_container',
                            height: 450,
                            width: 700,
                            maximizable: true,
                            checkOnly: false,//是否只能查看
                            resultClazz: 'ValueExDto',
                            simpleConditionGridConfig: {
                                maxHeight: 450,
                            },
                            complexConditionTreeConfig: {
                                maxHeight: 450,
                            },
                            contextStore: null,
                        }, me.condition_field_container_config)],
                        bbar: {
                            xtype: 'bottomtoolbar',
                            saveBtnCfg: {
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    var condition_field_container = win.getComponent('condition_field_container');
                                    if (condition_field_container.isValid()) {
                                        var conditionDTO = condition_field_container.getValue();
                                        expressionField.conditionDTO = conditionDTO;
                                        win.close();
                                    }
                                }
                            },
                            lastStepBtnCfg: {
                                xtype: 'button',
                                iconCls: 'icon_test',
                                hidden: false,
                                text: '<font color=red>测试当前配置</font>',
                                tooltip: '根据propertyModelId测试运行',
                                handler: function (btn) {
                                    var me = this;
                                    var toolbar = me.ownerCt;
                                    var win = toolbar.ownerCt;
                                    var condition_field_container = win.getComponent('condition_field_container');
                                    var dto = condition_field_container.getValue();
                                    var expressionData = null;
                                    if (dto) {
                                        var mainController = Ext.create('CGP.common.conditionv2.controller.MainController', {
                                            contextStore: condition_field_container.contextStore
                                        });
                                        var data = mainController.builderController(dto).generate();
                                        if (data.clazz == 'com.qpp.cgp.expression.Expression') {
                                            expressionData = data;
                                        } else {
                                            expressionData = data.expression;
                                        }
                                        JSValidValueEx(expressionData);
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('prompt'), '当前无需校验的配置数据');
                                    }
                                },
                            }
                        }
                    }, null));
                    win.show(null, function () {
                        if (expressionField.conditionDTO) {
                            var condition_field_container = win.getComponent('condition_field_container');
                            condition_field_container.setValue(expressionField.conditionDTO);
                        }
                    });
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
            if (me._grid) {
                if (hasError) {
                    me._grid.body.setStyle('borderColor', '#cf4c35')
                } else {
                    me._grid.body.setStyle('borderColor', 'silver #d9d9d9 #d9d9d9')
                }
            }
            me.getActionEl().dom.setAttribute('aria-invalid', hasError);
            if (me.errorEl) {
                me.errorEl.dom.innerHTML = activeError;
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
