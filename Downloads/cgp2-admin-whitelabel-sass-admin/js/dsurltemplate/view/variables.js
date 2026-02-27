Ext.define('CGP.dsurltemplate.view.variables', {
    extend: 'Ext.ux.form.GridField',
    requires: [
        'Ext.selection.CellModel'],
    name: 'variables',
    fieldLabel: i18n.getKey('variables'),
    itemId: 'variables',
    initComponent: function () {
        var me = this;

        me.gridConfig = {
            plugins: [
                new Ext.grid.plugin.CellEditing({
                    clicksToEdit: 2
                })
            ],
            store: Ext.create("CGP.dsurltemplate.store.Variable"),
            height: 300,
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
                    header: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 95,
                    editor: {
                        allowBlank: false
                    }
                },
                {
                    header: i18n.getKey('value'),
                    dataIndex: 'value',
                    width: 120,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    },
                    editor: {

                    }
                },
                {
                    header: i18n.getKey('valueSelector'),
                    dataIndex: 'valueSelector',
                    width: 300,
                    sortable:false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    },
                    editor: {

                    }
                },
                {
                    header: i18n.getKey('expression'),
                    dataIndex: 'expression',
                    width: 300,
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    },
                    editor: {

                    }
                }
            ],
            tbar: [
                {
                    text: 'Add Variable',
                    handler: function (el) {
                        // Create a model instance
                        var rec = Ext.create('CGP.dsurltemplate.model.Variable');
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
