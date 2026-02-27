Ext.onReady(function () {


    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('country'),
        block: 'country',
        editPage: 'edit.html',
        //权限控制
        accessControl: true,
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [{
                text: i18n.getKey('id'),
                dataIndex: 'id',
                xtype: 'gridcolumn',
                itemId: 'id',
                sortable: true
            }, {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                xtype: 'gridcolumn',
                itemId: 'name',
                sortable: true
            }, {
                text: i18n.getKey('isoCode') + "(2)",
                dataIndex: 'isoCode2',
                xtype: 'gridcolumn',
                itemId: 'isoCode2',
                sortable: true
            }, {
                text: i18n.getKey('isoCode') + "(3)",
                dataIndex: 'isoCode3',
                xtype: 'gridcolumn',
                itemId: 'isoCode3',
                sortable: true,
                flex: 1
            }]
        },
        // 搜索框
        filterCfg: {
            items: [{
                id: 'idSearchField',
                name: 'id',
                xtype: 'numberfield',
                allowDecimals: false,
                hideTrigger: true,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                name: 'isoCode2',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('isoCode') + "(2)",
                itemId: 'isoCode2',
                diyGetValue: function () {
                    var me = this;
                    return me.getValue()?.toUpperCase();
                }
            }, {
                name: 'isoCode3',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('isoCode') + "(3)",
                itemId: 'isoCode3',
                diyGetValue: function () {
                    var me = this;
                    return me.getValue()?.toUpperCase();
                }
            }]
        }

    });
});