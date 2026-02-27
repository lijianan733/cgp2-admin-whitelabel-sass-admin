/**
 * Created by nan on 2019/1/22.
 */
Ext.define('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.EditItemConditionForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',//带有错误提示的Form
    frame: false,
    record: null,
    itemId: 'editItemConditionForm',
    autoScroll: true,
    outTab: null,
    layout: {
        type: 'table',
        columns: 2
    },
    rawData: null,//记录未编辑前的原始数据
    defaults: {
        padding: '10 10 5 15'
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
    setFormValue: function (data) {
        var me = this;
        me.rawData = data;
        var condition = me.getComponent('condition');
        condition.setValue(data);
    },
    getFormValue: function () {
        var me = this;
        if (me.rendered) {//已经渲染完成
            var conditionValue = me.getComponent('condition').getValue();
            return {
                condition: conditionValue
            }
        } else {
            return {
                condition: me.rawData
            }
        }
    },
    showExpression: function (value) {
        var me = this;
        var items = [];
        var conditions = JSON.parse(JSON.stringify(value));
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
            height: '50%',
            width: '40%',
            maximizable: true,
            modal: true,
            constrain: true,
            layout: 'fit',
            items: form
        }).show();
    },
    initComponent: function () {
        var me = this;
        var mask = new Ext.LoadMask(me, {
            msg: "加载中..."
        });
        var controller = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.controller.Controller');
        me.tbar = Ext.create('Ext.ux.toolbar.Edit', {
            btnCreate: {
                hidden: true,
                handler: function () {
                }
            },
            btnCopy: {
                hidden: true
            },
            btnReset: {
                disabled: true
            },
            btnSave: {
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    var isValid = controller.validItemValue(form);
                    if (isValid) {
                        controller.saveItemValue(form);
                    }
                }
            },
            btnGrid: {
                disabled: true
            },
            btnConfig: {
                disabled: true,
                handler: function () {
                }
            },
            btnHelp: {
                handler: function () {
                }
            }
        });
        me.items = [
            Ext.create('CGP.common.valueExV3.view.ValidExpressionContainer', {
                fieldLabel: i18n.getKey('condition'),
                padding: '10 10 5 15',
                itemId: 'condition',
                defaults: {
                    allowBlank: false,
                    width: 650,
                    margin: '10 0 20 35',
                    msgTarget: 'side'
                }

            })
        ];
        me.callParent();
    }
})
