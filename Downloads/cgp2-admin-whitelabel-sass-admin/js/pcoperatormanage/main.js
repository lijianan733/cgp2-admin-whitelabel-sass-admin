Ext.onReady(function () {
    var controller = Ext.create('CGP.pcoperatormanage.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('pcoperatormanage'),
        block: 'pcoperatormanage',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function () {
                    controller.editOperator('create', null)
                }
            }
        },
        gridCfg: {
            store: Ext.create('CGP.pcoperatormanage.store.TargetOpStore'),
            frame: false,
            editActionHandler: function (grid, rowIndex, colIndex){
                var record = page.grid.getStore().getAt(rowIndex);
                controller.editOperator('edit', record)
            },
            viewConfig: {
                enableTextSelection: true
            },
            columnDefaults: {
                tdCls: 'vertical-middle'
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id'
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 450,
                    sortable: false
                }
            ]
        },
        // 搜索框
        filterCfg: {
            height: 100,
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: 'description',
                    xtype: 'textfield',
                    itemId: 'description',
                    fieldLabel: i18n.getKey('description')
                },
                {
                    name: 'sourceType',
                    itemId: 'sourceType',
                    xtype: 'textfield',
                    hidden: true,
                    value: 'Target',
                    fieldLabel: i18n.getKey('sourceType')
                }
            ]
        }


    })

})
