/***
 *
 *
 */
Ext.Loader.syncRequire([
    'CGP.attribute.view.window.DragZone'
])
Ext.onReady(function () {


    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('orderStatus'),
        block: 'orderstatus',
        editPage: 'edit.html',
        gridCfg: {
            //store.js
            store: Ext.create('CGP.orderstatus.store.OrderStatusStore'),
            frame: false,
            viewConfig: {
                listeners: {
                    drop: function (node, Object, overModel, dropPosition, eOpts) {
                        var view = this;
                        JSSetLoading(true, '处理中...');
                        this.store.suspendAutoSync();//挂起数据同步
                        view.ownerCt.suspendLayouts();//挂起布局
                        view.store.suspendEvents(true);//挂起事件粗触发，false表示丢弃事件，true表示阻塞事件队列*/
                        var data = this.store.data.items;
                        for (var i = 0; i < data.length; i++) {
                            data[i].index = i;
                            if (data[i].get('fontSort') == i) {

                            } else {
                                data[i].set('fontSort', i);
                            }
                        }
                        this.store.sync({
                            callback: function () {
                                view.store.resumeEvents();//恢复事件触发
                                view.ownerCt.resumeLayouts();
                                JSSetLoading(false);
                            }
                        });//同步数据
                    }
                },
                enableTextSelection: true,
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragText: 'Drag and drop to reorganize',
                }
            },
            selModel: Ext.create("Ext.selection.RowModel", {
                mode: "single",
                checkOnly: true,
                allowDeselect: true,
            }),
            columnDefaults: {
                sortable: false,
                autoSizeColumn: true
            },
            columns: [{
                text: i18n.getKey('id'),
                dataIndex: 'id',
                itemId: 'id',
                sortable: true
            }, {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                width: 300,
                itemId: 'name',
            }, {
                text: i18n.getKey('displayName'),
                dataIndex: 'frontendName',
                itemId: 'frontendName',
                width: 300,
            }, {
                text: i18n.getKey('displayName') + '(ZH)',
                dataIndex: 'name',
                width: 300,
                itemId: 'name',
                renderer: function (value, mateData, record) {
                    return i18n.getKey(value);
                }
            }, {
                text: i18n.getKey('排序'),
                dataIndex: 'fontSort',
                itemId: 'fontSort',
                width: 300,
                flex: 1
            }]
        },
        tbarCfg: {
            msgDisplay: {
                value: '行号处上下拖拽调整执行顺序'
            }
        },
        filterCfg: {
            items: [{
                id: 'idSearchField',
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                id: 'frontendName',
                name: 'frontendName',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('displayName'),
                itemId: 'frontendName'
            }]
        }
    });
});