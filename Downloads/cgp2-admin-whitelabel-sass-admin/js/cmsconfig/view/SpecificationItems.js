/**
 * @Description:
 * @author nan
 * @date 2023/11/23
 */
Ext.define('CGP.cmsconfig.view.SpecificationItems', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.specification_items',
    title: i18n.getKey('描述信息项'),
    layout: 'fit',
    border: false,
    autoScroll: true,
    data: null,
    getValue: function () {
        var me = this;
        var result = [];
        var store = me.getComponent('gridwithcrud').getStore();
        store.data.items.map(function (item) {
            result.push(item.getData());
        });
        return {
            specificationItems: result
        };
    },
    setValue: function (data) {
        var me = this;
        var specificationItems = data.specificationItems || [];
        me.data = {
            specificationItems: specificationItems
        }
        var store = me.getComponent('gridwithcrud').getStore();
        store.proxy.data = specificationItems;
        store.load();
    },
    isValid: function () {
        var me = this;
        return true;
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'gridwithcrud',
                border: false,
                itemId: 'gridwithcrud',
                store: {
                    xtype: 'store',
                    fields: [
                        {
                            name: 'id',
                            convert: function (value) {
                                return value || JSGetUUID();
                            }
                        },
                        'description',
                        'header',
                        'detailUrl',
                        'icon',
                        'content',
                        'index',
                        'clazz'
                    ],
                    pageSize: 25,
                    proxy: {
                        type: 'memory'
                    },
                    data: []
                },
                viewConfig: {
                    enableRowNumberLineMove: true,//启用行号处拖拽
                    listeners: {
                        drop: function (node, Object, overModel, dropPosition, eOpts) {
                            var view = this;
                            view.ownerCt.suspendLayouts();//挂起布局
                            var data = this.store.data.items;
                            var arr = [];
                            for (var i = 0; i < data.length; i++) {
                                var item = data[i].getData();
                                item.index = i;
                                arr.push(item);
                            }
                            this.store.proxy.data = arr;
                            this.store.load();
                        },

                    },
                    plugins: {
                        ptype: 'gridviewdragdrop',
                        dragText: '显示顺序处可用鼠标拖拽进行上下排序'
                    }
                },
                columns: [
                    {
                        xtype: 'rownumberer',
                        width: 80,
                        text: '显示顺序',
                    },
                    {
                        text: i18n.getKey('description'),
                        dataIndex: 'description',
                        width: 350
                    },
                    {
                        xtype: 'atagcolumn',
                        text: i18n.getKey('header'),
                        dataIndex: 'header',
                        getDisplayName: function (value, metaData, record) {
                            var me = this;
                            return '<a href="#" style="color: blue">查看</a>';
                        },
                        clickHandler: function (value, metaData, record) {
                            var win = Ext.create('Ext.window.Window', {
                                modal: true,
                                constrain: true,
                                title: '详情',
                                width: 800,
                                height: 800,
                                items: [
                                    {
                                        xtype: 'component',
                                        html: value
                                    }
                                ]
                            });
                            win.show();
                        }
                    },
                    {
                        xtype: 'atagcolumn',
                        text: i18n.getKey('内容'),
                        dataIndex: 'content',
                        getDisplayName: function (value, metaData, record) {
                            var me = this;
                            return '<a href="#" style="color: blue">查看</a>';
                        },
                        clickHandler: function (value, metaData, record) {
                            var win = Ext.create('Ext.window.Window', {
                                modal: true,
                                constrain: true,
                                title: '详情',
                                width: 800,
                                height: 800,
                                items: [
                                    {
                                        xtype: 'component',
                                        html: value
                                    }
                                ]
                            });
                            win.show();
                        }
                    },
                    {
                        xtype: 'imagecolumn',
                        width: 100,
                        text: i18n.getKey('图标'),
                        dataIndex: 'icon',
                    },
                    {
                        xtype: 'atagcolumn',
                        text: i18n.getKey('详情链接'),
                        dataIndex: 'detailUrl',
                        flex: 1,
                        clickHandler: function (value, metaData, record) {
                            window.open(value);
                        }
                    },
                ],
                winConfig: {
                    winTitle: '产品描述信息项',
                    width: 1000,
                    maximizable: true,
                    formConfig: {
                        isValidForItems: true,
                        layout: {
                            type: 'vbox'
                        },
                        defaults: {
                            allowBlank: false,
                            msgTarget: 'none',
                            margin: '5 25',
                            width: 450,
                        },
                        items: [
                            {
                                xtype: 'hiddenfield',
                                name: 'id',
                                itemId: 'id',
                                fieldLabel: i18n.getKey('id')
                            },
                            {
                                xtype: 'textarea',
                                name: 'description',
                                itemId: 'description',
                                fieldLabel: i18n.getKey('description')
                            },
                            {
                                xtype: 'textfield',
                                name: 'detailUrl',
                                itemId: 'detailUrl',
                                allowBlank: true,
                                fieldLabel: i18n.getKey('详情链接')
                            }, {
                                xtype: 'fileuploadv2',
                                name: 'icon',
                                itemId: 'icon',
                                allowBlank: true,
                                fieldLabel: i18n.getKey('图标')
                            },
                            {
                                xtype: 'textarea',
                                name: 'header',
                                itemId: 'header',
                                height: 80,
                                fieldLabel: i18n.getKey('header')
                            }, {
                                xtype: 'htmleditor',
                                name: 'content',
                                itemId: 'content',
                                width: '100%',
                                flex: 1,
                                fieldLabel: i18n.getKey('内容'),
                                enableAlignments: false,
                                enableColors: false,
                                enableFont: false,
                                enableFontSize: false,
                                enableFormat: false,
                                enableLinks: false,
                                enableLists: false,
                                enableSourceEdit: true,
                                fontFamilies: false,
                                listeners: {
                                    afterrender: function () {
                                        var contentField = this;
                                        var toolbar = this.toolbar;
                                        toolbar.insert(0, {
                                            xtype: 'button',
                                            text: '根据模板生成',
                                            handler: function () {
                                                var template = []
                                                if (window.websiteConfig) {
                                                    template = window.websiteConfig['CMS产品发布配置规格模板数据'];
                                                } else {
                                                    JSGetWebsiteConfig('qpson', JSWebsiteIsStage() == true ? 'release' : 'stage', false);
                                                    template = window.websiteConfig['CMS产品发布配置规格模板数据'];
                                                }
                                                template = template.map(function (item) {
                                                    return {display: item.name, value: item};
                                                });
                                                var buildData = function (template, data) {
                                                    if (data && template) {
                                                        var outTemplate = template.outTemplate;
                                                        var innerTemplate = template.innerTemplate;
                                                        var arr = data.split('\n');
                                                        var result = '';
                                                        arr.map(function (item) {
                                                            result += innerTemplate.replace('${变量}', item);
                                                        });
                                                        result = outTemplate.replace('${变量}', result);
                                                        return result;
                                                    } else {
                                                        return '';
                                                    }

                                                };
                                                var win = Ext.create('Ext.window.Window', {
                                                    modal: true,
                                                    constrain: true,
                                                    title: '根据模板生成',
                                                    layout: 'fit',
                                                    maxHeight: 600,
                                                    minHeight: 350,
                                                    width: 600,
                                                    items: [
                                                        {
                                                            xtype: 'errorstrickform',
                                                            itemId: 'form',
                                                            defaults: {
                                                                margin: '5 25',
                                                                allowBlank: false,
                                                            },
                                                            layout: {
                                                                type: 'vbox'
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'container',
                                                                    items: [
                                                                        {
                                                                            xtype: 'combo',
                                                                            valueField: 'value',
                                                                            displayField: 'display',
                                                                            editable: false,
                                                                            name: 'template',
                                                                            itemId: 'template',
                                                                            width: 450,
                                                                            allowBlank: false,
                                                                            fieldLabel: '数据模板',
                                                                            store: {
                                                                                xtype: 'store',
                                                                                fields: ['display', 'value'],
                                                                                data: template
                                                                            },
                                                                            listeners: {
                                                                                change: function () {
                                                                                    var form = this.up('[itemId=form]');
                                                                                    var formData = form.getValues();
                                                                                    var result = form.getComponent('result');
                                                                                    result.setValue(buildData(formData.template, formData.data));
                                                                                }
                                                                            }
                                                                        },
                                                                        {
                                                                            xtype: 'textarea',
                                                                            name: 'data',
                                                                            itemId: 'data',
                                                                            grow: true,
                                                                            allowBlank: false,
                                                                            width: 450,
                                                                            fieldLabel: '数据源(换行区分一条数据)',
                                                                            listeners: {
                                                                                change: function () {
                                                                                    var form = this.up('[itemId=form]');
                                                                                    var formData = form.getValues();
                                                                                    var result = form.getComponent('result');
                                                                                    result.setValue(buildData(formData.template, formData.data));
                                                                                }
                                                                            }
                                                                        },
                                                                    ]
                                                                },
                                                                {
                                                                    xtype: 'htmleditor',
                                                                    name: 'result',
                                                                    itemId: 'result',
                                                                    flex: 1,
                                                                    minHeight: 150,
                                                                    width: '100%',
                                                                    fieldLabel: i18n.getKey('结果'),
                                                                    enableAlignments: false,
                                                                    enableColors: false,
                                                                    enableFont: false,
                                                                    enableFontSize: false,
                                                                    enableFormat: false,
                                                                    enableLinks: false,
                                                                    enableLists: false,
                                                                    enableSourceEdit: false,
                                                                    fontFamilies: false,
                                                                    listeners: {
                                                                        afterrender: function () {
                                                                            var toolbar = this.toolbar;
                                                                            toolbar.insert(1, ['-', {
                                                                                xtype: 'button',
                                                                                text: '切换视图',
                                                                                itemId: 'sourceedit',
                                                                                title: 'Source Edit',
                                                                                handler: function (btn) {
                                                                                    var me = btn.ownerCt.ownerCt;
                                                                                    me.toggleSourceEdit(!me.sourceEditMode);
                                                                                }
                                                                            }]);
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    bbar: {
                                                        xtype: 'bottomtoolbar',
                                                        saveBtnCfg: {
                                                            handler: function (btn) {
                                                                var win = btn.ownerCt.ownerCt;
                                                                var form = win.getComponent('form');
                                                                if (form.isValid()) {
                                                                    var data = form.getValues();
                                                                    var result = data.result;
                                                                    contentField.setValue(result);
                                                                    win.close();
                                                                }
                                                            }
                                                        }
                                                    }
                                                });
                                                win.show();

                                            }
                                        });
                                        toolbar.insert(1, ['-', {
                                            xtype: 'button',
                                            text: '切换视图',
                                            itemId: 'sourceedit',
                                            title: 'Source Edit',
                                            cls: Ext.baseCSSPrefix + 'html-editor-tip',
                                            handler: function (btn) {
                                                var me = btn.ownerCt.ownerCt;
                                                me.toggleSourceEdit(!me.sourceEditMode);
                                            }
                                        }]);

                                    }
                                }
                            },
                            {
                                xtype: 'hiddenfield',
                                name: 'index',
                                itemId: 'index',
                            },
                            {
                                xtype: 'hiddenfield',
                                value: 'com.qpp.cgp.domain.cms.ProductDetailSpecificationItem',
                                name: 'clazz',
                                itemId: 'clazz'
                            }
                        ],
                        listeners: {
                            afterrender: function () {
                                var form = this;
                                var win = form.ownerCt;
                                var index = form.getComponent('index');
                                if (Ext.isEmpty(win.record)) {
                                    index.setValue(win.outGrid.store.getCount());
                                }
                            }
                        }
                    },
                },
                tbar: {
                    btnDelete: {
                        xtype: 'displayfield',
                        width: 600,
                        value: '<font color="red">行号处可用鼠标拖拽进行上下排序</font>',
                        hidden: false,
                    }
                }
            }
        ];
        me.callParent();
    }
})