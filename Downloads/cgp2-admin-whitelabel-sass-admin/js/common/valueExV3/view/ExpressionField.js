/**
 * Created by nan on 2019/12/26.
 *  //需要配置上下文信息
 *   expressionConfig: {
 *                 contentAttributeStore: Ext.data.StoreManager.get('contentAttributeStore'),
 *             },
 */
Ext.define('CGP.common.valueExV3.view.ExpressionField', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.expressionfield',
    layout: {type: 'hbox'},
    labelAlign: 'left',
    defaults: {
        //去除原有的样式
    },
    isFormField: true,
    readOnly: false,
    msgTarget: 'side',
    defaultResultType: null,//表达式的返回值类型
    isCanUseTemplate: false,
    expressionConfig: null,
    uxTextareaContextData: null,
    defaultClazz: null,
    defaultExpression: null,//设置一默认的表达式
    deleteSrc: path + 'ClientLibs/extjs/resources//themes/images/shared/fam/remove.png',
    setExpressionValueWindowConfig: null,
    value: null,
    initComponent: function () {
        var me = this;
        me.listeners = me.listeners || {};
        me.listeners = Ext.Object.merge(me.listeners, {
            fieldvaliditychange: function () {
                me.isValid();
            }
        });
        me.items = [
            {
                xtype: 'button',
                text: i18n.getKey((me.value ? 'edit' : 'create')),
                name: 'expression',
                allowBlank: false,
                flex: 1,
                itemId: 'expression',
                expressionStore: Ext.create('Ext.data.Store', {
                    autoSync: true,
                    fields: [
                        {name: 'clazz', type: 'string'},
                        {name: 'expression', type: 'string'},
                        {name: 'expressionEngine', type: 'string', defaultValue: 'JavaScript'},
                        {name: 'inputs', type: 'array'},
                        {name: 'resultType', type: 'string'},
                        {name: 'promptTemplate', type: 'string'},
                        {name: 'min', type: 'object', defaultValue: undefined},
                        {name: 'max', type: 'object', defaultValue: undefined},
                        {name: 'regexTemplate', type: 'string', defaultValue: undefined}
                    ],
                    data: me.value ? [me.value] : []
                }),
                listeners: {
                    'afterrender': function (btn) {
                        btn.expressionStore.on('datachanged', function (store) {
                            btn.ownerCt.fireEvent('fieldvaliditychange');
                            if (store.getCount() > 0) {
                                btn.setText(i18n.getKey('edit'));
                            } else {
                                btn.setText(i18n.getKey('create'));
                            }
                        }, this, {})
                    }
                },
                getFieldLabel: function () {
                    var me = this;
                    return me.ownerCt.getFieldLabel();
                },
                getErrors: function () {
                    return '不允许为空'
                },
                getValue: function () {
                    if (Ext.isEmpty(this.expressionStore.getAt(0))) {
                        return null;

                    } else {
                        var result = this.expressionStore.getAt(0).getData();//去除多余数据
                        for (var i in result) {
                            if (Ext.isEmpty(result[i])) {
                                delete result[i];
                            }
                        }
                        return result;
                    }
                },
                isValid: function () {
                    var me = this;
                    if (me.disabled) {//禁用时不校验
                        return true;
                    } else {
                        return me.getValue() ? true : false;

                    }
                },
                getName: function () {
                    return this.name;
                },
                setValue: function (value) {
                    var me = this;
                    this.expressionStore.removeAll();
                    if (Ext.isEmpty(value)) {
                        me.setText(i18n.getKey('create'));
                    } else {
                        me.setText(i18n.getKey('edit'));
                        var record = new this.expressionStore.model(value);
                        this.expressionStore.add(record);
                    }
                    me.ownerCt.fireEvent('fieldvaliditychange');
                },
                handler: function (btn) {
                    var expressionField = btn.ownerCt;
                    var win = Ext.create('CGP.common.valueExV3.view.SetExpressionValueWindow', Ext.Object.merge({
                        expressionValueStore: btn.expressionStore,//记录expressionValue的store
                        readOnly: expressionField.readOnly,
                        configurableId: null,//旧的配置现在暂时没用到,
                        isCanUseTemplate: expressionField.isCanUseTemplate,//是否可以使用快捷的模板来创建function表达式，
                        uxTextareaContextData: expressionField.uxTextareaContextData,//表达式中使用的上下文
                        defaultResultType: expressionField.defaultResultType,//expression中的结果类型
                        expressionConfig: expressionField.expressionConfig,//expression中expression字段的配置
                        defaultClazz: expressionField.defaultClazz,
                    }, me.setExpressionValueWindowConfig));
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
                                    var expression = expressionField.getComponent('expression');
                                    expression.setValue();
                                }
                            })
                        });
                    }
                }
            }
        ];
        me.callParent();
        me.on('afterrender', function () {
            if (me.defaultExpression) {
                me.setValue({
                    clazz: me.defaultClazz || 'com.qpp.cgp.expression.Expression',
                    expression: me.defaultExpression,
                    expressionEngine: "JavaScript",
                    inputs: [],
                    resultType: me.defaultResultType || 'String',
                })
            }
        })
    },
    getValue: function () {
        return this.items.items[0].getValue();
    },
    setValue: function (value) {
        this.items.items[0].setValue(value);
        if (Ext.Object.isEmpty(value)) {//设置空值，即reset时的处理
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
            me.getActionEl().dom.setAttribute('aria-invalid', hasError);

            // Update the errorEl (There will only be one if msgTarget is 'side' or 'under') with the error message text
            if (me.errorEl) {
                me.errorEl.dom.innerHTML = activeError;
                //改变样式显示错误信息
                me.errorEl.dom.setAttribute('style', '');
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
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.disabled) {
            } else {
                if (item.isValid()) {
                } else {
                    valid = false;

                    me.Errors[item.getFieldLabel()] = item.getErrors();
                }
            }
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
    }
})
