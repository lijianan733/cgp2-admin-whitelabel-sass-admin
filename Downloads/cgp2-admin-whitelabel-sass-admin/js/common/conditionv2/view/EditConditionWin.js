/**
 * @Description:编辑值-操作-值结构的组件
 * @author nan
 * @date 2023/2/7
 */
Ext.Loader.syncRequire([
    'CGP.common.conditionv2.view.ILogicalFieldV2',
    'CGP.common.conditionv2.model.ConditionTreeModel'
])
Ext.define('CGP.common.conditionv2.view.EditConditionWin', {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    createOrEdit: 'create',
    record: null,
    data: null,//这个和record.getData()取出来的数据不同
    contextStore: null,//上下文store
    layout: {
        type: 'fit',
    },
    autoScroll: true,
    width: 650,
    bbar: {
        xtype: 'bottomtoolbar',
        saveBtnCfg: {
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                var ilogicalfieldv2 = win.getComponent('ilogicalfieldv2');
                if (ilogicalfieldv2.isValid()) {
                    var data = ilogicalfieldv2.diyGetValue();
                    console.log(data);
                    if (win.createOrEdit == 'edit') {
                        var newRecord = Ext.create('CGP.common.conditionv2.model.ConditionTreeModel', data);
                        win.record.raw = newRecord.getData();
                        for (var i in win.record.raw) {
                            win.record.set(i, win.record.raw[i]);
                        }
                    } else if (win.createOrEdit == 'create') {
                        win.record.appendChild(data);
                        win.record.expand();
                    }
                    win.close();
                }
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey(me.createOrEdit) + '条件';
        me.items = [
            {
                xtype: 'ilogicalfieldv2',
                itemId: 'ilogicalfieldv2',
                margin: '0 25',
                allowBlank: false,
                contextStore: me.contextStore,
            }
        ];
        me.callParent();
        me.on('afterrender', function () {
            var me = this;
            if (me.data) {
                var ilogicalfieldv2 = me.getComponent('ilogicalfieldv2');
                ilogicalfieldv2.diySetValue(me.data);
            }
        });
    },
});
