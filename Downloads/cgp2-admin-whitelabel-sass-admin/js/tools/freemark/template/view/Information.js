Ext.Loader.syncRequire(["CGP.tools.freemark.template.model.FreemarkTemplate"]);
Ext.define('CGP.tools.freemark.template.view.Information', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    requires: ["CGP.tools.freemark.template.view.TemplateModule"],
    layout: {
        type: 'table',
        columns: 1
    },
    itemId: 'information',
    bodyStyle: 'padding:10px',
    autoScroll: true,
    fieldDefaults: {
        labelAlign: 'right',
        width: 400,
        labelWidth: 120,
        msgTarget: 'side',
        validateOnChange: false,
        plugins: [
            {
                ptype: 'uxvalidation'
            }
        ]
    },

    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('information');

        var productStore = Ext.create('CGP.tools.freemark.template.store.Product', {
            storeId: 'productStore',
            params: {
                filter: Ext.JSON.encode([{"name": "type", "value": "%Configurable%", "type": "string"}])
            }
        });
        var defaultVariateStore = Ext.create('CGP.tools.freemark.template.store.VariableKey', {
            storeId: 'defaultVariateStore',
            data: [
                {
                    name: 'printQty',
                    valueType: 'number',
                    description: '打印数量'
                },
                {
                    name: 'pageIndex',
                    valueType: 'number',
                    description: '当前页'
                },
                {
                    name: 'pageTotal',
                    valueType: 'number',
                    description: '总页数'
                },
                {
                    name: 'barCode',
                    valueType: 'string',
                    description: '条码'
                }
            ]
        });
        me.items = [
            {
                xtype: 'singlegridcombo',
                fieldLabel: i18n.getKey('product'),
                itemId: 'productId',
                name: 'contextSource',
                editable: false,
                displayField: 'name',
                valueField: 'id',
                store: productStore,
                allowBlank: false,
                matchFieldWidth: false,
                multiSelect: false,
                autoScroll: true,
                gridCfg: {
                    store: productStore,
                    height: 400,
                    width: 600,
                    autoScroll: true,
                    //hideHeaders : true,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 80,
                            dataIndex: 'id'
                        },
                        {
                            text: i18n.getKey('name'),
                            flex: 1,
                            dataIndex: 'name'
                        },
                        {
                            text: i18n.getKey('type'),
                            width: 100,
                            dataIndex: 'type'
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: productStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    })
                },

                filterCfg: {
                    layout: {
                        type: 'column'
                    },
                    defaults: {
                        width: 170,
                        isLike: false,
                        padding: 3
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            fieldLabel: i18n.getKey('id'),
                            name: 'id',
                            itemId:'searchId',
                            isLike: false,
                            labelWidth: 40,
                            hideTrigger: true
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            name: 'name',
                            itemId:'searchName',
                            isLike: true,
                            labelWidth: 40
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('type'),
                            itemId:'searchType',
                            name: 'type',
                            isLike: true,
                            labelWidth: 40,
                            value:'Configurable'
                        }
                    ]
                },
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        Ext.create('CGP.common.store.ConditionProductAttribute', {
                            storeId:'contentAttribute',
                            productId: Object.keys(newValue)[0]
                        });
                        comp.ownerCt.getComponent('description').setValue(comp.getRawValue());
                    }
                }
            },
            {
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                allowBlank: false
            },
            {
                xtype: 'variategrid',
                name: 'items',
                fieldLabel: i18n.getKey('items'),
                itemId: 'items',
                allowBlank: false,
                width: 600
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: i18n.getKey('freemarkExpression'),
                width: 600,
                layout: 'vbox',
                items: [
                    {
                        xtype: 'button',
                        itemId: 'btnCreateFreemark',
                        text: i18n.getKey('convert') + i18n.getKey('freemark'),
                        iconCls: 'icon_agree',
                        handler: function (btn) {
                            var textfreemark = btn.ownerCt.getComponent('textFreemark')
                            if (textfreemark) {
                                textfreemark.setValue(me.getExpression());
                            }
                        }
                    },
                    {
                        xtype: 'textareafield',
                        itemId: 'textFreemark',
                        rows: 16,
                        width: 475
                    }
                ]
            }
        ];

        me.callParent(arguments);

    },

    getValue: function () {
        var me = this;
        var items = me.items.items;
        var data = me.editModel.data;
        Ext.Array.each(items, function (item) {
            if (item.name) {
                if (item.xtype == 'singlegridcombo') {
                    data[item.name] = {
                        productId: item.getSubmitValue()[0],
                        clazz: "com.qpp.composing.domain.freemarker.ProductContext"
                    };
                } else if (item.xtype == 'variategrid') {
                    data[item.name] = item.getSubmitValue();
                } else {
                    data[item.name] = item.getValue();
                }
            }
        });

        return data;
    },

    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.name) {
                if (item.xtype == 'singlegridcombo') {
                    item.setSingleValue(data[item.name].productId)
                    if (item.name == 'contextSource')
                        item.disable();
                } else if (item.xtype == 'variategrid') {
                    item.setSubmitValue(data[item.name])
                } else {
                    item.setValue(data[item.name]);
                }
            }
        });
        // Ext.create('CGP.common.store.ProductAttributeStore', {
        //     storeId: 'skuAttribute',
        //     productId: data['contextSource'].productId
        //
        // });
    },

    getExpression: function () {
        var me = this;
        var controller = Ext.create('CGP.tools.freemark.template.controller.Controller');
        var variableComp = me.getComponent('items');
        var variables = null, freemarkExp = '';
        if (!variableComp.isVisible()) {
            return false;
        }
        variables = variableComp.getSubmitValue();
        if (!(variables || variables.length < 1))
            return false;
        freemarkExp += controller.variableToFreemark(variables) + '\n';
        freemarkExp += controller.variabeltoExp(variables);
        return freemarkExp;
    }

});