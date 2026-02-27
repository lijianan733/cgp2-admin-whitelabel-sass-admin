/**
 * Created by nan on 2020/3/31.
 * bomItem中关联物料只有一个时，该组件隐藏
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.BomItemMaterialPredicatesGridField', {
    extend: 'Ext.ux.form.GridFieldWithCRUD',
    name: 'materialPredicates',
    itemId: 'materialPredicates',
    alias: 'widget.bomitemmaterialpredicatesgridfield',
    fieldLabel: i18n.getKey('物料筛选配置'),
    minHeight: 100,
    msgTarget: 'side',
    labelAlign: 'top',
    allowBlank: false,
    bomItem: null,
    data: null,
    tipInfo: '该配置的最终结果是筛选出一个需要的物料',
    padding: '10 25 15 25',
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
            if (win.createOrEdit == 'create') {
                win.outGrid.store.add(data);
            } else {
                for (var i in data) {
                    win.record.set(i, data[i]);
                }
            }
            //触发修改事件
            var centerContainer = Ext.getCmp('productMaterialMappingV3_CenterContainer');
            if (centerContainer) {
                centerContainer.fireEvent('dirty');
            }
            win.close();
        }
    },
    setValueHandler: function (data) {
        var win = this;
        var form = win.getComponent('form');
        form.items.items.forEach(function (item) {
            if (item.disabled == false) {
                if (item.xtype == 'bomitemqtyconfiggridfield' || item.xtype == 'bomitemmaterialpredicatesgridfield') {
                    item.setSubmitValue(data[item.getName()]);
                } else {
                    item.setValue(data[item.getName()]);

                }
            }
        })
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
    addHandler: function (btn) {
        var grid = btn.ownerCt.ownerCt;
        var me = grid.gridField;
        var optionalMaterialCount = 1;
        if (grid.gridField.bomItem.optionalMaterials) {
            optionalMaterialCount += grid.gridField.bomItem.optionalMaterials.length;
        }
        /*   var hadPredicateMaterials = [];
           if (grid.store.getCount() > 0) {
               grid.store.data.each(function (item) {
                   if (item.get('clazz') == 'com.qpp.cgp.domain.product.config.material.mapping2dto.DiscreteExcludePredicateDTO') {
                       hadPredicateMaterials.push(item.get('materialId'));
                   }
               });
           }
           if (optionalMaterialCount - 1 == hadPredicateMaterials.length) {
               Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('在配置的过滤规则中，已过滤出一个关联物料'));
               return;
           }*/
        var win = Ext.create('GridFieldWithCRUD.localWindow', {
            createOrEdit: 'create',
            gridField: me,
            outGrid: grid,
            data: null,
            winTitle: me.winTitle,
            saveHandler: me.saveHandler,
            resetHandler: me.resetHandler,
            setValueHandler: me.setValueHandler,
            formItems: me.formItems
        });
        win.show();
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
                    clazz: 'com.qpp.cgp.domain.product.config.material.mapping2dto.DiscreteExcludePredicateDTO',
                    materialId: null,
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
    initComponent: function () {
        var me = this;
        var optionalMaterials = me.bomItem.optionalMaterials || [];
        var optionalMaterialIds = [];
        optionalMaterials.forEach(function (item) {
            optionalMaterialIds.push(item._id);
        });
        optionalMaterialIds.push(me.bomItem.itemMaterial._id);
        var MaterialStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.store.MaterialStore', {
            autoLoad: false,
            pageSize: 1000,
            params: {
                sort: Ext.JSON.encode([{"property": "_id", "direction": "ASC"}]),
                filter: Ext.JSON.encode([{
                    name: 'includeIds',
                    type: 'string',
                    value: '[' + optionalMaterialIds.toString() + ']'
                }])
            }
        });
        //这是表示但只有一个物料的可选件时，不需要配置
        if (optionalMaterialIds.length > 1) {
            me.hidden = false;
        } else {
            me.hidden = true;
        }
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller');
        me.formItems = [
            {
                xtype: 'combo',
                name: 'clazz',
                items: 'clazz',
                value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.DiscreteExcludePredicateDTO',
                fieldLabel: i18n.getKey('筛选物料方式'),
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value',
                        'display'
                    ],
                    data: [
                        {
                            display: '单个物料排除',
                            value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.DiscreteExcludePredicateDTO'
                        },
                        {
                            display: '表达式批量排除',
                            value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.ExcludeFilterDTO'
                        },
                        {
                            display: '选定指定物料',
                            value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.IncludeFilterDTO'
                        },
                    ]
                }),
                displayField: 'display',
                valueField: 'value',
                editable: false,
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var filterExpression = combo.ownerCt.getComponent('filterExpression');
                        var material = combo.ownerCt.getComponent('materialId');
                        if (newValue == 'com.qpp.cgp.domain.product.config.material.mapping2dto.DiscreteExcludePredicateDTO') {
                            material.show();
                            material.setDisabled(false);
                            filterExpression.hide();
                            filterExpression.setDisabled(true);
                        } else if (newValue == 'com.qpp.cgp.domain.product.config.material.mapping2dto.ExcludeFilterDTO') {
                            filterExpression.show();
                            filterExpression.setDisabled(false);
                            material.hide();
                            material.setDisabled(true);
                        } else if (newValue == 'com.qpp.cgp.domain.product.config.material.mapping2dto.IncludeFilterDTO') {
                            material.show();
                            material.setDisabled(false);
                            filterExpression.hide();
                            filterExpression.setDisabled(true);
                        }
                    }
                }
            },
            {
                xtype: 'combo',
                name: 'materialId',
                itemId: 'materialId',
                allowBlank: false,
                store: MaterialStore,
                fieldLabel: i18n.getKey('material'),
                displayField: 'displayName',
                valueField: '_id',
                editable: false
            },
            {
                xtype: 'jsexpressioninputfield',
                columnWidth: 0.8,
                width: 650,
                height: 150,
                allowBlank: false,
                hidden: true,
                disabled: true,
                emptyText: '请输入表达式',
                msgTarget: 'hide',
                margin: '0 5 0 0',
                name: 'filterExpression',
                fieldLabel: i18n.getKey('批量排除表达式'),
                itemId: 'filterExpression',
                tipInfo: '表达式返回结果为true，表示该物料将被排除掉，这个物料不可用',
                contextData: function () {
                    var contextData = [];
                    var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
                    contextData.push({
                        id: null,
                        valueName: '当前待排除物料对象',
                        displayName: "currentMaterial"
                    });
                    for (var i = 0; i < skuAttributeStore.getCount(); i++) {
                        var data = skuAttributeStore.getAt(i).getData();
                        contextData.push({
                            id: data.attribute.id,
                            valueName: data.attribute.name + '的值',
                            displayName: "Attr_" + data.attribute.id
                        })
                    }
                    return contextData;
                }(),
            },
            {
                xtype: 'conditionfieldcontainer',
                name: 'condition',
                itemId: 'condition',
                maxHeight: 350,
                width: 800,
                minHeight: 80,
                allowElseCondition: false,
                fieldLabel: i18n.getKey('condition'),
            }
        ];
        me.gridConfig = {
            renderTo: JSGetUUID(),
            autoScroll: true,
            maxHeight: 350,
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'condition',
                        type: 'object'
                    },
                    {
                        name: 'materialId',
                        type: 'string'
                    },
                    {
                        name: 'materialName',
                        type: 'string'
                    },
                    {
                        name: 'name',
                        type: 'string'
                    },
                    {
                        name: 'filterExpression',
                        type: 'string'
                    },
                    {//默认是单个物料排除
                        name: 'clazz',
                        type: 'string',
                        value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.DiscreteExcludePredicateDTO'
                    }
                ],
                data: me.data || [],
            }),
            columns: [
                {
                    xtype: 'rownumberer',
                    tdCls: 'vertical-middle',
                    width: 60
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
                    text: i18n.getKey('筛选'),
                    dataIndex: 'materialId',
                    tdCls: 'vertical-middle',
                    itemId: 'materialId',
                    flex: 1,
                    renderer: function (value, mateData, record) {
                        if (record.get('clazz') == 'com.qpp.cgp.domain.product.config.material.mapping2dto.DiscreteExcludePredicateDTO') {
                            return '排除的物料 : ' + record.get('materialName') + '(' + record.get('materialId') + ')';
                        } else if (record.get('clazz') == 'com.qpp.cgp.domain.product.config.material.mapping2dto.ExcludeFilterDTO') {
                            return '批量排除公式 : ' + record.get('name') + '(' + record.get('filterExpression') + ')';
                        } else if (record.get('clazz') == 'com.qpp.cgp.domain.product.config.material.mapping2dto.IncludeFilterDTO') {
                            return '选定指定物料 : ' + record.get('materialName') + '(' + record.get('materialId') + ')';
                        }
                    }
                },
                {
                    text: i18n.getKey('materialScreeningMethod'),
                    dataIndex: 'clazz',
                    tdCls: 'vertical-middle',
                    itemId: 'clazz',
                    width: 200,
                    renderer: function (value, mateData, record) {
                        if (value == 'com.qpp.cgp.domain.product.config.material.mapping2dto.ExcludeFilterDTO') {
                            return '表达式批量排除';
                        } else if (value == 'com.qpp.cgp.domain.product.config.material.mapping2dto.DiscreteExcludePredicateDTO') {
                            return '单个物料排除';
                        } else if (value == 'com.qpp.cgp.domain.product.config.material.mapping2dto.IncludeFilterDTO') {
                            return '选定指定物料';
                        }
                    }
                }
            ]
        };
        me.callParent();
    },
});

