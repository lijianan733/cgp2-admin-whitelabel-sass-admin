/**
 * @Description:
 * @author nan
 * @date 2022/11/5
 */
Ext.Loader.syncRequire([
    'CGP.common.typesettingschedule.model.SheetLocal',
    'CGP.common.typesettingschedule.model.PlaceHolders',
    'CGP.common.typesettingschedule.view.FileColumn'
])
Ext.define('CGP.common.typesettingschedule.view.ImpressionFieldSet', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.impressionfieldset',
    layout: 'fit',
    collapsible: true,
    padding: '3px 10px 0px 10px',
    border: '1 0 0 0 ',
    extraButtons: {
        edit: {
            xtype: 'button',
            margin: '0 5 0 5',
            iconCls: 'icon_check',
            ui: 'default-toolbar-small',
            text: i18n.getKey('查看源JSON'),
            handler: function (btn) {
                var impressionFieldSet = btn.ownerCt.ownerCt;
                var data = impressionFieldSet.data;
                var title = '源JSON';
                JSShowJsonDataV2(data, title);
            }
        }
    },
    data: null,
    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            model: 'CGP.common.typesettingschedule.model.SheetLocal',
            proxy: 'pagingmemory',
            data: me.data.impressionSheets
        });
        me.items = [
            {
                xtype: 'grid',
                itemId: 'document',
                name: 'document',
                store: store,
                columns: {
                    defaults: {
                        menuDisabled: true,
                        sortable: false,
                    },
                    items: [
                        {
                            xtype: 'rownumberer',
                            tdCls: 'vertical-middle',
                            width: 45
                        },
                        {
                            text: i18n.getKey('sheetId'),
                            dataIndex: '_id',
                            width: 80,
                        },
                        {
                            text: i18n.getKey('sheet配置编号'),
                            dataIndex: 'templateId',
                            width: 110,
                        },
                        {
                            text: i18n.getKey('type'),
                            dataIndex: 'type',
                            width: 80,
                            sortable: true
                        },
                        {
                            text: i18n.getKey('quantity'),
                            dataIndex: 'quantity',
                            width: 100,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('sortOrder'),
                            dataIndex: 'sortOrder',
                            width: 120,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('placeholder'),
                            dataIndex: 'placeHolders',
                            width: 100,
                            xtype: 'atagcolumn',
                            getDisplayName: function () {
                                return '<a href="#">查看</a>'
                            },
                            clickHandler: function (value, metaData, record) {
                                var store = Ext.create('Ext.data.Store', {
                                        model: 'CGP.common.typesettingschedule.model.PlaceHolders',
                                        proxy: 'pagingmemory',
                                        data: value || []
                                    }
                                );
                                var win = Ext.create('Ext.window.Window', {
                                    modal: true,
                                    constrain: true,
                                    maximizable: true,
                                    title: '占位符列表',
                                    layout: 'fit',
                                    items: [
                                        {
                                            xtype: 'grid',
                                            width: 800,
                                            height: 350,
                                            store: store,
                                            columns: [
                                                {
                                                    xtype: 'rownumberer'
                                                },
                                                {
                                                    text: i18n.getKey('contentid'),
                                                    dataIndex: 'id',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'contentid',
                                                    renderer: function (value, metadata, record) {
                                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                                        return value;
                                                    }
                                                },
                                                {
                                                    text: i18n.getKey('sortOrder'),
                                                    dataIndex: 'sortOrder',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'sortOrder',
                                                    sortable: true
                                                },
                                                {
                                                    text: i18n.getKey('contentTypeId'),
                                                    dataIndex: 'contentTypeId',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'contentTypeId',
                                                    width: 80,
                                                    sortable: true
                                                },
                                                {
                                                    text: i18n.getKey('contentSortOrder'),
                                                    dataIndex: 'contentSortOrder',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'contentSortOrder',
                                                    width: 120,
                                                    renderer: function (value, metadata, record) {
                                                        return value;
                                                    }
                                                },
                                                {
                                                    text: i18n.getKey('isSignature'),
                                                    dataIndex: 'isSignature',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'isSignature',
                                                    width: 120,
                                                    renderer: function (value, metadata, record) {
                                                        return value;
                                                    }
                                                },
                                                {
                                                    text: i18n.getKey('composingElement'),
                                                    dataIndex: 'composingElement',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'composingElement',
                                                    width: 120,
                                                    renderer: function (value, metadata, record) {
                                                        var val = value ? value['_id'] : '';
                                                        return val;
                                                    }
                                                },
                                                {
                                                    text: i18n.getKey('positionInitialized'),
                                                    dataIndex: 'positionInitialized',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'positionInitialized',
                                                    width: 120,
                                                    renderer: function (value, metadata, record) {
                                                        return value;
                                                    }
                                                },
                                                {
                                                    text: i18n.getKey('x'),
                                                    dataIndex: 'x',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'x',
                                                    width: 120,
                                                    renderer: function (value, metadata, record) {
                                                        return value;
                                                    }
                                                },
                                                {
                                                    text: i18n.getKey('y'),
                                                    dataIndex: 'y',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'y',
                                                    width: 120,
                                                    renderer: function (value, metadata, record) {
                                                        return value;
                                                    }
                                                },
                                                {
                                                    text: i18n.getKey('width'),
                                                    dataIndex: 'width',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'width',
                                                    width: 120,
                                                    renderer: function (value, metadata, record) {
                                                        return value;
                                                    }
                                                },
                                                {
                                                    text: i18n.getKey('height'),
                                                    dataIndex: 'height',
                                                    xtype: 'gridcolumn',
                                                    itemId: 'height',
                                                    width: 120,
                                                    renderer: function (value, metadata, record) {
                                                        return value;
                                                    }
                                                }
                                            ],
                                            bbar: {
                                                xtype: 'pagingtoolbar',
                                                store: store
                                            }
                                        }
                                    ]
                                });
                                win.show();
                            }
                        },
                        {
                            xtype: 'filecolumn',
                            text: i18n.getKey('file'),
                            dataIndex: 'file',
                            width: 500,
                            flex: 1,
                            getDisplayName: function (value) {
                                return JSAutoWordWrapStr(value.replace('smb:', ''))
                            },
                        },
                    ]
                },
                bbar: {
                    xtype: 'pagingtoolbar',
                    store: store
                }
            }
        ];
        me.callParent();
    }
})
