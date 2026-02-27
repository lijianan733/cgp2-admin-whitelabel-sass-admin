/**
 * Created by miao on 2021/6/09.
 */
Ext.Loader.syncRequire([
    'CGP.attrconfigtransform.Controller'
])
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.controller.Controller', {

    saveTextParameter: function (eidtForm) {
        var data = eidtForm.getValue();
        var method = 'POST', url = adminPath + 'api/textParameters';
        if (data?._id) {
            method = 'PUT';
            url += "/" + data._id;
        }
        var request = {
            url: url,
            method: method,
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var resp = Ext.JSON.decode(res.responseText);

                if (resp.success) {
                    eidtForm.getComponent('baseForm').getComponent('id').setValue(resp.data?._id);
                    window.parent.Ext.getCmp('textParameterEdit').setTitle(i18n.getKey('edit') + i18n.getKey('排版文字参数'));
                    // eidtForm.down('toolbar').getComponent('save').disable();
                    Ext.Msg.alert('提示', '保存成功！');
                } else {
                    Ext.Msg.alert('提示', '请求错误：' + resp.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };
        Ext.Ajax.request(request);
    },
    /**
     *
     * @param btn
     */
    showTestTab: function (btn) {
        var tabPanel = btn.ownerCt.ownerCt.ownerCt;
        tabPanel.remove('testFormTab');
        var testFormTab = tabPanel.add(
            Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.TestForm', {
                id: 'testFormTab',
                title: i18n.getKey('testForm'),
                closable: true,
                width: '100%'
            })
        );
        tabPanel.setActiveTab(testFormTab);
    },

    /**
     *参数值设置窗口
     * @param grid
     * @param recdData
     * @param index
     */
    showValueEdit: function (comp, recdData, index) {
        var me = this;
        var grid = comp.getGrid();
        var wind = Ext.create("Ext.window.Window", {
            title: i18n.getKey('ValueEdit'),
            modal: true,
            layout: 'fit',
            width: 900,
            height: 600,
            items: [
                Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.ValueEdit', {
                    itemId: "valueForm",
                    data: recdData
                })
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var wind = btn.ownerCt.ownerCt;
                        var valueForm = wind.getComponent('valueForm');
                        if (valueForm.isValid()) {
                            var data = valueForm.getValue();
                            if (index == undefined) {//Gridfield操作本地data
                                if (Ext.isEmpty(grid.store.proxy.data)) {
                                    grid.store.proxy.data = [];
                                }
                                grid.store.proxy.data.push(data);
                                index = grid.store.proxy.data.length - 1;
                            } else {
                                Ext.Array.splice(grid.store.proxy.data, index, 1, data);
                            }
                            grid.store.load();
                            grid.getSelectionModel().select(index);
                            me.setRecordValueMapping(comp, grid.store.proxy.data)
                            wind.close();
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        wind.close();
                    }
                }
            ]
        });
        wind.show();
    },

    setRecordValueMapping: function (comp, valueMappings) {
        var me = this;
        var currentParameter = comp.recordData;
        currentParameter['valueMappings'] = valueMappings;
        currentParameter['value'] = me.translateValue(valueMappings, currentParameter.valueType);
        var parameterGrid = Ext.getCmp('parameterGrid').getGrid();
        Ext.Array.splice(parameterGrid.store.proxy.data, comp.innerParamsIndex, 1, currentParameter);
    },
    translateValue: function (dtoData, valueType) {
        var me = this;
        var reslut = {
            "clazz": "com.qpp.cgp.value.ExpressionValueEx",
            "type": valueType || 'String',
            "constraints": [],
            "expression": {
                "clazz": "com.qpp.cgp.expression.Expression",
                "resultType": valueType || 'String',
                "expressionEngine": "JavaScript",
                "inputs": [],
                "expression": "function expression(args){ return args.context.lineItems[0].productName; }",
                "multilingualKey": "com.qpp.cgp.expression.Expression"
            },
            "multilingualKey": "com.qpp.cgp.value.ExpressionValueEx"
        };
        var jsSetValueExp = '';
        dtoData.forEach(function (arrEl, index) {
            var conditionExp = me.conditionToFreemark(arrEl.condition);
            var valueExp = me.setValueJSExp(arrEl.value);

            if (index == 0) {
                jsSetValueExp += Ext.String.format('if({0}){\n {1}\n}', Ext.isEmpty(conditionExp) ? 'true' : conditionExp, valueExp);
            } else {
                jsSetValueExp += Ext.String.format('else if({0}){\n {1}\n}', Ext.isEmpty(conditionExp) ? 'true' : conditionExp, valueExp);
            }
        });
        reslut.expression.expression = Ext.String.format("function expression(args){ {0} \n return '';}",
            jsSetValueExp.replace(/lineItems\[/g, "args.context.lineItems["));
        return reslut;
    },
    /**
     * 条件查看
     * @param data
     */
    showCondition: function (data) {
        var wind = Ext.create("Ext.window.Window", {
            title: i18n.getKey('ValueEdit'),
            modal: true,
            layout: 'fit',
            width: 900,
            height: 600,
            items: [
                Ext.create('CGP.common.condition.view.ConditionContainer', {
                    name: 'condition',
                    itemId: 'condition',
                    // fieldLabel: i18n.getKey('condition'),
                    header: false,
                    data: data,
                    contentAttributeStore: Ext.data.StoreManager.lookup('contentAttributeStore'),
                    listeners: {
                        afterrender: function (comp) {
                            if (!Ext.isEmpty(comp.data)) {
                                comp.setValue(comp.data);
                            }
                        }
                    },
                }),
            ]
        });
        wind.show();
    },
    /**
     * 内部参数编辑
     * @param grid
     * @param recdData
     * @param index
     */
    showParameterEdit: function (grid, recdData, index) {
        var titleOp = recdData ? i18n.getKey('edit') : i18n.getKey('create');
        var wind = Ext.create("Ext.window.Window", {
            itemId: "parameterEdit",
            title: titleOp + i18n.getKey('inner') + i18n.getKey('param'),
            modal: true,
            layout: 'fit',
            items: [
                Ext.create('Ext.form.Panel', {
                    itemId: 'parameterName',
                    padding: '20',
                    border: 0,
                    width: '100%',
                    items: [
                        {
                            name: 'name',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            itemId: 'name',
                            allowBlank: false,
                            regex: /^[A-Za-z]+[A-Za-z0-9_-]*$/,
                            emptyText: '字母开头的字母、数字、-、_',
                            regexText: '只允许字母开头的字母、数字、-、_',
                            value: recdData ? recdData.name : '',
                            maxLength: 50
                        },
                        {
                            name: 'valueType',
                            xtype: 'combo',
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            allowBlank: false,
                            itemId: 'valueType',
                            value: recdData ? recdData.value.type : 'String',
                            fieldLabel: i18n.getKey('valueType'),
                            store: {
                                fields: [
                                    'display', 'value'
                                ],
                                data: [
                                    {
                                        display: 'String',
                                        value: 'String'
                                    },
                                    {
                                        display: 'Number',
                                        value: 'Number'
                                    },
                                    {
                                        display: 'Boolean',
                                        value: 'Boolean'
                                    }
                                ]
                            },

                        }
                    ]
                })
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var wind = btn.ownerCt.ownerCt;
                        var form = wind.down('form');
                        var nameComp = wind.down('form').getComponent('name');
                        var formData = form.getValues();
                        if (form.isValid()) {
                            var newName = nameComp.getValue();
                            var valueType = formData.valueType;
                            var nameIsExist = false;
                            if (Ext.isEmpty(grid.store.proxy.data)) {
                                grid.store.proxy.data = [];
                            }
                            grid.store.proxy.data.forEach(function (item, checkIndex) {
                                if (item.name == newName) {
                                    nameIsExist = true;
                                }
                            });
                            if (nameIsExist) {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey(newName + ' Is Exist!'));
                                return false;
                            }
                            if (!Ext.isEmpty(index)) {//Gridfield操作本地data
                                recdData.name = newName;
                                recdData.valueType = valueType;
                                Ext.Array.splice(grid.store.proxy.data, index, 1, recdData);
                            } else {
                                var data = {};
                                data.name = newName;
                                data.valueType = valueType;
                                data.valueMappings = [];
                                grid.store.proxy.data.push(data);
                                index = grid.store.proxy.data.length - 1;
                            }
                            grid.store.load(function (records, operation, success) {
                                if (success) {
                                    // grid.getSelectionModel().deselectAll()
                                    grid.getSelectionModel().select(index);
                                }
                            });
                            wind.close();
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        wind.close();
                    }
                }
            ]
        });
        wind.show();
    },

    editTextParameter: function (tab, title, id) {
        var title = (id ? i18n.getKey('edit') : i18n.getKey('create')) + i18n.getKey('排版文字参数');
        var tabPanel = tab.parent.Ext.getCmp('textParameteList').ownerCt;
        var parameterEditTab = tabPanel.getComponent('textParameterEdit');
        var textParameteUrl = path + 'partials/product/productconfig/productimpositionconfig/composition/textparameteredit.html' +
            '?parameterId=' + (id ?? 0) + '&productId=' + JSGetQueryString('productId') + '&impositionId=' + JSGetQueryString('impositionId');
        if (parameterEditTab) {
            parameterEditTab.title = title;
            parameterEditTab.update('<iframe id="tabs_iframe_textParamete" src="' + textParameteUrl + '" width="100%" ' +
                'height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        } else {
            parameterEditTab = tabPanel.add({
                id: 'textParameterEdit',
                title: title,
                closable: true,
                html: '<iframe id="tabs_iframe_textParamete_edit" src="' + textParameteUrl + '" width="100%" height="100%" ' +
                    'frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                // closable: true
            });
        }
        tabPanel.setActiveTab(parameterEditTab);
    },

    /**
     * 删除文字参数
     * @param grid
     * @param ids
     */
    deleteTextParameter: function (grid, ids) {

    },
    /**
     *
     * @param data
     * @param mask
     */
    testFreemark: function (data, mask) {
        var me = this, method = "POST", url;
        url = composingPath + 'api/freemarker/templates/test';
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
                    mask.hide();
                    var wind = Ext.create("Ext.window.Window", {
                        itemId: "inputKeyWind",
                        title: i18n.getKey('test') + i18n.getKey('result'),
                        modal: true,
                        layout: 'fit',
                        width: 500,
                        height: 400,
                        items: [
                            {
                                xtype: 'textareafield',
                                itemid: 'result',
                                readOnly: true,
                                value: resp.data
                            }
                        ]
                    });
                    wind.show();
                } else {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {
                mask.hide();
            }
        });
    },

    showOrderData: function (pbtn) {
        var wind = Ext.create("Ext.window.Window", {
            itemId: "orderDataWind",
            title: i18n.getKey('orderData'),
            modal: true,
            layout: 'fit',
            width: 900,
            height: 600,
            items: [
                Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.OrderDataForm', {
                    itemId: 'orderDataForm'
                })
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var orderData = null;
                        if (wind.getComponent('orderDataForm').isValid()) {
                            orderData = wind.getComponent('orderDataForm').getValue();
                        }
                        pbtn.ownerCt.getComponent('orderData').setValue(JSON.stringify(orderData));
                        wind.close();
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        wind.close();
                    }
                }
            ]
        });
        wind.show();
    },
    /**
     *
     * @param templateModules
     * @returns {String|string}
     * @constructor
     */
    variableToFreemark: function (innerParameters) {
        var resultData = '', variable = '';
        if (Ext.isEmpty(innerParameters) || innerParameters.length < 1)
            return resultData;
        Ext.Array.forEach(innerParameters, function (item, index) {
            variable += item.name + '="" ';
        });
        resultData = Ext.String.format('<#assign {0} />', variable);
        return resultData;
    },
    /**
     * 变量对象转换成freemark赋值表达式
     * @param variables
     * @returns {string}
     */
    variabeltoExp: function (innerParameters) {
        var result = '', me = this;
        Ext.Array.forEach(innerParameters, function (item) {
            var parameterValue = ''
            item.valueMappings.forEach(function (arrEl, index) {
                var conditionExp = me.conditionToFreemark(arrEl.condition);
                var valueExp = me.setValueExp(item.name, arrEl.value);

                if (index == 0) {
                    parameterValue += Ext.String.format('<#if {0}>\n{1}\n', Ext.isEmpty(conditionExp) ? 'true' : conditionExp, valueExp);
                } else {
                    parameterValue += Ext.String.format('<#elseif {0}>\n{1}\n', Ext.isEmpty(conditionExp) ? 'true' : conditionExp, valueExp);
                }
            });
            if (parameterValue) {
                parameterValue += '</#if>'
            }
            result += parameterValue;
        });
        return result;
    },

    /**
     *
     * @param condition
     * @returns {string|*}
     */
    conditionToFreemark: function (condition) {
        var me = this;
        if (Ext.isEmpty(condition)) {
            return '';
        }
        if (condition.conditionType == 'custom') {
            return condition.operation.expression;
        } else {
            var tandform = Ext.create("CGP.attrconfigtransform.Controller");
            return tandform.operation(condition.operation);
        }
    },
    /**
     *
     * @param variables
     * @returns {string}
     */
    setValueExp: function (parameterName, value) {
        var result = '';
        // .value||arrEl.value.calculationExpression
        if (value.calculationExpression) {
            result += Ext.String.format('<#assign {0}={1} >\n', parameterName, value.calculationExpression);
        } else {
            result += Ext.String.format('<#assign {0}="{1}" >\n', parameterName, value.value);
        }
        return result;
    },

    /**
     *
     * @param variables
     * @returns {string}
     */
    setValueJSExp: function (value) {
        var result = '';
        // .value||arrEl.value.calculationExpression
        if (value.calculationExpression) {
            result += Ext.String.format('return {0} ;', value.calculationExpression);
        } else {
            result += Ext.String.format('return "{0}" ;', value.value);
        }
        return result;
    },
})