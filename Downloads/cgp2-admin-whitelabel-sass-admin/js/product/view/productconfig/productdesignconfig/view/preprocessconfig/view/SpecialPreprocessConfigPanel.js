/**
 * Created by nan on 2021/1/8
 *
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.SpecialPreProcessConfigGrid',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.CalenderPreprocessConfigModel',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomBackgroundPreprocessConfigModel',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomLayoutPreprocessConfigModel',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomContentPreprocessConfigModel'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.SpecialPreprocessConfigPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.specialpreprocessconfigpanel',
    designId: null,
    builderConfigTab: null,
    controller: null,
    layout: {
        type: 'accordion',
        titleCollapse: true,
        animate: true,
        activeOnTop: false
    },
    bodyStyle: 'border-color:silver;',
    header: {
        style: 'background-color:white;',
        color: 'black',
        border: '0 0 0 0'
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'specialpreprocessconfiggrid',
                title: '日历预处理配置',
                width: '100%',
                clazz: 'CalenderPreprocessConfig',
                store: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.AllTypePCSPreprocessStore', {
                    storeId: 'calenderPreprocessConfigStore',
                    model: 'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.CalenderPreprocessConfigModel',
                    params: {
                        filter: Ext.JSON.encode([
                            {
                                name: 'designId',
                                type: 'string',
                                value: me.designId
                            },
                            {
                                name: 'clazz',
                                type: 'string',
                                value: 'com.qpp.cgp.domain.preprocess.config.CalenderPreprocessConfig'
                            }
                        ])
                    }
                }),
                columns: [
                    {
                        dataIndex: 'layout',
                        text: i18n.getKey('布局'),
                        xtype: 'componentcolumn',
                        width: 150,
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = 'data-qtip="查看布局"';
                            if (value) {
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#")>查看</a>',
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                JSShowJsonDataV2(value, '查看随机布局');
                                            });
                                        }
                                    }
                                };
                            } else {
                                return null;
                            }
                        }
                    },
                    {
                        dataIndex: 'background',
                        text: i18n.getKey('背景'),
                        xtype: 'componentcolumn',
                        width: 150,
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = 'data-qtip="查看布局"';
                            if (value) {
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#")>查看</a>',
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                JSShowJsonDataV2(value, '查看背景');
                                            });
                                        }
                                    }
                                };
                            } else {
                                return null;
                            }
                        }
                    },
                    {
                        dataIndex: 'background',
                        text: i18n.getKey('月份图配置'),
                        xtype: 'componentcolumn',
                        width: 150,
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = 'data-qtip="查看"';
                            if (value) {
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#")>查看</a>',
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                JSShowJsonDataV2(value, '查看月份图配置');
                                            });
                                        }
                                    }
                                };
                            } else {
                                return null;
                            }
                        }
                    }, {
                        dataIndex: 'background',
                        text: i18n.getKey('日期格子内容模板'),
                        xtype: 'componentcolumn',
                        width: 200,
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = 'data-qtip="查看"';
                            if (value) {
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#")>查看</a>',
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                JSShowJsonDataV2(value, '查看日期格子内容模板');

                                            });
                                        }
                                    }
                                };
                            } else {
                                return null;
                            }
                        }
                    }, {
                        dataIndex: 'background',
                        text: i18n.getKey('日期格子配置'),
                        xtype: 'componentcolumn',
                        minWidth: 250,
                        flex: 1,
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = 'data-qtip="查看"';
                            if (value) {
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#")>查看</a>',
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                JSShowJsonDataV2(value, '查看随机布局');
                                            });
                                        }
                                    }
                                };
                            } else {
                                return null;
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'specialpreprocessconfiggrid',
                title: '随机背景预处理',
                clazz: 'RandomBackgroundPreprocessConfig',
                store: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.AllTypePCSPreprocessStore', {
                    storeId: 'randomBackgroundPreprocessConfigStore',
                    model: 'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomBackgroundPreprocessConfigModel',
                    params: {
                        filter: Ext.JSON.encode([
                            {
                                name: 'designId',
                                type: 'string',
                                value: me.designId
                            },
                            {
                                name: 'clazz',
                                type: 'string',
                                value: 'com.qpp.cgp.domain.preprocess.config.RandomBackgroundPreprocessConfig'
                            }
                        ])
                    },
                    listeners: {
                        load: function (store, records) {
                            console.log(records)
                        }
                    }
                }),
                columns: [
                    {
                        text: i18n.getKey('背景图片注入位置'),
                        dataIndex: 'bgImageElementSelector',
                        itemId: 'bgImageElementSelector',
                        flex: 1,
                        renderer: function (value, metadata, record) {
                            return JSAutoWordWrapStr(value);
                        }
                    }, {
                        text: i18n.getKey('背景颜色注入位置'),
                        dataIndex: 'bgColorElementSelector',
                        itemId: 'bgColorElementSelector',
                        flex: 1,
                        renderer: function (value, metadata, record) {
                            return JSAutoWordWrapStr(value);
                        }
                    }
                ]
            },
            {
                xtype: 'specialpreprocessconfiggrid',
                title: '随机布局预处理',
                hidden: false,
                clazz: 'RandomLayoutPreprocessConfig',
                store: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.AllTypePCSPreprocessStore', {
                    storeId: 'randomLayoutPreprocessConfigStore',
                    model: 'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomLayoutPreprocessConfigModel',
                    params: {
                        filter: Ext.JSON.encode([
                            {
                                name: 'designId',
                                type: 'string',
                                value: me.designId
                            },
                            {
                                name: 'clazz',
                                type: 'string',
                                value: 'com.qpp.cgp.domain.preprocess.config.RandomLayoutPreprocessConfig'
                            }
                        ])
                    }
                }),
                columns: [
                    {
                        text: i18n.getKey('数据注入位置'),
                        dataIndex: 'pcTargetSelector',
                        itemId: 'pcTargetSelector',
                        width: 200,
                        renderer: function (value, metadata, record) {
                            return JSAutoWordWrapStr(value);
                        }
                    },
                    {
                        text: i18n.getKey('PC源数据列表'),
                        dataIndex: 'pageContentList',
                        width: 200,
                        itemId: 'pageContentList',
                        xtype: 'componentcolumn',
                        renderer: function (value, metadata, record) {
                            var pageContents = value;
                            var items = [];
                            for (var i = 0; i < pageContents.length; i++) {
                                items.push({
                                    xtype: 'displayfield',
                                    value: pageContents[i].name + '(<a href="#")>' + pageContents[i]._id + '</a>),',
                                    pageContentId: pageContents[i]._id,
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            var pageContentsId = display.pageContentId;
                                            ela.on("click", function () {
                                                // http://localhost:8080/cgp2-admin-fixbug/partials/pagecontent/main.html"
                                                    JSOpen({
                                                        id: 'pagecontentpage',
                                                        url: path + "partials/pagecontent/main.html?_id=" + pageContentsId,
                                                        title: 'pageContent',
                                                        refresh: true
                                                    })
                                            });
                                        }
                                    }
                                })
                            }
                            return {
                                xtype: 'fieldcontainer',
                                layout: {
                                    type: 'table',
                                    columns: 2
                                },
                                defaults: {
                                    labelWidth: 150,
                                    width: '100%'
                                },
                                items: items
                            }
                        }
                    },
                    {
                        text: i18n.getKey('PC源数据位置'),
                        dataIndex: 'pcSourceContentSelector',
                        itemId: 'pcSourceContentSelector',
                        flex: 1,
                        renderer: function (value, metadata, record) {
                            return JSAutoWordWrapStr(value);
                        }
                    },
                ]
            },
            {
                xtype: 'specialpreprocessconfiggrid',
                title: '随机内容预处理',
                hidden: false,
                clazz: 'RandomContentPreprocessConfig',
                store: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.AllTypePCSPreprocessStore', {
                    store: 'randomContentPreprocessConfigStore',
                    model: 'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.RandomContentPreprocessConfigModel',
                    params: {
                        filter: Ext.JSON.encode([
                            {
                                name: 'designId',
                                type: 'string',
                                value: me.designId
                            },
                            {
                                name: 'clazz',
                                type: 'string',
                                value: 'com.qpp.cgp.domain.preprocess.config.RandomContentPreprocessConfig'
                            }
                        ])
                    }
                }),
                columns: [
                    {
                        dataIndex: 'layout',
                        text: i18n.getKey('布局'),
                        xtype: 'componentcolumn',
                        width: 150,
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = 'data-qtip="查看布局"';
                            if (value) {
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#")>查看</a>',
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                JSShowJsonDataV2(value, '查看随机布局');
                                            });
                                        }
                                    }
                                };
                            } else {
                                return null;
                            }
                        }
                    },
                    {
                        dataIndex: 'background',
                        text: i18n.getKey('背景'),
                        xtype: 'componentcolumn',
                        flex: 1,
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = 'data-qtip="查看布局"';
                            if (value) {
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#")>查看</a>',
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                JSShowJsonDataV2(value, '查看背景');
                                            });
                                        }
                                    }
                                };
                            } else {
                                return null;
                            }
                        }
                    }
                ]
            }
        ];
        me.callParent();
    }
})