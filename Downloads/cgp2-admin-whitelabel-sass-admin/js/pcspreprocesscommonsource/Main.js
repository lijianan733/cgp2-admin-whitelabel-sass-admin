Ext.onReady(function () {
    var controller = Ext.create('CGP.pcspreprocesscommonsource.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('pcspreprocesscommonsource'),
        block: 'pcspreprocesscommonsource',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                xtype: 'button',
                text: i18n.getKey('New'),
                iconCls: 'icon_create',
                width:80,
                menu: {
                    items: [{
                        text: 'GridSourceConfig',
                        itemId:'GridSourceConfig',
                        handler: function (btn) {
                            controller.editSourceSkip(null,btn.itemId);
                        }
                    }, {
                        text: 'FlowGridSourceConfig',
                        itemId: 'FlowGridSourceConfig',
                        handler: function (btn) {
                            controller.editSourceSkip(null,btn.itemId);
                        }
                    }, {
                        text: 'SvgFileSourceConfig',
                        itemId: 'SvgFileSourceConfig',
                        handler: function (btn) {
                            controller.editSourceSkip(null,btn.itemId);
                        }
                    }, {
                        text: 'CgpDynamicSizeSourceConfig',
                        itemId:'CgpDynamicSizeSourceConfig',
                        handler: function (btn) {
                            controller.editSourceSkip(null,btn.itemId);
                        }
                    }]
                },
                handler: function () {}
            }
        },
        gridCfg: {
            store: Ext.create('CGP.pcspreprocesscommonsource.store.SourceStore'),
            frame: false,
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
                }, {
                    text: i18n.getKey('type'),
                    dataIndex: 'clazz',
                    width: 250,
                    sortable: false,
                    renderer: function (value) {
                        var type = value.split('.').pop();
                        return type;
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 450,
                    sortable: false
                }
            ],
            //gird上的編輯按鈕函數
            editActionHandler: function (grid, rowIndex, colIndex) {
                var me = this;
                var id = grid.getStore().getAt(rowIndex).data._id;
                var clazz = grid.getStore().getAt(rowIndex).data.clazz;
                var  type = clazz.slice(clazz.lastIndexOf('.')+1);
                controller.editSourceSkip(id,type);
            }
        },
        // 搜索框
        filterCfg: {
            height: 150,
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
                    name: 'clazz',
                    itemId: 'clazz',
                    xtype: 'combo',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [{
                            name: 'GridSourceConfig',
                            value: 'com.qpp.cgp.domain.pcspreprocess.source.GridSourceConfig'
                        }, {
                            name: 'FlowGridSourceConfig',
                            value: 'com.qpp.cgp.domain.pcspreprocess.source.FlowGridSourceConfig'
                        }, {
                            name: 'SvgFileSourceConfig',
                            value: 'com.qpp.cgp.domain.pcspreprocess.source.SvgFileSourceConfig'
                        }, {
                            name: 'CgpDynamicSizeSourceConfig',
                            value: 'com.qpp.cgp.domain.pcspreprocess.source.CgpDynamicSizeSourceConfig'
                        }]
                    }),
                    fieldLabel: i18n.getKey('type')
                }
            ]
        }
    })

})
