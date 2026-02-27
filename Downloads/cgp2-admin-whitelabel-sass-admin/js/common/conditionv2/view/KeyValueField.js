/**
 * @Description:key-value格式的数据，value为表达式或valueEx，当值一定为boolean时，用conditionFieldV2
 * @author nan
 * @date 2023/12/15
 */
Ext.Loader.syncRequire([
    'CGP.common.conditionv2.view.KeyToConditionGrid',
])
Ext.define('CGP.common.conditionv2.view.KeyValueField', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.key_value_field',
    layout: {
        type: 'hbox'
    },
    labelAlign: 'left',
    defaults: {
        //去除原有的样式
    },
    returnType: 'ValueExDto',//'ValueExDto' ||'ExpressionDto',
    valueType: 'String',
    msgTarget: 'side',
    readOnly: false,
    allowBlank: true,
    deleteSrc: path + 'ClientLibs/extjs/resources//themes/images/shared/fam/clear.png',
    key_to_condition_grid_config: null,//弹窗显示的组件的配置
    keyValueDTO: null,//存放的具体数据
    contextStore: null,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'button',
                text: '编辑',
                name: 'expression',
                flex: 1,
                itemId: 'expression',
                expressionStore: null,
                handler: function (btn) {
                    var key_value_field = btn.ownerCt;
                    var win = Ext.create('Ext.window.Window', Ext.Object.merge({
                        modal: true,
                        constrain: true,
                        title: i18n.getKey('赋值配置'),
                        layout: 'fit',
                        items: [Ext.Object.merge({
                            xtype: 'key_to_condition_grid',
                            name: 'key_to_condition_grid',
                            itemId: 'key_to_condition_grid',
                            maxHeight: 450,
                            minHeight: 250,
                            allowBlank: me.allowBlank,
                            width: 700,
                            maximizable: true,
                            checkOnly: false,//是否只能查看
                            resultClazz: 'ValueExDto',
                            valueType: me.valueType,
                            returnType: me.returnType,
                            contextStore: me.contextStore,
                        }, me.key_to_condition_grid_config)],
                        bbar: {
                            xtype: 'bottomtoolbar',
                            saveBtnCfg: {
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    var key_to_condition_grid = win.getComponent('key_to_condition_grid');
                                    if (key_to_condition_grid.isValid()) {
                                        var keyValueDTO = key_to_condition_grid.diyGetValue();
                                        key_value_field.keyValueDTO = keyValueDTO;
                                        win.close();
                                    }
                                }
                            },
                        }
                    }, null));
                    win.show(null, function () {
                        if (key_value_field.keyValueDTO) {
                            var key_to_condition_grid = win.getComponent('key_to_condition_grid');
                            key_to_condition_grid.diySetValue(key_value_field.keyValueDTO);
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
                                    var key_value_field = display.ownerCt;
                                    key_value_field.keyValueDTO = null;
                                }
                            })
                        });
                    }
                }
            }
        ];
        me.callParent();
    },
    /**
     * 按照需求自行修改返回的数据结构
     * @returns {{elseStatement: *, conditions: *, clazz: string}}
     */
    diyGetValue: function () {
        //默认返回一个标准valueEx结构
        var me = this;
        if (me.keyValueDTO) {
            return me.keyValueDTO;
        } else {
            return null;
        }
    },
    diySetValue: function (data) {
        var me = this;
        try {
            me.keyValueDTO = data;
        } catch (e) {
            console.log(e)
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
    /**
     *
     */
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
        if (Ext.isEmpty(me.keyValueDTO)) {
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
        var keyValueDTO = me.diyGetValue();
        //空的条件
        if (Ext.isEmpty(keyValueDTO)) {
            return null;
        } else {
            var controller = Ext.create('CGP.common.conditionv2.controller.MainController', {
                contextStore: me.contextStore
            });
            return controller.builderController(keyValueDTO).generate();
        }
    },
})
