/**
 *
 */
Ext.onReady(function () {

    var store = Ext.create("CGP.rtattribute.store.Attribute");

    var gridPage = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('rtattribute'),
        block: 'rtattribute',

        editPage: 'edit.html',

        gridCfg: {
            store: store,
            frame: false,
            viewConfig: {
                enableTextSelection: true
            },
            columnDefaults: {
                tdCls: 'vertical-middle'
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: '_id',
                    sortable: true
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    itemId: 'name',
                    sortable: false
                },
                {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    itemId: 'code',
                    sortable: false
                },
                /*     {
                         dataIndex: 'required',
                         text: i18n.getKey('required'),
                         itemId: 'required'
                     },
                     {
                         dataIndex: 'validationExp',
                         text: i18n.getKey('validationExp'),
                         itemId: 'validationExp'
                     },*/
                {
                    dataIndex: 'valueType',
                    text: i18n.getKey('valueType'),
                    itemId: 'valueType'
                },
                {
                    dataIndex: 'valueDefault',
                    text: i18n.getKey('valueDefault'),
                    itemId: 'valueDefault'
                },
                {
                    dataIndex: 'selectType',
                    text: i18n.getKey('selectType'),
                    itemId: 'selectType'
                },
                {
                    dataIndex: 'arrayType',
                    text: i18n.getKey('arrayType'),
                    itemId: 'arrayType'
                },
                {
                    dataIndex: 'customTypeId',
                    text: i18n.getKey('customType'),
                    itemId: 'customTypeId'
                },
                {
                    dataIndex: 'description',
                    text: i18n.getKey('description'),
                    itemId: 'description'
                },
                {
                    text: i18n.getKey('options'),
                    dataIndex: 'options',
                    width: 370,
                    xtype: 'arraycolumn',
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
        },
        filterCfg: {
            minHeight: 100,
            defaults: {
                isLike: false
            },
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
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
                    editable: false,
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
                    store: Ext.create('CGP.rtattribute.store.ArrayType'),
                    displayField: 'code',
                    valueField: 'code',
                    fieldLabel: i18n.getKey('arrayType'),
                    itemId: 'arrayType'
                }
            ]
        }
    });
});
