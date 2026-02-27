/**
 * Created by nan on 2019/9/12.
 */
Ext.define("CGP.rttypes.view.information.attribute.RtAttributeDefTreePanel", {
    extend: "Ext.tree.Panel",
    requires: ['CGP.material.model.RtAttributeTree'],
    title: i18n.getKey('rtAttributeDef树形结构'),
    viewConfig: {
        stripeRows: true
    },
    rootVisible: false,
    closable: true,
    rtType: null,
    itemId: 'rtAttributeDefTreePanel',
    refreshData: function (record) {
        var me = this;
        var store = me.getStore();
        var toolBar = me.getDockedItems('toolbar[dock="top"]')[0];
        var operater = toolBar.getComponent('operater');
        operater.count = 0;
        operater.setText(i18n.getKey('expandAll'));
        operater.setIconCls('icon_expandAll');
        store.proxy.url = adminPath + 'api/rtTypes/' + record.getId() + '/rtAttributeDefs';
        store.load();
    },
    listeners: {
        beforeload: function (sto, operation, e) {
            var type = operation.node.get('valueType');
            var rtTypeId;
            var customType = operation.node.get('customType');
            if (customType) {
                rtTypeId = customType['_id'];
            }
            if (type == 'CustomType') {
                sto.proxy.url = adminPath + 'api/rtTypes/' + rtTypeId + '/rtAttributeDefs';
            }
        },
        load: function (store, node, records) {
            Ext.Array.each(records, function (item) {
                item.set('icon', '../material/category.png');
            });
        }
    },
    tbar: [
        {
            xtype: 'button',
            text: i18n.getKey('expandAll'),
            iconCls: 'icon_expandAll',
            itemId: 'operater',
            count: 0,
            handler: function (btn) {
                var treepanel = btn.ownerCt.ownerCt;
                if (btn.count % 2 == 0) {
                    treepanel.expandAll();
                    btn.setText(i18n.getKey('collapseAll'));
                    btn.setIconCls('icon_collapseAll');

                } else {
                    treepanel.collapseAll();
                    btn.setText(i18n.getKey('expandAll'));
                    btn.setIconCls('icon_expandAll');
                }
                btn.count++;
            }
        }
    ],
    initComponent: function () {
        var me = this;
        me.columns = [
            {
                xtype: 'treecolumn',
                dataIndex: '_id',
                width: 200,
                tdCls: 'vertical-middle',
                text: i18n.getKey('id'),
                itemId: '_id'
            },
            {
                text: i18n.getKey('name'),
                width: 200,
                tdCls: 'vertical-middle',
                dataIndex: 'name'
            },
            {
                dataIndex: 'valueType',
                text: i18n.getKey('valueType'),
                itemId: 'valueType',
                tdCls: 'vertical-middle',
                width: 150
            },
            {
                dataIndex: 'valueDefault',
                text: i18n.getKey('valueDefault'),
                tdCls: 'vertical-middle',
                itemId: 'valueDefault',
                width: 150
            },
            {
                dataIndex: 'selectType',
                text: i18n.getKey('selectType'),
                tdCls: 'vertical-middle',
                itemId: 'selectType',
                width: 150
            },
            {
                dataIndex: 'arrayType',
                text: i18n.getKey('arrayType'),
                tdCls: 'vertical-middle',
                itemId: 'arrayType',
                flex: 1
            }
        ];

        me.store = Ext.create('Ext.data.TreeStore', {
            model: 'CGP.material.model.RtAttributeTree',
            nodeParam: '_id',
            root: {
                _id: 'root',
            },
            autoSync: false,
            autoLoad: false,
            proxy: {
                type: 'treerest',
                url: adminPath + 'api/rtTypes/{_id}/rtAttributeDefs',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        });
        me.store.load({
            callback: function (records) {
                me.expandAll();
            }
        });
        me.callParent();
    }
})
