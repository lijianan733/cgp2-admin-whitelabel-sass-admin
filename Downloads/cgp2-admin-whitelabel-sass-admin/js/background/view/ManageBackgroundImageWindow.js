/**
 * Created by nan on 2020/12/18
 */
Ext.define('CGP.background.view.ManageBackgroundImageWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    layout: 'fit',
    height: 600,
    backgroundId: null,
    maximizable: true,
    readOnly: false,
    updateColumns: function () {
        var win = this;
        var imageGroup = win.items.items[0];
        var currentWidth = win.body.el.dom.offsetWidth;
        var itemWidth = 350;
        var newColumns = Math.floor(currentWidth / itemWidth);
        imageGroup.layout.columns = newColumns;
        imageGroup.updateLayout();
    },
    listeners: {
        show: function () {
            var win = this;
            win.setZIndex(1040);
            win.zIndexManager.mask.setStyle('z-index', 1039)
        },
        maximize: function () {
            var me = this;
            me.updateColumns();
        },
        restore: function () {
            var me = this;
            me.updateColumns();
        }
    },
    backgroundImageStore: null,
    initComponent: function () {
        var me = this;
        //修改弹窗遮罩层的z_index
        Ext.WindowManager.zseed = 1000;
        me.controller = Ext.create('CGP.background.controller.Controller');
        me.items = [
            Ext.create('CGP.background.view.image.ImageGroup', {
                readOnly: me.readOnly,
            })
        ];
        me.tbar = {
            hidden: me.readOnly,
            items: [
                {
                    xtype: 'button',
                    text: i18n.getKey('add') + i18n.getKey('size'),
                    iconCls: 'icon_add',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.controller.showAddNewBackgroundSizeWin(win, win.backgroundId);

                    }
                }
            ]
        };
        me.callParent();
        me.setValue(me.backgroundId);
    },
    setValue: function (backgroundId) {
        var me = this;
        me.backgroundImageStore = Ext.create('CGP.background.store.BackgroundImageStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'background._id',
                    type: 'string',
                    value: backgroundId
                }])
            },
            listeners: {
                load: function (store, records) {
                    var imageGroup = me.items.items[0];
                    var data = [];
                    records.forEach(function (item) {
                        data.push(item.getData());
                    })
                    imageGroup.setValue(data);
                }
            }
        })
    },
    refreshData: function () {
        var me = this;
        var imageGroup = me.items.items[0];
        imageGroup.removeAll();
        me.backgroundImageStore.load();
    }
})