Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.controller.Controller', {
    /**
     * 查看条件
     */
    checkCondition: function (conditionData, productAttributeStore, productId) {
       
        var controller = this;
        var isInputCondition = (conditionData.clazz == 'com.qpp.cgp.domain.executecondition.InputCondition');
        var profileItem = [];
        var inputCondition = null;
        if (!isInputCondition) {
            //执行条件包含输入条件和propertyItems
            inputCondition = conditionData.executeAttributeInput;
            Ext.Ajax.request({
                url: encodeURI(adminPath + 'api/attributeProfile?' + 'page=1&start=0&limit=25&filter=[{"name":"productId","value":' + productId + ',"type":"number"}]'),
                method: 'GET',
                async: false,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        for (var i = 0; i < responseMessage.data.content.length; i++) {
                            var item = responseMessage.data.content[i];
                            profileItem.push({
                                boxLabel: item.name,
                                name: 'profile',
                                inputValue: item._id,
                                readOnly: true
                            })
                            if (Ext.Array.contains(conditionData.executeProfileItemIds, item._id)) {
                                profileItem[i].checked = true;
                            }
                        }
                    }
                }
            });
        } else {
            //输入条件不用选择property
            inputCondition = conditionData;
        }
        var conditionType = inputCondition ? inputCondition.conditionType : '';
        var logicalOperator = inputCondition ? inputCondition.operation.operator : '';
        var win = Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            title: i18n.getKey('check') + i18n.getKey('condition'),
            items: [
                {
                    xtype: 'form',
                    itemId: 'form',
                    layout: 'vbox',
                    autoScroll: true,
                    maxHeight: 500,
                    border: false,
                    margin: 20,
                    defaults: {
                        margin: '10 0 5 20'
                    },
                    items: [
                        {
                            xtype: 'checkboxgroup',
                            fieldLabel: 'profile',
                            padding: '10 10 0 20',
                            width: 400,
                            readOnly: true,
                            hidden: isInputCondition,
                            disabled: isInputCondition,
                            itemId: 'profile',
                            items: profileItem
                        },
                        {
                            itemId: 'conditionType',
                            width: 400,
                            xtype: 'checkboxgroup',
                            readOnly: true,
                            items: [
                                {
                                    boxLabel: '简单条件',
                                    name: 'conditionType',
                                    readOnly: true,
                                    checked: conditionType == 'simple',
                                    inputValue: 'simple'
                                },
                                {
                                    boxLabel: '多属性计算表达式条件',
                                    name: 'conditionType',
                                    inputValue: 'complex',
                                    readOnly: true,
                                    checked: conditionType == 'complex'
                                }
                            ]
                        },
                        {
                            itemId: 'conditionType',
                            width: 400,
                            hidden: !(inputCondition && inputCondition.operation.operations.length > 0),
                            xtype: 'checkboxgroup',
                            items: [
                                {
                                    boxLabel: '满足以下所有条件',
                                    name: 'logicalOperator',
                                    inputValue: 'AND',
                                    checked: logicalOperator == 'AND',
                                    readOnly: true

                                },
                                {
                                    boxLabel: '满足以下任一条件',
                                    name: 'logicalOperator',
                                    inputValue: 'OR',
                                    checked: logicalOperator == 'OR',
                                    readOnly: true
                                }
                            ]
                        }
                    ]
                }

            ]
        });
        if (inputCondition) {
            var form = win.getComponent('form');
            var createContainer = function (operations, productAttributeStore, panel) {
                for (var i = 0; i < operations.length; i++) {
                    var item = operations[i];
                    var skuAttributeId = item.operations[0].skuAttributeId;
                    if (item.clazz == "com.qpp.cgp.domain.executecondition.operation.BetweenOperation") {
                        skuAttributeId = item.midValue.skuAttributeId;
                    }
                    var skuAttributeRecord = null;
                    var operator = item.operator;
                    for (var j = 0; j < productAttributeStore.data.length; j++) {
                        //找出对应的属性
                        if (skuAttributeId == productAttributeStore.data.items[j].getId()) {
                            skuAttributeRecord = productAttributeStore.data.items[j];
                        }
                    }
                    var value = {
                        value: null,
                        min: null,
                        max: null
                    };
                    if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], operator)) {
                        value.min = item.operations[0].value;
                        value.max = item.operations[1].value;
                    } else {
                        value.value = item.operations[1].value || item.operations[1].OptionId;
                    }
                    var field = controller.createFieldByAttribute(skuAttributeRecord.get('attribute'), value, operator, true);
                    field.width = 600;
                    panel.add({
                        xtype: 'fieldcontainer',
                        width: 650,
                        items: [field]
                    });
                }
            };
            var createMultiAttributeConstraint = function (value) {
                var min = null;
                var attributeField = null;
                var max = null;
                var operatorValue = null;
                if (value) {
                    operatorValue = value.operator;
                    if (value.clazz == 'com.qpp.cgp.domain.executecondition.operation.BetweenOperation') {
                        attributeField = value.midValue.calculationExpression;
                        min = value.operations[0].value;
                        max = value.operations[1].value;
                    } else {
                        attributeField = value.operations[0].calculationExpression;
                        min = value.operations[1].value;
                    }

                }
                var item = {
                    xtype: 'fieldcontainer',
                    width: 950,
                    layout: {
                        type: 'hbox'
                    },
                    getValue: function () {
                        var me = this;
                        var result = {};
                        result.operations = [];
                        var attributeField = me.getComponent('attributeField');
                        var operator = me.getComponent('operator');
                        var simpleInput = me.getComponent('simpleInput');
                        var complexInput = me.getComponent('complexInput');
                        if (simpleInput.hidden == false) {
                            result.clazz = 'com.qpp.cgp.domain.executecondition.operation.CompareOperation';
                            result.operator = operator.getValue();
                            result.operations.push({
                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue',
                                calculationExpression: attributeField.getValue()
                            });
                            result.operations.push({
                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                                value: simpleInput.getValue()
                            });
                        } else {
                            result.clazz = 'com.qpp.cgp.domain.executecondition.operation.BetweenOperation';
                            result.operator = operator.getValue();
                            result.midValue = {
                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue',
                                calculationExpression: attributeField.getValue()
                            };
                            result.operations.push({
                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                                value: complexInput.getComponent('min').getValue()
                            });
                            result.operations.push({
                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                                value: complexInput.getComponent('max').getValue()
                            });
                        }
                        return result;
                    }
                };
                var attributeField = {
                    xtype: 'textfield',
                    width: 400,
                    itemId: 'attributeField',
                    margin: '0 10 0 0',
                    readOnly: true,
                    allowBlank: false,
                    value: attributeField
                };
                var operator = {
                    xtype: 'combo',
                    displayField: 'display',
                    valueField: 'value',
                    editable: false,
                    width: 100,
                    itemId: 'operator',
                    margin: '0 5 0 0',
                    readOnly: true,
                    matchFieldWidth: false,
                    value: '==',
                    allowBlank: false,
                    listConfig: {
                        itemTpl: Ext.create('Ext.XTemplate',
                            '<div title="{title}" ext:qtitle="title" ext:qtip="{display} : {display} tip" >{display}</div>')
                    },
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'display',
                            'value',
                            'title'
                        ],
                        data: [
                            {
                                display: '=',
                                value: '=='
                            },
                            {
                                display: '!=',
                                value: '!='
                            },
                            {
                                display: '<',
                                value: '<'
                            },
                            {
                                display: '>',
                                value: '>'
                            },
                            {
                                display: '<=',
                                value: '<='
                            },
                            {
                                display: '>=',
                                value: '>='
                            },

                            {
                                display: '[min,max]',
                                value: '[min,max]',
                                title: 'min<=选择属性运算值<=max'
                            }, {
                                display: '[min,max)',
                                value: '[min,max)',
                                title: 'min<=选择属性运算值<max'
                            }, {
                                display: '(min,max)',
                                value: '(min,max)',
                                title: 'min<选择属性运算值<max'
                            }, {
                                display: '(min,max]',
                                value: '(min,max]',
                                title: 'min<选择属性运算值<=max'
                            }
                        ]
                    }),
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            var simpleInput = field.ownerCt.getComponent('simpleInput');
                            var complexInput = field.ownerCt.getComponent('complexInput');
                            if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], newValue)) {
                                simpleInput.hide();
                                simpleInput.setDisabled(true);
                                complexInput.show();
                                complexInput.setDisabled(false);
                            } else {
                                complexInput.hide();
                                complexInput.setDisabled(true);
                                simpleInput.show();
                                simpleInput.setDisabled(false);
                            }
                        },
                        afterrender: function (field) {
                            if (operatorValue) {
                                field.setValue(operatorValue);
                            }
                        }
                    }
                };
                var simpleInput = {
                    xtype: 'numberfield',
                    itemId: 'simpleInput',
                    flex: 1,
                    name: 'min',
                    readOnly: true,
                    value: min,
                    allowBlank: false
                }
                var complexInput = {
                    xtype: 'fieldcontainer',
                    hidden: true,
                    disabled: true,
                    itemId: 'complexInput',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'numberfield',
                            width: 150,
                            allowBlank: false,
                            labelWidth: 50,
                            margin: '0 5 0 0',
                            itemId: 'min',
                            name: 'min',
                            readOnly: true,
                            value: min,
                            vtype: 'minAndMax',
                            fieldLabel: i18n.getKey('min')
                        },
                        {
                            xtype: 'numberfield',
                            width: 150,
                            allowBlank: false,
                            labelWidth: 50,
                            itemId: 'max',
                            name: 'max',
                            readOnly: true,
                            value: max,
                            vtype: 'minAndMax',
                            fieldLabel: i18n.getKey('max')
                        }
                    ]
                }
                item.items = [attributeField, operator, simpleInput, complexInput];
                return item;
            };
            if (inputCondition && inputCondition.operation.operations.length > 0) {
                if (conditionType == 'complex') {
                    for (var i = 0; i < inputCondition.operation.operations.length; i++) {
                        var item = inputCondition.operation.operations[i];
                        var field = createMultiAttributeConstraint(item);
                        form.add(field);
                    }
                } else {
                    createContainer(inputCondition.operation.operations, productAttributeStore, form);

                }
            }
        }
        win.show();
    },
    checkConditionV2: function (conditionData, productAttributeStore, productId) {
        var me = this;
        var profileStore = Ext.data.StoreManager.get('profileStore');
        var conditionGridPanel = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.ConditionGridPanel', {
            width: 800,
            itemId: 'conditionGridPanel',
            productId: productId,
            checkOnly: true,
            minHeight: 100,
            hidden: Ext.isEmpty(conditionData.executeAttributeInput),
            margin: '0 20 30 20'
        });
        var profileItem = [];
        for (var i = 0; i < profileStore.data.length; i++) {
            var item = profileStore.data.items[i].getData();
            profileItem.push({
                boxLabel: item.name,
                name: 'profile',
                readOnly: true,
                inputValue: item._id,
                checked: i == 0
            })
        }
        var checkgroup = Ext.widget('checkboxgroup', {
                fieldLabel: 'profile',
                padding: '10 20 0 20',
                columns: 3,
                width: 850,
                itemId: 'profile',
                hidden: profileStore.data.length == 0,
                vertical: false,
                labelWidth: 95,
                items: profileItem
            }
        );
        var win = Ext.create('Ext.window.Window', {
            width: Ext.isEmpty(conditionData.executeAttributeInput) ? 550 : 850,
            modal: true,
            constrain: true,
            title: i18n.getKey('查看条件'),
            minHeight: 200,
            items: [
                checkgroup,
                conditionGridPanel
            ]
        });
        win.show();
        checkgroup.setValue({profile: conditionData.executeProfileItemIds});
        conditionGridPanel.setValue(conditionData.executeAttributeInput);
    },

    /**
     * 更新该约束
     * @param {Object} data 需要更新的最新数据
     * @param {Ext.data.Store} store multiDiscreteValueConstraintItem Store
     * @param {Ext.LoadMask} lm 等待加载提示
     * @param {Ext.data.Model} disEnableRecord 将设为禁用状态的记录
     */
    updateProductAttributeConstraint: function (data, store, lm, disEnableRecord) {
        Ext.Ajax.request({
            url: adminPath + 'api/multiDiscreteAttributeEnableOptionMappings/' + data._id,
            jsonData: data,
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                var disEnableRecordData = disEnableRecord.getData();
                var disEnableRecordId = disEnableRecordData._id;
                if (response.success == true) {
                    if (data.isEnable == false || disEnableRecordId == data._id) {
                        Ext.Msg.alert('提示', '保存成功！');
                        store.load();
                    } else {
                        disEnableRecordData.isEnable = false;
                        Ext.Ajax.request({
                            url: adminPath + 'api/multiDiscreteAttributeEnableOptionMappings/' + disEnableRecordId,
                            jsonData: disEnableRecordData,
                            method: 'PUT',
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                if (response.success == true) {
                                    Ext.Msg.alert('提示', '保存成功！');
                                    store.load();
                                } else {
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        })
                    }

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    /**
     * 新建约束
     * @param {Object} data 需要更新的最新数据
     * @param {Ext.grid.Panel} leftGrid 左边的导航grid
     * @param {Ext.LoadMask} lm 等待加载提示
     * @param {Ext.data.Model} disEnableRecord 将设为禁用状态的记录
     */
    createOrEditProductAttributeConstraint: function (data, leftGrid, lm, recordId, recordData) {
        var url = adminPath + 'api/multiDiscreteAttributeEnableOptionMappings';
        var method = 'POST';
        var promptStr = i18n.getKey('addsuccessful');
        var attributePropertyDtoTransformController = Ext.create('CGP.product.controller.AttributePropertyDtoTransformController');
        data.attributeMappingDomain = attributePropertyDtoTransformController.dealOneWayAttributeMapping(data);
        console.log(recordData);
        if (recordId) {
            url = adminPath + 'api/multiDiscreteAttributeEnableOptionMappings/' + recordId;
            method = 'PUT';
            promptStr = i18n.getKey('modifySuccess');
            data.attributeMappingDomain._id = recordData.attributeMappingDomain._id;
        }
        Ext.Ajax.request({
            url: url,
            jsonData: data,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                var recordId = response.data._id;
                if (response.success == true) {
                    Ext.Msg.alert('提示', promptStr);
                    leftGrid.store.load({
                            callback: function () {
                                var record = leftGrid.store.findRecord('_id', recordId);
                                leftGrid.getSelectionModel().select(record);
                            }
                        }
                    );
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    /**
     * 激活一条产品属性约束为启用状态
     * @param {Ext.data.Store} store 产品属性约束的集合
     * @param {Ext.data.Model} toEnableRecord 将被激活的记录
     * @param {Ext.data.Model} disEnableRecord 将被禁用的记录
     * @param {Ext.form.Panel} formToGrid 约束详细信息的form
     */
    enableProductAttributeConstraint: function (store, toEnableRecord, disEnableRecord, formToGrid) {
        var arr = [toEnableRecord, disEnableRecord];
        var data = {};
        Ext.Array.each(arr, function (item, index) {
            data = item.getData();
            if (item.get('isEnable')) {
                data.isEnable = false;
            } else {
                data.isEnable = true;
            }
            Ext.Ajax.request({
                url: adminPath + 'api/multiDiscreteAttributeEnableOptionMappings' + data._id,
                jsonData: data,
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    var data = response.data;
                    if (response.success == true) {
                        if (index == 1) {
                            store.load({
                                callback: function () {
                                    var setData = toEnableRecord.getData();
                                    setData.isEnable = true;
                                    formToGrid.refreshData(setData);
                                }
                            });
                        }
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            })
        })
    },
    /**
     * 删除约束
     * @param {String} id 将要删除的约束Id
     * @param {Ext.data.Store} store 产品属性约束的集合
     * @param {Ext.form.Panel} formToGrid 约束详细信息的form
     */
    deleteProductAttributeConstraint: function (id, store, formToGrid, grid) {
        Ext.Ajax.request({
            url: adminPath + 'api/multiDiscreteAttributeEnableOptionMappings/' + id,
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success == true) {
                    formToGrid.setDisabled(true);
                    grid.getSelectionModel().deselectAll();
                    Ext.Array.each(formToGrid.items.items, function (item) {
                        item.reset();
                        item.clearInvalid();
                    });
                    Ext.Msg.alert('提示', '删除成功！');
                    store.load();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    /**
     * 查看列表形式的规则配置
     * @param value
     * @param productAttributeStore
     * @param selectedSkuAttributes
     */
    checkAttributeRuleGrid: function (value, productAttributeStore, selectedSkuAttributes) {
        var fields = [];
        var columns = [
            {
                xtype: 'rownumberer',
                tdCls: 'vertical-middle'
            }
        ];
        for (var i = 0; i < productAttributeStore.data.items.length; i++) {
            var skuAttribute = productAttributeStore.data.items[i].getData();
            if (Ext.Array.contains(selectedSkuAttributes, skuAttribute.id)) {
                fields.push(skuAttribute.id + '');
                columns.push({
                    tdCls: 'vertical-middle',
                    width: 150,
                    dataIndex: skuAttribute.id + '',
                    skuAttribute: skuAttribute,
                    text: i18n.getKey(skuAttribute.displayName),
                    renderer: function (value, mete, record) {
                        var options = mete.column.skuAttribute.options;
                        for (var j = 0; j < options.length; j++) {
                            if (options[j].id == value) {
                                mete.tdAttr = 'data-qtip="' + options[j].name + '"';//显示的文本
                                return options[j].name;
                            }
                        }
                    },
                    editor: {
                        xtype: 'combo',
                        allowBlank: false,
                        displayField: 'name',
                        valueField: 'id',
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            data: skuAttribute.attribute.options,
                            fields: [
                                'displayValue',
                                'id',
                                'imageUrl',
                                'name',
                                'value'
                            ]
                        })
                    }
                });
            }
        }
        columns[columns.length - 1].flex = 1;
        var rules = [];
        for (var i = 0; i < value.length; i++) {
            var rule = value[i];
            var list = rule.list;
            var itemData = {};
            for (var j = 0; j < list.length; j++) {
                itemData[list[j].skuAttributeId] = list[j].optionId;
            }
            rules.push(itemData);
        }
        var store = Ext.create('Ext.data.Store', {
            fields: fields,
            proxy: {
                type: 'memory'
            },
            data: rules
        });
        var grid = {
            xtype: 'grid',
            store: store,
            width: 600,
            fields: fields,
            maxHeight: 350,
            height: 200,
            autoScroll: true,
            viewConfig: {
                enableTextSelection: true,
                stripeRows: true
            },
            columns: columns
        };
        Ext.create('Ext.window.Window', {
            modal: true,
            title: i18n.getKey('查看属性组合'),
            constrain: true,
            layout: 'fit',
            items: [
                grid
            ]
        }).show();
    },
    /**
     * 查看决策树形式的规则配置
     * @param value
     * @param productAttributeStore
     * @param selectedSkuAttributes
     */
    checkAttributeRuleTree: function (value, isInclude) {
        var root = {
            id: 0,
            name: 'root',
            optionId: 'root',
            children: Ext.JSON.decode(Ext.JSON.encode(value[0].tree))
        };
        var dataStructureStore = Ext.create('CGP.product.view.productattributeconstraint.store.DataStructureStore', {
            root: root
        });
        var tree = {
            xtype: 'treepanel',
            collapsible: true,
            header: false,
            maxHeight: 400,
            padding: 10,
            rootVisible: false,
            useArrows: false,
            viewConfig: {
                stripeRows: true
            },
            autoScroll: true,
            listeners: {
                afterrender: function (treepanel) {
                    treepanel.expandAll();
                }
            },
            store: dataStructureStore,
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('expandAll'),
                    iconCls: 'icon_collapseAll',
                    count: 1,
                    handler: function (btn) {
                        var treepanel = btn.ownerCt.ownerCt;
                        if (btn.count % 2 == 0) {
                            treepanel.expandAll();
                            btn.setText(i18n.getKey('collapseAll'));
                            btn.setIconCls('icon_collapseAll');

                        } else {
                            treepanel.collapseAll();
                            btn.setText(i18n.getKey('expandAll'));
                            btn.setIconCls('icon_expandAll');
                        }
                        btn.count++;
                    }
                },
                {
                    xtype: 'radiogroup',
                    columns: 2,
                    width: 500,
                    name: 'isInclude',
                    vertical: true,
                    items: [
                        {
                            boxLabel: '启用以下项组合',
                            readOnly: true,
                            name: 'isInclude',
                            inputValue: true,
                            checked: isInclude == true ? true : false
                        },
                        {
                            boxLabel: '禁用以下选项组合',
                            readOnly: true,
                            name: 'isInclude',
                            inputValue: false,
                            checked: isInclude == false ? true : false
                        }
                    ]
                }
            ],
            columns: [
                {
                    xtype: 'treecolumn',
                    text: i18n.getKey('attribute'),
                    flex: 1,
                    dataIndex: 'skuAttributeId',
                    renderer: function (value, metadata, record) {
                        return record.get('attributeName') + '（' + value + '）';
                    }
                },
                {
                    text: i18n.getKey('options'),
                    flex: 1,
                    lockable: true,
                    iconCls: 'hidden',
                    xtype: 'treecolumn',
                    dataIndex: 'optionId',
                    renderer: function (value, metadata, record) {
                        return record.get('optionName') + '（' + value + '）';
                    }
                }
            ]
        };
        Ext.create('Ext.window.Window', {
            modal: true,
            width: 700,
            height: 450,
            title: i18n.getKey('查看属性组合'),
            constrain: true,
            layout: 'fit',
            items: [
                tree
            ]
        }).show();
    },

    /**
     *
     * @param data  attribute数据
     * @param value 值的对象{value:null,max:null,min:null}
     * @param value 操作符
     */
    createFieldByAttribute: function (data, value, operator, isReadOnly) {
        Ext.apply(Ext.form.field.VTypes, {
            minAndMax: function (val, field) {
                if (field.itemId == 'min') {
                    var max = field.ownerCt.getComponent('max');
                    if (Ext.isEmpty(max.getValue())) {
                        return true;
                    }
                    if (val < max.getValue()) {
                        max.clearInvalid()
                        return true;
                    } else {
                        return false
                    }

                } else {
                    var min = field.ownerCt.getComponent('min');
                    if (Ext.isEmpty(min.getValue())) {
                        return true;
                    }
                    if (val > min.getValue()) {
                        min.clearInvalid()
                        return true;
                    } else {
                        return false
                    }
                }
            },
            minAndMaxText: '请输入正确数值'
        });
        if (!data['inputType']) {
            throw Error('data should be a CGP.Model.Attribute instance!');
        }
        var inputType = data['inputType'];
        var selectType = data['selectType'];
        var options = data['options'];
        var item = {};
        item.name = data['id'] + '';
        item.fieldLabel = data['name'];
        item.flex = 1;
        item.itemId = 'valueField';
        item.allowBlank = false;
        if (!Ext.isEmpty(isReadOnly)) {
            item.readOnly = isReadOnly;
        }
        if (value) {
            item.value = value.value;
        }
        if (options.length > 0) {//选项类型
            item.xtype = 'combo';
            item.displayField = 'name';
            item.valueField = 'id';//不需要id
            item.editable = false;
            item.multiSelect = selectType == 'MULTI' ? true : false;
            if (item.multiSelect) {
                if (item.value) {
                    item.value = item.value.split(',');
                    item.value = item.value.map(function (i) {
                        return parseInt(i)
                    });
                }
                item.listConfig = {
                    itemTpl: Ext.create('Ext.XTemplate', '<input type=checkbox>{[values.name]}'),
                    onItemSelect: function (record) {
                        var node = this.getNode(record);
                        if (node) {
                            Ext.fly(node).addCls(this.selectedItemCls);
                            var checkboxs = node.getElementsByTagName("input");
                            if (checkboxs != null)
                                var checkbox = checkboxs[0];
                            checkbox.checked = true;
                        }
                    },
                    listeners: {
                        itemclick: function (view, record, item, index, e, eOpts) {
                            var isSelected = view.isSelected(item);
                            var checkboxs = item.getElementsByTagName("input");
                            if (checkboxs != null) {
                                var checkbox = checkboxs[0];
                                if (!isSelected) {
                                    checkbox.checked = true;
                                } else {
                                    checkbox.checked = false;
                                }
                            }
                        }
                    }
                };
            } else {
                if (value) {
                    if (Ext.isString(item.value)) {
                        item.value = Ext.Number.from(item.value);
                    }
                }
            }
            item.store = new Ext.data.Store({
                fields: ['id', 'name'],
                data: options
            });
        } else if (inputType == 'Date') {//输入类型
            item.xtype = 'datetimefield';
            item.editable = false;
            item.format = "Y-m-d H:i:s";
            if (item.value) {
                item.value = new Date(parseInt(item.value));
            }
        } else if (inputType == 'YesOrNo') {
            item.xtype = 'radiogroup';
            var yesItem = {
                name: item.name,
                inputValue: 'YES',
                boxLabel: 'YES',
                readOnly: Ext.isEmpty(isReadOnly) ? false : isReadOnly

            }
            var noItem = {
                name: item.name,
                inputValue: 'NO',
                boxLabel: 'NO',
                readOnly: Ext.isEmpty(isReadOnly) ? false : isReadOnly
            }
            if (value) {
                if (value == 'YES') {
                    yesItem.checked = true;
                } else if (value == 'NO') {
                    noItem.checked = true;
                }
            }
            item.items = [yesItem, noItem];
            item.columns = 2;
        } else {
            item = {
                xtype: 'fieldcontainer',
                flex: 1,
                itemId: 'valueField',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                items: [
                    {
                        xtype: 'combo',
                        displayField: 'display',
                        valueField: 'value',
                        editable: false,
                        fieldLabel: item.fieldLabel,
                        margin: '0 5 0 0',
                        matchFieldWidth: false,
                        value: '==',
                        width: 200,
                        readOnly: Ext.isEmpty(isReadOnly) ? false : isReadOnly,
                        labelWidth: 100,
                        operator: operator || null,
                        itemId: 'operator',
                        listConfig: {
                            itemTpl: Ext.create('Ext.XTemplate',
                                '<div title="{title}" ext:qtitle="title" ext:qtip="{display} : {display} tip" >{display}</div>')
                        },
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'display',
                                'value',
                                'title'
                            ],
                            data: [
                                {
                                    display: '=',
                                    value: '=='
                                },
                                {
                                    display: '<',
                                    value: '<'
                                },
                                {
                                    display: '>',
                                    value: '>'
                                },
                                {
                                    display: '<=',
                                    value: '<='
                                },
                                {
                                    display: '>=',
                                    value: '>='
                                },
                                {
                                    display: '!=',
                                    value: '!='
                                },
                                {
                                    display: '[min,max]',
                                    value: '[min,max]',
                                    title: 'min<=' + item.name + '<=max'
                                }, {
                                    display: '[min,max)',
                                    value: '[min,max)',
                                    title: 'min<=' + item.name + '<max'
                                }, {
                                    display: '(min,max)',
                                    value: '(min,max)',
                                    title: 'min<' + item.name + '<max'
                                }, {
                                    display: '(min,max]',
                                    value: '(min,max]',
                                    title: 'min<' + item.name + '<=max'
                                }
                            ]
                        }),
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var simpleInput = field.ownerCt.getComponent('simpleInput');
                                var complexInput = field.ownerCt.getComponent('complexInput');
                                if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], newValue)) {
                                    simpleInput.hide();
                                    simpleInput.setDisabled(true);
                                    complexInput.show();
                                    complexInput.setDisabled(false);
                                } else {
                                    complexInput.hide();
                                    complexInput.setDisabled(true);
                                    simpleInput.show();
                                    simpleInput.setDisabled(false);
                                }
                            },
                            afterrender: function () {
                                var me = this;
                                if (me.operator) {
                                    me.setValue(me.operator);
                                }
                            }
                        }
                    },
                    {
                        xtype: data['valueType'] == 'Number' ? 'numberfield' : 'textfield',
                        itemId: 'simpleInput',
                        flex: 1,
                        allowBlank: false,
                        readOnly: Ext.isEmpty(isReadOnly) ? false : isReadOnly,
                        value: value ? value.value : null
                    },
                    {
                        xtype: 'fieldcontainer',
                        hidden: true,
                        disabled: true,
                        itemId: 'complexInput',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'numberfield',
                                width: 150,
                                vtype: 'minAndMax',
                                labelWidth: 50,
                                allowBlank: false,
                                itemId: 'min',
                                readOnly: Ext.isEmpty(isReadOnly) ? false : isReadOnly,
                                value: value ? value.min : null,
                                margin: '0 5 0 0',
                                fieldLabel: i18n.getKey('min')
                            },
                            {
                                xtype: 'numberfield',
                                width: 150,
                                vtype: 'minAndMax',
                                allowBlank: false,
                                labelWidth: 50,
                                readOnly: Ext.isEmpty(isReadOnly) ? false : isReadOnly,
                                itemId: 'max',
                                value: value ? value.max : null,
                                fieldLabel: i18n.getKey('max')
                            }
                        ]
                    }
                ]
            }
        }
        return item;
    }
});
