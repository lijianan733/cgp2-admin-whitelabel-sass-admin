/**
 * Created by nan on 2018/1/3.
 */
Ext.syncRequire(['CGP.product.view.managerskuattribute.store.SkuAttribute']);
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainter.controller.Controller', {
    nodifyData: function (view, rowIndex, configurableId) {
        var store = view.getStore();
        var createOrEdit = '';
        var record = {};
        if (Ext.isEmpty(rowIndex)) {
            createOrEdit = 'create';
            record = Ext.create(store.model);
        } else {
            record = store.getAt(rowIndex);
            createOrEdit = 'edit'

        }
        var alertwindow = Ext.create('Ext.window.Window', {
            title: i18n.getKey(createOrEdit) + i18n.getKey('expression'),
            height: 750,
            modal: true,
            width: 800,
            layout: 'fit',
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'form',
                autoScroll: true,
                itemId: 'conditionsForm',
                fieldDefaults: {
                    margin: '10 0 0 20 ',
                    allowBlank: false
                },
                bbar: ['->', {
                    xtype: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function () {
                        var conditionsalertwindow = this.ownerCt.ownerCt.getComponent('conditionsalertwindow');
                        var itemsclassValue = conditionsalertwindow.getComponent('clazz').getValue();
                        if (itemsclassValue == 'RangeExpression') {
                            var inputs = conditionsalertwindow.getComponent('inputs');
                            var inputStore = inputs.gridConfig.store;
                            inputStore.removeAll();
                            var minIsUse = conditionsalertwindow.getComponent('min').getComponent('otherOperation').getComponent('allowUse').getValue();
                            var minIsEqual = conditionsalertwindow.getComponent('min').getComponent('otherOperation').getComponent('allowEqual').getValue();
                            if (minIsUse == true) {
                                var min = conditionsalertwindow.getComponent('min').getValue();
                                var newrecord = Ext.create(inputStore.model);
                                newrecord.set('clazz', 'com.qpp.cgp.expression.ExpressionInput');
                                newrecord.set('name', 'min');
                                newrecord.set('value', conditionsalertwindow.getComponent('min').getValue());
                                inputStore.add(newrecord);
                            }
                            var maxIsUse = conditionsalertwindow.getComponent('max').getComponent('otherOperation').getComponent('allowUse').getValue();
                            var maxIsEqual = conditionsalertwindow.getComponent('max').getComponent('otherOperation').getComponent('allowEqual').getValue();
                            if (maxIsUse == true) {
                                var max = conditionsalertwindow.getComponent('max').getValue();
                                var newrecord = Ext.create(inputStore.model);
                                newrecord.set('clazz', 'com.qpp.cgp.expression.ExpressionInput');
                                newrecord.set('name', 'max');
                                newrecord.set('value', conditionsalertwindow.getComponent('max').getValue());
                                inputStore.add(newrecord);
                            }
                            if (minIsUse == false && maxIsUse == false) {
                                Ext.Msg.alert(i18n.getKey('prompt'), '最大最小值必须有一项启用');
                            }
                            var expression = conditionsalertwindow.getComponent('expression');
                            var expressionString = 'function expression(context) { return ';
                            if (minIsUse == false) {
                                expressionString += (minIsEqual ? 'Number(context.inputs.min)<=Number(context.context.currentAttributeValue.value);}' : 'Number(context.inputs.min)<Number(context.context.currentAttributeValue.value);}');
                            } else if (maxIsUse == false) {
                                expressionString += (maxIsEqual ? 'Number(context.context.currentAttributeValue.value)<=Number(context.inputs.max);}' : 'Number(context.context.currentAttributeValue.value)<Number(context.inputs.max);}');
                            } else {
                                expressionString += (minIsEqual ? 'Number(context.inputs.min)<=Number(context.context.currentAttributeValue.value)' : 'Number(context.inputs.min)<Number(context.context.currentAttributeValue.value)');
                                expressionString += (maxIsEqual ? ' && Number(context.context.currentAttributeValue.value)<=Number(context.inputs.max);}' : ' && Number(context.context.currentAttributeValue.value)<Number(context.inputs.max);}');
                            }
                            expression.setValue(expressionString);
                        }
                        if (this.ownerCt.ownerCt.form.isValid()) {
                            for (var i in this.ownerCt.ownerCt.items.items[0].getValue()) {
                                if (i == 'inputs') {
                                    for (var j = 0; j < this.ownerCt.ownerCt.items.items[0].getValue()[i].length; j++) {
                                        delete this.ownerCt.ownerCt.items.items[0].getValue()[i][j].value.otherOperation;
                                    }
                                    record.set(i, this.ownerCt.ownerCt.items.items[0].getValue()[i]);

                                } else if (i == 'min' || i == 'max') {
                                    delete this.ownerCt.ownerCt.items.items[0].getValue()[i].otherOperation;
                                    record.set(i, this.ownerCt.ownerCt.items.items[0].getValue()[i]);

                                } else {
                                    record.set(i, this.ownerCt.ownerCt.items.items[0].getValue()[i]);
                                }

                            }
                            if (createOrEdit == 'create') {
                                store.add(record);
                            }
                            this.ownerCt.ownerCt.ownerCt.close();
                        }
                    }
                },
                    {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        handler: function () {
                            this.ownerCt.ownerCt.ownerCt.close();
                        }
                    }
                ]
            }
        });
        var alertwindowFormContainer = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.view.ValidExpressionContainer', {
            itemId: 'conditionsalertwindow',
            name: 'conditionsalertwindow',
            id: '777',
            gridConfigRenderTo: 'asasddf',
            configurableId: configurableId
        });
        alertwindowFormContainer.getComponent('clazz').store = Ext.create('Ext.data.Store', {
            autoSync: true,
            autoLoad: true,
            fields: [
                {name: 'name', type: 'string'},
                {name: 'class', type: 'string'}
            ],
            data: [
                {class: 'com.qpp.cgp.expression.Expression', name: 'CustomExpression'},
                {class: 'com.qpp.cgp.expression.RegexExpression', name: 'RegexExpression'}
            ]
        });
        alertwindow.getComponent('conditionsForm').add(alertwindowFormContainer);
        alertwindow.show();
        if (createOrEdit == 'edit') {
            var conditionsalertwindowFromContainer = alertwindow.getComponent('conditionsForm').getComponent('conditionsalertwindow');
            conditionsalertwindowFromContainer.setValue(record.data);
        }
    },
    showInputsDetail: function (value) {
        var restHttpRequestConfigs = value;
        var items = [];
        var headersItems = [];
        var queryParametersItems = [];
        for (var i = 0; i < restHttpRequestConfigs.length; i++) {
            var config = restHttpRequestConfigs[i];
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
                    for (var k in config[j]) {
                        if (k == 'clazz') {
                            config[j][k] = config[j][k].substring(config[j][k].lastIndexOf('.') + 1, (config[j][k].length));
                        }
                        var item2 = {
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey(k),
                            value: config[j][k]
                        };
                        items2.push(item2)
                    }
                    configItem = {
                        xtype: 'fieldset',
                        padding: false,
                        margin: '0 0 10 0',
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
            var item = {
                xtype: 'fieldset',
                title: i18n.getKey('input') + (i + 1),
                collapsible: true,
                items: nextItem
            };
            items.push(item)
        }
        var form = Ext.create('Ext.form.Panel', {
            padding: 10,
            autoScroll: true,
            border: false,
            items: items
        });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('input'),
            height: 400,
            width: 600,
            layout: 'fit',
            items: form
        }).show();
    },
    getFormValue: function (view, createOrEdit) {
        var validExpression = view.ownerCt.ownerCt.getComponent('validateExpression');
        if (!Ext.isEmpty(validExpression)) {
            var itemsclassValue = validExpression.getComponent('clazz').getValue();
            if (itemsclassValue == 'com.qpp.cgp.expression.RangeExpression') {
                var inputs = validExpression.getComponent('inputs');
                var inputStore = inputs.gridConfig.store;
                inputStore.removeAll();
                var minIsUse = validExpression.getComponent('min').getComponent('otherOperation').getComponent('allowUse').getValue();
                var minIsEqual = validExpression.getComponent('min').getComponent('otherOperation').getComponent('allowEqual').getValue();
                if (minIsUse == true) {
                    var min = validExpression.getComponent('min').getValue();
                    var newrecord = Ext.create(inputStore.model);
                    newrecord.set('clazz', 'com.qpp.cgp.expression.ExpressionInput');
                    newrecord.set('name', 'min');
                    newrecord.set('value', validExpression.getComponent('min').getValue());
                    inputStore.add(newrecord);
                }
                var maxIsUse = validExpression.getComponent('max').getComponent('otherOperation').getComponent('allowUse').getValue();
                var maxIsEqual = validExpression.getComponent('max').getComponent('otherOperation').getComponent('allowEqual').getValue();
                if (maxIsUse == true) {
                    var max = validExpression.getComponent('max').getValue();
                    var newrecord = Ext.create(inputStore.model);
                    newrecord.set('clazz', 'com.qpp.cgp.expression.ExpressionInput');
                    newrecord.set('name', 'max');
                    newrecord.set('value', validExpression.getComponent('max').getValue());
                    inputStore.add(newrecord);
                }
                if (minIsUse == false && maxIsUse == false) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '最大最小值必须有一项启用');
                    return null;
                }
                var expression = validExpression.getComponent('expression');
                var expressionString = 'function expression(context) { return ';

                if (minIsUse == false) {
                    expressionString += (minIsEqual ? 'Number(context.inputs.min)<=Number(context.context.currentAttributeValue.value);}' : 'Number(context.inputs.min)<Number(context.context.currentAttributeValue.value);}');
                } else if (maxIsUse == false) {
                    expressionString += (maxIsEqual ? 'Number(context.context.currentAttributeValue.value)<=Number(context.inputs.max);}' : 'Number(context.context.currentAttributeValue.value)<Number(context.inputs.max);}');
                } else {
                    expressionString += (minIsEqual ? 'Number(context.inputs.min)<=Number(context.context.currentAttributeValue.value)' : 'Number(context.inputs.min)<Number(context.context.currentAttributeValue.value)');
                    expressionString += (maxIsEqual ? ' && Number(context.context.currentAttributeValue.value)<=Number(context.inputs.max);}' : ' && Number(context.context.currentAttributeValue.value)<Number(context.inputs.max);}');
                }

                /*  if (minIsUse == false) {
                      expressionString += (maxIsEqual ? 'context.context.currentAttributeValue.value<=context.inputs.max;}' : 'context.context.currentAttributeValue.value<context.inputs.max;}');
                  } else if (maxIsUse == false) {
                      expressionString += (minIsEqual ? 'context.inputs.min<=context.context.currentAttributeValue.value;}' : 'context.inputs.min<context.context.currentAttributeValue.value;}');
                  } else {
                      expressionString += (minIsEqual ? 'context.inputs.min<=context.context.currentAttributeValue.value' : 'context.inputs.min<context.context.currentAttributeValue.value');
                      expressionString += (maxIsEqual ? ' && context.context.currentAttributeValue.value<=context.inputs.max;}' : ' && context.context.currentAttributeValue.value<context.inputs.max;}');
                  }*/
                expression.setValue(expressionString);
            }
        }
        if (view.ownerCt.ownerCt.form.isValid()) {
            //先处理最大最小值中的expression按钮的值
            var validateExpression = view.ownerCt.ownerCt.getComponent('validateExpression');
            if (!Ext.isEmpty(validateExpression)) {
                var clazz = validateExpression.getComponent('clazz').getValue();
                if (clazz == 'com.qpp.cgp.expression.RangeExpression') {
                    var minClazz = validateExpression.getComponent('min').getComponent('clazz').getValue();
                    var minIsUse = validateExpression.getComponent('min').getComponent('otherOperation').getComponent('allowUse').getValue();//是否启用
                    var maxClazz = validateExpression.getComponent('max').getComponent('clazz').getValue();
                    var maxIsUse = validateExpression.getComponent('max').getComponent('otherOperation').getComponent('allowUse').getValue();//是否启用
                    if (minIsUse && minClazz == 'com.qpp.cgp.value.ExpressionValueEx') {
                        //根据获取到的store中的记录是否为空进行判断
                        var minExpression = validateExpression.getComponent('min').getComponent('expression').getValue().clazz;
                        if (Ext.isEmpty(minExpression)) {
                            Ext.Msg.alert(i18n.getKey('prompt'), '最小值表达式不能为空');
                            return null;
                        }
                    }
                    if (maxIsUse && maxClazz == 'com.qpp.cgp.value.ExpressionValueEx') {
                        var maxExpression = validateExpression.getComponent('max').getComponent('expression').getValue().clazz;
                        if (Ext.isEmpty(maxExpression)) {
                            Ext.Msg.alert(i18n.getKey('prompt'), '最大值的表达式不能为空');
                            return null;
                        }
                    }
                }
            }
            var resultSet = {};
            view.ownerCt.ownerCt.items.items.forEach(function (field) {
                var val;
                if (field.xtype == 'gridcombo') {
                    val = field.getArrayValue();
                } else if (field.xtype == 'gridfield') {
                    if (field.isDisabled() == true) {
                        val = [];
                    } else {
                        val = field.getSubmitValue();
                    }
                } else if (field.xtype == 'singlegridcombo') {
                    val = field.getSingleValue();
                } else if (field.xtype == 'symbol') {
                    val = field.getSubmitValue();
                } else if (field.xtype == 'emailsfield') {
                    val = field.getSubmitValue();
                } else if (field.xtype == 'gridfieldselect') {
                    val = field.getSubmitValue();
                } else if (field.xtype == "backgroundfacegrid") {
                    val = field.getSubmitValue();
                } else if (field.xtype == 'radiogroup') {
                    var str = field.getName();
                    var object = JSON.parse('{"' + str + '":' + data[field.getName()] + ' }');
                    field.setValue(object);
                } else if (field.xtype == 'uxfieldcontainer') {
                    val = field.getValue();
                } else {
                    val = field.getValue();
                }
                resultSet[field.getName()] = val;
            });
            if (resultSet._id == '') {
                delete resultSet._id;
            }
            if (!Ext.isEmpty(validExpression)) {
                if (resultSet.validateExpression.clazz == 'com.qpp.cgp.expression.RangeExpression') {
                    for (var i = 0; i < resultSet.validateExpression.inputs.length; i++) {
                        delete resultSet.validateExpression.inputs[i].value.otherOperation;
                    }
                }
            }
            return resultSet;
        } else {
            return null;
        }
    },
    saveData: function (data, createOrEdit, recoreId, tab) {
        if (createOrEdit == 'create') {
            Ext.Ajax.request({
                url: adminPath + 'api/skuAttributeConstraints/v2',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: data,
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        var tabPanel = Ext.getCmp('EditAtrributeConstraintPanel');
                        var tabPanel2 = Ext.getCmp('managerSkuAttriConstraint');
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                            tabPanel.close();
                            tab.setActiveTab(tabPanel2);
                            tabPanel2.store.load();
                        });
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            })
        } else {
            Ext.Ajax.request({
                url: adminPath + 'api/skuAttributeConstraints/v2/' + recoreId,
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: data,
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        var tabPanel = Ext.getCmp('EditAtrributeConstraintPanel');
                        var tabPanel2 = Ext.getCmp('managerSkuAttriConstraint');
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                            tabPanel.close();
                            tabPanel2.store.load();
                            tab.setActiveTab(tabPanel2);
                        });
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            })
        }

    },
    showconditionsDetail: function (value) {
        var items = [];
        var me = this;
        for (var count = 0; count < value.length; count++) {
            var conditions = JSON.parse(JSON.stringify(value[count]));
            var countItems = [];
            var headersItems = [];
            var queryParametersItems = [];
            for (var i in conditions) {
                if (i == 'clazz') {
                    conditions[i] = conditions[i].substring(conditions[i].lastIndexOf('.') + 1, (conditions[i].length));
                }
                if (i == 'inputs') {
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
                                    var item2 = null;
                                    if (h == 'expression') {
                                        var id = JSGetUUID();
                                        var value = config[j][h];
                                        item2 = {
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
                                        item2 = {
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
                                    margin: '0 0 10 0',
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
                        var item = {
                            xtype: 'fieldcontainer',
                            labelAlign: 'top',
                            title: i18n.getKey('expression') + (k + 1),
                            fieldLabel: i18n.getKey('expression') + (k + 1),
                            collapsible: true,
                            items: nextItem,
                            defaults: {
                                margin: '0 0 10 30'
                            }
                        };
                        countItems.push(item)
                    }
                } else {
                    var item = {
                        xtype: 'displayfield',
                        fieldLabel: i18n.getKey(i),
                        value: conditions[i]

                    };
                    countItems.push(item)
                }
            }
            items.push({
                xtype: 'fieldset',
                labelAlign: 'top',
                title: i18n.getKey('condition') + (count + 1),
                fieldLabel: i18n.getKey('condition') + (count + 1),
                defaults: {
                    margin: '0 0 10 30'
                },
                collapsible: true,
                items: countItems
            })
        }
        var form = Ext.create('Ext.form.Panel', {
            padding: 10,
            autoScroll: true,
            border: false,
            items: items
        });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('check') + i18n.getKey('condition'),
            height: 600,
            width: 800,
            modal: true,
            layout: 'fit',
            items: form
        }).show();
    },
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
            height: 600,
            width: 800,
            modal: true,
            layout: 'fit',
            items: form
        }).show();
    },
    editOrAddItems: function (view, rowIndex, configurableId) {
        var store = view.getStore();
        var createOrEdit = '';
        var record = {};
        if (Ext.isEmpty(rowIndex)) {
            createOrEdit = 'create';
            record = Ext.create(store.model);
        } else {
            record = store.getAt(rowIndex);
            createOrEdit = 'edit'

        }
        var validMarker = JSGetUUID();
        var validObj = {};
        validObj[validMarker] = function (v) {
            var isnumber = /^(\-|\+)?\d+(\.\d+)?$/;
            return isnumber.test(v);
        };
        var validText = validMarker + 'Text';
        validObj[validText] = '输入值必须为数值！';
        Ext.apply(Ext.form.VTypes, validObj);


        var alertwindow = Ext.create('Ext.window.Window', {
            title: i18n.getKey(createOrEdit) + 'item',
            height: 750,
            modal: true,
            width: 850,
            layout: 'fit',
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'form',
                autoScroll: true,
                itemId: 'conditionsForm',
                fieldDefaults: {
                    margin: '10 0 0 20 ',
                    allowBlank: false
                },
                items: [
                    {
                        xtype: 'gridfield',
                        name: 'conditions',
                        itemId: 'conditions',
                        msgTarget: 'none',
                        allowBlank: true,
                        fieldLabel: i18n.getKey('condition'),
                        width: 650,
                        height: 200,
                        gridConfig: {
                            viewConfig: {
                                enableTextSelection: true
                            },
                            renderTo: 'DiscreteConditions',
                            height: 200,
                            width: 650,
                            allowBlank: true,
                            store: Ext.create('Ext.data.Store', {
                                autoSync: true,
                                fields: [
                                    {name: 'clazz', type: 'string'},
                                    {name: 'expression', type: 'string'},
                                    {name: 'expressionEngine', type: 'string'},
                                    {name: 'inputs', type: 'object'},
                                    {name: 'resultType', type: 'string'},
                                    {name: 'promptTemplate', type: 'string'},
                                    {name: 'min', type: 'object', defaultValue: undefined},
                                    {name: 'max', type: 'object', defaultValue: undefined},
                                    {name: 'regexTemplate', type: 'string', defaultValue: undefined}


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
                                                var controller = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.controller.Controller');
                                                controller.nodifyData(view, rowIndex, configurableId);
                                            }
                                        },
                                        {
                                            iconCls: 'icon_remove icon_margin',
                                            itemId: 'actionremove',
                                            tooltip: 'Remove',
                                            handler: function (view, rowIndex, colIndex) {
                                                var store = view.getStore();
                                                store.removeAt(rowIndex);
                                            }
                                        }

                                    ]
                                },
                                {
                                    text: i18n.getKey('type'),
                                    dataIndex: 'clazz',
                                    tdCls: 'vertical-middle',
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value.substring(value.lastIndexOf('.') + 1, (value.length)) + '"';//显示的文本
                                        return value.substring(value.lastIndexOf('.') + 1, (value.length));
                                    }
                                },
                                {
                                    text: i18n.getKey('expression'),
                                    dataIndex: 'expression',
                                    tdCls: 'vertical-middle'

                                },
                                {
                                    text: i18n.getKey('expressionEngine'),
                                    dataIndex: 'expressionEngine',
                                    tdCls: 'vertical-middle'

                                },
                                {
                                    text: i18n.getKey('resultType'),
                                    dataIndex: 'resultType',
                                    tdCls: 'vertical-middle'

                                },
                                {
                                    text: i18n.getKey('promptTemplate'),
                                    dataIndex: 'promptTemplate',
                                    tdCls: 'vertical-middle'

                                }
                            ],
                            tbar: [
                                {
                                    text: i18n.getKey('add'),
                                    iconCls: 'icon_create',
                                    handler: function () {
                                        var controller = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.controller.Controller');
                                        controller.nodifyData(this.ownerCt.ownerCt, null, configurableId);

                                    }
                                }
                            ]

                        }
                    }

                ],
                bbar: ['->',
                    {
                        xtype: 'button',
                        text: i18n.getKey('save'),
                        iconCls: 'icon_save',
                        handler: function () {
                            if (this.ownerCt.ownerCt.form.isValid()) {
                                var clazz = this.ownerCt.ownerCt.getComponent('valueContainer').getComponent('clazz').getValue();
                                if (clazz == 'com.qpp.cgp.value.ExpressionValueEx') {
                                    var expression = this.ownerCt.ownerCt.getComponent('valueContainer').getComponent('expression').getValue();
                                    if (Ext.isEmpty(expression)) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), '表达式不能为空');
                                        return;
                                    }
                                }
                                for (var j = 0; j < this.ownerCt.ownerCt.items.items.length; j++) {
                                    if (this.ownerCt.ownerCt.items.items[j].xtype == 'gridfield') {
                                        record.set(this.ownerCt.ownerCt.items.items[j].getName(), this.ownerCt.ownerCt.items.items[j].getSubmitData().conditions)
                                    } else {
                                        record.set(this.ownerCt.ownerCt.items.items[j].getName(), this.ownerCt.ownerCt.items.items[j].getValue())
                                    }
                                }
                                if (createOrEdit == 'create') {
                                    store.add(record);
                                }
                                this.ownerCt.ownerCt.ownerCt.close();
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        handler: function () {
                            this.ownerCt.ownerCt.ownerCt.close();
                        }
                    }
                ]
            }
        });
        var alertwindowFormContainer = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.view.ValidExpressionContainer', {
            itemId: 'alertwindowFormContainer',
            name: 'conditions',
            gridConfigRenderTo: 'conditions',
            fieldLabel: i18n.getKey('condition'),
            configurableId: configurableId
        });
        alertwindowFormContainer.getComponent('clazz').store = Ext.create('Ext.data.Store', {
            autoSync: true,
            autoLoad: true,
            fields: [
                {name: 'name', type: 'string'},
                {name: 'class', type: 'string'}
            ],
            data: [
                {class: 'com.qpp.cgp.expression.Expression', name: 'CustomExpression'},
                {class: 'com.qpp.cgp.expression.RegexExpression', name: 'RegexExpression'}
            ]
        });
        var expressionStore = Ext.create('Ext.data.Store', {
            autoSync: true,
            id: JSGetUUID(),//唯一标识
            fields: [
                {name: 'clazz', type: 'string'},
                {name: 'expression', type: 'string'},
                {name: 'expressionEngine', type: 'string'},
                {name: 'inputs', type: 'array'},
                {name: 'resultType', type: 'string'},
                {name: 'promptTemplate', type: 'string'},
                {name: 'min', type: 'object', defaultValue: undefined},
                {name: 'max', type: 'object', defaultValue: undefined},
                {name: 'regexTemplate', type: 'string', defaultValue: undefined}
            ],
            data: []
        });
        var valueContainer = Ext.create('Ext.ux.form.field.UxFieldContainer', {
            name: 'value',
            itemId: 'valueContainer',
            fieldLabel: i18n.getKey('value'),
            defaults: {
                allowBlank: false,
                width: 650,
                margin: '10 0 20 50 ',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'combo',
                    editable: false,
                    name: 'clazz',
                    itemId: 'clazz',
                    fieldLabel: i18n.getKey('type'),
                    value: 'default',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'clazz', type: 'string'},
                            {name: 'value', type: 'string'}
                        ],
                        data: [
                            {clazz: 'ConstantValue', value: 'com.qpp.cgp.value.ConstantValue'},
                            {
                                clazz: 'ProductAttrValueEx',
                                value: 'com.qpp.cgp.domain.product.value.ProductAttributeValueEx'
                            },
                            {clazz: 'UserAssignValue', value: 'com.qpp.cgp.value.UserAssignValue'},
                            {clazz: 'JsonPathValue', value: 'com.qpp.cgp.value.JsonPathValue'},
                            {clazz: 'ExpressionValueEx', value: 'com.qpp.cgp.value.ExpressionValueEx'}
                        ]
                    }),
                    displayField: 'clazz',
                    valueField: 'value',
                    listeners: {
                        'afterrender': function (view) {
                            view.setValue('com.qpp.cgp.value.ConstantValue');
                        },
                        'change': function (view, newValue, oldValue) {
                            var container = view.ownerCt.items.items;
                            for (var i = 0; i < container.length; i++) {
                                if (Ext.Array.contains(['clazz', 'otherOperation', 'type'], container[i].getName())) {
                                    continue;
                                }
                                container[i].setDisabled(true);
                                container[i].hide();
                            }
                            switch (newValue) {
                                case 'com.qpp.cgp.value.ConstantValue': {
                                    var value = view.up().getComponent('value');
                                    value.show();
                                    value.setDisabled(false)
                                    break;
                                }
                                case 'com.qpp.cgp.domain.product.value.ProductAttributeValueEx': {
                                    var attributeID = view.up().getComponent('attributeID');
                                    attributeID.show();
                                    attributeID.setDisabled(false)
                                    break;
                                }
                                case 'ClassSelector': {
                                    break;
                                }
                                case 'com.qpp.cgp.value.UserAssignValue': {
                                    break;
                                }
                                case 'com.qpp.cgp.value.JsonPathValue': {
                                    var path = view.up().getComponent('path');
                                    path.show();
                                    path.setDisabled(false)
                                    break;
                                }
                                case 'com.qpp.cgp.value.ExpressionValueEx': {
                                    var expression = view.up().getComponent('expression');
                                    expression.show();
                                    expression.setDisabled(false)
                                    break;
                                }
                            }
                        }
                    }
                },
                {
                    xtype: 'combo',
                    editable: false,
                    name: 'type',
                    itemId: 'type',
                    value: 'Number',
                    defaultValue: 'Number',
                    fieldLabel: i18n.getKey('valueType'),
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'type', type: 'string'}
                        ],
                        data: [
                            {type: 'Boolean'},
                            {type: 'String'},
                            {type: 'Array'},
                            {type: 'Date'},
                            {type: 'Number'}
                        ]
                    }),
                    displayField: 'type',
                    valueField: 'type',
                    listeners: {
                        'change': function (view, newValue, oldValue) {
                            var value = view.up().getComponent('value');
                            var clazz = view.up().getComponent('clazz').getValue();
                            if (clazz == 'com.qpp.cgp.value.ConstantValue') {
                                switch (newValue) {
                                    case 'Number' : {
                                        validObj[validMarker] = function (v) {
                                            var isNumber = /^(\-|\+)?\d+(\.\d+)?$/;
                                            return isNumber.test(v);
                                        };
                                        validObj[validText] = '输入值必须为数值！';
                                        Ext.apply(Ext.form.VTypes, validObj);
                                        break;
                                    }
                                    case 'Boolean' : {
                                        validObj[validMarker] = function (v) {
                                            return v == 'true' || v == 'false'
                                        };
                                        validObj[validText] = '输入值必须为true或false';
                                        Ext.apply(Ext.form.VTypes, validObj);
                                        value.reset();
                                        break;
                                    }
                                    default : {
                                        validObj[validMarker] = function (v) {
                                            return !Ext.isEmpty(v);
                                        };
                                        validObj[validText] = '该输入项不予许为空';
                                        Ext.apply(Ext.form.VTypes, validObj);
                                        break;
                                    }
                                }
                            }
                            value.validate();
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    name: 'value',
                    itemId: 'value',
                    vtype: validMarker,
                    fieldLabel: i18n.getKey('value')
                },
                {
                    xtype: 'combo',
                    name: 'attributeId',
                    itemId: 'attributeID',
                    editable: false,
                    store: Ext.create('CGP.product.view.managerskuattribute.store.SkuAttribute', {
                        configurableId: configurableId
                    }),
                    displayField: 'attributeName',
                    valueField: 'id',
                    hidden: true,
                    fieldLabel: i18n.getKey('attribute') + i18n.getKey('id')
                },
                {
                    xtype: 'textfield',
                    name: 'path',
                    itemId: 'path',
                    hidden: true,
                    fieldLabel: i18n.getKey('path')
                },
                {
                    xtype: 'uxfieldcontainer',
                    name: 'expression',
                    itemId: 'expression',
                    hidden: true,
                    layout: {xtype: 'hbox'},
                    labelAlign: 'left',
                    defaults: {
                        //去除原有的样式
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: '编辑',
                            name: 'expression',
                            storeData: expressionStore,
                            getValue: function () {
                                if (Ext.isEmpty(this.storeData.getAt(0))) {
                                    return null;

                                } else {
                                    return this.storeData.getAt(0).getData();
                                }
                            },
                            getName: function () {
                                return this.name;
                            },
                            setValue: function (value) {
                                var record = new this.storeData.model(value);
                                this.storeData.removeAll();
                                this.storeData.add(record);
                            },
                            handler: function (view) {
                                var controller = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.controller.Controller');
                                controller.showExpressValueExValue(view.storeData, view, configurableId);
                            }
                        }
                    ],
                    getValue: function () {
                        return this.items.items[0].getValue();
                    },
                    setValue: function (value) {
                        this.items.items[0].setValue(value);
                    },
                    fieldLabel: i18n.getKey('expression')
                }
            ]
        });
        alertwindow.getComponent('conditionsForm').add([valueContainer]);
        alertwindow.show();
        if (createOrEdit == 'edit') {
            var conditions = alertwindow.getComponent('conditionsForm').getComponent('conditions');
            conditions.setSubmitValue(record.get('conditions'))
            var valueContainer = alertwindow.getComponent('conditionsForm').getComponent('valueContainer');
            valueContainer.setValue(record.get('value'));

        }
    },
    setContinuousFormValue: function (form, data) {
        var sourcedata3 = data;
        if (sourcedata3.validateExpression.clazz == 'com.qpp.cgp.expression.RangeExpression') {
            for (var i = 0; i < sourcedata3.validateExpression.inputs.length; i++) {
                sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name] = {};
                var maxOrmin = sourcedata3.validateExpression.inputs[i].name == 'min' ? 'min' : 'max';
                sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name]['clazz'] = sourcedata3.validateExpression.inputs[i].value.clazz;
                sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name]['type'] = sourcedata3.validateExpression.inputs[i].value.type;
                sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name]['value'] = sourcedata3.validateExpression.inputs[i].value.value;
                sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name]['attributeId'] = sourcedata3.validateExpression.inputs[i].value.attributeId;
                sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name]['otherOperation'] = {};
                sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name]['assginValue'] = sourcedata3.validateExpression.inputs[i].value.assginValue;
                sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name]['calculatedValue'] = sourcedata3.validateExpression.inputs[i].value.calculatedValue;
                sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name]['path'] = sourcedata3.validateExpression.inputs[i].value.path;
                sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name]['expression'] = sourcedata3.validateExpression.inputs[i].value.expression;
                if (maxOrmin == 'min') {
                    sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name]['otherOperation']['allowUse'] = sourcedata3.validateExpression.expression.indexOf('context.inputs.min') >= 0 ? true : false;
                    sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name]['otherOperation']['allowEqual'] = sourcedata3.validateExpression.expression.indexOf('context.inputs.min<=') >= 0 ? true : false;
                }
                if (maxOrmin == 'max') {
                    var reacheStr = '<=context.inputs.max';
                    sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name]['otherOperation']['allowUse'] = sourcedata3.validateExpression.expression.indexOf('context.inputs.max') >= 0 ? true : false;
                    sourcedata3.validateExpression[sourcedata3.validateExpression.inputs[i].name]['otherOperation']['allowEqual'] = sourcedata3.validateExpression.expression.indexOf('<=context.inputs.max') >= 0 ? true : false;
                }
            }
        }
        sourcedata3.validateExpression['expressionEngine'] = 'JavaScript';
        for (var i = 0; i < form.items.items.length; i++) {
            if (form.items.items[i].xtype == 'gridfield') {
                form.items.items[i].setSubmitValue(sourcedata3[form.items.items[i].getName()])

            } else {
                form.items.items[i].setValue(sourcedata3[form.items.items[i].getName()]);
            }
        }

    },
    setDiscreteFormValue: function (form, data) {
        for (var i = 0; i < form.items.items.length; i++) {
            if (form.items.items[i].xtype == 'gridfield') {
                form.items.items[i].setSubmitValue(data[form.items.items[i].getName()])

            } else {
                form.items.items[i].setValue(data[form.items.items[i].getName()])
            }
        }
    },
    showExpressValueExValue: function (store, button, configurableId) {
        var controller = this;
        var storeData = store;
        var createOrEdit = storeData.getCount() > 0 ? 'edit' : 'create';
        var alertwindow = Ext.create('Ext.window.Window', {
            title: i18n.getKey(createOrEdit) + i18n.getKey('ExpressionValue'),
            height: 750,
            modal: true,
            width: 800,
            layout: 'fit',
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'form',
                autoScroll: true,
                itemId: 'conditionsForm',
                fieldDefaults: {
                    margin: '10 0 0 20 ',
                    allowBlank: false
                },
                bbar: ['->', {
                    xtype: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function (view) {
                        var conditionsalertwindow = this.ownerCt.ownerCt.items.items[0];
                        controller.getValidExpressionContainerValue(conditionsalertwindow, view, createOrEdit, storeData, button);
                    }
                },
                    {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        handler: function () {
                            this.ownerCt.ownerCt.ownerCt.close();
                        }
                    }
                ]
            }
        });
        var alertwindowFormContainer = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.view.ValidExpressionContainer', {
            itemId: JSGetUUID(),
            name: JSGetUUID(),
            id: JSGetUUID(),
            gridConfigRenderTo: JSGetUUID(),
            configurableId: configurableId
        });
        alertwindowFormContainer.getComponent('clazz').store = Ext.create('Ext.data.Store', {
            autoSync: true,
            autoLoad: true,
            fields: [
                {name: 'name', type: 'string'},
                {name: 'class', type: 'string'}
            ],
            data: [
                {class: 'com.qpp.cgp.expression.Expression', name: 'CustomExpression'},
                {class: 'com.qpp.cgp.expression.RegexExpression', name: 'RegexExpression'}
            ]
        });
        alertwindow.getComponent('conditionsForm').add(alertwindowFormContainer);
        if (createOrEdit == 'edit') {
            alertwindowFormContainer.setValue(store.getAt(0).getData());
        }
        alertwindow.show();
    },
    getValidExpressionContainerValue: function (conditionsalertwindow, view, createOrEdit, store, button) {
        var itemsclassValue = conditionsalertwindow.getComponent('clazz').getValue();
        var record = null;
        if (store.getCount() != 0) {
            record = store.getAt(0);
        } else {
            record = Ext.create(store.model);
        }
        if (itemsclassValue == 'RangeExpression') {
            var inputs = conditionsalertwindow.getComponent('inputs');
            var inputStore = inputs.gridConfig.store;
            inputStore.removeAll();
            var minIsUse = conditionsalertwindow.getComponent('min').getComponent('otherOperation').getComponent('allowUse').getValue();
            var minIsEqual = conditionsalertwindow.getComponent('min').getComponent('otherOperation').getComponent('allowEqual').getValue();
            if (minIsUse == true) {
                var min = conditionsalertwindow.getComponent('min').getValue();
                var newrecord = Ext.create(inputStore.model);
                newrecord.set('clazz', 'com.qpp.cgp.expression.ExpressionInput');
                newrecord.set('name', 'min');
                newrecord.set('value', conditionsalertwindow.getComponent('min').getValue());
                inputStore.add(newrecord);
            }
            var maxIsUse = conditionsalertwindow.getComponent('max').getComponent('otherOperation').getComponent('allowUse').getValue();
            var maxIsEqual = conditionsalertwindow.getComponent('max').getComponent('otherOperation').getComponent('allowEqual').getValue();
            if (maxIsUse == true) {
                var max = conditionsalertwindow.getComponent('max').getValue();
                var newrecord = Ext.create(inputStore.model);
                newrecord.set('clazz', 'com.qpp.cgp.expression.ExpressionInput');
                newrecord.set('name', 'max');
                newrecord.set('value', conditionsalertwindow.getComponent('max').getValue());
                inputStore.add(newrecord);
            }
            if (minIsUse == false && maxIsUse == false) {
                Ext.Msg.alert(i18n.getKey('prompt'), '最大最小值必须有一项启用');
            }
            var expression = conditionsalertwindow.getComponent('expression');
            var expressionString = 'function expression(context) { return ';

            if (minIsUse == false) {
                expressionString += (minIsEqual ? 'Number(context.inputs.min)<=Number(context.context.currentAttributeValue.value);}' : 'Number(context.inputs.min)<Number(context.context.currentAttributeValue.value);}');
            } else if (maxIsUse == false) {
                expressionString += (maxIsEqual ? 'Number(context.context.currentAttributeValue.value)<=Number(context.inputs.max);}' : 'Number(context.context.currentAttributeValue.value)<Number(context.inputs.max);}');
            } else {
                expressionString += (minIsEqual ? 'Number(context.inputs.min)<=Number(context.context.currentAttributeValue.value)' : 'Number(context.inputs.min)<Number(context.context.currentAttributeValue.value)');
                expressionString += (maxIsEqual ? ' && Number(context.context.currentAttributeValue.value)<=Number(context.inputs.max);}' : ' && Number(context.context.currentAttributeValue.value)<Number(context.inputs.max);}');
            }

            /*       if (minIsUse == false) {
                       expressionString += (minIsEqual ? 'context.inputs.min<=context.context.currentAttributeValue.value;}' : 'context.inputs.min<context.context.currentAttributeValue.value;}');
                   } else if (maxIsUse == false) {
                       expressionString += (maxIsEqual ? 'context.context.currentAttributeValue.value<=context.inputs.max;}' : 'context.context.currentAttributeValue.value<context.inputs.max;}');
                   } else {
                       expressionString += (minIsEqual ? 'context.inputs.min<=context.context.currentAttributeValue.value' : 'context.inputs.min<context.context.currentAttributeValue.value');
                       expressionString += (maxIsEqual ? ' && context.context.currentAttributeValue.value<=context.inputs.max;}' : ' && context.context.currentAttributeValue.value<context.inputs.max;}');
                   }*/
            expression.setValue(expressionString);
        }
        if (view.ownerCt.ownerCt.form.isValid()) {
            var fields = view.ownerCt.ownerCt.items.items[0];
            for (var i in fields.getValue()) {
                if (i == 'inputs') {
                    for (var j = 0; j < fields.getValue()[i].length; j++) {
                        delete fields.getValue()[i][j].value.otherOperation;
                    }
                    record.set(i, fields.getValue()[i]);

                } else if (i == 'min' || i == 'max') {
                    delete fields.getValue()[i].otherOperation;
                    record.set(i, fields.getValue()[i]);

                } else {
                    record.set(i, fields.getValue()[i]);
                }
            }
            if (createOrEdit == 'create') {
                store.add(record);
            }
            view.ownerCt.ownerCt.ownerCt.close();
        }
    }
})
