/**
 * Created by admin on 2019/4/26.
 */
Ext.define('CGP.dsdatasource.view.selectors', {
    extend: 'Ext.ux.form.GridField',
    requires: [
        'Ext.selection.CellModel'],
    name: 'selectors',
    fieldLabel: i18n.getKey('selectors'),
    itemId: 'selectors',
    initComponent: function () {
        var me = this;

        me.gridConfig = {
            plugins: [
                new Ext.grid.plugin.CellEditing({
                    clicksToEdit: 2
                })
            ],
            store: Ext.create("CGP.dsdatasource.store.Selector"),
            height: 300,
            width: 900,
            columns: [
                {
                    header: i18n.getKey('key'),
                    dataIndex: 'key',
                    width: 70,
                    flex: 1,
                    editor: {
                        allowBlank: false
                    }
                },
                {
                    header: i18n.getKey('selector'),
                    dataIndex: 'selector',
                    width: 95,
                    editor: {
                        allowBlank: false
                    }
                },
                {
                    header: i18n.getKey('urlTemplateId'),
                    dataIndex: 'urlTemplateId',
                    width: 95,
                    align: 'right',
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
                        xtype: 'numberfield'
                    }
                },
                {
                    header: i18n.getKey('attr'),
                    dataIndex: 'attr',
                    width: 95,
                    editor: {

                    }
                },

                {
                    header: i18n.getKey('converter'),
                    dataIndex: 'converter',
                    width: 95,
                    editor: {

                    }
                },
                {
                    header: i18n.getKey('svgWidthOffset'),
                    dataIndex: 'svgWidthOffset',
                    width: 95,
                    editor: {

                    }
                },
                {
                    header: i18n.getKey('svgHeightOffset'),
                    dataIndex: 'svgHeightOffset',
                    width: 95,
                    editor: {

                    }
                },
                {
                    header: i18n.getKey('strokWidth'),
                    dataIndex: 'strokWidth',
                    width: 95,
                    editor: {

                    }
                },
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
                }
            ],
            tbar: [
                {
                    text: 'Add Selector',
                    handler: function (el) {
                        // Create a model instance
                        var rec = Ext.create('CGP.dsdatasource.model.Selector');
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