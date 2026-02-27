/**
 * Created by nan on 2020/3/31.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.BomItemQtyConfigGridField', {
    extend: 'Ext.ux.form.GridFieldWithCRUD',
    name: 'qtyMappingRules',
    itemId: 'qtyMappingRules',
    alias: 'widget.bomitemqtyconfiggridfield',
    fieldLabel: i18n.getKey('BomItem用量映射规则'),
    minHeight: 100,
    msgTarget: 'side',
    labelAlign: 'top',
    allowBlank: false,
    padding: '10 25 30 25',
    data: null,
    switchUrl: path + 'ClientLibs/extjs/resources/themes/images/ux/switchType.png',
    saveHandler: function (btn) {
        var form = btn.ownerCt.ownerCt;
        var win = form.ownerCt;
        var isValid = true;
        form.items.items.forEach(function (item) {
            if (item.disabled == false) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        if (isValid == true) {
            var data = {};
            form.items.items.forEach(function (item) {
                if (item.disabled == false) {
                    data[item.getName()] = item.getValue();
                }
            });
            if (!Ext.isObject(data.outputValue)) {
                data.outputValue = {
                    clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                    value: data.outputValue
                }
            }
            data.clazz = 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule';


            var gridSpecialRecord = {};
            var outGrid = win.outGrid;
            for (var i = 0; i < outGrid.store.getCount(); i++) {
                var record = outGrid.store.getAt(i);
                var condition = record.get('condition');
                if (condition && condition.conditionType == 'else') {
                    gridSpecialRecord.else = record;
                } else if (Ext.isEmpty(condition)) {
                    gridSpecialRecord.empty = record;
                }
            }
            if (win.createOrEdit == 'create') {
                if (data.condition && data.condition.conditionType == 'else') {
                    if (gridSpecialRecord.else) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('其他条件都不成立时执行的配置已经存在!'));
                        return;
                    }
                } else if (Ext.isEmpty(data.condition)) {
                    if (gridSpecialRecord.empty) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('无条件执行的配置已经存在!'));
                        return;
                    }
                }
                win.outGrid.store.add(data);
            } else {
                if (data.condition && data.condition.conditionType == 'else') {
                    if (gridSpecialRecord.else && win.record != gridSpecialRecord.else) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('其他条件都不成立时执行的配置已经存在!'));
                        return;
                    }
                } else if (Ext.isEmpty(data.condition)) {
                    if (gridSpecialRecord.empty && win.record != gridSpecialRecord.empty) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('无条件执行的配置已经存在!'));
                        return;
                    }
                }
                for (var i in data) {
                    win.record.set(i, data[i]);
                }
            }

            var centerContainer = Ext.getCmp('productMaterialMappingV3_CenterContainer');
            if (centerContainer) {
                centerContainer.fireEvent('dirty');
            }
            win.close();
        }
    },
    resetHandler: function (btn) {
        var form = btn.ownerCt.ownerCt;
        var win = form.ownerCt;
        form.el.mask('loading..');
        setTimeout(function () {
            if (win.record) {
                win.setValueHandler(win.record.getData());
            } else {
                win.setValueHandler({
                    clazz: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule',
                    outputValue: {
                        clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                        value: null
                    },
                    condition: {
                        conditionType: "simple",
                        clazz: "com.qpp.cgp.domain.executecondition.InputCondition",
                        operation: {
                            operator: "AND",
                            operations: [],
                            clazz: "com.qpp.cgp.domain.executecondition.operation.LogicalOperation"
                        }
                    }
                })
            }
            form.el.unmask('loading..');
        }, 100)
    },
    deleteHandler: function (view, rowIndex, colIndex) {
        var store = view.getStore();
        store.removeAt(rowIndex);
        //触发修改事件
        var centerContainer = Ext.getCmp('productMaterialMappingV3_CenterContainer');
        if (centerContainer) {
            centerContainer.fireEvent('dirty');
        }
    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller');
        me.formItems = [
            {
                name: 'description',
                text: i18n.getKey('description'),
                itemId: 'description',
                xtype: 'textfield',
                allowBlank: false,
                fieldLabel: i18n.getKey('description')
            },
            {
                xtype: 'attributejsexpressioninputfield',
                attribute: {
                    inputType: 'numberfield',
                    selectType: 'NON',
                    options: [],
                    valueType: 'Number'
                },
                labelAlign: 'left',
                itemId: 'propertyValue',
                allowBlank: false,
                msgTarget: 'none',
                fieldLabel: i18n.getKey('qty'),
                name: 'outputValue',
                padding: '10 0 5 25',
                width: 800,
                JSExpressionInputFieldConfig: {
                    templateInfo: 'Attr_属性Id+2;',
                    contextData: function () {
                        var contextData = [];
                        var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
                        for (var i = 0; i < skuAttributeStore.getCount(); i++) {
                            var data = skuAttributeStore.getAt(i).getData();
                            contextData.push({
                                id: data.attribute.id,
                                valueName: data.attribute.name + '的值',
                                displayName: "Attr_" + data.attribute.id
                            })
                        }
                        return contextData;
                    }()
                }
            },
            {
                xtype: 'conditionfieldcontainer',
                name: 'condition',
                itemId: 'condition',
                maxHeight: 350,
                width: 800,
                minHeight: 80,
                fieldLabel: i18n.getKey('condition'),
            }
        ];
        me.gridConfig = {
            renderTo: JSGetUUID(),
            autoScroll: true,
            maxHeight: 350,
            itemId: 'gridField_grid',
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'condition',
                        type: 'object'
                    },
                    {
                        name: 'outputValue',
                        type: 'object'
                    },
                    {
                        name: 'description',
                        type: 'string'
                    }, {
                        name: 'clazz',
                        type: 'string',
                        value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule'
                    }
                ],
                data: me.data || []
            }),
            columns: [
                {
                    xtype: 'rownumberer',
                    tdCls: 'vertical-middle',
                    width: 60
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    tdCls: 'vertical-middle',
                    itemId: 'description',
                    width: 260
                },
                {
                    text: i18n.getKey('condition'),
                    dataIndex: 'condition',
                    tdCls: 'vertical-middle',
                    itemId: 'condition',
                    width: 150,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        if (value && value.conditionType == 'else') {
                            return {
                                xtype: 'displayfield',
                                value: '<font color="red">其他条件都不成立时执行</font>'
                            };
                        } else if (value && (value.operation.operations.length > 0 || value.conditionType == 'custom')) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>查看执行条件</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            controller.checkCondition(value);
                                        });
                                    }
                                }
                            };
                        } else {
                            return {
                                xtype: 'displayfield',
                                value: '<font color="green">无条件执行</font>'
                            };
                        }
                    }
                },
                {
                    text: i18n.getKey('qty'),
                    dataIndex: 'outputValue',
                    tdCls: 'vertical-middle',
                    itemId: 'outputValue',
                    flex: 1,
                    renderer: function (value, mateData, record) {
                        if (!Ext.isEmpty(value.value)) {
                            return value.value;
                        } else {
                            return value.calculationExpression;

                        }
                    }
                }
            ]
        };
        me.callParent();
    },
});
