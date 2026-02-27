/**
 * Created by nan on 2018/3/14.
 */
Ext.define('CGP.common.valueExV3.controller.Controller', {
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
                                                            var controller = Ext.create('CGP.common.valueExV3.controller.Controller');
                                                            controller.showExpression(value)
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
            height: '70%',
            width: '50%',
            modal: true,
            constrain: true,
            layout: 'fit',
            items: form
        }).show();
    },
    /**
     *显示value中expressionValueEx的值的窗口，即配置获取值的表达式配置窗口
     * @param store
     * @param button
     * @param configurableId
     * @param isCanUseTemplate 是否可以根据便捷模板创建，便捷模板的返回值必定为boolean类型
     */
    showExpressValueExValue: function (store, button, configurableId, isCanUseTemplate) {
        var controller = this;
        var storeData = store;
        var createOrEdit = storeData.getCount() > 0 ? 'edit' : 'create';
        var alertwindow = Ext.create('Ext.window.Window', {
            title: i18n.getKey(createOrEdit) + i18n.getKey('ExpressionValue'),
            height: '70%',
            constrain: true,
            modal: true,
            width: '50%',
            maximizable: true,
            layout: 'fit',
            items: {
                xtype: 'form',
                autoScroll: true,
                itemId: 'conditionsForm',
                fieldDefaults: {
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
        var alertwindowFormContainer = Ext.create('CGP.common.valueExV3.view.ValidExpressionContainer', {
            itemId: JSGetUUID(),
            name: JSGetUUID(),
            id: JSGetUUID(),
            gridConfigRenderTo: JSGetUUID(),
            isCanUseTemplate: isCanUseTemplate
            //configurableId: configurableId
        });
        alertwindowFormContainer.getComponent('clazz').store = Ext.create('Ext.data.Store', {
            autoSync: true,
            autoLoad: true,
            fields: [
                {name: 'name', type: 'string'},
                {name: 'class', type: 'string'}
            ],
            data: [
                {class: 'com.qpp.cgp.expression.Expression', name: '自定义表达式'},
                {class: 'com.qpp.cgp.expression.RegexExpression', name: '正则校验表达式'}
            ]
        });
        alertwindow.getComponent('conditionsForm').add(alertwindowFormContainer);
        if (createOrEdit == 'edit') {
            alertwindowFormContainer.setValue(store.getAt(0).getData());
        }
        alertwindow.show();
    },
    /**
     *
     * @param recordId
     * @param tab 外围的tab
     * @param createOrEdit
     * @param inputTypeClazz 选择的约束类型clazz
     * @param data 记录数据集
     * @param configurableId
     * @param record  当前编辑的记录
     * @param currentPanel 跳转前的窗口
     */
    selectConstraintType: function (recordId, tab, createOrEdit, inputTypeClazz, data, configurableId, record, currentPanel) {
        var createOrEdit = createOrEdit;
        var inputTypeClazz = inputTypeClazz
        var controller = Ext.create('CGP.common.valueExV3.controller.Controller');
        var panel = tab.getComponent('EditAtrributeConstraintPanel');
        if (!Ext.isEmpty(panel)) {
            tab.remove(panel);
        }
        panel = Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            id: JSGetUUID(),
            title: i18n.getKey(createOrEdit) + i18n.getKey('constraint'),
            itemId: 'EditAtrributeConstraintPanel',
            closable: true,//是否显示关闭按钮,
            autoScroll: true
        });
        if (inputTypeClazz == 'com.qpp.cgp.value.constraint.DiscreteValueConstraint') {
            var EditDiscreteValueConstraintForm = Ext.create('CGP.common.valueExV3.view.EditDiscreteValueConstraintForm', {
                createOrEdit: createOrEdit,
                configurableId: configurableId,
                inputTypeClazz: inputTypeClazz,
                recordId: recordId,
                tab: tab,
                editPanel: panel,
                currentPanel: currentPanel,
                record: record,
                itemId: 'editConstraint',
                listeners: {
                    'afterrender': function (form) {
                        if (createOrEdit == 'edit') {
                            form.setFormValue(data);
                            /*  controller.setDiscreteFormValue(EditDiscreteValueConstraintForm, data);
                              EditDiscreteValueConstraintForm.items.items[3].isValid();*/
                        }
                    }
                }
            });
            EditDiscreteValueConstraintForm.configurableId = configurableId;
            panel.add(EditDiscreteValueConstraintForm);
        } else {
            var EditContinuousValueConstraintForm = Ext.create('CGP.common.valueExV3.view.EditContinuousValueConstraintForm', {
                configurableId: configurableId,
                createOrEdit: createOrEdit,
                inputTypeClazz: inputTypeClazz,
                currentPanel: currentPanel,//当前的跳转前的panel
                recordId: recordId,
                record: record,
                editPanel: panel,//跳转后的编辑panel
                id: 'editConstraint',
                tab: tab,//外围的tab
                listeners: {
                    'afterrender': function (form) {
                        if (createOrEdit == 'edit') {
                            form.setFormValue(data);
                        }
                    }
                }
            });
            EditContinuousValueConstraintForm.configurableId = configurableId;
            panel.add(EditContinuousValueConstraintForm);
        }
        tab.add(panel);
        tab.setActiveTab(panel);
    },
    /**
     *
     * @param data 表单数据
     * @param groupGridPanel 分组grid的组件对象
     * @param createOrEdit 是否新建
     * @param tab
     * @param record 对应的记录，如果是新建则为空
     */
    getDataToGridStore: function (data, groupGridPanel, createOrEdit, tab, record) {
        //经过判读是哪个grid中的数据加入到对应的grid中,根据是否新建判断是否新建记录
        var continuousValueConstraintGrid = {};
        var discreteValueConstraintGrid = {};
        for (var i = 0; i < groupGridPanel.items.items.length; i++) {
            if (groupGridPanel.items.items[i].inputTypeClazz == 'com.qpp.cgp.value.constraint.DiscreteValueConstraint') {
                discreteValueConstraintGrid = groupGridPanel.items.items[i];
            } else {
                continuousValueConstraintGrid = groupGridPanel.items.items[i];
            }
        }
        var store = groupGridPanel.items.items[0].getStore();//模型都一样
        var record = record;
        if (createOrEdit == 'create') {
            var record = Ext.create(store.model);
        }
        for (i in data) {
            record.set(i, data[i]);
        }
        if (createOrEdit == 'create') {
            if (record.get('clazz') == 'com.qpp.cgp.value.constraint.ContinuousValueConstraint') {
                continuousValueConstraintGrid.getStore().add(record);
            } else {
                discreteValueConstraintGrid.getStore().add(record);
            }
        }
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
            height: '70%',
            constrain: true,
            width: '50%',
            modal: true,
            maximizable: true,
            layout: 'fit',
            items: form
        }).show();
    }
})

