/**
 * Created by nan on 2018/8/30.
 */
Ext.syncRequire([
    'Ext.ux.data.proxy.PagingMemoryProxy'
])
Ext.define('CGP.customer.view.accesscontroller.LeftPanel', {
    extend: 'Ext.grid.Panel',
    multiSelect: true,
    flex: 1,
    title: i18n.getKey('已选访问控制'),
    selType: 'checkboxmodel',
    itemId: 'leftPanel',
    recordArray: [],
    leftRecordIds: [],
    viewConfig: {
        enableTextSelection: true,
        stripeRows: true,
        plugins: {
            ptype: 'gridviewdragdrop',
            ddGroup: 'selDD',
            enableDrag: true,
            enableDrop: true
        },
        listeners: {
            drop: function () {
                var rightPanel = arguments[1].view.ownerCt;
                var leftPanel = rightPanel.ownerCt.getComponent('leftPanel');
                var records = arguments[1].records[0].store.data.items;
                leftPanel.recordArray = [];
                leftPanel.leftRecordIds = [];
                rightPanel.leftRecordIds = [];
                rightPanel.leftData = [];
                for(var i=0;i<records.length;i++){
                    var item=records[i];
                    if (leftPanel.leftRecordIds.indexOf(item.getId()) != -1) {
                        continue;
                    }
                    leftPanel.recordArray.push(item.getData());
                    rightPanel.leftRecordIds.push(item.getId());
                    leftPanel.leftRecordIds.push(item.getId());
                }
                rightPanel.leftData = leftPanel.recordArray;
                leftPanel.store.proxy.data = leftPanel.recordArray;//改变分页代理中的数据集
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.recordArray = [];
        me.header = {
            text: 'left',
            titleAlign: 'center',
            style: {
                opacity: 0.7
            }
        };

        me.store = Ext.create('Ext.data.Store', {
            model: 'CGP.authorityeffectrange.model.AuthorityEffectRangeModel',
            data: me.recordArray,
            autoLoad: true,
            autoSync: true,
            proxy: {
                type: 'pagingmemory'
            }
        });

        me.columns = [
            {
                dataIndex: '_id',
                text: i18n.getKey('id'),
                width: 80,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip=' + value;
                    return {
                        xtype: 'displayfield',
                        value: '<a href="#" style="color: green">' + value + '</a>',
                        listeners: {
                            render: function (display) {
                                var a = display.el.dom.getElementsByTagName('a')[0];
                                var ela = Ext.fly(a);
                                var type = record.get('clazz') == 'com.qpp.security.domain.acp.Role' ? 'role' : 'accessControlPermission';
                                ela.on("click", function () {
                                    if (type == 'role') {
                                        JSOpen({
                                            id: 'rolepage',
                                            url: path + 'partials/acprole/main.html?_id=' + value,
                                            title: i18n.getKey('acpRole'),
                                            refresh: true
                                        });
                                    } else {
                                        JSOpen({
                                            id: 'authorityeffectrangepage',
                                            url: path + 'partials/authorityeffectrange/main.html?_id=' + value,
                                            title: i18n.getKey('authorityEffectRange'),
                                            refresh: true
                                        });
                                    }
                                });
                            }
                        }
                    };
                }
            },
            {
                dataIndex: 'name',
                text: i18n.getKey('name'),
                flex: 1
            },
            {
                dataIndex: 'description',
                text: i18n.getKey('description'),
                flex: 1
            },
            {
                dataIndex: 'code',
                text: i18n.getKey('code'),
                flex: 1
            }
        ];
        var record = CGP.customer.model.AccessControl.load(me.userId, {
            scope: this,
            failure: function (record, operation) {

            },
            success: function (record, operation) {
                var items = record.get('acpDTOs');
                me.recordArray = [];
                me.leftRecordIds = [];
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    me.recordArray.push(item);
                    me.leftRecordIds.push(item._id)
                }
                me.store.loadData(me.recordArray);
            },
            callback: function (record, operation) {
            }
        });
        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.store,
            displayInfo: true,
            displayMsg: '',
            emptyMsg: ''
        })
        me.callParent();
    }
})