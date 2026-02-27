
Ext.onReady(function () {
    var page = Ext.create('Ext.ux.ui.GridPage', {
    	i18nblock: i18n.getKey('attributesets'),
        block: 'attributesets',
        editPage: 'edit.html',
        //权限控制
        accessControl: true,
        gridCfg: {
            store: Ext.create("CGP.attributesets.store.Attributesets"),
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
                width:200,
                itemId: 'name',
                sortable: true
   			}, {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                xtype: 'gridcolumn',
                itemId: 'description',
                sortable: false,
                width: 200,
            }]},
        // 搜索框
        filterCfg: {
            items: [{
                id: 'idSearchField',
                name: 'id',
                xtype: 'numberfield',
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
                id: 'descriptionSearchField',
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
              }]}

    });
});