Ext.Loader.syncRequire([
    'CGP.cmscontext.model.cmsContextModel'
])
Ext.onReady(function () {
    Ext.apply(Ext.form.field.VTypes, {
        keyValid: function (value, field) {
            var form = field.ownerCt;
            var win = form.ownerCt;
            var store = win.outGrid.store;
            var data = store.getProxy().data;
            console.log(win)
            for (var i = 0; i < data.length; i++) {
                var key = data[i].key;
                if (win.createOrEdit == 'create' && value == key) {
                    return false;
                }
            }
            return value;
        },
        keyValidText: i18n.getKey('key') + '值重名'
    });
    var page = Ext.widget({
        xtype: 'uxeditpage',
        block: 'cmscontext',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.cmscontext.model.cmsContextModel',
            layout: 'auto',
            items: [
                {
                    xtype: 'textfield',
                    itemId: 'name',
                    name: 'name',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('name')
                },
                {
                    xtype: 'gridfieldwithcrudv2',
                    name: 'variables',
                    itemId: 'variables',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('variables'),
                    width: 800,
                    gridConfig: {
                        store: {
                            xtype: 'store',
                            fields: [
                                {
                                    name: 'key',
                                    type: 'string'
                                },
                                {
                                    name: 'value',
                                    type: 'string'
                                },
                                {
                                    name: 'valueType',
                                    type: 'string'
                                },
                                {
                                    name: 'builderInFunction',
                                    type: 'object'
                                },
                                {
                                    name: 'addModels',
                                    type: 'number',
                                    convert: function (value, record) {
                                        if (record.raw.value) {
                                            return {
                                                addModels: 2
                                            }
                                        } else {
                                            return {
                                                addModels: 1
                                            }
                                        }
                                    }
                                }
                            ],
                            proxy: {
                                type: 'pagingmemory'
                            },
                            data: []
                        },
                        autoScroll: true,
                        columns: [
                            {
                                dataIndex: 'key',
                                width: 100,
                                text: i18n.getKey('key')
                            },
                            {
                                dataIndex: 'valueType',
                                minWidth: 100,
                                text: i18n.getKey('valueType')
                            },
                            {
                                text: i18n.getKey('value'),
                                flex: 2,
                                renderer: function (value, metaData, record) {
                                    var data = record.getData();
                                    var displayInfo = [];
                                    if (data.value) {
                                        displayInfo = [
                                            {
                                                title: 'value',
                                                value: data.value
                                            }
                                        ];
                                    } else if (data.builderInFunction.name) {
                                        displayInfo = [
                                            {
                                                title: 'builderInFunction',
                                                value: data.builderInFunction.name
                                            }
                                        ];
                                    }
                                    return JSAutoWordWrapStr(JSCreateHTMLTable(displayInfo));
                                }
                            }
                        ]
                    },
                    winConfig: {
                        layout: 'fit',
                        formConfig: {
                            layout: {
                                type: 'vbox'
                            },
                            width: 800,
                            useForEach: true,
                            isValidForItems: true,
                            defaults: {
                                allowBlank: false,
                                labelWidth: 110,
                                width: '100%'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    itemId: 'key',
                                    name: 'key',
                                    vtype: 'keyValid',
                                    fieldLabel: i18n.getKey('key')
                                },
                                {
                                    xtype: 'combo',
                                    itemId: 'valueType',
                                    name: 'valueType',
                                    valueField: 'value',
                                    displayField: 'key',
                                    editable: false,
                                    fieldLabel: i18n.getKey('valueType'),
                                    store: {
                                        xtype: 'store',
                                        fields: ['key', 'value'],
                                        data: [
                                            {
                                                key: 'string',
                                                value: 'string'
                                            },
                                            {
                                                key: 'number',
                                                value: 'number'
                                            },
                                            {
                                                key: 'array',
                                                value: 'array'
                                            },
                                            {
                                                key: 'map',
                                                value: 'map'
                                            }
                                        ]
                                    },
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var form = comp.ownerCt;
                                            var value = form.getComponent('value');
                                            value.diyShow(newValue);
                                        }
                                    }
                                },
                                {
                                    xtype: 'radiogroup',
                                    itemId: 'addModels',
                                    name: 'addModels',
                                    fieldLabel: i18n.getKey('addModels'),
                                    defaults: {
                                        flex: 1
                                    },
                                    items: [
                                        {
                                            boxLabel: '模板添加',
                                            name: 'addModels',
                                            inputValue: 1,
                                            checked: true
                                        },
                                        {
                                            boxLabel: '手动添加',
                                            name: 'addModels',
                                            inputValue: 2
                                        }
                                    ],
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var form = comp.ownerCt;
                                            var valueField = form.getComponent('value');
                                            var builderInFunctionField = form.getComponent('builderInFunction');
                                            var valueType = form.getComponent('valueType');
                                            valueField.setVisible(newValue.addModels == 2);
                                            valueField.setDisabled(newValue.addModels != 2);
                                            builderInFunctionField.setVisible(newValue.addModels == 1);
                                            builderInFunctionField.setDisabled(newValue.addModels != 1);
                                            if (newValue.addModels == 2 && !valueType.value) {
                                                valueType.setValue('string');
                                            }
                                        }
                                    },
                                    diySetValue: function (data) {
                                        var me = this;
                                        me.setValue(data)
                                    }
                                },
                                {
                                    xtype: 'combo',
                                    itemId: 'builderInFunction',
                                    name: 'builderInFunction',
                                    editable: false,
                                    displayField: 'key',
                                    valueField: 'value',
                                    fieldLabel: i18n.getKey('builderInFunction'),
                                    store: {
                                        xtype: 'store',
                                        fields: ['key', 'value'],
                                        data: [
                                            {
                                                key: 'GetProductDetailMethod',
                                                value: 'GetProductDetailMethod'
                                            },
                                            {
                                                key: 'GetProductsOfCatalogMethod',
                                                value: 'GetProductsOfCatalogMethod'
                                            },
                                            {
                                                key: 'GetCatalogMethod',
                                                value: 'GetCatalogMethod'
                                            },
                                            {
                                                key: 'GetAllProductCatalogMethod',
                                                value: 'GetAllProductCatalogMethod'
                                            },
                                            {
                                                key: 'GetAllCatalogMethod',
                                                value: 'GetAllCatalogMethod'
                                            },
                                            {
                                                key: 'GetDefaultProductCatalogMethod',
                                                value: 'GetDefaultProductCatalogMethod'
                                            }
                                        ]
                                    },
                                    diySetValue: function (value) {
                                        var me = this;
                                        if (value) {
                                            me.setValue(value.name);
                                        }
                                    },
                                    diyGetValue: function () {
                                        var me = this;
                                        var value = me.value;
                                        var data = {
                                            name: value,
                                            clazz: 'com.qpp.cgp.domain.funtion.BuilderInFunction'
                                        };
                                        return data;
                                    }
                                },
                                {
                                    name: 'value',
                                    xtype: 'uxfieldcontainer',
                                    labelAlign: 'left',
                                    itemId: 'value',
                                    hidden: true,
                                    disabled: true,
                                    flex:1,
                                    fieldLabel: i18n.getKey('value'),
                                    defaults: {
                                        width: '100%',
                                        hidden: true,
                                        disabled: true,
                                        flex: 1,
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            itemId: 'string',
                                            name: 'value',
                                            hidden: false,
                                            disabled: false
                                        },
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'number',
                                            name: 'value',
                                            hideTrigger: true
                                        },
                                        {
                                            xtype: 'arraydatafield',
                                            resultType: 'String',
                                            itemId: 'array',
                                            name: 'value'
                                        },
                                        {
                                            xtype: 'textarea',
                                            itemId: 'map',
                                            name: 'value',
                                            height: 100
                                        }
                                    ],
                                    diyGetValue: function () {
                                        var me = this;
                                        var data = me.getValue();
                                        return data.value;
                                    },
                                    diySetValue: function (value) {
                                        var me = this;
                                        if (value) {
                                            me.items.items.map(function (item) {
                                                if (item.diySetValue) {
                                                    item.diySetValue(value);
                                                } else {
                                                    item.setValue(value);
                                                }
                                            })
                                        }
                                    },
                                    diyShow: function (valueType) {
                                        var me = this;
                                        me.items.items.map(function (item) {
                                            item.setDisabled(!(item.itemId == valueType));
                                            item.setVisible(item.itemId == valueType);
                                        })
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        }
    })

})
