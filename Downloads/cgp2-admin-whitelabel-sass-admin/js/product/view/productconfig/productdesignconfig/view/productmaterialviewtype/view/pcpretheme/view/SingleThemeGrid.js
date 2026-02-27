/**
 * Created by nan on 2021/8/25
 * 所有pc都用改主题
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.view.IndexMappingFieldContainer',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.PcResourceApplyConfig'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.SingleThemeGrid', {
        extend: 'Ext.ux.grid.GridWithCRUD',
        alias: 'widget.singlethemegrid',
        mixins: ['CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.GridCommonConfig'],
        title: i18n.getKey('optional') + i18n.getKey('SingleThemeGrid'),
        rawData: null,//加载的初始数据
        pcsData: null,
        mvtId: null,
        mvtType: null,
        deleteHandler: function (view, rowIndex, colIndex, dom, event, record) {
            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                if (selector == 'yes') {
                    var singleGrid = view.ownerCt;
                    singleGrid.store.remove(record);
                    singleGrid.store.sync({
                        callback: function (store, option) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                        }
                    });
                }
            })
        },
        initComponent: function () {
            var me = this;
            var singleThemeStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.store.PCPreThemeStore', {
                params: {
                    filter: Ext.JSON.encode([
                        {
                            name: 'mvt._id',
                            type: 'string',
                            value: me.mvtId
                        },
                        {
                            name: 'clazz',
                            type: 'string',
                            value: "com.qpp.cgp.domain.theme.SinglePCMvtTheme"
                        }
                    ])
                }
            })
            me.store = singleThemeStore;
            me.columns = [
                {
                    dataIndex: '_id',
                    text: i18n.getKey('id')
                },
                {
                    dataIndex: 'description',
                    name: 'description',
                    width: 450,
                    text: i18n.getKey('description')
                },
                {
                    dataIndex: 'resourceItemConfigs',
                    name: 'resourceItemConfigs',
                    flex: 1,
                    text: i18n.getKey('主题操作列表'),
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看配置"';
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>查看配置</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        var win = Ext.create('Ext.window.Window', {
                                            modal: true,
                                            constrain: true,
                                            title: i18n.getKey('主题操作列表'),
                                            layout: 'fit',
                                            items: [
                                                {
                                                    xtype: 'grid',
                                                    width: 600,
                                                    store: {
                                                        xtype: 'store',
                                                        fields: [
                                                            {name: 'executeOrder', type: 'number'},
                                                            {
                                                                name: 'applyConfig', type: 'object'
                                                            },
                                                            {name: 'clazz', type: 'string'}
                                                        ],
                                                        data: value
                                                    },
                                                    columns: [
                                                        {
                                                            width: 100,
                                                            dataIndex: 'executeOrder',
                                                            text: i18n.getKey('executeOrder'),
                                                        },
                                                        {
                                                            text: i18n.getKey('目标位置'),
                                                            dataIndex: 'applyConfig',
                                                            flex: 1,
                                                            renderer: function (value) {
                                                                return value.targetSelector;
                                                            }
                                                        },
                                                        {
                                                            text: i18n.getKey('resources'),
                                                            dataIndex: 'applyConfig',
                                                            flex: 1,
                                                            renderer: function (value) {
                                                                value = value.resource;
                                                                return JSCreateHTMLTable([
                                                                    {
                                                                        title: i18n.getKey('resources') + i18n.getKey('type'),
                                                                        value: value.clazz.split('.').pop()
                                                                    },
                                                                    {
                                                                        title: i18n.getKey('id'),
                                                                        value: value._id
                                                                    }
                                                                ])
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        });
                                        win.show();
                                    });
                                }
                            }
                        };
                    }
                }
            ];
            me.bbar = {
                xtype: 'pagingtoolbar',
                store: singleThemeStore,
            };
            me.winConfig = {
                resourceName: i18n.getKey('单预设主题'),
                layout: 'fit',
                //自定义保存操作
                saveHandler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    var win = form.ownerCt;
                    var grid = win.outGrid;
                    var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.controller.Controller');
                    if (form.isValid()) {
                        var data = form.getValue();
                        console.log(data);
                        controller.savePCPreSet(data, grid);
                        win.close();
                    }
                },
                formConfig: {
                    autoScroll: false,
                    isValidForItems: true,
                    defaults: {
                        padding: '5 25 10 25',
                        width: 400,
                        allowBlank: false
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: '_id',
                            hidden: true,
                            itemId: '_id',
                            allowBlank: true,
                            fieldLabel: i18n.getKey('_id')
                        },
                        {
                            xtype: 'textfield',
                            name: 'description',
                            itemId: 'description',
                            fieldLabel: i18n.getKey('description')
                        },
                        {
                            xtype: 'textfield',
                            name: 'mvt',
                            itemId: 'mvt',
                            hidden: true,
                            fieldLabel: i18n.getKey('mvt'),
                            value: me.mvtId + '_' + me.mvtType,
                            diySetValue: function (data) {
                                var me = this;
                                if (data) {
                                    me.setValue(data._id + '_' + data.clazz);
                                }
                            },
                            diyGetValue: function () {
                                var me = this;
                                var data = me.getValue();
                                if (data) {
                                    var id = data.split('_')[0];
                                    var clazz = data.split('_')[1];
                                    return {
                                        _id: id,
                                        clazz: clazz
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            hidden: true,
                            value: 'com.qpp.cgp.domain.theme.SinglePCMvtTheme',
                            fieldLabel: i18n.getKey('clazz')
                        },
                        {
                            xtype: 'gridfieldwithcrudv2',
                            width: 600,
                            labelAlign: 'top',
                            fieldLabel: i18n.getKey('主题操作列表'),
                            itemId: 'resourceItemConfigs',
                            name: 'resourceItemConfigs',
                            minHeight: 150,
                            winConfig: {
                                formConfig: {
                                    defaults: {
                                        width: 450,
                                        allowBlank: false,
                                        margin: '5 25 10 50'
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            itemId: 'executeOrder',
                                            name: 'executeOrder',
                                            readOnly: true,
                                            fieldStyle: 'background-color:silver',
                                            allowBlank: true,
                                            fieldLabel: i18n.getKey('executeOrder'),
                                            listeners: {
                                                afterrender: function () {
                                                    var win = this.ownerCt.ownerCt;
                                                    var count = win.gridField.getStore().getCount();
                                                    if (win.createOrEdit == 'create') {
                                                        this.setValue(count);
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'clazz',
                                            itemId: 'clazz',
                                            hidden: true,
                                            value: 'com.qpp.cgp.domain.theme.ThemeResourceItemConfig'
                                        },
                                        {
                                            xtype: 'pcresourceapplyconfig',
                                            fieldLabel: i18n.getKey('resourceApplyConfig'),
                                            name: 'applyConfig',
                                            itemsId: 'applyConfig',
                                            pcsData: me.pcsData
                                        },
                                    ]
                                },
                            },
                            gridConfig: {
                                tbar: {
                                    msgDisplay: {
                                        value: '上下拖拽调整执行顺序',
                                    }
                                },
                                viewConfig: {
                                    enableTextSelection: true,
                                    listeners: {
                                        drop: function (node, Object, overModel, dropPosition, eOpts) {
                                            var view = this;
                                            view.ownerCt.mask('处理中..');
                                            this.store.suspendAutoSync();//挂起数据同步
                                            view.ownerCt.suspendLayouts();//挂起布局
                                            view.store.suspendEvents(true);//挂起事件粗触发，false表示丢弃事件，true表示阻塞事件队列*/
                                            var data = this.store.data.items;
                                            for (var i = 0; i < data.length; i++) {
                                                data[i].index = i;
                                                data[i].set('executeOrder', i);
                                            }
                                            this.store.sync({
                                                callback: function () {
                                                    view.ownerCt.unmask();
                                                    view.store.resumeEvents();//恢复事件触发
                                                    view.ownerCt.resumeLayouts();
                                                }
                                            });//同步数据
                                        }
                                    },
                                    plugins: {
                                        ptype: 'gridviewdragdrop',
                                        dragText: 'Drag and drop to reorganize',
                                    }
                                },
                                store: {
                                    xtype: 'store',
                                    fields: [
                                        {name: 'executeOrder', type: 'number'},
                                        {name: 'applyConfig', type: 'object'},
                                        {name: 'clazz', type: 'string'}
                                    ],
                                    data: []
                                },
                                columns: [
                                    {
                                        width: 100,
                                        dataIndex: 'executeOrder',
                                        text: i18n.getKey('executeOrder'),
                                    },
                                    {
                                        text: i18n.getKey('目标位置'),
                                        dataIndex: 'applyConfig',
                                        flex: 1,
                                        renderer: function (value) {
                                            return value.targetSelector;
                                        }
                                    },
                                    {
                                        text: i18n.getKey('resources'),
                                        dataIndex: 'applyConfig',
                                        flex: 1,
                                        renderer: function (value) {
                                            value = value.resource;
                                            return JSCreateHTMLTable([
                                                {
                                                    title: i18n.getKey('resources') + i18n.getKey('type'),
                                                    value: value.clazz.split('.').pop()
                                                },
                                                {
                                                    title: i18n.getKey('id'),
                                                    value: value._id
                                                }
                                            ])
                                        }
                                    }
                                ],
                            }
                        }
                    ]
                },
            }
            me.callParent();
            me.on('afterrender', function () {
                var page = this;
                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                var productId = builderConfigTab.productId;
                me.productId = productId;
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
            })
        }
    }
)
