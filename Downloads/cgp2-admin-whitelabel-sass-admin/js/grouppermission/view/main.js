Ext.Loader.setPath({
    enabled: true,
    "CGP.grouppermission": path + "js/grouppermission"
});
/**
 *
 */
Ext.onReady(function () {


    var permissionController = Ext.create("CGP.grouppermission.controller.Permission");
    var mainController = Ext.create("CGP.grouppermission.controller.Main");

    var gridPage = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('grouppermission'),
        block: 'grouppermission',
        editPage: 'edit.html',
        gridCfg: {
            store: Ext.create("CGP.grouppermission.store.PermissionGroup"),
            frame: false,
            deleteAction: false,
            columns: [{
                xtype: 'actioncolumn',
                itemId: 'deleteaction',
                sortable: false,
                resizable: false,
                width: 40,
                menuDisabled: true,
                tdCls: 'vertical-middle',
                items: [{
                    iconCls: 'icon_remove icon_margin',
                    itemId: 'actiondelete',
                    tooltip: i18n.getKey('destroy'),
                    handler: function (view, rowIndex, colIndex, item, e, record) {
                        mainController.deleteRecord(view, record);
                    }
                }]
            }, {
                text: i18n.getKey('operator'),
                sortable: false,
                itemId: 'operator',
                width: 125,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    return {
                        xtype: 'displayfield',
                        value: "<font color='blue'>" + i18n.getKey('setPermission') + "</font>",
                        listeners: {
                            render: function (display) {
                                display.getEl().on("click", function () {
                                    permissionController.openPermissionWindow(record);
                                });
                            }
                        }
                    }
                }
            }, {
                text: i18n.getKey('id'),
                dataIndex: 'id',
                xtype: 'gridcolumn',
                itemId: 'id',
                sortable: true,
                width: '10%'
            }, {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                xtype: 'gridcolumn',
                itemId: 'name',
                sortable: false,
                width: '20%'
            }, {
                text: i18n.getKey('title'),
                dataIndex: 'title',
                xtype: 'gridcolumn',
                itemId: 'title',
                sortable: false,
                width: '40%',
                flex: 1
            }]
        },
        filterCfg: {
            minHeight: 100,
            items: [{
                id: 'idSearchField',
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }]
        }
    });
});