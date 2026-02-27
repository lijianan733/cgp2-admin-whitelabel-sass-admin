Ext.Loader.syncRequire(['Ext.ux.form.field.MultiCombo', 'Ext.ux.data.proxy.PagingMemoryProxy']);
Ext.define('CGP.product.view.productattributeconstraint.view.FormToGrid', {
    extend: 'Ext.form.Panel',
    region: 'center',
    autoScroll: true,
    statics: {
        itemData: []
    },
    itemId: 'formWithPanel',
    bodyPadding: 20,
    attributeArray: [],
    itemData: [],
    //disabled: true,
    defaults: {
        width: 350
    },
    skuAttributeIds: null,

    initComponent: function () {
        var me = this;
        var fieldSetNum = 0;
        me.attributeArray = [];
        me.title = i18n.getKey(me.editOrNew);

        if (me.editOrNew == 'new') {
            CGP.product.view.productattributeconstraint.view.FormToGrid.addStatics({
                itemData: []
            })
        }
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                itemId: 'saveButton',
                disabled: me.saveDisabled,
                handler: function () {
                    var data = {};
                    if (me.isValid()) {
                        var lm = me.setLoading();
                        Ext.Array.each(me.items.items, function (item) {
                            if (item.name == 'items') {
                                CGP.product.view.productattributeconstraint.view.FormToGrid.itemData = item.getSubmitValue();
                                data[item.name] = CGP.product.view.productattributeconstraint.view.FormToGrid.itemData;
                            } else {
                                data[item.name] = item.getValue()
                            }
                        });
                        Ext.Array.each(data.items, function (item) {
                            item.clazz = 'com.qpp.cgp.domain.product.attribute.constraint2.multi.MultiDiscreteValueConstraintItem';
                        });
                        data.productId = me.productId;
                        data.clazz = 'com.qpp.cgp.domain.product.attribute.constraint2.multi.MultiDiscreteValueConstraint';
                        data._id = me._id;
                        var disEnableRecord = me.store.findRecord('isEnable', true);
                        if (me.editOrNew == 'edit') {
                            mainController.updateProductAttributeConstraint(data, me.store, lm, disEnableRecord);
                        } else if (me.editOrNew == 'new') {
                            mainController.createProductAttributeConstraint(data, me.store, lm, me.ownerCt, disEnableRecord)
                        }
                    }
                }
            }
        ];

        Ext.Array.each(me.skuAttributeIds, function (skuAttributeId) {
            var record = me.skuAttributeStore.findRecord('id', skuAttributeId);
            me.attributeArray.push(record.data);
        });
        //window.skuAttributeStore = skuAttributeStore;
        var mainController = Ext.create('CGP.product.view.productattributeconstraint.controller.Controller');

        var simpsonsStore = Ext.create('Ext.data.Store', {
            autoSync: true,
            fields: [
                {name: 'conditions', type: 'array'},
                {name: 'attributeValues', type: 'array'},
                {name: 'query', type: 'string', convert: function (value, record) {
                    var attributeValues = record.get('attributeValues');
                    var result = '';
                    if (!Ext.isEmpty(attributeValues)) {
                        Ext.Array.each(attributeValues, function (item) {
                            if (item.value.clazz == 'com.qpp.cgp.value.ConstantValue') {
                                result += item.attributeId + ':' + item.value.value + ',';
                            } else if (item.value.clazz == 'com.qpp.cgp.domain.product.value.ProductAttributeValueEx') {
                                result += item.attributeId + ':' + '{' + 'attributeId：' + item.value.attributeId + '}' + ',';
                            }
                        });
                        return result;
                    } else {
                        return '';
                    }
                }}
            ],
            pageSize: 25,
            autoLoad: false,
            proxy: {
                type: "pagingmemory",
                reader: {
                    type: "json"
                }
            }
        });
        var items = {
            viewConfig: {
                enableTextSelection: true
            },
            height: 500,
            renderTo: me.itemsID,
            autoScroll: true,
            width: 700,
            listeners: {
                afterrender: function (comp) {
                    comp.el.on("keydown", function (event, target) {
                        if (event.button == 12) {
                            var searchButton = comp.down('toolbar').getComponent("search");
                            searchButton.handler(searchButton);
                        }
                    });
                }

            },
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: simpsonsStore, // same store GridPanel is using
                    pageSize: 25,
                    dock: 'bottom',
                    displayInfo: true
                }
            ],
            store: simpsonsStore,
            columns: [
                {
                    xtype: 'actioncolumn',
                    tdCls: 'vertical-middle',
                    itemId: 'actioncolumn',
                    width: 60,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                var editOrNew = 'edit';
                                mainController.editMultiDiscreteValueConstraintItem(me.skuAttributeStore, me.skuAttributeIds, store, record, editOrNew, me.itemData, me.configurableId);
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                store.removeAt(rowIndex);
                            }
                        }

                    ]
                },
                {
                    text: i18n.getKey('condition'),
                    dataIndex: 'conditions',
                    tdCls: 'vertical-middle',
                    xtype: 'arraycolumn',
                    flex: 1,
                    lineNumber: 1,
                    renderer: function (value, metadata, record) {
                        /*var returnstr = mainController.renderCondition(value, record.get('_id'));
                         var tipValue = '';
                         var recordCount = 0;
                         if (value) {
                         for (var i in value) {
                         recordCount++;
                         if (recordCount > 2)
                         break;
                         tipValue += i + " : " + value[i] + '<br>';
                         }
                         }
                         metadata.tdAttr = 'data-qtip="' + tipValue + '"';//显示的文本*/
                        return 'expression：' + value.expression;
                    }

                },
                {
                    text: i18n.getKey('attributeValues'),
                    dataIndex: 'attributeValues',
                    tdCls: 'vertical-middle',
                    xtype: 'arraycolumn',
                    flex: 2,
                    lineNumber: 3,
                    renderer: function (v) {
                        var value = v.value;
                        var valueStr = '';
                        if (value.clazz == 'com.qpp.cgp.value.ConstantValue') {
                            valueStr += value.value;
                        } else if (value.clazz == 'com.qpp.cgp.domain.product.value.ProductAttributeValueEx') {
                            valueStr += '{' + 'attributeId: ' + value.attributeId + '}'
                        } else if (value.clazz == 'com.qpp.cgp.value.JsonPathValue') {
                            valueStr += '{' + 'path: ' + value.path + '}';
                        } else if (value.clazz == 'com.qpp.cgp.value.UserAssignValue') {
                            valueStr += '{' + 'type: ' + 'UserAssignValue' + '}';
                        } else if (value.clazz == 'com.qpp.cgp.value.ExpressionValueEx') {
                            valueStr += '{' + 'type: ' + 'ExpressionValueEx' + '}';
                        }
                        return '[' + v.attributeId + '：' + valueStr + ']';
                    }

                }
            ],
            tbar: [
                {
                    text: i18n.getKey('create'),
                    iconCls: 'icon_create',
                    handler: function () {
                        var store = this.ownerCt.ownerCt.getStore();
                        var record = null;
                        var editOrNew = 'new';
                        mainController.editMultiDiscreteValueConstraintItem(me.skuAttributeStore, me.skuAttributeIds, store, record, editOrNew, me.itemData, me.configurableId);
                    }
                },
                {
                    text: i18n.getKey('batch') + i18n.getKey('create'),
                    iconCls: 'icon_batch',
                    handler: function () {
                        var store = this.ownerCt.ownerCt.getStore();
                        Ext.create('CGP.product.view.productattributeconstraint.view.BatchCreate', {
                            skuAttributeStore: me.skuAttributeStore,
                            skuAttributeIds: me.skuAttributeIds,
                            configurableId: me.configurableId,
                            store: store,
                            attributeArray: me.attributeArray,
                            itemData: me.itemData
                        })
                    }
                },
                '->',
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('query'),
                    labelWidth: 50,
                    itemId: 'query'
                },
                {
                    text: i18n.getKey('search'),
                    itemId: 'search',
                    handler: function () {
                        var toolbar = this.ownerCt;
                        /*me.el.on("keydown", function (event, target) {
                         if (event.button == 12) {
                         var searchButton = me.getComponent("fieldContainer").getComponent("searchButton");
                         searchButton.handler();
                         }
                         });*/
                        var gridStore = toolbar.ownerCt.getStore();
                        var value = toolbar.getComponent('query').getValue();
                        //gridStore.filter('query', value);
                        gridStore.clearFilter();
                        gridStore.filter([
                            {
                                filterFn: function (item) {
                                    return item.get('query').indexOf(value) >= 0;
                                }
                            }
                        ]);
                    }
                },
                {
                    text: i18n.getKey('clear'),
                    handler: function () {
                        var toolbar = this.ownerCt;
                        var gridStore = toolbar.ownerCt.getStore();
                        toolbar.getComponent('query').reset();
                        gridStore.clearFilter();
                    }
                }
            ]

        };
        me.items = [
            {
                fieldLabel: i18n.getKey('constraintRelatedAttributes'),
                xtype: 'multicombobox',
                editable: false,
                //isHidden: true,
                readOnly: true,
                width: 450,
                fieldStyle: 'background-color:silver',
                value: Ext.isEmpty(me.skuAttributeIds) ? [] : me.skuAttributeIds,
                name: 'skuAttributeIds',
                valueField: 'id',
                store: me.skuAttributeStore,
                displayField: 'displayName',
                itemId: 'skuAttribute'
            },
            {
                name: 'isEnable',
                xtype: 'checkbox',
                //hidden: true,
                checked: true,
                fieldLabel: i18n.getKey('enable'),
                itemId: 'isEnable'
            },
            {
                name: 'isInclude',
                xtype: 'checkbox',
                checked: true,
                hidden: true,
                fieldLabel: i18n.getKey('include'),
                itemId: 'isInclude'
            },
            {
                name: 'description',
                width: 450,
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            },
            {
                xtype: 'gridfield',
                name: 'items',
                itemId: 'items',
                allowBlank: false,
                msgTarget: 'under',
                fieldLabel: i18n.getKey('items'),
                //labelAlign: 'top',
                width: 600,
                height: 230,
                gridConfig: items
            }
        ];
        me.listeners = {
            afterrender: function () {
                me.setDisabled(me.saveDisabled);
            }
        };
        me.callParent(arguments);
    },
    addItem: function (item, container) {
        var me = this;
        var length = container.items.items.length;
        container.insert(length - 1, item);
    },
    refreshData: function (data) {
        var me = this;
        me.skuAttributeIds = data.skuAttributeIds;
        me.attributeArray = [];
        me.itemData = data.items;
        Ext.Array.each(me.skuAttributeIds, function (skuAttributeId) {
            var record = me.skuAttributeStore.findRecord('id', skuAttributeId);
            me.attributeArray.push(record.data);
        });
        console.log(me.attributeArray);
        CGP.product.view.productattributeconstraint.view.FormToGrid.itemData = data.items;
        me._id = data._id;
        Ext.Array.each(me.items.items, function (item) {
            if (item.name == 'items') {
                item.getGrid().getStore().getProxy().data = data.items;
                item.getGrid().getStore().load();
            } else {
                item.setValue(data[item.name]);
            }
        });
    }
});
