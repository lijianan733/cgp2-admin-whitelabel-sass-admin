/**
 * Created by nan on 2021/8/25
 * 指定pc和主题映射规则
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.SingleThemeGrid',

])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.MultiThemeGrid', {
    extend: 'Ext.ux.grid.GridWithCRUD',
    alias: 'widget.multithemegrid',
    title: i18n.getKey('特殊') + i18n.getKey('themePreSet'),
    rawData: null,//加载的初始数据
    pcsData: null,
    mixins: ['CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.GridCommonConfig'],
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
                filter: Ext.JSON.encode([{
                    name: 'mvt._id',
                    type: 'string',
                    value: me.mvtId
                }, {
                    name: 'clazz',
                    type: 'string',
                    value: "com.qpp.cgp.domain.theme.SinglePCMvtTheme"
                }])
            }
        })
        var multiThemeStore = me.store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.store.PCPreThemeStore', {
            params: {
                filter: Ext.JSON.encode([
                    {
                        name: 'mvt._id',
                        type: 'string',
                        value: me.mvtId
                    }, {
                        name: 'clazz',
                        type: 'string',
                        value: "com.qpp.cgp.domain.theme.MultiPCMvtTheme"
                    }
                ])
            }
        })
        me.columns = [
            {
                dataIndex: '_id',
                text: i18n.getKey('id')
            },
            {
                dataIndex: 'description',
                flex: 1,
                text: i18n.getKey('description')
            },
            {
                dataIndex: 'indexMappingConfig',
                flex: 1,
                text: i18n.getKey('映射规则'),
                renderer: function (value) {
                    var me = this;
                    var mapping = {
                        'com.qpp.cgp.domain.theme.SequenceRepeatConfig': i18n.getKey('顺序应用'),
                        'com.qpp.cgp.domain.theme.RandomIndexMappingConfig': i18n.getKey('随机应用'),
                        'com.qpp.cgp.domain.theme.ExpressionIndexMappingConfig': i18n.getKey('自定义规则应用')
                    };
                    return mapping[value.clazz];
                }
            },
            {
                dataIndex: 'items',
                flex: 1,
                text: i18n.getKey('主题列表'),
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="查看"';
                    return {
                        xtype: 'displayfield',
                        value: '<a href="#")>查看</a>',
                        listeners: {
                            render: function (display) {
                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                ela.on("click", function () {
                                    var win = Ext.create('Ext.window.Window', {
                                        modal: true,
                                        constrain: true,
                                        title: i18n.getKey('主题列表'),
                                        layout: 'fit',
                                        width: 450,
                                        height: 450,
                                        items: [
                                            {
                                                xtype: 'grid',
                                                autoScroll: true,
                                                store: {
                                                    xtype: 'store',
                                                    fields: [
                                                        {
                                                            name: 'index',
                                                            type: 'number'
                                                        },
                                                        {
                                                            name: 'singlePCMvtTheme',
                                                            type: 'object'
                                                        },
                                                    ],
                                                    data: value
                                                },
                                                columns: [
                                                    {
                                                        dataIndex: 'index',
                                                        text: i18n.getKey('index')
                                                    },
                                                    {
                                                        dataIndex: 'singlePCMvtTheme',
                                                        name: 'singlePCMvtTheme',
                                                        flex: 1,
                                                        text: i18n.getKey('单预设主题'),
                                                        renderer: function (value) {
                                                            return value._id;
                                                        }
                                                    }
                                                ],
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
            store: multiThemeStore,
        };
        me.winConfig = {
            winTitle: i18n.getKey('itemProcess'),
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
                    margin: '5 25 10 25',
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
                        xtype: 'indexmappingfieldcontainer',
                        name: 'indexMappingConfig',
                        itemId: 'indexMappingConfig',
                    },
                    {
                        xtype: 'textfield',
                        name: 'clazz',
                        itemId: 'clazz',
                        hidden: true,
                        value: 'com.qpp.cgp.domain.theme.MultiPCMvtTheme',
                        fieldLabel: i18n.getKey('clazz')
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
                        xtype: 'gridfieldwithcrudv2',
                        width: 600,
                        labelAlign: 'top',
                        fieldLabel: i18n.getKey('主题列表'),
                        itemId: 'items',
                        name: 'items',
                        minHeight: 150,
                        gridConfig: {
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
                                            data[i].set('index', i);
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
                            tbar: {
                                msgDisplay: {
                                    value: '上下拖拽调整执行顺序'
                                }
                            },
                            store: {
                                xtype: 'store',
                                autoSync: true,
                                fields: [
                                    {
                                        name: 'index',
                                        type: 'number'
                                    },
                                    {
                                        name: 'singlePCMvtTheme',
                                        type: 'object'
                                    },
                                ],
                                data: []
                            },
                            columns: [
                                {
                                    dataIndex: 'index',
                                    text: i18n.getKey('executeOrder')
                                },
                                {
                                    dataIndex: 'singlePCMvtTheme',
                                    name: 'singlePCMvtTheme',
                                    flex: 1,
                                    text: i18n.getKey('单预设主题'),
                                    renderer: function (value) {
                                        return value._id;
                                    }
                                }
                            ],

                        },
                        winConfig: {
                            winTitle: i18n.getKey('itemProcess'),
                            layout: 'fit',
                            formConfig: {
                                autoScroll: false,
                                isValidForItems: true,
                                defaults: {
                                    padding: '5 25 10 25',
                                    width: 400,
                                    allowBlank: false
                                },
                                //自定义保存操作
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        itemId: 'index',
                                        name: 'index',
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
                                        xtype: 'gridcombo',
                                        itemId: 'singlePCMvtTheme',
                                        name: 'singlePCMvtTheme',
                                        fieldLabel: i18n.getKey('单预设主题'),
                                        allowBlank: false,
                                        displayField: '_id',
                                        valueField: '_id',
                                        editable: false,
                                        msgTarget: 'side',
                                        store: singleThemeStore,
                                        matchFieldWidth: false,
                                        gridCfg: {
                                            height: 350,
                                            width: 400,
                                            columns: [
                                                {
                                                    text: i18n.getKey('id'),
                                                    dataIndex: '_id'
                                                },
                                                {
                                                    text: i18n.getKey('description'),
                                                    dataIndex: 'description',
                                                    flex: 1,
                                                }
                                            ],
                                            bbar: {
                                                store: singleThemeStore,
                                                xtype: 'pagingtoolbar',
                                            }
                                        }
                                    }
                                ]
                            },
                        }
                    }
                ]
            },
        };
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
})
