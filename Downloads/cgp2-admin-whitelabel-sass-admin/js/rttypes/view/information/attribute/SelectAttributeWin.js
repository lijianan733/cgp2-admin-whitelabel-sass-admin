Ext.define('CGP.rttypes.view.information.attribute.SelectAttributeWin', {
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    /*width: 350,
    height: 350,*/
    store: null,
    record: null,
    editOrNew: null,
    filterData: null,
    rtAttributeDefGrid: null,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('selectAttribute');
        var attributeGrid = Ext.create('CGP.rttypes.view.information.attribute.SelectAttributeGrid', {
            filterData: me.filterData
            //store: me.store
        });
        var controller = Ext.create('CGP.rttypes.controller.Controller');
        me.items = [attributeGrid];
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('confirm'),
            iconCls: 'icon_add',
            handler: function () {
                var selectRecords = me.grid.getSelectionModel().getSelection();
                var noParentAttr = [];
                Ext.Array.each(me.store.data.items, function (item) {
                    if (item.get('belongsToParent') == false) {
                        noParentAttr.push(item);
                    }
                });
                var lastHaveRecord = noParentAttr[noParentAttr.length - 1];
                if (!Ext.isEmpty(selectRecords)) {
                    if (lastHaveRecord) {
                        for (var i = 0; i < selectRecords.length; i++) {
                            selectRecords[i].set('sortOrder', lastHaveRecord.get('sortOrder') + i + 1);
                            selectRecords[i].set('belongsToParent', false);
                        }
                    } else {
                        for (var i = 0; i < selectRecords.length; i++) {
                            selectRecords[i].set('sortOrder', i + 1);
                            selectRecords[i].set('belongsToParent', false);
                        }
                    }
                    var selectData = [];
                    for (var i = 0; i < selectRecords.length; i++) {
                        selectData.push(selectRecords[i].getData());
                    }
                    me.store.add(selectData);
                    me.rtAttributeDefGrid.hadModify = true;
                    me.close();
                } else {
                    Ext.Msg.alert('提示', '请选择属性！');
                }
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function () {
                me.close();
            }
        }];
        me.callParent(arguments);
        me.grid = me.down('grid');
    }
});
