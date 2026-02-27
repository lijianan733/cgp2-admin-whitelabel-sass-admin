/**
 * Created by nan on 2019/4/3.
 *
 *         var win = Ext.create('CGP.common.valueExV3.view.SetExpressionValueWindow', {
            expressionValueStore: expressionValueStore,//记录expressionValue的store
            isCanUseTemplate: false,//是否可以使用快捷的模板来创建function表达式
            saveHandler: function (btn) {
                var form = btn.ownerCt.ownerCt;
                var window = form.ownerCt;
                var validExpressionContainer = form.items.items[0];
                if (form.isValid()) {
                    var data = validExpressionContainer.getValidExpressionContainerValue();
                    if (data) {
                        var record = null;
                        window.expressionValueStore.removeAll();
                        record = new window.expressionValueStore.model(data);
                        expressionStore.add(record);
                        window.close();
                    }
                }
            }
        });
 */
Ext.define('CGP.common.valueExV3.view.SetExpressionValueWindow', {
    extend: 'Ext.window.Window',
    requires: ['Ext.ux.form.ErrorStrickForm'],
    controller: Ext.create('CGP.common.valueExV3.controller.Controller'),
    expressionValueStore: null,//记录expressionValue的store
    configurableId: null,//旧的配置现在暂时没用到,
    isCanUseTemplate: false,//是否可以使用快捷的模板来创建function表达式
    uxTextareaContextData: null,//自定义的textarea中查看上下文的内容源
    createOrEdit: 'create',//以上3个参数时必须传的
    height: 650,
    constrain: true,
    modal: true,
    width: 800,
    maximizable: true,
    layout: 'fit',
    readOnly: false,
    validExpressionContainer: null,
    saveHandler: null,//自定义的保存操作
    defaultResultType: null,//确定了的结果类型
    expressionConfig: null,//自定义expression字段的配置
    defaultClazz: null,//指定表达式类型
    validExpressionContainerConfig: null,
    initComponent: function () {
        var me = this;
        me.createOrEdit = me.expressionValueStore.getCount() > 0 ? 'edit' : 'create';//是否已经有数据
        me.title = (me.readOnly ? i18n.getKey('check') : i18n.getKey(me.createOrEdit)) + i18n.getKey('ExpressionValue');
        var validExpressionContainer = me.validExpressionContainer = Ext.create('CGP.common.valueExV3.view.ValidExpressionContainer', Ext.Object.merge({
                itemId: JSGetUUID(),
                name: JSGetUUID(),
                readOnly: me.readOnly,
                gridConfigRenderTo: JSGetUUID(),
                isCanUseTemplate: me.isCanUseTemplate,
                uxTextareaContextData: me.uxTextareaContextData,
                defaultResultType: me.defaultResultType,
                expressionConfig: me.expressionConfig,
                defaultClazz: me.defaultClazz,
                //configurableId: configurableId
            }, me.validExpressionContainerConfig)
        );
        validExpressionContainer.getComponent('clazz').store = Ext.create('Ext.data.Store', {//现在把范围表达式暂时不启用
            autoSync: true,
            autoLoad: true,
            fields: [
                {name: 'name', type: 'string'},
                {name: 'class', type: 'string'}
            ],
            data: [
                {class: 'com.qpp.cgp.expression.Expression', name: '自定义表达式'},
                {class: 'com.qpp.cgp.expression.RegexExpression', name: '正则校验表达式'},
                {class: 'com.qpp.cgp.expression.RangeExpression', name: '范围值表达式'}
            ]
        });

        me.items = [{
            xtype: 'errorstrickform',
            autoScroll: true,
            itemId: 'conditionsForm',
            fieldDefaults: {
                readOnly: me.readOnly,
                allowBlank: false
            },
            isValid: function () {
                this.msgPanel.hide();
                var errors = {};
                var isValid = true;
                var validExpressionContainer = this.items.items[0];
                validExpressionContainer.items.items.forEach(function (f) {
                    if (f.xtype == 'uxfieldcontainer') {
                        if (!f.isValid()) {
                            isValid = false;
                            errors[f.getFieldLabel()] = '不允许为空';
                        }
                    } else {
                        if (!f.isValid()) {
                            isValid = false;
                            errors[f.getFieldLabel()] = f.getErrors();
                        }
                    }

                });
                isValid ? null : this.showErrors(errors);
                return isValid;
            },
            items: [
                validExpressionContainer
            ],
            bbar: [
                {
                    xtype: 'button',
                    text: '<font color="red">' + i18n.getKey('测试expression') + '</font>',
                    iconCls: 'icon_test',
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        var validExpressionContainer = form.items.items[0];
                        if (form.isValid()) {
                            var data = validExpressionContainer.getValidExpressionContainerValue();
                            JSValidValueEx(data, me.uxTextareaContextData || {});
                        }
                    }
                },
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    disabled: me.readOnly,
                    handler: me.saveHandler || function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        var window = form.ownerCt;
                        var validExpressionContainer = form.items.items[0];
                        if (form.isValid()) {
                            var data = validExpressionContainer.getValidExpressionContainerValue();
                            if (data) {
                                var record = null;
                                ;
                                window.expressionValueStore.removeAll();
                                /*
                                                                record = new window.expressionValueStore.model(data);
                                */
                                record = window.expressionValueStore.add(data);
                                window.close();
                            }
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        var win = form.ownerCt;
                        win.close();
                    }
                }
            ]
        }];
        if (me.createOrEdit == 'edit') {
            me.validExpressionContainer.setValidExpressionContainerValue(me.expressionValueStore.getAt(0).getData());
        }
        me.callParent();
    }
})
