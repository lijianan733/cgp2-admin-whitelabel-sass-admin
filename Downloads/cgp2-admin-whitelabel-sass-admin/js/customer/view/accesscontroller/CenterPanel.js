/**
 * Created by nan on 2018/8/31.
 */
Ext.define('CGP.customer.view.accesscontroller.CenterPanel', {
        extend: 'Ext.container.Container',
        multiSelect: true,
        width: 50,
        title: i18n.getKey('已选访问控制'),
        selType: 'checkboxmodel',
        itemId: 'centerPanel',
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        defaults: {
            margin: '10 0 10 0'
        },
        initComponent: function () {
            var me = this;
            me.items = [
                {
                    xtype: 'button',
                    style:{
                        opacity:0.7
                    },
                    iconCls: 'icon_ux_left',
                    handler: function (view) {
                        var leftPanel = view.ownerCt.ownerCt.getComponent('leftPanel');
                        var rightPanel = view.ownerCt.ownerCt.getComponent('rightPanel');
                        var selectRecords = rightPanel.getSelectionModel().getSelection();
                        if (Ext.isEmpty(selectRecords)) {
                            return;
                        }
                        for (var i = 0; i < selectRecords.length; i++) {
                            leftPanel.getStore().proxy.data.push(selectRecords[i].getData());
                            leftPanel.leftRecordIds.push(selectRecords[i].getId());
                            leftPanel.recordArray.push(selectRecords[i].getData());
                        }
                        rightPanel.leftRecordIds = leftPanel.leftRecordIds;
                        rightPanel.recordArray = leftPanel.recordArray
                        leftPanel.store.load();
                        rightPanel.getStore().remove(selectRecords);
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'icon_ux_right',
                    style:{
                        opacity:0.7
                    },
                    handler: function (view) {
                        var leftPanel = view.ownerCt.ownerCt.getComponent('leftPanel');
                        var rightPanel = view.ownerCt.ownerCt.getComponent('rightPanel');
                        var selectRecords = leftPanel.getSelectionModel().getSelection();
                        if (Ext.isEmpty(selectRecords)) {
                            return;
                        }
                        leftPanel.store.remove(selectRecords);
                        leftPanel.store.proxy.data = [];
                        leftPanel.leftRecordIds = [];
                        leftPanel.recordArray = [];
                        rightPanel.leftRecordIds = [];
                        rightPanel.recordArray = [];
                        for (var i = 0; i < leftPanel.store.data.items.length; i++) {
                            var item = leftPanel.store.data.items[i];
                            leftPanel.store.proxy.data.push(item.getData());
                            leftPanel.leftRecordIds.push(item.getId());
                            leftPanel.recordArray.push(item.getData());
                        }
                        rightPanel.leftRecordIds = leftPanel.leftRecordIds;
                        rightPanel.recordArray = leftPanel.recordArray;
                        leftPanel.store.load();
                        rightPanel.store.load();
                    }
                }
            ];
            me.callParent();
        }
    }
)
