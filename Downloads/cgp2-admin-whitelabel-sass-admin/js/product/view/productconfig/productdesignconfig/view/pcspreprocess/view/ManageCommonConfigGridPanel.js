/**
 * Created by nan on 2021/5/24
 * 管理普通的pcs预处理配置
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.ManageCommonConfigGridPanel', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    PMVTId: null,
    filterCfg: {
        header: false,
        minHeight: 85,
        items: [
            {
                name: '_id',
                xtype: 'textfield',
                autoStripChars: true,
                allowExponential: false,
                isLike: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: '_id'
            },
            {
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            },
            {
                name: 'operationType',
                xtype: 'combo',
                fieldLabel: i18n.getKey('operation') + i18n.getKey('type'),
                itemId: 'operationType',
                editable: false,
                valueField: 'value',
                displayField: 'name',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {name: '替换', value: 'Replace'},
                        {name: '插入', value: 'Append'},
                        {name: '删除', value: 'Remove'}
                    ]
                })
            },
            {
                name: 'valueType',
                xtype: 'combo',
                fieldLabel: i18n.getKey('valueType'),
                itemId: 'valueType',
                editable: false,
                valueField: 'value',
                displayField: 'name',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'Boolean', value: 'Boolean'},
                        {name: 'String', value: 'String'},
                        {name: 'Array', value: 'Array'},
                        {name: 'Date', value: 'Date'},
                        {name: 'Number', value: 'Number'}
                    ]
                })
            }/*,
            {
                name: 'clazz',
                xtype: 'textfield',
                hidden: true,
                isLike: false,
                value: 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSPreprocessPlaceholderConfig',
                fieldLabel: i18n.getKey('clazz'),
                itemId: 'clazz'
            }*/
        ]
    },
    outTab: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.controller.Controller');
        me.tbarCfg = {
            xtype: 'uxstandardtoolbar',
            disabledButtons: ['config'],
            hiddenButtons: ['read', 'clear', 'sepQuery'],
            btnExport: {
                disabled: true
            },
            btnImport: {
                disabled: true
            },
            btnRead: {
                handler: function () {
                    me.grid.getStore().loadPage(1);
                }
            },
            btnClear: {
                handler: function () {
                    me.filter.reset();
                }
            },
            btnCreate: {
                handler: function (view) {
                    var outTab = me.ownerCt;
                    controller.editPcsPreprocess(null, null, me.PMVTId, outTab);
                }
            },
            btnDelete: {
                handler: function (view) {
                    var grid = view.ownerCt.ownerCt;
                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteSelectedComfirm'), function (selector) {
                        if (selector == 'yes') {
                            var selected = grid.getSelectionModel().getSelection();
                            var keys = Ext.Array.slice(grid.getSelectionModel().selected.keys);
                            if (!Ext.isEmpty(keys))
                                grid.view.loadMask.show();
                            var store = grid.getStore();
                            Ext.each(keys, function (key) {
                                var record = store.getById(key) || store.getById(key + '');//处理现在id有些是字符串，有些是int
                                store.remove(record);
                            }, this);
                            store.sync({
                                callback: function (o, m) {
                                    grid.view.loadMask.hide();
                                    if (o.proxy.reader.rawData.success) {
                                        var msg = Ext.ux.util.getMsg(o);
                                        //if (msg) Ext.ux.util.prompt(msg);
                                        Ext.ux.util.prompt('删除成功！');
                                    } else {
                                        Ext.ux.util.prompt(o.proxy.reader.rawData.data.message);
                                        store.reload({
                                            callback: function () {
                                                grid.getSelectionModel().select(selected);
                                            }
                                        });
                                    }
                                }
                            });

                        }
                    })
                }
            }
        };
        me.gridCfg = {
            store: Ext.create("CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.store.pcsPreprocessStore", {
                PMVTId: me.PMVTId,
                listeners: {
                    load: function (store, record) {//过滤掉非连续值的属性,过滤掉自己这个属性
                        store.filterBy(function (item) {
                            return item.data.clazz != 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSGridTemplatePreprocessCommonConfig';
                        })
                    }
                }/*,
                filters: [
                    function(item) {
                        return item.clazz != 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSGridTemplatePreprocessCommonConfig';
                    }
                ]*/
            }),
            frame: false,
            columnDefaults: {
                width: 200,
                autoSizeColumn: true
            },
            tbar: me.tbarCfg,
            editActionHandler: function (gridView, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                controller.editPcsPreprocess(record.getId(), null, me.PMVTId, me.ownerCt);
            },
            deleteActionHandler: function (gridView, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                var grid = gridView.ownerCt;
                var store = grid.store;
                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                    if (selector == 'yes') {
                        var mask = me.setLoading(true);
                        controller.deleteRecord(store, record, me.PMVTId, mask)
                    }
                })
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id',
                    width: 100
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    itemId: 'description'
                },
                {
                    text: i18n.getKey('selector') + i18n.getKey('type'),
                    dataIndex: 'selector',
                    itemId: 'selector',
                    renderer: function (value, meta, record) {
                        var clazz = record.get('clazz');
                        var clazzTranslate = {
                            'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSPreprocessPlaceholderConfig': '单选择器',
                            'com.qpp.cgp.domain.pcspreprocess.operatorconfig.ManySelectorPlaceholderConfig': '多选择器',
                            'com.qpp.cgp.domain.pcspreprocess.operatorconfig.CycleSelectorPlaceholderConfig': '动态选择器'
                        }
                        return clazzTranslate[clazz];
                    }
                },
                {
                    text: i18n.getKey('operation') + i18n.getKey('type'),
                    dataIndex: 'operationType',
                    itemId: 'operationType'
                }, {
                    text: i18n.getKey('index'),
                    dataIndex: 'index',
                    itemId: 'index'
                }, {
                    text: i18n.getKey('valueType'),
                    dataIndex: 'valueType',
                    itemId: 'valueType'
                },
                {
                    text: i18n.getKey('value'),
                    dataIndex: 'value',
                    itemId: 'value',
                    xtype: 'componentcolumn',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip=' + i18n.getKey('check') + i18n.getKey('value');
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" style="color: blue" )>' + i18n.getKey('value') + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                    var ela = Ext.fly(a);//获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        JSShowJsonData(value, i18n.getKey('check') + i18n.getKey('variableDataIndexExpression'), {})
                                    });
                                }
                            }
                        }
                    }
                }
            ]
        };
        me.callParent();
    },
    listeners: {
        afterrender: function () {
            //检测产品锁定状态
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
            //添加检测配置是否正确功能入口
            var toolbar = page.down("toolbar[@dock='top']");
            var PMVTId = JSGetQueryString('PMVTId');
            toolbar.insert(8, {
                xtype: 'button',
                width: 150,
                text: i18n.getKey('检测') + i18n.getKey('PCS') + i18n.getKey('config') + i18n.getKey('正确性'),
                handler: function (btn) {
                    Ext.Msg.prompt('请输入一个propertyModelId', null, function (selector, propertyId) {
                        if (selector == 'ok') {
                            page.setLoading(true);
                            var url = adminPath + 'api/pagecontentschemapreprocessconfig/preprocess/' + PMVTId + '/' + propertyId + '/pageContentSchema';
                            setTimeout(function () {
                                JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
                                    page.setLoading(false);
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        JSShowJsonDataV2(responseText.data, '运行结果');
                                    }
                                })
                            })
                        }
                       
                    })
                }
            })
        }
    }
})
