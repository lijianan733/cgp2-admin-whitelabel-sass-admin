Ext.onReady(function () {


    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('machineModel'),
        block: 'printmachine',
        editPage: 'edit.html',
        //权限控制
        accessControl: true,
        gridCfg: {
            store: Ext.create('CGP.printmachine.store.PrintMachine'),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [{
                text: i18n.getKey('id'),
                dataIndex: '_id',
                xtype: 'gridcolumn',
                itemId: 'id',
                sortable: true
            }, {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                xtype: 'gridcolumn',
                itemId: 'name',
                width: 200,
                sortable: true
            }, {
                text: i18n.getKey('code'),
                dataIndex: 'code',
                xtype: 'gridcolumn',
                itemId: 'code',
                sortable: true,
                flex: 1
            }]
        },
        // 搜索框
        filterCfg: {
            items: [{
                id: 'idSearchField',
                name: '_id',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                name: 'code',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('code'),
                itemId: 'code'
            }]
        }

    });
});