/**
 *
 */
Ext.onReady(function () {


    var permissionController = Ext.create("CGP.role.controller.Permission");
    var roleStore = Ext.create("CGP.role.store.Role");

    var gridPage = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('role'),
        block: 'role',

        editPage: 'edit.html',

        gridCfg: {
            store: roleStore,
            frame: false,
            columns: [{
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
                text: i18n.getKey('description'),
                dataIndex: 'description',
                xtype: 'gridcolumn',
                itemId: 'description',
                sortable: false,
                width: '40%',
                flex: 1
            }]
        },
        filterCfg: {
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