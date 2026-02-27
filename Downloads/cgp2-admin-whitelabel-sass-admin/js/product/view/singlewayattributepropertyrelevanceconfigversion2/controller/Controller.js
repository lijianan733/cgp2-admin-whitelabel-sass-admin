/**
 * Created by nan on 2019/11/7.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller', {
    saveData: function (data, wind, grid) {
        var method = 'POST', url = adminPath + 'api/oneWayProductAttributeMappings';
        if (!Ext.isEmpty(data._id)) {
            method = 'PUT';
            url = url + "/" + data._id;
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'), function () {
                        grid.store.load();
                        wind.close();
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {
                wind.close();
            }
        });
    },
    addWindow: function (productId, mappingType, grid, recordData) {
        var win = null;
        Ext.Ajax.request({
            url: adminPath + 'api/products/configurable/' + productId + '/skuAttributes',
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    win = Ext.create(mappingType, {
                        productId: productId,
                        grid: grid,
                        productSkuAtt: resp.data,
                        data: recordData
                    }).show();
                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            }
        });
        return win;
    },
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
    },
    /**
     * 创建多属性约束的条件
     * @param value
     * @returns {{layout: {type: string}, getValue: (function()), xtype: string}}
     */
    createMultiAttributeConstraint: function (value) {
        var me = this;
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
            allowBlank: false,
            value: attributeField,
            emptyText: '如: skuAttribute_id1.value+skuAttribute_id2.value, 即属性A的Id.Value + 属性B的Id.Value; '
        };
        var operator = {
            xtype: 'combo',
            displayField: 'display',
            valueField: 'value',
            editable: false,
            width: 100,
            itemId: 'operator',
            margin: '0 5 0 0',
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
                    value: max,
                    vtype: 'minAndMax',
                    fieldLabel: i18n.getKey('max')
                }
            ]
        }
        var deleteField = {
            xtype: 'displayfield',
            width: 16,
            padding: '0 10 0 10 ',
            height: 16,
            itemId: 'delete',
            value: '<img class="tag" title="点击进行清除数据" style="height: 100%;width: 100%;cursor: pointer" src="' + me.deleteSrc + '">',
            listeners: {
                render: function (display) {
                    var a = display.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                    ela.on("click", function () {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否清除已填写的数据'), function (selector) {
                            if (selector === 'yes') {
                                var container = display.ownerCt;
                                var panel = container.ownerCt;
                                panel.remove(container);
                            }
                        })
                    });
                }
            }
        };
        item.items = [deleteField, attributeField, operator, simpleInput, complexInput];
        return item;
    },

    /**
     * 创建或者编辑单向条件约束
     */
    createOrEditConditionOneWayValueMapping: function (data, createOredit, record, grid, win) {
        var method = 'POST';
        var url = adminPath + 'api/oneWayProductAttributeMappings';
        var prompt = 'addsuccessful';
        var attributePropertyDtoTransformController = Ext.create('CGP.product.controller.AttributePropertyDtoTransformController');
        var attributeMappingDomain = attributePropertyDtoTransformController.dealOneWayAttributeMapping(data);
        data.attributeMappingDomain = attributeMappingDomain;
        if (createOredit == 'edit') {
            method = 'PUT';
            prompt = 'modifySuccess';
            url = adminPath + 'api/oneWayProductAttributeMappings/' + record.getId();
            data.attributeMappingDomain._id = record.get('attributeMappingDomain')._id;
        }
        win.el.mask();
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response) {
                win.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey(prompt), function () {
                            grid.store.load();
                            win.close();
                        }
                    );
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                win.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    /**
     * 创建或者编辑单向属性映射
     */
    deleteOneWayValueMapping: function (record, grid) {
        Ext.Ajax.request({
            url: adminPath + 'api/oneWayProductAttributeMappings/' + record.getId(),
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'), function () {
                        grid.store.load();
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    /**
     * 查看条件
     */
    checkCondition: function (conditionData, productAttributeStore, productId) {
        var conditionFieldSet = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.AttributeMappingRuleConditionFieldSet', {
            title: i18n.getKey('执行规则的前提条件'),
            itemId: 'attributeMappingRuleFieldSet',
            productId: productId,
            leftAttributes: [],//输入的属性
            width: 1000,
            checkOnly: true,
            listeners: {
                afterrender: function (form) {
                    conditionFieldSet.setValue(conditionData);
                }
            }
        });
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('查看条件'),
            items: [
                conditionFieldSet
            ]
        });
        win.show();
        /*
               
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
                if (inputCondition) {
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
                            var form = win.getComponent('form');
                            for (var i = 0; i < inputCondition.operation.operations.length; i++) {
                                var item = inputCondition.operation.operations[i];
                                var field = createMultiAttributeConstraint(item);
                                form.add(field);
                            }
                            win.show();
                        } else {
                            var conditionGridPanel = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.ConditionGridPanel', {
                                width: 800,
                                itemId: 'conditionGridPanel',
                                productId: productId,
                                checkOnly: true,
                                minHeight: 100,
                                margin: '0 20 30 20'
                            });
                            var win = Ext.create('Ext.window.Window', {
                                width: 850,
                                modal: true,
                                constrain: true,
                                title: i18n.getKey('查看条件'),
                                minHeight: 100,
                                items: [
                                    conditionGridPanel
                                ]
                            });
                            conditionGridPanel.setValue(inputCondition);
                        }
                        win.show();
                    }
                }
        */
    },
    checkConditionV2: function (conditionData, productAttributeStore, productId) {
        var me = this;
        var profileStore = Ext.data.StoreManager.get('profileStore');
        var conditionValuePanel = null;
        if (conditionData.executeAttributeInput.conditionType == 'custom') {
            conditionValuePanel = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.CustomConditionPanel', {
                title: i18n.getKey('自定义执行条件'),
                hideConditionModel: true,
                checkOnly: true,
                productId: productId,
                header: false,
                border: false,
                width: '100%',
                margin: '0 0 30 0'
            })
        } else {
            conditionValuePanel = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.AttributeMappingRuleConditionFieldSet', {
                itemId: 'conditionGridPanel',
                productId: productId,
                checkOnly: true,
                leftAttributes: [],
                width: '100%',
                title: '',
                header: false,
                border: false,
                minHeight: 50,
                margin: '0 0 30 0'
            });
        }

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
            minHeight: 100,
            items: [
                checkgroup,
                conditionValuePanel
            ]
        });
        win.show();
        checkgroup.setValue({profile: conditionData.executeProfileItemIds});
        conditionValuePanel.setValue(conditionData.executeAttributeInput);
    },


})
