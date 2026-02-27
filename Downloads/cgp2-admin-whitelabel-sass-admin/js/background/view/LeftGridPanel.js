/**
 * Created by nan on 2020/12/18
 */
Ext.define('CGP.background.view.LeftGridPanel', {
    extend: 'Ext.grid.Panel',
    width: 350,
    controller: null,
    readOnly: false,
    listeners: {
        select: function (rowModel, record) {
            var leftGrid = arguments[0].view.ownerCt;
            var centerPanel = leftGrid.ownerCt.getComponent('centerPanel');
            var seriesId = record.getId();
            centerPanel.refreshData(seriesId);
        },
    },
    title: i18n.getKey('background') + i18n.getKey('category'),

    initComponent: function () {
        var me = this;
        me.controller = Ext.create('CGP.background.controller.Controller');
        var store = me.store = Ext.create('CGP.background.store.BackgroundSeriesStore');
        me.tbar = {
            hidden: me.readOnly,
            items: [
                {
                    xtype: 'button',
                    text: i18n.getKey('add')+i18n.getKey('category'),
                    iconCls: 'icon_add',
                    handler: function (btn) {
                        var leftGrid = btn.ownerCt.ownerCt;
                        leftGrid.controller.editSeriesWindow(null, leftGrid);
                    }
                }
            ]
        };
        me.columns = [
            {
                xtype: 'actioncolumn',
                width: 50,
                hidden: me.readOnly,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                        tooltip: 'Edit',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var grid = view.ownerCt;
                            grid.controller.editSeriesWindow(record.getData(), grid);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        tooltip: 'Delete',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            Ext.Msg.confirm('提示', '确定删除？', callback);

                            function callback(id) {
                                if (id === 'yes') {
                                    var grid = view.ownerCt;
                                    grid.controller.deleteSeriesConfig(record.getId(), grid);
                                }
                            }
                        }
                    }
                ]
            },
            {
                text: i18n.getKey('id'),
                dataIndex: '_id',
                flex: 1,
            },
            {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                flex: 1,
            },
            {
                text: i18n.getKey('displayName'),
                dataIndex: 'displayName',
                flex: 1,
            },
        ];
        me.bbar = Ext.create('Ext.PagingToolbar', {//底端的分页栏
            store: store,
            displayInfo: false, // 是否 ? 示， 分 ? 信息
        });
        me.callParent();
    }
})