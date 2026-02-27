Ext.define('CGP.dssheettemplateconfig.view.impplaceholders', {
    extend: 'Ext.ux.form.GridField',
    requires: [
        'Ext.selection.CellModel'],
    name: 'impressionPlaceholders',
    fieldLabel: i18n.getKey('impplaceholders'),
    itemId: 'impplaceholders',
    initComponent: function () {
        var me = this;

        me.gridConfig = {
            renderTo:"impplaceholdersGrid",
            plugins: [
                new Ext.grid.plugin.CellEditing({
                    clicksToEdit: 2
                })
            ],
            store: Ext.create("CGP.dssheettemplateconfig.store.ImpPlaceholder"),
            height: 200,
            width: 900,
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
                    header: 'id',
                    dataIndex: 'id',
                    width: 80,
                    editor: {
                        allowBlank: false
                    }
                },
                {
                    header: 'index',
                    dataIndex: 'index',
                    width: 80,
                    editor: {
                        allowBlank: false
                    }
                },
                {
                    header: i18n.getKey('contentType'),
                    dataIndex: 'contentType',
                    width: 180,
                    sortable:false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    },
                    editor: {

                    }
                },
                {
                    header: i18n.getKey('contentSortOrder'),
                    dataIndex: 'contentSortOrder',
                    width: 80,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    },
                    editor: {

                    }
                },
                {
                    header: 'x',
                    dataIndex: 'x',
                    width: 80,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        if(value){
                            return value;
                        }
                        else{
                            return "";
                        }
                    },
                    editor: {

                    }
                },
                {
                    header: 'y',
                    dataIndex: 'y',
                    width: 80,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        if(value){
                            return value;
                        }
                        else{
                            return "";
                        }
                    },
                    editor: {

                    }
                },
                {
                    header: 'width',
                    dataIndex: 'width',
                    width: 80,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        if(value){
                            return value;
                        }
                        else{
                            return "";
                        }
                    },
                    editor: {

                    }
                },
                {
                    header: 'height',
                    dataIndex: 'height',
                    width: 80,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        if(value){
                            return value;
                        }
                        else{
                            return "";
                        }
                    },
                    editor: {

                    }
                },
                {
                    header: i18n.getKey('rotate'),
                    dataIndex: 'rotate',
                    width: 80,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        if(value){
                            return value;
                        }
                        else{
                            return "";
                        }
                    },
                    editor: {

                    }
                }
            ],
            tbar: [
                {
                    text: 'Add ImpPlaceholder',
                    handler: function (el) {
                        // Create a model instance
                        var rec = Ext.create('CGP.dssheettemplateconfig.model.ImpPlaceholder');
                        var tt = el;
                        var selectGrid = me.gridConfig;
                        selectGrid.store.insert(0, rec);
                        selectGrid.plugins[0].startEditByPosition({
                            row: 0,
                            column: 0
                        });
                    }
                }
            ]
        }
        me.callParent();
    }
})
