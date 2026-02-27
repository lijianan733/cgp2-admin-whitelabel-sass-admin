Ext.onReady(function () {
    // 用于下面的资源

    // 初始化资源

    var productId = parseInt(JSGetQueryString('productId'));
    var controller = Ext.create('CGP.product.view.productattributeprofile.controller.Controller');
    var recordCount = 0;
    var ProfileStore = Ext.create('CGP.product.view.productattributeprofile.store.ProfileStore', {
        sorters: [{
            property: 'sort',
            direction: 'ASC'
        }],
        listeners: {
            load: function (store, record) {
                recordCount = store.getTotalCount();
            }
        }
    });
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('productAttributeProfile'),
        block: 'productattributeprofile',
        editPage: 'edit.html',
        tbarCfg: {
            disabledButtons: ['delete'],
            btnCreate: {
                xtype: 'splitbutton',
                width: 90,
                handler: function () {
                    controller.editProductAttributeProfile(productId, page, 'create', null, recordCount);
                },
                menu: [
                    {
                        text: i18n.getKey('create') + i18n.getKey('default') + i18n.getKey('profile'),
                        handler: function () {
                            controller.createDefaultProfile(productId, page, recordCount);
                        }
                    }
                ]
            }
        },
        gridCfg: {
            store: ProfileStore,
            frame: false,
            editActionHandler: function (gridview, recordIndex, cellIndex, fun, button, record) {
                var id = record.getId();
                controller.editProductAttributeProfile(productId, page, 'edit', id);
            },
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    width: 360,
                    itemId: 'name',
                    sortable: false
                },
                {
                    text: i18n.getKey('sorter'),
                    dataIndex: 'sort',
                    xtype: 'gridcolumn',
                    width: 160,
                    itemId: 'sort'
                },
                {
                    text: i18n.getKey('group'),
                    dataIndex: 'groups',
                    width: 160,
                    xtype: 'arraycolumn',
                    itemId: 'groups',
                    maxLineCount: 3,
                    sortable: false,
                    renderer: function (value) {
                        return value.name;
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    hideTrigger: true,
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'nameSearchField',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                }, {
                    name: "productId",
                    xtype: "numberfield",
                    hidden: true,
                    value: productId,
                    itemId: 'productId'
                }
            ]
        },
        listeners: {
            afterrender: function () {
                var page = this;
                var productId = parseInt(JSGetQueryString('productId'));
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
            }
        }
    });
});
