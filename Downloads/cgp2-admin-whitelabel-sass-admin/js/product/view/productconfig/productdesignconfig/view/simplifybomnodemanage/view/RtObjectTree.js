Ext.define("CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.view.RtObjectTree", {
    extend: "Ext.tree.Panel",
    minHeight: 150,
    maxHeight: 500,
    collapsible: true,
    config: {
        rootVisible: false,
        useArrows: true,
        viewConfig: {
            stripeRows: true,
            selectedItemCls: '',
            focusedItemCls: '',
            overItemCls: ''
        }
    },
    autoScroll: true,
    children: null,
    header: false,
    selModel: {
        selType: 'rowmodel',
        checkOnly: true
    },
    itemId: 'rtTypeObject',
    rootNode: 'root',//根节点的位置
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('descriptionAttr');
        me.store = Ext.create('CGP.material.store.RtAttributeTree', {
            root: {
                _id: "root"
            }
        });
        me.store.proxy.url = adminPath + 'api/rtTypes/rtAttributeDefs';
        me.store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                //console.log(node);
                if (node.isRoot()) {
                    if (item.get('valueType') == 'CustomType') {
                        me.valueJsonObject[item.get('name')] = {};
                    } else {
                        if (!Ext.isEmpty(me.objectJson)) {
                            if (!Ext.isEmpty(me.objectJson[item.get('name')])) {
                                me.valueJsonObject[item.get('name')] = me.objectJson[item.get('name')]
                            } else {
                                me.valueJsonObject[item.get('name')] = null
                            }
                        }
                    }
                } else {
                    var path = node.getPath('name');
                    var array = path.split('/');
                    var valuePath = '$';
                    Ext.Array.each(array, function (item) {
                        if (!Ext.isEmpty(item)) {
                            valuePath += '.' + item;
                        }
                    });
                    if (item.get('valueType') == 'CustomType') {
                        jsonPath(me.valueJsonObject, valuePath)[0][item.get('name')] = {};
                    } else {
                        if (jsonPath(me.objectJson, valuePath)) {
                            jsonPath(me.valueJsonObject, valuePath)[0][item.get('name')] = jsonPath(me.objectJson, valuePath)[0][item.get('name')]
                        } else {
                            jsonPath(me.valueJsonObject, valuePath)[0][item.get('name')] = null
                        }
                    }
                }
            });
        });
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                dataIndex: 'name',
                flex: 1

            },
            {
                text: i18n.getKey('value'),
                xtype: 'componentcolumn',
                flex: 2,
                dataIndex: 'value',
                sortable: false,
                renderer: function (value, metadata, record, a, b, c, view) {
                    var valueType = record.get('valueType');
                    var selectType = record.get('selectType');
                    var options = record.get('options');
                    var array = record.getPath('name').split('/');
                    var valuePath = '$';
                    Ext.Array.each(array, function (item) {
                        if (!Ext.isEmpty(item)) {
                            valuePath += '.' + item;
                        }
                    });
                    var comp;
                    switch (selectType) {
                        case 'NON':
                            if (Ext.Array.contains(['String', 'Date'], valueType)) {
                                comp = {
                                    xtype: 'textfield',
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }
                                        }
                                    }
                                }

                            } else if (Ext.Array.contains(['Number', 'int'], valueType)) {
                                comp = {
                                    xtype: 'numberfield',
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }
                                        }
                                    },
                                    allowBlank: false
                                }

                            } else if (valueType === 'Boolean') {
                                comp = {
                                    xtype: 'combo',
                                    displayField: 'name',
                                    valueField: 'value',
                                    editable: false,
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }

                                        }
                                    },
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value'],
                                        data: [
                                            {name: 'true', value: true},
                                            {name: 'false', value: false}
                                        ]
                                    }),
                                    queryMode: 'local'
                                }
                            }
                            break;
                        case 'SINGLE':
                            if (Ext.Array.contains(['String', 'Date', 'Number', 'int', 'Boolean'], valueType)) {
                                comp = {
                                    xtype: 'combo',
                                    displayField: 'name',
                                    editable: false,
                                    valueField: 'value',
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }
                                        }
                                    },
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value'],
                                        data: options
                                    }),
                                    queryMode: 'local'
                                }

                            }
                            break;
                        case 'MULTI':
                            if (Ext.Array.contains(['String', 'Date', 'Number', 'int', 'Boolean'], valueType)) {
                                comp = {
                                    xtype: 'combo',
                                    displayField: 'name',
                                    multiSelect: true,
                                    editable: false,
                                    valueField: 'value',
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var array = record.getPath('name').split('/');
                                            var value = me.valueJsonObject;
                                            for (var i = 0; i < array.length; i++) {
                                                if (!Ext.isEmpty(array[i])) {

                                                    if (i == array.length - 1) {
                                                        if (Ext.isEmpty(newValue)) {
                                                            value[array[i]] = null;
                                                        } else {
                                                            value[array[i]] = newValue;
                                                        }
                                                        //me.objectJson = me.valueJsonObject;
                                                    } else {
                                                        value = value[array[i]];
                                                        me.objectJson = me.valueJsonObject;
                                                    }
                                                }
                                            }
                                        },
                                        afterrender: function (comp) {
                                            if (me.objectJson) {
                                                comp.setValue(jsonPath(me.objectJson, valuePath)[0]);
                                            }
                                        }
                                    },
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['name', 'value'],
                                        data: options
                                    }),
                                    queryMode: 'local'
                                }

                            }
                            break;
                    }

                    return comp;
                }

            }
        ];
        me.listeners = {
            beforeload: function (sto, operation, e) {
                var type = operation.node.get('valueType');
                var rtTypeId;
                var customType = operation.node.get('customType');
                if (customType) {
                    rtTypeId = customType['_id'];
                }
                if (type == 'CustomType') {
                    sto.proxy.url = adminPath + 'api/rtTypes/' + rtTypeId + '/rtAttributeDefs';
                }
            }
        };
        me.callParent(arguments);

    },
    getValue: function () {
        var me = this;
        var rtTypeData = {};
        var rtObjectData = {
            "_id": me.data['_id'],
            "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
            "idReference": "RtObject",
            "rtType": {
                "_id": me.data.rtType['_id'],
                "idReference": "RtType",
                "clazz": "com.qpp.cgp.domain.bom.attribute.RtType"
            }
        };
        rtObjectData.objectJSON = me.valueJsonObject;
        rtTypeData.rtObject = rtObjectData;
        return rtTypeData.rtObject;
    },
    refreshData: function (data) {
        var me = this;
        me.data = data;
        me.valueJsonObject = {};
        me.objectJson = data.objectJSON;
        me.store.proxy.url = adminPath + 'api/rtTypes/' + me.data.rtType._id + '/rtAttributeDefs';
        me.store.load({
            callback: function (records) {
                me.expandAll();
            }
        })
    }
});
