Ext.define('CGP.dssheettemplateconfig.view.placeholders', {
    extend: 'Ext.ux.form.GridField',
    requires: [
        'Ext.selection.CellModel'],
    name: 'placeholders',
    fieldLabel: i18n.getKey('placeholders'),
    itemId: 'placeholders',

    initComponent: function () {
        var me = this;

        me.gridConfig = {
            renderTo:"placeholdersGrid",
            plugins: [
                new Ext.grid.plugin.CellEditing({
                    clicksToEdit: 2
                })
            ],
            store: Ext.create("CGP.dssheettemplateconfig.store.Placeholder"),
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
                    header: 'id',
                    dataIndex: 'id',
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
                        xtype: 'numberfield',
                        allowBlank: false
                    }
                },
                {
                    header: i18n.getKey('type'),
                    dataIndex: 'type',
                    width: 80,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    },
                    editor: {

                    }
                },
                {
                    header: i18n.getKey('selector'),
                    dataIndex: 'selector',
                    width: 150,
                    sortable:false,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    },
                    editor: {
                        allowBlank: true
                    }
                },
                {
                    header: i18n.getKey('attributes'),
                    dataIndex: 'attributes',
                    width: 100,
                    renderer: function (value, metadata, record) {
                        var viewValue=value.toString();
                        metadata.tdAttr = 'data-qtip="' + viewValue + '"';

                        return viewValue;
                    },
                    editor: {
                        allowBlank: false
                    }
                },
                {
                    header: i18n.getKey('expression'),
                    dataIndex: 'expression',
                    width: 300,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    },
                    editor: {

                    }
                },
                {
                    header: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 120,
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
                    text: 'Add Placeholder',
                    handler: function (el) {
                        // Create a model instance
                        var rec = Ext.create('CGP.dssheettemplateconfig.model.Placeholder');
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
