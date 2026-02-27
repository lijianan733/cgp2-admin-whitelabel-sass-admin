/**
 * Created by nan on 2021/5/25
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.gridpcstemplateitem.view.ItemProcesses', {
        extend: 'Ext.ux.grid.GridWithCRUD',
        alias: 'widget.itemprocesses',
        title: i18n.getKey('ItemProcesses'),
        rawData: null,//加载的初始数据源
        listeners: {
            afterrender: function () {
                var page = this;
                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                var productId = builderConfigTab.productId;
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
            }
        },
        isValid: function () {
            return true;
        },
        getValue: function () {
            var me = this;
            if (me.rendered == true) {
                var result = [];
                for (var i = 0; i < me.store.getCount(); i++) {
                    var item = me.store.getAt(i);
                    result.push(item.getData());
                }
                return {
                    itemProcesses: result
                };
            } else {
                return {
                    itemProcesses: me.rawData
                }
            }
        },
        setValue: function (data) {
            var me = this;
            console.log(data);
            if (data) {
                me.rawData = data.itemProcesses;
                me.store.loadData(Ext.clone(me.rawData) || [])
            }
        },
        initComponent: function () {
            var me = this;
            me.store = Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'selector',
                        type: 'string'
                    },
                    {
                        name: 'sortOrder',
                        type: 'number'
                    },
                    {
                        name: 'fieldName',
                        type: 'string'
                    },
                    {
                        name: 'fieldValue',
                        type: 'object'
                    },
                    {
                        name: 'operator',
                        type: 'string'
                    }
                ],
                data: [],
                proxy: {
                    type: 'memory'
                }
            });
            me.columns = [
                {
                    dataIndex: 'selector',
                    name: 'selector',
                    width: 300,
                    sortable: false,
                    text: i18n.getKey('selector')
                },
                {
                    dataIndex: 'sortOrder',
                    name: 'sortOrder',
                    width: 200,
                    sortable: false,
                    text: i18n.getKey('index')
                },
                {
                    dataIndex: 'fieldName',
                    name: 'fieldName',
                    width: 200,
                    sortable: false,
                    text: i18n.getKey('attribute') + i18n.getKey('name'),
                }, {
                    dataIndex: 'fieldValue',
                    name: 'fieldValue',
                    width: 200,
                    sortable: false,
                    xtype: 'valueexcomponentcolumn',
                    canChangeValue: false,//是否可以通过编辑改变record的
                    text: i18n.getKey('attribute') + i18n.getKey('value'),
                }, {
                    dataIndex: 'operator',
                    name: 'operator',
                    flex: 1,
                    sortable: false,
                    text: i18n.getKey('operator')
                },
            ];
            me.winConfig = {
                winTitle: i18n.getKey('itemProcess'),
                formConfig: {
                    width: 500,
                    defaults: {
                        margin: '10 25 5 45',
                        width: 400,
                        allowBlank: false
                    },
                    items: [
                        {
                            xtype: 'combo',
                            name: 'operator',
                            itemId: 'operator',
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            value: 'update',
                            fieldLabel: i18n.getKey('operator'),
                            store: Ext.create('Ext.data.Store', {
                                fields: ['value', 'display'],
                                data: [{
                                    value: 'add',
                                    display: i18n.getKey('add')
                                }, {
                                    value: 'insert',
                                    display: i18n.getKey('insert'),
                                }, {
                                    value: 'delete',
                                    display: i18n.getKey('delete')
                                }, {
                                    value: 'update',
                                    display: i18n.getKey('replace')
                                },],
                            }),
                            listeners: {
                                change: function (combo, newValue, oldValue) {
                                    var fieldName = combo.ownerCt.getComponent('fieldName');
                                    var fieldValue = combo.ownerCt.getComponent('fieldValue');
                                    if (newValue == 'delete') {
                                        fieldName.hide();
                                        fieldName.setDisabled(true);
                                        fieldValue.hide();
                                        fieldValue.setDisabled(true);
                                    } else if (newValue == 'add') {
                                        fieldName.show();
                                        fieldName.setDisabled(false);
                                        fieldValue.show();
                                        fieldValue.setDisabled(false);
                                    } else if (newValue == 'insert') {
                                        fieldName.hide();
                                        fieldName.setDisabled(true);
                                        fieldValue.show();
                                        fieldValue.setDisabled(false);
                                    } else if (newValue == 'update') {
                                        fieldName.hide();
                                        fieldName.setDisabled(true);
                                        fieldValue.show();
                                        fieldValue.setDisabled(false);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            name: 'sortOrder',
                            itemId: 'sortOrder',
                            minValue: 0,
                            value: 0,
                            fieldLabel: i18n.getKey('index'),
                        },
                        {
                            xtype: 'jsonpathselector',
                            name: 'selector',
                            itemId: 'selector',
                            editable: false,
                            valueField: 'value',
                            displayField: 'display',
                            fieldLabel: i18n.getKey('selector'),
                            rawData: null,
                            rootName: 'layers',
                            getCurrentData: function () {
                                var itemProcess = me;
                                var newData = itemProcess.ownerCt.getComponent('itemTemplate').getValue();
                                newData = newData.itemTemplate;
                                return newData;
                            }
                        },
                        {
                            xtype: 'numberfield',
                            name: 'fieldName',
                            itemId: 'fieldName',
                            minValue: 0,
                            allowBlank: true,
                            hidden: true,
                            disabled: true,
                            fieldLabel: i18n.getKey('attribute') + i18n.getKey('name'),
                        }, {
                            xtype: 'valueexfield',
                            name: 'fieldValue',
                            itemId: 'fieldValue',
                            fieldLabel: i18n.getKey('attribute') + i18n.getKey('value'),
                            value: {
                                clazz: "com.qpp.cgp.value.ExpressionValueEx",
                                constraints: [],
                                expression: {
                                    clazz: "com.qpp.cgp.expression.Expression",
                                    expression: "function expression(input){var itemQty= input.context.itemQty;var titleArray = [];for(var i = 0;i < itemQty;i++){titleArray.push('Tile'+(i+1))}return titleArray}",
                                    expressionEngine: "JavaScript",
                                    inputs: [],
                                    resultType: "Array",
                                },
                                type: "Array",
                            },
                            commonPartFieldConfig: {
                                defaultValueConfig: {
                                    type: 'Array',
                                    clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                                    typeSetReadOnly: true,
                                    clazzSetReadOnly: false,
                                }
                            }
                        }
                    ]
                },
            }
            me.callParent();
        }
    }
)
