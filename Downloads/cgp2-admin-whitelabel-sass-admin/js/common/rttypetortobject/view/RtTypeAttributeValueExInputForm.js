/**
 * Created by nan on 2020/7/1.
 * 设置指定rtType的attribute的值的组件，
 * attribute的值为valueEx
 */
Ext.define("CGP.common.rttypetortobject.view.RtTypeAttributeValueExInputForm", {
    extend: 'Ext.tree.Panel',
    alias: 'widget.rttypeattributevalueexinputform',
    rootVisible: false,
    rtTypeRootNode: {
        _id: 'root',
        name: null,
        id: 'root'
    },
    viewConfig: {
        stripeRows: true,
    },
    rtTypeId: null,
    useArrows: true,
    autoScroll: true,
    rtTypeTreeStore: null,
    hideRtType: false,
    fieldLabel: null,
    entrys: null,
    readOnly: false,
    getName: function () {
        var me = this;
        return me.name;
    },
    getFieldLabel: function () {
        var me = this;
        return me.fieldLabel;
    },
    getErrors: function () {
        return '所有属性值不能为空'
    },
    listeners: {
        beforeload: function (sto, operation, e) {
            var type = operation.node.get('valueType');
            var rtTypeId;
            var customType = operation.node.get('customType');
            if (customType) {
                rtTypeId = customType['_id'];
            }
            if (type == 'CustomType') {
                sto.proxy.url = composingPath + 'api/pageConfigs/rtTypes/' + rtTypeId + '/rtAttributeDefs';
            }
        },
        load: function (store, node, records) {
            Ext.Array.each(records, function (item) {
                item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/category.png');
                if (!node.isRoot()) {//不为根节点
                    item.set('path', node.get('path') + ',' + item.get('name'))
                } else {
                    item.set('path', item.get('name'));
                    node.set('path', '');
                }
            });

        }
    },
    isValid: function () {
        var treePanel = this;
        var isValid = true;
        var valueExFields = treePanel.query('[xtype=valueexfield]');
        var result = [];
        for (var i = 0; i < valueExFields.length; i++) {
            if (valueExFields[i].isValid() == false) {
                isValid = false;
            }
        }
        return isValid;
    },
    getValue: function () {
        var treePanel = this;
        var valueExFields = treePanel.query('[xtype=valueexfield]');
        var result = [];
        for (var i = 0; i < valueExFields.length; i++) {
            valueExFields[i].isValid();
        }
        for (var i = 0; i < valueExFields.length; i++) {
            result.push({
                path: valueExFields[i].name,
                value: valueExFields[i].getValue()
            })
        }
        console.log(result);
        return result;
    },
    setValue: function (rtTypeId, entrys) {
        var me = this;
        var tbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var rtTypeTreeCombo = tbar.getComponent('rtType');
        me.entrys = entrys;
        rtTypeTreeCombo.setInitialValue([rtTypeId]);
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.store.RtAttributeTreeStore', {
            root: {
                _id: "root"
            }
        });
        me.rtTypeTreeStore = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.store.RtTypeTreeStore', {
            root: me.rtTypeRootNode
        });
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                flex: 4,
                dataIndex: 'name',
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                }
            },
            {
                text: i18n.getKey('value'),
                xtype: 'componentcolumn',
                flex: 7,
                dataIndex: 'value',
                tdCls: 'vertical-middle',
                sortable: false,
                hidden: me.hiddenValue,
                listeners: {},
                renderer: function (value, metadata, record, a, b, c, view) {
                    var valueType = record.get('valueType');
                    var selectType = record.get('selectType');
                    var options = record.get('options');
                    var comp;
                    var path = record.get('path');
                    if (Ext.Array.contains(['Number', 'int'], valueType)) {
                        valueType = 'Number';
                    }
                    if (Ext.Array.contains(['Date'], valueType)) {
                        valueType = 'String';
                    }
                    value = null;
                    if (me.entrys) {
                        for (var j = 0; j < me.entrys.length; j++) {
                            if (path == me.entrys[j].path) {
                                value = me.entrys[j].value;
                                break;
                            }
                        }
                    }
                    if (valueType != 'CustomType') {
                        switch (selectType) {
                            case 'NON':
                                comp = {
                                    allowBlank: false,
                                    name: path,
                                    xtype: 'valueexfield',
                                    commonPartFieldConfig: {
                                        defaultValueConfig: {
                                            type: valueType,
                                            typeSetReadOnly: true,
                                            clazzSetReadOnly: false
                                        }
                                    }
                                };
                                break;
                            case 'SINGLE':
                                comp = {
                                    xtype: 'valueexfield',
                                    name: path,
                                    autoFitErrors: true,
                                    combineErrors: true,
                                    commonPartFieldConfig: {
                                        defaultValueConfig: {
                                            type: 'String',
                                            typeSetReadOnly: true,
                                            clazzSetReadOnly: false
                                        }
                                    },
                                    diyValueExInputConfig: {
                                        xtype: 'combo',
                                        displayField: 'name',
                                        multiSelect: false,
                                        editable: false,
                                        valueField: 'value',
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['name', 'value'],
                                            data: options
                                        })
                                    }
                                }
                                break;
                            case 'MULTI':
                                comp = {
                                    xtype: 'valueexfield',
                                    name: path,
                                    autoFitErrors: true,
                                    combineErrors: true,
                                    commonPartFieldConfig: {
                                        defaultValueConfig: {
                                            type: 'Array',
                                            typeSetReadOnly: true,
                                            clazzSetReadOnly: false
                                        }
                                    },
                                    diyValueExInputConfig: {
                                        xtype: 'multicombobox',
                                        displayField: 'name',
                                        multiSelect: true,
                                        editable: false,
                                        valueField: 'value',
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['name', 'value'],
                                            data: options
                                        }),
                                        diySetValue: function (data) {
                                            var me = this;
                                            var data = data.toString();
                                            data = data.replace(/\[|\]/g, '');
                                            me.setValue(data.split(','));
                                        },
                                        diyGetValue: function () {
                                            var me = this;
                                            return '[' + me.getSubmitValue() + ']';
                                        }
                                    }
                                }
                                break;
                        }
                    }
                    if (value) {
                        comp.readOnly = me.readOnly;
                        comp.value = value;
                    }
                    return comp;
                }

            }
        ];
        me.tbar = {
            hidden: me.hideRtType,
            items: [
                {
                    name: 'rtType',
                    xtype: 'uxtreecombohaspaging',
                    fieldLabel: i18n.getKey('rtType'),
                    itemId: 'rtType',
                    displayField: 'name',
                    valueField: '_id',
                    haveReset: true,
                    editable: false,
                    rootVisible: false,
                    readOnly: false,
                    width: 350,
                    multiselect: false,
                    store: me.rtTypeTreeStore,
                    infoUrl: composingPath + 'api/pageConfigs/rtTypes/{id}',
                    defaultColumnConfig: {
                        renderer: function (value, metadata, record) {
                            return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                        }
                    },
                    showSelectColumns: [
                        {
                            dataIndex: '_id',
                            flex: 1,
                            text: i18n.getKey('id')
                        },
                        {
                            dataIndex: 'name',
                            text: i18n.getKey('name'),
                            flex: 2
                        }
                    ],
                    listeners: {
                        change: function (comp, newValue, oldValue) {
                            me.getRootNode().removeAll();
                            if (!Ext.isEmpty(newValue)) {
                                me.getStore().proxy.url = composingPath + 'api/pageConfigs/rtTypes/' + newValue + '/rtAttributeDefs';
                            } else {
                                me.getStore().proxy.url = composingPath + 'api/pageConfigs/rtTypes/root/rtAttributeDefs';
                            }
                            me.getStore().load({
                                callback: function (records) {
                                    me.expandAll();
                                }
                            });

                        },
                        afterrender: function (comp) {
                            comp.tree.expandAll();
                            if (me.rtTypeId) {
                                comp.setInitialValue([me.rtTypeId]);
                            }
                        }
                    }
                }

            ]
        };
        me.callParent();
    }
})
