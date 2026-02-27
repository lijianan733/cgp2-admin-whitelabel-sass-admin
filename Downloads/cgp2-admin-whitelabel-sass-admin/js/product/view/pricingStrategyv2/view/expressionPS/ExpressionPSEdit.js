/**
 * Created by admin on 2020/3/31.
 */
Ext.Loader.syncRequire(['Ext.ux.form.GridField']);
Ext.define("CGP.product.view.pricingStrategyv2.view.expressionPS.ExpressionPSEdit", {
    extend: 'Ext.ux.form.ErrorStrickForm',
    bodyPadding: 5,
    fieldDefaults: {
        labelAlign: 'right',
        width: 400,
        labelWidth: 100,
        msgTarget: 'side'
    },
    layout: {
        type: 'table',
        columns: 2,
        tdAttrs: {
            style: {
                width: 420
            }
        }
    },
    autoScroll: true,
    scroll: 'vertical',
    strategyId: null,
    strategyModel: null,
    tabPanel: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create("CGP.product.view.pricingStrategyv2.controller.PricingStrategy");
        var argStore = Ext.create("CGP.product.view.pricingStrategyv2.store.LocalArgument");
        var argGrid = Ext.create("Ext.ux.form.GridField", {
            store: argStore,
            itemId: 'argumentGrid',
            name: 'args',
            fieldLabel: i18n.getKey('arguments'),
            colspan: 2,
            layout: 'fit',
            bodyStyle: 'padding:10px',
            width: 700,
            Defaults: {
                width: 100
            },
            gridConfig: {
                renderTo: 'argumentGridContainer',
                plugins: [
                    new Ext.grid.plugin.CellEditing({
                        clicksToEdit: 2
                    })
                ],
                store: argStore,
                minHeight: 200,
                layout: 'fit',
                tbar: [
                    '->',
                    {
                        text: i18n.getKey('add'),
                        iconCls: 'icon_add',
                        handler: function () {
                            controller.argumentWind(me, null);
                        }
                    }
                ],
                columns: [
                    {
                        text: i18n.getKey('operation'),
                        xtype: 'actioncolumn',
                        itemId: 'actioncolumn',
                        dataIndex: '_id',
                        width: 50,
                        sortable: false,
                        resizable: false,
                        menuDisabled: true,
                        items: [

                            {
                                iconCls: 'icon_remove icon_margin',
                                itemId: 'actionremove',
                                tooltip: 'Remove',
                                handler: function (view, rowIndex, colIndex) {
                                    Ext.Msg.confirm(i18n.getKey('info'), i18n.getKey('deleteConfirm'), function (select) {
                                        if (select == 'yes') {
                                            var store = view.getStore();
                                            store.removeAt(rowIndex);
                                        }
                                    });
                                }
                            },
                            {
                                iconCls: 'icon_edit icon_margin',
                                itemId: 'actionedit',
                                tooltip: 'Edit',
                                handler: function (view, rowIndex, colIndex) {

                                    var store = view.getStore();
                                    var record = store.getAt(rowIndex);
                                    var argumentType = 'CGP.product.view.pricingStrategyv2.view.expressionPS.AttributeArgument';
                                    if (record.get('clazz') == "com.qpp.cgp.domain.pricing.configuration.QtyTableArgument") {
                                        argumentType = 'CGP.product.view.pricingStrategyv2.view.expressionPS.QtyArgument';
                                    }
                                    var title = i18n.getKey('edit') + i18n.getKey('argument') + '(' + record.getId() + ')';
                                    controller.createArgument(me, argumentType, title, record);
                                }
                            }
                        ]
                    },
                    {
                        text: i18n.getKey('argumentName'),
                        dataIndex: 'key',
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false,
                            minValue: 1
                        },
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip ="' + value + '"';
                            return value;
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        text: i18n.getKey('argumentValue'),
                        sortable: false,
                        dataIndex: '_id',
                        width: 120,
                        renderer: function (value, metadata, record, rowIndex) {
                            var displayValue = 'Qty';
                            if (!Ext.isEmpty(record.data.attributeId) && record.data.attributeId != 0) {
                                displayValue = 'attributeId_' + record.data.attributeId;
                            }
                            metadata.tdAttr = 'data-qtip ="' + displayValue + '"';
                            return {
                                xtype: 'displayfield',
                                value: displayValue
                            };
                        }
                    },
                    {
                        text: i18n.getKey('description'),
                        sortable: false,
                        dataIndex: 'description',
                        flex: 1,
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip ="' + value + '"';
                            return value;
                        },
                        editor: {
                            xtype: 'textfield'
                        }
                    }
                ]
            }
        });

        if (Ext.isEmpty(me.strategyModel)) {
            me.strategyModel = Ext.create('CGP.product.view.pricingStrategyv2.model.PricingStrategy', {
                clazz: 'com.qpp.cgp.domain.pricing.configuration.ExpressionPricingConfig'
            });
        }
        me.tbar = Ext.create('Ext.ux.toolbar.Edit', Ext.Object.merge({
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
                disabled: me.readOnly,
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    if (form.getForm().isValid()) {
                        var data = me.getValue();
                        //提交数据前验证表达式
                        var errors = form.validateOutput(data.expression, data.args);
                        if (JSON.stringify(errors) != '{}') {
                            form.showErrors(errors);
                            return false;
                        }
                        //转换成提交数据
                        var translateData = function (data) {
                            if (Ext.isEmpty(data.setting)) {
                                data.setting = {
                                    _id: JSGetCommonKey(),
                                    clazz: 'com.qpp.cgp.domain.pricing.configuration.MathExpressionPricingSetting',
                                    expression: null,
                                    args: null
                                };
                            }
                            //data.strategyType='com.qpp.cgp.domain.pricing.configuration.MathExpressionPricingSetting';
                            data.setting.expression = data.expression;
                            data.setting.args = data.args;
                            if (Ext.isEmpty(data.formula)) {
                                data.formula = {
                                    _id: JSGetCommonKey(),
                                    index: 0,
                                    description: 'ExpressionPricingSetting',
                                    clazz: 'com.qpp.cgp.domain.pricing.configuration.ExpressionPricingFormula',
                                    formula: {
                                        "expression": '',
                                        "type": "Javascript"
                                    },
                                    factorGenerators: null
                                }
                            }
                            var formulaExp = 'function expression(args) {' + data.expression;
                            for (var i = 0; i < data.args.length; i++) {
                                var reg = new RegExp("\{[" + data.args[i].key + "]\}");
                                formulaExp = formulaExp.replace(reg, 'args[' + data.args[i].index + ']');
                            }

                            data.formula.formula.expression = formulaExp + '}';
                            data.formula.factorGenerators = controller.translateExpressionSetting(data.args);
                            delete data.expression;
                            delete data.args;
                            delete data.strategyType;
                            return data;
                        };
                        controller.save(translateData(data), me.tabPanel, me.tabPanel.url);
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
        }, me.tbarConfig));
        me.items = [
            {
                xtype: 'textfield',
                name: 'description',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                allowBlank: false,
                colspan: 2
            },
            {
                xtype: 'textareafield',
                name: 'expression',
                fieldLabel: i18n.getKey('expression'),
                itemId: 'expression',
                tipInfo: i18n.getKey('expression') + i18n.getKey('format') + ':' + '({arg1}/2+2)*{arg2}',
                allowBlank: false,
                width: 420//,formItemCls:''
            },
            {
                xtype: 'button',
                text: i18n.getKey('expression') + i18n.getKey('test'),
                iconCls: 'icon_verify',
                flex: 1,
                handler: function (btn) {
                    var expComp = me.getComponent('expression');
                    var argsComp = me.getComponent('argumentGrid');
                    var expValue = expComp.getValue();
                    var errors = me.validateOutput(expValue, argsComp.getSubmitValue());
                    if (JSON.stringify(errors) != '{}') {
                        Ext.Msg.alert(i18n.getKey('errorMessage'), me.getErrHtml(errors));
                        return false;
                    } else {
                        Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('expression') + i18n.getKey('test') + i18n.getKey('success'));
                    }
                }
            },
            argGrid
        ];

        me.callParent(arguments);
        me.on('afterrender', function () {
            var page = this;
            var productId = JSGetQueryString('productId');
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    },
    listeners: {
        afterrender: function (comp) {
            if (!Ext.isEmpty(comp.strategyId)) {
                comp.refreshData(comp.strategyModel.data);
            }
        }
    },

    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (!Ext.isEmpty(item.name)) {
                if (item.xtype == 'gridfield') {
                    item.setSubmitValue(data[item.name])
                } else {
                    item.setValue(data[item.name]);
                }
            }
        })
    },
    getValue: function () {
        var me = this, data = me.strategyModel.data;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (!Ext.isEmpty(item.name)) {
                if (item.xtype == 'gridfield') {
                    var gridData = item.getSubmitValue();
                    for (var i = 0; i < gridData.length; i++) {
                        gridData[i].index = i;
                    }
                    data[item.name] = gridData;
                } else {
                    data[item.name] = item.getValue();
                }
            }
        });
        return data;
    },

    validateOutput: function (exp, argsData) {
        var errors = {};
        if (Ext.isEmpty(exp)) {
            errors['expression'] = i18n.getKey('Not blank');
        } else {
            var argsKey = Ext.Array.map(argsData, function (item) {
                return item.key;
            });
            var regArg = /\{\w*\}/g;
            var expArgs = exp.match(regArg);
            Ext.each(expArgs, function (arg) {
                var itemArg = arg.substring(1, arg.length - 1);
                if (!Ext.Array.contains(argsKey, itemArg)) {
                    errors[itemArg] = 'no ' + itemArg + ' argument';
                }
            });

            var reg = /\{\w*\}/g;
            //var reg='/[\+\-\*\/]/g';
            try {
                var values = exp.replace(reg, '100');
                eval(values);
            } catch (error) {
                errors['expression'] = i18n.getKey('expression') + i18n.getKey('misformatted');
            }
        }
        return errors;
    }


})
