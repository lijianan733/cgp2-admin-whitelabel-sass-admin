Ext.define('CGP.resource.view.font.LanguageGridField', {
    extend: 'Ext.ux.form.GridField',
    alias: 'widget.languagefield',
    width: "100%",
    border: false,
    initComponent: function () {
        var me = this;
        me.gridConfig = {
            renderTo: JSGetUUID(),
            store: Ext.create("CGP.font.store.Language"),
            minHeight: 200,
            width: 600,
            columns: [
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    width: 60,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
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
                    text: i18n.getKey('id'),
                    sortable: true,
                    dataIndex: 'id',
                    width: 80,
                    renderer: function (value) {
                        if (value < 0) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                },
                {
                    text: i18n.getKey('name'),
                    sortable: false,
                    dataIndex: 'name',
                    flex: 1,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('locale'),
                    dataIndex: 'locale',
                    xtype: 'gridcolumn',
                    itemId: 'locale',
                    sortable: true,
                    renderer: function (v) {
                        if (v) {
                            return v.name + '(' + v.code + ')';
                        }
                    }
                }, {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    xtype: 'gridcolumn',
                    itemId: 'code',
                    sortable: true,
                    renderer: function (v) {
                        return v.code;
                    }
                }
            ],
            tbar: [
                {
                    text: i18n.getKey('add'),
                    itemId: 'add',
                    iconCls: 'icon_create',
                    // handler: function () {
                    //
                    // }
                }
            ]
        };
        me.callParent(arguments);
    },
    diySetValue: function (data) {
        var me = this;
        me.setSubmitValue(data);
    },
    diyGetValue: function () {
        var me = this;
        var data = me.getSubmitValue();
        if (Ext.isArray(data)) {
            data = data.map(function (item) {
                item['id'] = item['_id'];
                delete item['_id'];
                return item;
            });
        }
        return data;
    }
})