Ext.onReady(function () {
    var controller = Ext.create("CGP.font.controller.Controller");

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('font') + i18n.getKey('manage'),
        block: 'font',
        editPage: 'edit.html',
        gridCfg: {
            //store.js
            store: Ext.create("CGP.font.store.FontStore"),
            frame: false,
            columnDefaults: {
                tdCls: 'vertical-middle',
                autoSizeColumn: true
            },
            hiddenButtons: ['delete', 'read', 'clear', 'sepQuery'],
            deleteActionHandler: function (gridview, rowIndex, colIndex, view, event, record, dom) {
                Ext.MessageBox.confirm(i18n.getKey('confirm'), i18n.getKey('deleteConfirm'), function (btn) {
                    if (btn == 'yes') {
                        var removeId = record.getId();
                        controller.deleteRecords(removeId, page.grid);
                    }
                })
            },
            columns: [
                /*{
                    text: i18n.getKey('operator'),
                    width: 80,
                    xtype: "componentcolumn",
                    renderer: function (value, metadata, record) {
                        if (!Ext.Array.contains(notOptional, record.get('inputType'))) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>' + i18n.getKey('managerOptions') + '</a>',
                                listeners: {
                                    render: function (display) {
                                        display.getEl().on("click", function () {
                                            controller.openOptionWindow(record);
                                        });
                                    }
                                }
                            };
                        }
                    }
                },*/
                {
                    text: i18n.getKey('id'),
                    width: 90,
                    dataIndex: '_id',
                    itemId: 'id',
                    isLike: false,
                    sortable: true
                },
                {
                    text: i18n.getKey('fontFamily'),
                    dataIndex: 'fontFamily',
                    width: 250,
                    itemId: 'fontFamily'
                },
                {
                    text: i18n.getKey('displayName'),
                    dataIndex: 'displayName',
                    width: 165,
                    itemId: 'displayName'
                },
                {
                    text: i18n.getKey('wordRegExp'),
                    dataIndex: 'wordRegExp',
                    width: 120,
                    itemId: 'wordRegExp'
                }, {
                    text: i18n.getKey('字体支持样式'),
                    dataIndex: 'fontStyleKeys',
                    width: 150,
                    xtype: 'uxarraycolumnv2',
                    itemId: 'fontStyleKeys',
                    sortable: false,
                    maxLineCount: 5,
                    lineNumber: 3,
                    renderer: function (value, mate, record) {
                        return value;

                    }
                },
                {
                    text: i18n.getKey('language'),
                    dataIndex: 'languages',
                    itemId: 'language',
                    width: 150,
                    xtype: 'uxarraycolumnv2',
                    sortable: false,
                    maxLineCount: 5,
                    lineNumber: 3,
                    flex: 1,
                    renderer: function (value, mate, record) {
                        var result = value.name;
                        return result;
                    }
                }
            ]
        },
        filterCfg: {
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'nameSearchField',
                    name: 'fontFamily',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('fontFamily'),
                    itemId: 'fontFamily'
                },
                {
                    id: 'displaynameSearchField',
                    name: 'displayName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('displayName'),
                    itemId: 'displayName'
                }, {
                    name: 'languages',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('language'),
                    itemId: 'language',
                    editable: false,
                    haveReset: true,
                    isLike: false,
                    valueField: 'id',
                    displayField: 'name',
                    store: Ext.create('CGP.common.store.Language')
                }/*,
                {
                    name: 'valueType',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('valueType'),
                    itemId: 'valueType',
                    editable: false,
                    valueField: 'value',
                    displayField: 'name',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: 'Boolean', value: 'Boolean'},
                            {name: 'String', value: 'String'},
                            {name: 'Array', value: 'Array'},
                            {name: 'Date', value: 'Date'},
                            {name: 'Number', value: 'Number'}
                        ]
                    })
                },
                {
                    name: 'selectType',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('selectType'),
                    itemId: 'selectType',
                    valueField: 'value',
                    editable: false,
                    displayField: 'name',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: '输入型', value: 'NON'},
                            {name: '单选型', value: 'SINGLE'},
                            {name: '多选型', value: 'MULTI'}
                        ]
                    })
                }*/
            ]
        }
    });
});
