/**
 * Created by nan on 2021/3/5
 */
Ext.define('CGP.background.view.SelectImageSizeWin', {
    extend: 'Ext.window.Window',
    title: i18n.getKey('optional') + i18n.getKey('image') + i18n.getKey('size'),
    seriesId: null,
    modal: true,
    constrain: true,
    width: 700,
    height: 600,
    layout: 'fit',
    outGird: null,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'grid',
                selType: 'checkboxmodel',
                store: Ext.create('CGP.background.store.ImageSizeStore', {
                    seriesId: me.seriesId
                }),
                columns: [
                    {
                        text: i18n.getKey('尺寸描述'),
                        dataIndex: 'name',
                        menuDisabled: true,
                        sortable: false,
                    },
                    {
                        text: i18n.getKey('产出物宽度'),
                        dataIndex: 'productWidth',
                        menuDisabled: true,
                        sortable: false,
                    },
                    {
                        text: i18n.getKey('产出物高度'),
                        dataIndex: 'productHeight',
                        menuDisabled: true,
                        sortable: false,
                    },
                    {
                        text: i18n.getKey('出血线位置'),
                        dataIndex: 'cut',
                        menuDisabled: true,
                        width: 250,
                        sortable: false,
                        renderer: function (value, medata, record) {
                            return '上：' + (record.get('cutTop') || 0) +
                                ' 下：' + (record.get('cutBottom') || 0) +
                                ' 左：' + (record.get('cutLeft') || 0) +
                                ' 右：' + (record.get('cutRight') || 0)
                        }
                    },
                    {
                        text: i18n.getKey('unit'),
                        menuDisabled: true,
                        dataIndex: 'unit',
                        flex: 1,
                        sortable: false,
                    }
                ]
            }
        ]
        me.callParent();
    },
    bbar: [
        '->',
        {
            xtype: 'button',
            text: 'save',
            iconCls: 'icon_agree',
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                var grid = win.items.items[0];
                var selection = grid.getSelectionModel().getSelection();
                for (var i = 0; i < selection.length; i++) {
                    grid.ownerCt.outGrid.store.proxy.data.push(selection[i].getData());
                }
                grid.ownerCt.outGrid.store.load();
                win.close();
            }
        },
        {
            xtype: 'button',
            text: 'cancel',
            iconCls: 'icon_cancel',
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                win.close();
            }
        }
    ]
})