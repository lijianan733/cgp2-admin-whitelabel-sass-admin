Ext.define('CGP.rttypes.view.information.attribute.SelectAttributeGrid', {
    extend: 'CGP.common.field.SearchGrid',
    width: 850,
    height: 600,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('selectAttribute');
        var store = Ext.create('CGP.rttypes.store.AllAttribute');
        var filterData = me.filterData;
        me.gridCfg = {
            editAction: false,
            deleteAction: false,
            id: 'selectAttribute',
            selType: 'checkboxmodel',
            store: store,
            tbar: [{
                xtype: 'button',
                text: i18n.getKey('addAttribute'),
                iconCls: 'icon_create',
                handler: function () {
                    JSOpen({
                        id: 'rtattribute' + '_edit',
                        url: path + "partials/rtattribute/edit.html",
                        title: i18n.getKey('create') + '_' + i18n.getKey('rtattribute'),
                        refresh: true
                    });
                }
            }],
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    tdCls: 'vertical-middle',
                    sortable: true
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    tdCls: 'vertical-middle',
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    sortable: false
                },
                {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    itemId: 'code',
                    tdCls: 'vertical-middle',
                    sortable: false
                },
                {
                    dataIndex: 'validationExp',
                    text: i18n.getKey('validationExp'),
                    tdCls: 'vertical-middle',
                    itemId: 'validationExp'
                },
                {
                    dataIndex: 'valueType',
                    text: i18n.getKey('valueType'),
                    tdCls: 'vertical-middle',
                    itemId: 'valueType'
                },
                {
                    dataIndex: 'valueDefault',
                    text: i18n.getKey('valueDefault'),
                    tdCls: 'vertical-middle',
                    itemId: 'valueDefault'
                },
                {
                    dataIndex: 'selectType',
                    text: i18n.getKey('selectType'),
                    tdCls: 'vertical-middle',
                    itemId: 'selectType'
                },
                {
                    dataIndex: 'arrayType',
                    text: i18n.getKey('selectType'),
                    tdCls: 'vertical-middle',
                    itemId: 'arrayType'
                },
                {
                    dataIndex: 'customTypeId',
                    text: i18n.getKey('customTypeId'),
                    tdCls: 'vertical-middle',
                    itemId: 'customTypeId'
                },
                {
                    dataIndex: 'description',
                    text: i18n.getKey('description'),
                    tdCls: 'vertical-middle',
                    itemId: 'description'
                },
                {
                    text: i18n.getKey('options'),
                    dataIndex: 'options',
                    width: 370,
                    xtype: 'arraycolumn',
                    tdCls: 'vertical-middle',
                    itemId: 'options',
                    sortable: false,
                    lineNumber: 2,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        metadata.style = "font-weight:bold";
                        return value['name'];
                    }
                }
            ]
        };
        me.filterCfg = {
            height: 120,
            header: false,
            defaults: {
                isLike: false
            },
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'codeSearchField',
                    name: 'code',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code'
                },
                {
                    id: 'nameSearchField',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    id: 'valueTypeSearchField',
                    name: 'valueType',
                    xtype: 'combo',
                    store: Ext.create('CGP.rtattribute.store.ValueType'),
                    displayField: 'code',
                    valueField: 'code',
                    fieldLabel: i18n.getKey('valueType'),
                    itemId: 'valueType'
                },
                {
                    id: 'selectTypeSearchField',
                    name: 'selectType',
                    xtype: 'combo',
                    displayField: 'name',
                    valueField: 'value',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: '输入型', value: 'NON'},
                            {name: '单选型', value: 'SINGLE'},
                            {name: '多选型', value: 'MULTI'}
                        ]
                    }),
                    fieldLabel: i18n.getKey('selectType'),
                    itemId: 'selectType'
                },
                {
                    id: 'arrayTypeSearchField',
                    name: 'arrayType',
                    xtype: 'combo',
                    editable: false,
                    store: Ext.create('CGP.rtattribute.store.ArrayType'),
                    displayField: 'code',
                    valueField: 'code',
                    fieldLabel: i18n.getKey('arrayType'),
                    itemId: 'arrayType'
                },
                {
                    xtype: 'textfield',
                    name: 'excludeIds',
                    hidden: true,
                    isArray: true,
                    value: function () {
                        if (Ext.isEmpty(filterData)) {
                            return;
                        } else {
                            var value = [];
                            for (var i = 0; i < filterData.length; i++) {
                                value.push(filterData[i].get('_id'));
                            }
                            return '[' + value.toString() + ']';
                        }
                    }()
                }
            ]
        };
        me.callParent(arguments);
    }
});
